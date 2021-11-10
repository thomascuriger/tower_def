const Message = require('../Message');

/**
 * <h1>StartGame</h1>
 * The "startGame" message properties sent by the client whenever the gamer requests to join a game session.
 */
class StartGame extends Message.Message {
    /**
     * The default constructor.
     */
    constructor() {
        super(Message.ObjectType.StartGame);
    }

    /**
     * Serialize the data in a steam to class attribute members.
     * @param stream The stream containing the date to be serialized.
     */
    fromStream(stream) {
        this.stream = stream;
        var data = JSON.parse(stream);
        this.playerName = data.name;
        this.playerIdentifier = data.identifier;
    }

    /**
     * Get the player identifier.
     * @return The player identifier.
     */
    getPlayerIdentifier() {
        return this.playerIdentifier;
    }

    /**
     * Get the player name.
     * @return The player name.
     */
    getPlayerName() {
        return this.playerName;
    }
}

module.exports = StartGame
