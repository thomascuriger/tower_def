/**
 * <h1>DateTime</h1>
 * A helper class for converting the date and time to various formats.
 */
class DateTime {
    /**
     * The default constructor.
     */
    constructor() {
        this.timestamp = new Date();
        this.day = ("0" + this.timestamp.getDate()).slice(-2);
        this.month = ("0" + (this.timestamp.getMonth() + 1)).slice(-2);
        this.year = this.timestamp.getFullYear().toString();
        this.hours = ("0" + this.timestamp.getHours()).slice(-2);
        this.minutes = ("0" + this.timestamp.getMinutes()).slice(-2);
        this.seconds = ("0" + this.timestamp.getSeconds()).slice(-2);
        this.millseconds = ("0" + this.timestamp.getMilliseconds()).slice(-3);
    }

    /**
     * Get the actual time formatted as YYYYMMDDhhmmssmmm string.
     * @return The formatted timestamp.
     */
    toTimestampKeyString() {
        return this.year + this.month + this.day + this.hours + this.minutes + this.seconds + this.millseconds;
    }

    /**
     * Get the actual time formatted as YYYY.MM.DD hh:mm:ss:mmm string.
     * @return The formatted timestamp.
     */
    toTimestampLongString() {
        return this.toTimestampShortString() + ":" + this.millseconds;
    }

    /**
     * Get the actual time formatted as YYYY.MM.DD hh:mm:ss string.
     * @return The formatted timestamp.
     */
    toTimestampShortString()  {
        return this.year + "." + this.month + "." + this.day + " " + this.hours + ":" + this.minutes + ":" + this.seconds;
    }

    /**
     * Get the actual date formatted as DD.MM.YYYY string.
     * @return The formatted timestamp.
     */
    toDateString()  {
        return this.day + "." + this.month + "." + this.year;
    }

    /**
     * Get the actual time formatted as hh.mm.ss string.
     * @return The formatted timestamp.
     */
    toTimeShortString()  {
        return this.hours + ":" + this.minutes + ":" + this.seconds;
    }

    /**
     * Get the actual time formatted as hh.mm.ss.mmm string.
     * @return The formatted timestamp.
     */
    toTimeLongString()  {
        return this.hours + ":" + this.minutes + ":" + this.seconds + ":" + this.millseconds;
    }
}

module.exports.DateTime = DateTime
