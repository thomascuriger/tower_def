const Database = require('../Database/Database');
const Player = require('./Player');
const GameBoardSetup = require('../Communications/ServerMessages/GameBoardSetup');

const DateTime = require('../DateTime/DateTime')
const Request = require('../Communications/ServerMessages/Request')
const Response = require('../Communications/ClientMessages/Response')
const Message = require('../Communications/Message')

/**
 * <h1>Players</h1>
 * The enumeration defining the players.
 */
const Players =  Object.freeze({
    Player1: '0',
    Player2: '1'
});

/**
 * <h1>State</h1>
 * The enumeration defining the game control states.
 */
const State =  Object.freeze({
    Undefined: '0',
    Playing: '1',
    WaitingShowGameLevelScoreTimerExpired : '2',
    WaitingStartNewLevelGameOrQuitGame : '4',
    WaitingStartNewGameOrQuitGame : '5'
});

/**
 * <h1>Session</h1>
 * The game session management and game control workflow.
 */
class Session {
    /**
     * The specialized constructor.
     * @param webClientSocketPlayer1 The web client socket for player 1
     * @param webClientSocketPlayer2 The web client socket for player 2
     */
    constructor(webClientSocketPlayer1, webClientSocketPlayer2) {
        this.state = State.Undefined;
        this.players = [];
        this.players.push(new Player(webClientSocketPlayer1));
        this.players.push(new Player(webClientSocketPlayer2));
        webClientSocketPlayer1.setGameSession(this);
        webClientSocketPlayer2.setGameSession(this);
        this.activeLevel = null;
        this.activePlayer = null;
        this.logger = null;
        this.confirmationKey = "";
    }

    /**
     * Get the players.
     * @return The players array.
     */
    getPlayers() {
        return this.players;
    }

    /**
     * Get a distinct player by the web client socket.
     * @param The web client socket.
     * @return The player instance.
     */
    getPlayer(webClientSocket) {
        if (this.players[Players.Player1].getClientWebSocket() === webClientSocket) {
            return this.players[Players.Player1];
        }
        return this.players[Players.Player2];
    }

    /**
     * Get the opponent player web client socket.
     * @param The player web client socket.
     * @return The opponent player web client socket.
     */
    getOpponentPlayerWecClientSocket(webClientSocket) {
        if (this.players[Players.Player1].getClientWebSocket() === webClientSocket) {
            return this.players[Players.Player2].getClientWebSocket();
        }
        return this.players[Players.Player1].getClientWebSocket();
    }

    /**
     * Get the opponent player.
     * @return The opponent player.
     */
    getOpponentPlayer() {
        if (this.players[Players.Player1] === this.players[this.activePlayer]) {
            return Players.Player2;
        }
        return Players.Player1;
    }

    /**
     * Notify a distinct player.
     * @param The player client to be notified.
     * @message The message to be notified.
     */
    notifyPlayer(player, message) {
        this.players[player].getClientWebSocket().send(message.toStream());
    }

    /**
     * Notify all player clients within this game session.
     * @message The message to be notified.
     */
    notifyPlayers(message) {
        this.notifyPlayer(Players.Player1, message);
        this.notifyPlayer(Players.Player2, message);
    }

    /**
     * Forward a message stream to an distinct player client.
     * @param The player client to be notified.
     * @stream The stream to be forwarded.
     */
    forwardMessage(player, stream) {
        this.logger.write(Logger.Direction.Send, this.players[player].getName(), stream);
        this.players[player].getClientWebSocket().send(stream);
    }

    /**
     * Start the game session by setting up the game level, logger and the game board.
     */
    startGame() {
        // State guard
        switch (this.state) {
            case State.Undefined:
            case State.WaitingStartNewGameOrQuitGame:
                this.state = State.Playing;
                break;
            default:
                return;
        }
        // Reset all scores
        this.players[Players.Player1].resetScores();
        this.players[Players.Player2].resetScores();
        // Setup the game board and start the game control
        this.setupGameBoard();
    }

    /**
     * Start the game for a specific level
     */
    startGameLevel() {
        this.state = State.Playing;
        // Reset level score
        this.players[Players.Player1].resetLevelScore();
        this.players[Players.Player2].resetLevelScore();
        // Setup the game board and start the game control
        this.setupGameBoard();
    }

    /**
     * Setup the game board for the active level.
     */
    setupGameBoard() {
        // Generate game board and notify clients
        var message = new GameBoardSetup.GameBoardSetup(
            this.players[Players.Player1].getName(),
            this.players[Players.Player1].getIdentifier(),
            this.players[Players.Player2].getName(),
            this.players[Players.Player2].getIdentifier());
        this.notifyPlayers(message);
    }



    /**
     * Handle the clients response stream.
     * @param The communication stream sent by the active player's client.
     */
    handleResponse(stream) {
        var response = new Response();
        response.fromStream(stream)
        switch (this.state) {
            case State.WaitingStartNewLevelGameOrQuitGame:
                this.waitingStartNewLevelGameOrQuitGame(response);
                break;
            case State.WaitingStartNewGameOrQuitGame:
                this.waitingStartNewGameOrQuitGame(response);
                break;
            default:
                break;
        }
    }

    /**
     * Waiting for the player(s) interaction to either start a new level game or quit the game.
     * @param The communication stream sent by the active player's client.
     */
    waitingStartNewLevelGameOrQuitGame(response) {
        // Do the confirmation keys match?
        if (this.confirmationKey !== response.getConfirmationKey()) {
            return;
        }
        this.confirmationKey = "";
        // Summarize the scores
        this.players[Players.Player1].addLevelScoreToGameScore();
        this.players[Players.Player2].addLevelScoreToGameScore();
        // Shall start a new game, increase level or quit game?
        switch (response.getConfirmationOption()) {
            case Message.ConfirmationOption.Option1:
                this.startGameLevel();
                break;
            case Message.ConfirmationOption.Option2:
                this.activeLevel += 1;
                this.startGameLevel();
                break;
            default:
                this.dispose();
                break;
        }
    }

    /**
     * Waiting for the player(s) interaction to either start a new game or finalize the game, writing the log files and the game scores to the persistent medium.
     * @param The communication stream sent by the active player's client.
     */
    waitingStartNewGameOrQuitGame(response) {
        // Do the confirmation keys match?
        if (this.confirmationKey !== response.getConfirmationKey()) {
            return;
        }
        this.confirmationKey = "";
        // Summarize the scores
        this.players[Players.Player1].addLevelScoreToGameScore();
        this.players[Players.Player2].addLevelScoreToGameScore();
        // Update the high scores and serialize log data to persistent medium
        var score = {};
        score.timestamp = new DateTime().toTimestampShortString();
        score.namePlayer1 = this.players[Players.Player1].getName();
        score.scorePlayer1 = this.players[Players.Player1].getGameScore();
        score.namePlayer2 = this.players[Players.Player2].getName();
        score.scorePlayer2 = this.players[Players.Player2].getGameScore();
        if (Message.ConfirmationOption.Option2 === response.getConfirmationOption()) {
            this.dispose();
            return;
        }
        this.startGameLevel();
    }

    /**
     * Dispose this instance.
     */
    dispose() {
        for (var index = 0; index < this.players.length; index++) {
            this.players[index].dispose();
        }
        this.players = [];
    }
}

module.exports = Session
