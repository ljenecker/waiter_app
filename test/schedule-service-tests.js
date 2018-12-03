const assert = require('assert');
const ScheduleService = require('../services/schedule-service');
const pg = require('pg');
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://lorenzo:123@localhost:5432/waiters_app_tests';

const pool = new Pool({
    connectionString
});

describe('The basic registration number web app', function () {
    beforeEach(async function () {
        await pool.query('delete from staff;');
        await pool.query('delete from work_schedule;');
    });

    it('should be able to add a staff member', async function () {
        let scheduleService = ScheduleService(pool);

        let staff = await scheduleService.createStaff({
            first_name: 'Lorenzo',
            last_name: 'Jenecker'
        });

        staff = await scheduleService.getStaffById(staff.id);
        assert.equal('Lorenzo Jenecker', staff.first_name + ' ' + staff.last_name);

    });

    after(function () {
        pool.end();
    });
});
