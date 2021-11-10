const Message = require('../Message');

/**
 * <h1>GameBoardSetup</h1>
 * The message properties to setup a game session on the clients.
 */
class GameBoardSetup extends Message.Message {
    /**
     * The specialized constructor.
     * @param namePlayer1 The name of player 1
     * @param identifierPlayer1 The identifier of player 1
     * @param namePlayer2 The name of player 2
     * @param identifierPlayer2 The identfier of player 2
     * @param gameLevel The game level
     */
    constructor(namePlayer1, identifierPlayer1, namePlayer2, identifierPlayer2, gameLevel) {
        super(Message.ObjectType.GameBoardSetup)
        this.namePlayer1 = namePlayer1;
        this.identifierPlayer1 = identifierPlayer1;
        this.namePlayer2 = namePlayer2;
        this.identifierPlayer2 = identifierPlayer2;
        this.gameLevel = gameLevel;
    }

    /**
     * Serialize the member attributes to the stream for communication with client.
     * @return The communication stream.
     */
    toStream() {
        var data = {};
        data.objecttype = this.objectType;
        data.player1identifier = this.identifierPlayer1;
        data.player1name = this.namePlayer1;
        data.player2identifier = this.identifierPlayer2;
        data.player2name = this.namePlayer2;
        data.gamelevel = this.gameLevel;
        return JSON.stringify(data);
    }

    /**
     * Serialize the member attributes to the stream for logging.
     * @return The log stream
     */
    toLogStream() {
        var stream = "ObjectType[GameBoardSetup], " +
            "Player 1[" +
            this.identifierPlayer1 +
            ", " +
            this.namePlayer1 +
            "], " +
            "Player 2[" +
            this.identifierPlayer2 +
            ", " +
            this.namePlayer2 +
            "]";
        return stream;
    }
}

module.exports = {
    GameBoardSetup : GameBoardSetup
}
