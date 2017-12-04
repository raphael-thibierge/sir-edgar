
const Tools = {

    elapsedTimeToHuman(elapsed_time_in_seconds){

        function numberToString(number) {
            return number < 10 ? '0' + number.toString() : number.toString();
        }

        let x = elapsed_time_in_seconds;

        if (x <= 0){
            return "00:00:00"
        }

        const seconds = Math.round(x % 60);
        x -= x%60;
        x /= 60;
        const minutes = Math.round(x % 60);
        x -= x%60;
        x /= 60;
        const hours = Math.round(x % 24);

        return numberToString(hours)+":"+numberToString(minutes)+":"+numberToString(seconds);

    },

    elapsedTimeToHumanWithoutSeconds(elapsed_time_in_seconds){

        function numberToString(number) {
            return number < 10 ? '0' + number.toString() : number.toString();
        }

        let x = elapsed_time_in_seconds;

        if(x <= 0){
            return "00h00"
        }

        x -= x%60;
        x /= 60;
        const minutes = Math.round(x % 60);
        x -= x%60;
        x /= 60;
        const hours = Math.round(x % 24);

        return numberToString(hours)+"h"+numberToString(minutes);

    },


    dateFormater(dateAsString){
        return new Date(
            parseInt(dateAsString.slice(0,4)), // year
            parseInt(dateAsString.slice(5,7)) - 1, // month
            parseInt(dateAsString.slice(8,10)), // day
            parseInt(dateAsString.slice(11,13)), // hour
            parseInt(dateAsString.slice(14,16)), // minutes
            parseInt(dateAsString.slice(17,19)), // seconds
            0
        );
    },

    dateFormatWithOffset(dateAsString){
        let date = this.dateFormater(dateAsString);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        return date;
    },


};

module.exports = Tools;