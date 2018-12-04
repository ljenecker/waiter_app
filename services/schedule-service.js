module.exports = function ScheduleService (pool) {
    async function createStaff (staff) {
        let data = [
            staff.first_name,
            staff.last_name
        ];

        let staffResult = await pool.query(`INSERT into staff (first_name, last_name) values ($1, $2) returning id, first_name, last_name`, data);
        staff = staffResult.rows[0];

        return staff;
    }

    async function getStaffById (id) {
        let staffResult = await pool.query('SELECT * FROM staff WHERE id = $1', [id]);
        let staff = staffResult.rows[0];
        return staff;
    }

    async function getAllStaff () {
        let staffResult = await pool.query('SELECT * FROM staff');
        let staff = staffResult.rows;
        return staff;
    }

    async function deleteAllStaff () {
        let staffResult = await pool.query('DELETE FROM staff');
        let staff = staffResult.rows;
        return staff;
    }

    async function createShift (shift) {
        let data = [
            shift.monday,
            shift.tuesday,
            shift.wednesday,
            shift.thursday,
            shift.friday,
            shift.saturday,
            shift.sunday,
            shift.staff_id
        ];

        let shiftResult = await pool.query(`INSERT into work_schedule (monday, tuesday, wednesday, thursday, friday, saturday, sunday, staff_id) values ($1, $2, $3, $4, $5, $6, $7, $8) returning id, monday, tuesday, wednesday, thursday, friday, saturday, sunday, staff_id`, data);
        shift = shiftResult.rows[0];

        return shift;
    }

    async function getShiftByStaffId (id) {
        let staffResult = await pool.query('SELECT * FROM work_schedule WHERE staff_id = $1', [id]);
        let staff = staffResult.rows[0];

        return staff;
    }

    async function updateShift (shift) {
        let data = [
            shift.id,
            shift.monday,
            shift.tuesday,
            shift.wednesday,
            shift.thursday,
            shift.friday,
            shift.saturday,
            shift.sunday,
            shift.staff_id
        ];

        let updateQuery = `UPDATE work_schedule SET monday = $2, tuesday = $3, wednesday = $4, thursday = $5, friday = $6, saturday = $7, sunday = $8 WHERE id = $1 and staff_id = $9`;

        return pool.query(updateQuery, data);
    }

    async function deleteShiftByStaffId (id) {
        return pool.query('DELETE FROM work_schedule WHERE staff_id = $1', [id]);
    }

    return {
        createStaff,
        getStaffById,
        getAllStaff,
        deleteAllStaff,
        createShift,
        getShiftByStaffId,
        updateShift,
        deleteShiftByStaffId
    };
};
