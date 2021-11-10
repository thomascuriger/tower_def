/**
 * <h1>TransmissionMode</h1>
 * The enumeration defining the message transmission mode.
 */
const TransmissionModeEnum = Object.freeze({
    Unicast: '0',
    Broadcast: '1'
});

/**
 * <h1>ChatLogEntry</h1>
 * The "chat log entry" message properties sent by the client whenever the gamer sends a chat message.
 */
class ChatLogEntry extends window.Message {
    constructor(transmissionMode, text) {
        super(window.ObjectType.ChatLogEntry);
        this.transmissionMode = transmissionMode;
        this.text = text;
        this.timestamp = Date.now();
    }

    /**
     * Serialize the data in a steam to class attribute members.
     * @param stream The stream containing the date to be serialized
     */
    fromStream(stream) {
        this.stream = stream;
        var data = JSON.parse(stream);
        this.playerIdentifier = data.identifier;
        this.transmissionMode = data.transmissionMode;
        this.text = data.text;
        this.timestamp = data.timestamp;
    }

    /**
     * Serialize the member attributes to the stream for communication with server.
     * @returns {string}
     */
    toStream() {
        var data = {};
        data.objecttype = this.objectType;
        data.identifier = this.playerIdentifier;
        data.transmissionMode = this.transmissionMode;
        data.text = this.text;
        data.timestamp = this.timestamp;
        return JSON.stringify(data);
    }

    /**
     * Get the transmission mode.
     * @returns {*}
     */
    getTransmissionMode() {
        return this.transmissionMode;
    }
}

window.TransmissionMode = TransmissionModeEnum;
window.ChatLogEntry = ChatLogEntry;
