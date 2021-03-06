module.exports = {
    getMonday: function () {
        var date = new Date();
        var day = date.getDay();
        var prevMonday = new Date();
        if (date.getDay() == 0) {
            prevMonday.setDate(date.getDate() - 6);
        } else {
            prevMonday.setDate(date.getDate() - (day - 1));
        }

        prevMonday.setUTCHours(0, 0, 0, 0);

        return prevMonday;
    },
};
