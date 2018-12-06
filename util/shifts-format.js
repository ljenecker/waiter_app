module.exports = function shiftsFormat (shift) {
    let filteredShifts = {};

    for (let key in shift) {
        let currentDay = shift[key].day_name;
        let firstName = shift[key].first_name;
        let lastName = shift[key].last_name;
        let fullName = firstName + ' ' + lastName;

        if (filteredShifts[currentDay] === undefined) {
            filteredShifts[currentDay] = [];
        }

        if (firstName != null) {
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
