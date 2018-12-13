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
        let status = 0;

        if (filteredShifts[key].length > 3) {
            status = 'blue';
        } else if (filteredShifts[key].length < 3) {
            status = 'red';
        } else { status = 'green'; }

        listShifts.push({
            day: key,
            status: status,
            waiters: filteredShifts[key]
        });
    }

    return listShifts;
};
