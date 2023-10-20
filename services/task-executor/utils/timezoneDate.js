const moment = require('moment-timezone');
module.exports.convertToSpecificTimezone = (date, timezone = 'Europe/Paris', format = 'DD-MM-YYYY HH:mm:ss') => {
    // check isValidTimezone if not update default timezone
    if (!moment.tz.names().includes(timezone)) {
        timezone = 'Europe/Paris';
    }
    const formattedDate = moment(date).tz(timezone).format(format);
    return formattedDate || date;
}