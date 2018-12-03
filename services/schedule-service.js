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

    return {
        createStaff,
        getStaffById
    };
};
