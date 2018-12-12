module.exports = function ScheduleService (pool) {
    async function getWeekDays () {
        let weekDaysResult = await pool.query('SELECT * FROM week_days');
        weekDays = weekDaysResult.rows;

        return weekDays;
    }

    async function createWaiter (waiter) {
        let waiterResult = await pool.query(`INSERT into waiters (username) values ($1) returning id, username`, [waiter]);
        waiter = waiterResult.rows[0];

        return waiter;
    }

    async function getWaiterById (id) {
        let waiterResult = await pool.query('SELECT * FROM waiters WHERE id = $1', [id]);
        let waiter = waiterResult.rows[0];
        return waiter;
    }

    async function getWaiterByName (name) {
        let waiterResult = await pool.query('SELECT * FROM waiters WHERE username = $1', [name]);
        let waiter = waiterResult.rows[0];
        return waiter;
    }

    async function getWaiters () {
        let waiterResult = await pool.query('SELECT * FROM waiters');
        let waiter = waiterResult.rows;
        return waiter;
    }

    async function deleteWaiterById (id) {
        let waiterResult = await pool.query('DELETE FROM waiters where id = $1', [id]);
        let waiter = waiterResult.rows;
        return waiter;
    }

    async function deleteWaiters () {
        let waiterResult = await pool.query('DELETE FROM waiters');
        let waiter = waiterResult.rows;
        return waiter;
    }

    async function checkShift (shift) {
        let data = [
            shift.waiter_id,
            shift.day_number
        ];

        let shiftResult = await pool.query('SELECT * FROM shifts WHERE waiter_id = $1 AND week_days_id = (SELECT id FROM week_days WHERE day_number = $2)', data);
        shift = shiftResult.rows[0];

        return shift;
    }

    async function createShift (shift) {
        let data = [
            shift.waiter_id,
            shift.day_number
        ];

        if (!await checkShift(shift)) {
            let shiftResult = await pool.query(`INSERT into shifts (waiter_id, week_days_id) values ($1, (SELECT id FROM week_days WHERE day_number = $2)) returning id, waiter_id, week_days_id`, data);
            shift = shiftResult.rows[0];
            return shift;
        }
    }

    async function getShiftsByWaiterId (id) {
        let shiftResult = await pool.query('SELECT week_days.day_name FROM shifts,waiters,week_days WHERE shifts.waiter_id = waiters.id and shifts.week_days_id = week_days.id and shifts.waiter_id = $1', [id]);
        let shift = shiftResult.rows;

        return shift;
    }

    async function getShifts () {
        let shiftResult = await pool.query(`SELECT
                                                week_days.day_number,
                                                week_days.day_name,
                                                waiters.username
                                            FROM week_days
                                                LEFT JOIN shifts ON shifts.week_days_id = week_days.id
                                                LEFT JOIN waiters ON shifts.waiter_id = waiters.id
                                            ORDER BY
                                                week_days.day_number,
                                                waiters.username`);
        let shift = shiftResult.rows;

        return shift;
    }

    async function deleteShiftByWaiterId (id) {
        return pool.query('DELETE FROM shifts WHERE waiter_id = $1', [id]);
    }

    return {
        getWeekDays,
        createWaiter,
        getWaiterById,
        getWaiterByName,
        getWaiters,
        deleteWaiterById,
        deleteWaiters,
        createShift,
        checkShift,
        getShiftsByWaiterId,
        getShifts,
        deleteShiftByWaiterId
    };
};
