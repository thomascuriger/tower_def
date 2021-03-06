class Message {
    constructor(objectType) {
        this.objectType = objectType;
    }

    /**
     * Serialize the data in a steam to class attribute members.
     * @param stream
     */
    fromStream(stream) {
        var data = JSON.parse(stream);
        this.objectType = data.objecttype;
    }

    getObjectType() {
        return this.objectType;
    }

    toStream() {
        return this.stream;
    }
}

window.Message = Message;
