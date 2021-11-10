const Message = require('../Message');

/**
 * <h1>TransmissionMode</h1>
 * The enumeration defining the message transmission mode.
 */
const TransmissionMode = Object.freeze({
    Unicast: '0',
    Broadcast: '1'
});

/**
 * <h1>ChatLogEntry</h1>
 * The "chat log entry" message properties sent by the client whenever the gamer sends a chat message.
 */
class ChatLogEntry extends Message.Message {
    /**
     * The default constructor.
     */
    constructor() {
        super(Message.ObjectType.ChatLogEntry);
    }

    /**
     * Serialize the data in a steam to class attribute members.
     * @param stream The stream containing the date to be serialized
     */
    fromStream(stream) {
        this.stream = stream;
        var data = JSON.parse(stream);
        this.transmissionMode = data.transmissionMode;
        this.text = data.text;
        this.timestamp = data.timestamp;
    }

    /**
     * Get the stream data.
     * @return The stream data.
     */
    toStream() {
        return this.stream;
    }

    /**
     * Get the chat message text.
     * @return The chat text.
     */
    getText() {
        return this.text;
    }

    /**
     * Get the chat message timestamp.
     * @return The message timestamp
     */
    getTimestamp() {
        return this.timestamp;
    }

    /**
     * Get the transmission mode.
     * @return The transmission node
     */
    getTransmissionMode() {
        return this.transmissionMode;
    }
}

module.exports = {
    ChatLogEntry : ChatLogEntry,
    TransmissionMode : TransmissionMode
}
