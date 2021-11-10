const Message = require('../Message');

/**
 * <h1>Request</h1>
 * The message properties sent to the client requesting an interaction with the gamer.
 */
class Request extends Message.Message {
    /**
     * The specialized constructor.
     * @param textKey The text to be visualized
     * @param type The type of request
     * @param confirmationKey The value to be confirmed
     * @param confirmationOption The accepted confirmation options
     */
    constructor(textKey, type, confirmationKey, confirmationOption) {
        super(Message.ObjectType.Request)
        this.textKey = textKey;
        this.type = type;
        this.confirmationKey = confirmationKey;
        this.confirmationOption = confirmationOption;
    }

    /**
     * Serialize the member attributes to the stream for communication with client.
     * @return The communication stream
     */
    toStream() {
        var data = {};
        data.objecttype = this.objectType;
        data.textkey = this.textKey;
        data.type = this.type;
        data.confirmationkey = this.confirmationKey;
        data.confirmationoption = this.confirmationOption;
        return JSON.stringify(data);
    }

    /**
     * Serialize the member attributes to the stream for logging.
     * @return The log stream
     */
    toLogStream() {
        return super.toLogStream() +
            ", Text key[" +
            this.textKey.toString() +
            "], Type[" +
            this.type.toString() +
            "], Confirmation key[" +
            this.confirmationKey +
            "], Confirmation option[" +
            this.confirmationOption.toString() +
            "]";
    }
}

module.exports = Request
