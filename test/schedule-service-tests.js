const assert = require('assert');
const ScheduleService = require('../services/schedule-service');
const shiftsFormat = require('../util/shifts-format');
const pg = require('pg');
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://lorenzo:123@localhost:5432/waiters_app_tests';

const pool = new Pool({
    connectionString
});

describe('The waiters web app', function () {
    beforeEach(async function () {
        await pool.query('delete from shifts;');
        await pool.query('delete from waiters;');
    });

    it('should be able to add a waiter', async function () {
        let scheduleService = ScheduleService(pool);

        let waiter = await scheduleService.createWaiter({
            first_name: 'Lorenzo',
            last_name: 'Jenecker'
        });

        waiter = await scheduleService.getWaiterById(waiter.id);
        assert.equal('Lorenzo Jenecker', waiter.first_name + ' ' + waiter.last_name);
    });

    it('should be able to get a waiter by waiter id', async function () {
        let scheduleService = ScheduleService(pool);

        let waiter = await scheduleService.createWaiter({
            first_name: 'Lorenzo',
            last_name: 'Jenecker'
        });

        waiter = await scheduleService.getWaiterById(waiter.id);
        assert.equal('Lorenzo Jenecker', waiter.first_name + ' ' + waiter.last_name);
    });

    it('should be able to get a waiter by waiter name', async function () {
        let scheduleService = ScheduleService(pool);

        let waiter = await scheduleService.createWaiter({
            first_name: 'Lorenzo',
            last_name: ''
        });

        waiter = await scheduleService.getWaiterByName(waiter.first_name);
        assert.equal('Lorenzo', waiter.first_name);
    });

    it('should be able to get all waiters', async function () {
        let scheduleService = ScheduleService(pool);

        await scheduleService.createWaiter({
            first_name: 'Lorenzo',
            last_name: 'Jenecker'
        });

        await scheduleService.createWaiter({
            first_name: 'Andre',
            last_name: 'Vermeulen'
        });

        let waiters = await scheduleService.getWaiters();
        assert.equal(2, waiters.length);
    });

    it('should be able to delete a waiter', async function () {
        let scheduleService = ScheduleService(pool);

        await scheduleService.createWaiter({
            first_name: 'Lorenzo',
            last_name: 'Jenecker'
        });

        let waiter = await scheduleService.createWaiter({
            first_name: 'Andre',
            last_name: 'Vermeulen'
        });

        await scheduleService.deleteWaiterById(waiter.id);
        let waiters = await scheduleService.getWaiters();
        assert.equal(1, waiters.length);
    });

    it('should be able to delete all waiters', async function () {
        let scheduleService = ScheduleService(pool);

        await scheduleService.createWaiter({
            first_name: 'Lorenzo',
            last_name: 'Jenecker'
        });

        await scheduleService.createWaiter({
            first_name: 'Andre',
            last_name: 'Vermeulen'
        });

        await scheduleService.deleteWaiters();
        let waiters = await scheduleService.getWaiters();
        assert.equal(0, waiters.length);
    });

    it('should be able to add shift(s) to waiter', async function () {
        let scheduleService = ScheduleService(pool);

        let waiter = await scheduleService.createWaiter({
            first_name: 'Lorenzo',
            last_name: 'Jenecker'
        });

        await scheduleService.createShift({
            waiter_id: waiter.id,
            day_number: 1
        });

        await scheduleService.createShift({
            waiter_id: waiter.id,
            day_number: 2
        });

        let shift = await scheduleService.getShiftsByWaiterId(waiter.id);

        let expectedShift = [{
            day_name: 'Monday'
        }, {
            day_name: 'Tuesday'
        }];

        assert.deepStrictEqual(expectedShift, shift);
    });

    it('should NOT be able to add the same shift(s) twice', async function () {
        let scheduleService = ScheduleService(pool);

        let waiter = await scheduleService.createWaiter({
            first_name: 'Lorenzo',
            last_name: 'Jenecker'
        });

        await scheduleService.createShift({
            waiter_id: waiter.id,
            day_number: 1
        });

        await scheduleService.createShift({
            waiter_id: waiter.id,
            day_number: 1
        });

        let shift = await scheduleService.getShiftsByWaiterId(waiter.id);

        assert.deepStrictEqual(1, shift.length);
    });

    it('should be able to get shift(s) by waiter id', async function () {
        let scheduleService = ScheduleService(pool);

        let waiter = await scheduleService.createWaiter({
            first_name: 'Lorenzo',
            last_name: 'Jenecker'
        });

        await scheduleService.createShift({
            waiter_id: waiter.id,
            day_number: 1
        });

        await scheduleService.createShift({
            waiter_id: waiter.id,
            day_number: 2
        });

        let shift = await scheduleService.getShiftsByWaiterId(waiter.id);

        let expectedShift = [{
            day_name: 'Monday'
        }, {
            day_name: 'Tuesday'
        }];

        assert.deepStrictEqual(expectedShift, shift);
    });

    it('should be able to get all shifts', async function () {
        let scheduleService = ScheduleService(pool);

        let waiter = await scheduleService.createWaiter({
            first_name: 'Lorenzo',
            last_name: 'Jenecker'
        });

        await scheduleService.createShift({
            waiter_id: waiter.id,
            day_number: 1
        });

        await scheduleService.createShift({
            waiter_id: waiter.id,
            day_number: 3
        });

        await scheduleService.createShift({
            waiter_id: waiter.id,
            day_number: 5
        });

        let waiter_2 = await scheduleService.createWaiter({
            first_name: 'Andre',
            last_name: 'Vermeulen'
        });

        await scheduleService.createShift({
            waiter_id: waiter_2.id,
            day_number: 1
        });

        await scheduleService.createShift({
            waiter_id: waiter_2.id,
            day_number: 4
        });

        await scheduleService.createShift({
            waiter_id: waiter_2.id,
            day_number: 5
        });

        let shift = await scheduleService.getShifts();
        let listShifts = shiftsFormat(shift);

        let expectedShift = [{
            day: 'Monday',
            waiters: ['Andre Vermeulen', 'Lorenzo Jenecker']
        },
        {
            day: 'Tuesday',
            waiters: []
        },
        {
            day: 'Wednesday',
            waiters: ['Lorenzo Jenecker']
        },
        {
            day: 'Thursday',
            waiters: ['Andre Vermeulen']
        },
        {
            day: 'Friday',
            waiters: ['Andre Vermeulen', 'Lorenzo Jenecker']
        },
        {
            day: 'Saturday',
            waiters: []
        },
        {
            day: 'Sunday',
            waiters: []
        }
        ];
        
        console.log(expectedShift);
        console.log('-----------------------------------');
        console.log(listShifts);
        console.log('-----------------------------------');
        
        assert.deepStrictEqual(expectedShift, listShifts);
    });

    it('should be able to update shift by waiter member', async function () {
        let scheduleService = ScheduleService(pool);

        let waiter = await scheduleService.createWaiter({
            first_name: 'Lorenzo',
            last_name: 'Jenecker'
        });

        await scheduleService.createShift({
            waiter_id: waiter.id,
            day_number: 1
        });

        await scheduleService.createShift({
            waiter_id: waiter.id,
            day_number: 2
        });

        await scheduleService.createShift({
            waiter_id: waiter.id,
            day_number: 3
        });

        let shift = await scheduleService.getShiftsByWaiterId(waiter.id);

        assert.deepStrictEqual(3, shift.length);
    });

    it('should be able to delete shift by waiter member', async function () {
        let scheduleService = ScheduleService(pool);

        let waiter = await scheduleService.createWaiter({
            first_name: 'Lorenzo',
            last_name: 'Jenecker'
        });

        await scheduleService.createShift({
            waiter_id: waiter.id,
            day_number: 1
        });

        await scheduleService.createShift({
            waiter_id: waiter.id,
            day_number: 2
        });

        await scheduleService.createShift({
            waiter_id: waiter.id,
            day_number: 3
        });

        await scheduleService.deleteShiftByWaiterId({
            waiter_id: waiter.id,
            day_number: 2
        });

        let shift = await scheduleService.getShiftsByWaiterId(waiter.id);

        let expectedShift = [{
            day_name: 'Monday'
        }, {
            day_name: 'Wednesday'
        }];

        assert.deepStrictEqual(expectedShift, shift);
    });

    after(function () {
        pool.end();
    });
});
