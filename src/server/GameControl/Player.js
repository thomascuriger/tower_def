const Database = require('../Database/Database');

/**
 * <h1>Player</h1>
 * The player properties.
 */
class Player {
    /**
     * The specialized constructor.
     * @param clientWebSocket The unique client web socket object for communications with the client
     */
    constructor(clientWebSocket) {
        this.levelScore = 0;
        this.gameScore = 0;
        this.clientWebSocket = clientWebSocket;
    }

    /**
     * Get the name.
     * @return The name.
     */
    getName() {
        return this.clientWebSocket.getPlayerName();
    }

    /**
     * Get the identifier.
     * @return The identifier.
     */
    getIdentifier() {
        return this.clientWebSocket.getPlayerIdentifier();
    }

    /**
     * Get the game core.
     * @return The game score.
     */
    getGameScore() {
        return this.gameScore;
    }

    /**
     * Get the actual level score.
     * @return The actual level score.
     */
    getLevelScore() {
        return this.levelScore;
    }

    /**
     * Reset the level score.
     */
    resetLevelScore() {
        this.levelScore = 0;
    }

    /**
     * Summarize the level score with the game score.
     */
    addLevelScoreToGameScore() {
        this.gameScore += this.levelScore;
    }
    /**
     * Reset the level and game scores.
     */
    resetScores() {
        this.gameScore = 0;
        this.levelScore = 0;
    }

    /**
     * Increment the level score by 1 score.
     */
    incrementLevelScore() {
        this.levelScore += 1;
    }

    /**
     * Get the client web socket associated to the player.
     * @return The client web socket.
     */
    getClientWebSocket() {
        return this.clientWebSocket;
    }

    /**
     * Dispose this instance.
     */
    dispose() {
        this.clientWebSocket.webSocket.close(4000, "The other client left the session");
        this.clientWebSocket = null;
    }
}

module.exports = Player
