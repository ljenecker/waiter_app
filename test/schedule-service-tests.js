const assert = require('assert');
const ScheduleService = require('../services/schedule-service');
const pg = require('pg');
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://lorenzo:123@localhost:5432/waiters_app_tests';

const pool = new Pool({
    connectionString
});

describe('The waiters web app', function () {
    beforeEach(async function () {
        await pool.query('delete from work_schedule;');
        await pool.query('delete from staff;');
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

    it('should be able to get a staff member', async function () {
        let scheduleService = ScheduleService(pool);

        let staff = await scheduleService.createStaff({
            first_name: 'Lorenzo',
            last_name: 'Jenecker'
        });

        staff = await scheduleService.getStaffById(staff.id);
        assert.equal('Lorenzo Jenecker', staff.first_name + ' ' + staff.last_name);
    });

    it('should be able to get all staff members', async function () {
        let scheduleService = ScheduleService(pool);

        await scheduleService.createStaff({
            first_name: 'Lorenzo',
            last_name: 'Jenecker'
        });

        await scheduleService.createStaff({
            first_name: 'Andre',
            last_name: 'Vermeulen'
        });

        staff = await scheduleService.getAllStaff();
        assert.equal(2, staff.length);
    });

    it('should be able to delete all staff members', async function () {
        let scheduleService = ScheduleService(pool);

        await scheduleService.createStaff({
            first_name: 'Lorenzo',
            last_name: 'Jenecker'
        });

        await scheduleService.createStaff({
            first_name: 'Andre',
            last_name: 'Vermeulen'
        });

        let staff = await scheduleService.deleteAllStaff();
        assert.equal(0, staff.length);
    });

    it('should be able to add shift(s) to staff members', async function () {
        let scheduleService = ScheduleService(pool);

        let staff = await scheduleService.createStaff({
            first_name: 'Lorenzo',
            last_name: 'Jenecker'
        });

        await scheduleService.createShift({
            monday: true,
            tuesday: false,
            wednesday: true,
            thursday: false,
            friday: true,
            saturday: false,
            sunday: true,
            staff_id: staff.id
        });

        let shift = await scheduleService.getShiftByStaffId(staff.id);

        assert.equal(true, shift.monday);
    });

    it('should be able to get shift by staff member', async function () {
        let scheduleService = ScheduleService(pool);

        let staff = await scheduleService.createStaff({
            first_name: 'Lorenzo',
            last_name: 'Jenecker'
        });

        await scheduleService.createShift({
            monday: true,
            tuesday: false,
            wednesday: true,
            thursday: false,
            friday: true,
            saturday: false,
            sunday: true,
            staff_id: staff.id
        });

        let shift = await scheduleService.getShiftByStaffId(staff.id);

        assert.equal(true, shift.monday);
    });

    it('should be able to get update shift by staff member', async function () {
        let scheduleService = ScheduleService(pool);

        let staff = await scheduleService.createStaff({
            first_name: 'Lorenzo',
            last_name: 'Jenecker'
        });

        let shift = await scheduleService.createShift({
            monday: true,
            tuesday: false,
            wednesday: true,
            thursday: false,
            friday: true,
            saturday: false,
            sunday: true,
            staff_id: staff.id
        });

        shift.tuesday = true;

        await scheduleService.updateShift(shift);

        shift = await scheduleService.getShiftByStaffId(staff.id);

        assert.equal(true, shift.tuesday);
    });

    it('should be able to delete shift by staff member', async function () {
        let scheduleService = ScheduleService(pool);

        let staff = await scheduleService.createStaff({
            first_name: 'Lorenzo',
            last_name: 'Jenecker'
        });

        await scheduleService.createShift({
            monday: true,
            tuesday: false,
            wednesday: true,
            thursday: false,
            friday: true,
            saturday: false,
            sunday: true,
            staff_id: staff.id
        });

        await scheduleService.deleteShiftByStaffId(staff.id);
        let shift = await scheduleService.getShiftByStaffId(staff.id);

        assert.equal(null, shift);
    });

    after(function () {
        pool.end();
    });
});
