const Message = require('../Message');

/**
 * <h1>State</h1>
 * The enumeration defining the waiting state.
 */
const State =  Object.freeze({
    Undefined: '0',
    WaitingForPlayer: '1'
});

/**
 * <h1>WaitStateInvoke</h1>
 * The message properties sent to the client requesting the client to enter the requested waiting state.
 */
class WaitStateInvoke extends Message.Message {
    /**
     * The specialized constructor.
     * @param textKey The text to be visualized
     * @param state The state machine to be triggered on the client
     */
    constructor(textKey, state) {
        super(Message.ObjectType.WaitStateInvoke)
        this.textKey = textKey;
        this.state = state;
    }

    /**
     * Serialize the member attributes to the stream for communication with client.
     * @return The communication stream
     */
    toStream() {
        var data = {};
        data.objecttype = this.objectType;
        data.textKey = this.textKey;
        data.state = this.state;
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
            "], State[" +
            this.state.toString() +
            "]";
    }
}

module.exports = {
    WaitStateInvoke : WaitStateInvoke,
    State : State
}
