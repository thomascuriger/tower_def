const Database = require('../Database/Database');
const ClientMessageDispatcher = require('./ClientMessages/Dispatcher');

/**
 * <h1>ClientWebSocket</h1>
 * This class is responsible to link up the web socket with an ongoing game session.
 */
class ClientWebSocket {
    /**
     * The specialized constructor.
     * @param webSocket The communication socket
     */
    constructor(webSocket) {
        this.webSocket = webSocket;
        this.dispatcher = new ClientMessageDispatcher();
        new Database().getInstance().addClientWebSockets(this);
        this.gameSession = null;
        this.playerName = null;
        this.playerIdentifier = null;
    }

    /**
     * Set the player properties.
     * @param playerIdentifier The player identifier
     * @param playerName The player name
     */
    setPlayerProperties(playerIdentifier, playerName) {
        this.playerIdentifier = playerIdentifier;
        this.playerName = playerName;
    }

    /**
     * Get the player's identifier.
     * @return The player's identifier.
     */
    getPlayerIdentifier() {
        return this.playerIdentifier;
    }

    /**
     * Get the player's name.
     * @return The player's name.
     */
    getPlayerName() {
        return this.playerName;
    }

    /**
     * Determine if a player has requested to join a game session.
     * @return The player's identifier is set and no game session is assigned.
     */
    isWaitingToJoinGameSession() {
        return (null != this.playerIdentifier) && (null == this.gameSession);
    }

    /**
     * Receive a communication stream from the web socket.
     * @param stream The communication stream
     */
    receive(stream) {
        this.dispatcher.dispatch(this, stream);
    }

    /**
     * Send a communication stream to the web socket.
     * @param stream The communication stream
     */
    send(stream) {
        console.log("Send: " + stream);
        this.webSocket.send(stream);
    }

    /**
     * Set the game session to link up.
     * @param gameSession The game session.
     */
    setGameSession(gameSession) {
        this.gameSession = gameSession;
    }

    /**
     * Get the game session.
     * @return The game session.
     */
    getGameSession() {
        return this.gameSession;
    }

    /**
     * Dispose this instance.
     */
    dispose() {
        if (null != this.gameSession) {
            this.gameSession.dispose();
            this.gameSession = null;
        }
    }
}

module.exports = ClientWebSocket
