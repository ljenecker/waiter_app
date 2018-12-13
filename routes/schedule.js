const shiftsFormat = require('../util/shifts-format');

module.exports = function (scheduleService) {
    async function show (req, res, next) {
        try {
            res.render('home');
        } catch (err) {
            next(err);
        }
    };

    async function login (req, res, next) {
        let username = req.body.username;
        res.redirect(`/waiters/${username}`);
    }

    async function getStaffShift (req, res, next) {
        let username = req.params.username;

        let waiterResult = await scheduleService.getWaiterByName(username);

        if (!waiterResult) {
            req.flash('account', 'New account created!');
            waiterResult = await scheduleService.createWaiter(username);
        }

        waiterResult = await scheduleService.getWaiterByName(username);
        let shiftResult = await scheduleService.getShiftsByWaiterId(waiterResult.id);
        let weekDaysResult = await scheduleService.getWeekDays();
        let filteredWeekDays = [];
        let alreadysorted = [];

        for (let key in weekDaysResult) {
            let id = weekDaysResult[key].id;
            let day_number = weekDaysResult[key].day_number;
            let day_name = weekDaysResult[key].day_name;

            for (let key in shiftResult) {
                let shift_day_name = shiftResult[key].day_name;

                if (day_name === shift_day_name) {
                    filteredWeekDays.push({
                        id: id,
                        day_number: day_number,
                        day_name: day_name,
                        checked: 'checked'
                    });
                    alreadysorted[day_number] = 'yes';
                }
            }

            if (!alreadysorted[day_number]) {
                filteredWeekDays.push({
                    id: id,
                    day_number: day_number,
                    day_name: day_name,
                    checked: ''
                });
            }
        }

        weekDaysResult = weekDaysResult.map(function (weekdays) {
            weekdays.checked = weekDaysResult.day_name === shiftResult.day_name ? 'checked' : '';
            return weekdays;
        });

        res.render('staff', {
            username: username,
            weekDays: filteredWeekDays
        });
    }

    async function updateStaffShift (req, res, next) {
        let weekday = req.body.weekday;
        let username = req.params.username;
        let valueType = typeof weekday;

        let waiterResult = await scheduleService.getWaiterByName(username);
        await scheduleService.deleteShiftByWaiterId(waiterResult.id);

        if (valueType === 'string') {
            await scheduleService.createShift({
                waiter_id: waiterResult.id,
                day_number: weekday
            });
        } else {
            for (let key in weekday) {
                let day_number = weekday[key];
                await scheduleService.createShift({
                    waiter_id: waiterResult.id,
                    day_number: day_number
                });
            }
        }
        req.flash('update', 'Your shifts has been updated!');
        res.redirect(`/waiters/${username}`);
    }

    async function admin (req, res, next) {
        try {
            let shifts = await scheduleService.getShifts();
            let weekDaysResult = await scheduleService.getWeekDays();

            let listShifts = shiftsFormat(shifts);

            res.render('admin', {
                weekDays: weekDaysResult,
                listShifts: listShifts
            });
        } catch (err) {
            next(err);
        }
    };

    async function reset (req, res, next) {
        try {
            await scheduleService.deleteShifts();
            await scheduleService.deleteWaiters();
            req.flash('update', 'Your waiters shifts has been reset!');
            res.redirect('/days');
        } catch (err) {
            next(err);
        }
    };

    return {
        show,
        login,
        admin,
        getStaffShift,
        updateStaffShift,
        reset
    };
};
