module.exports = function shiftsFormat (shift) {
    let filteredShifts = {};

    for (let key in shift) {
        let currentDay = shift[key].day_name;
        let fullName = shift[key].username;

        if (filteredShifts[currentDay] === undefined) {
            filteredShifts[currentDay] = [];
        }

        if (fullName != null) {
            filteredShifts[currentDay].push(fullName);
        }
    }

    let listShifts = [];

    for (let key in filteredShifts) {
        listShifts.push({
            day: key,
            waiters: filteredShifts[key]
        });
    }

    return listShifts;
};
