module.exports = function (scheduleService) {
    async function show (req, res, next) {
        try {
            res.render('home');
        } catch (err) {
            next(err);
        }
    };

    async function staff (req, res, next) {
        try {
            let username = req.query.username || req.params.username;
            let weekday = req.body.weekday;

            let valueType = typeof weekday;

            let waiterResult = await scheduleService.getWaiterByName(username);

            if (!waiterResult) {
                req.flash('account', 'New account created!');
                waiterResult = await scheduleService.createWaiter(username);
            }

            waiterResult = await scheduleService.getWaiterByName(username);

            if (weekday) {
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
            }

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
        } catch (err) {
            next(err);
        }
    };

    async function admin (req, res, next) {
        try {
            res.render('admin');
        } catch (err) {
            next(err);
        }
    };

    return {
        show,
        staff,
        admin
    };
};
