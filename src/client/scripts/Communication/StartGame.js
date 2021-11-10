class StartGame extends window.Message {
    constructor(serverName,levelName,playerIdentifier, playerName) {
        super(window.ObjectType.StartGame);
        this.playerIdentifier = playerIdentifier;
        this.playerName = playerName;
    }

    /**
     * Serialize the member attributes to the stream for communication with server.
     * @returns {string}
     */
    toStream() {
        var data = {};
        data.objecttype = this.objectType;
        data.identifier = this.playerIdentifier;
        data.name = this.playerName;
        return JSON.stringify(data);
    }

    /**
     * Serialize the data in a steam to class attribute members.
     * @param stream
     */
    fromStream(stream) {
        this.playerIdentifier = "";
        this.playerName = "";
    }
}

window.StartGame = StartGame;
