const Message = require('../Message');

/**
 * <h1>Response</h1>
 * The "response" message properties sent by the client whenever the gamer confirms a server request.
 */
class Response extends Message.Message {
    /**
     * The default constructor.
     */
    constructor() {
        super(Message.ObjectType.Response)
    }

    /**
     * Serialize the data in a steam to class attribute members.
     * @param stream The stream containing the date to be serialized
     */
    fromStream(stream) {
        var data = JSON.parse(stream);
        this.confirmationKey = data.confirmationkey;
        this.confirmationOption = data.confirmationoption;
    }

    /**
     * Get the request confirmation key.
     * @return The confirmation key.
     */
    getConfirmationKey() {
        return this.confirmationKey;
    }

    /**
     * Get the confirmation option.
     * @return The confirmation option.
     */
    getConfirmationOption() {
        return this.confirmationOption;
    }

    /**
     * Serialize the member attributes to the stream for logging.
     * @return The log stream
     */
    toLogStream() {
        return super.toLogStream() +
            ", Confirmation key[" +
            this.confirmationKey.toString() +
            "], Confirmation option[" +
            this.confirmationOption + "]";
    }
}

module.exports = Response
