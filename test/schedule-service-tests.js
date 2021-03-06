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

        let waiter = await scheduleService.createWaiter('Lorenzo');

        waiter = await scheduleService.getWaiterById(waiter.id);
        assert.equal('Lorenzo', waiter.username);
    });

    it('should be able to get a waiter by waiter id', async function () {
        let scheduleService = ScheduleService(pool);

        let waiter = await scheduleService.createWaiter('Lorenzo');

        waiter = await scheduleService.getWaiterById(waiter.id);
        assert.equal('Lorenzo', waiter.username);
    });

    it('should be able to get a waiter by waiter name', async function () {
        let scheduleService = ScheduleService(pool);

        let waiter = await scheduleService.createWaiter('Lorenzo');

        waiter = await scheduleService.getWaiterByName(waiter.username);
        assert.equal('Lorenzo', waiter.username);
    });

    it('should be able to get all waiters', async function () {
        let scheduleService = ScheduleService(pool);

        await scheduleService.createWaiter('Lorenzo');

        await scheduleService.createWaiter('Andre');

        let waiters = await scheduleService.getWaiters();
        assert.equal(2, waiters.length);
    });

    it('should be able to delete a waiter', async function () {
        let scheduleService = ScheduleService(pool);

        await scheduleService.createWaiter('Lorenzo');

        let waiter = await scheduleService.createWaiter('Andre');

        await scheduleService.deleteWaiterById(waiter.id);
        let waiters = await scheduleService.getWaiters();
        assert.equal(1, waiters.length);
    });

    it('should be able to delete all waiters', async function () {
        let scheduleService = ScheduleService(pool);

        await scheduleService.createWaiter('Lorenzo');

        await scheduleService.createWaiter('Andre');

        await scheduleService.deleteWaiters();
        let waiters = await scheduleService.getWaiters();
        assert.equal(0, waiters.length);
    });

    it('should be able to add shift(s) to waiter', async function () {
        let scheduleService = ScheduleService(pool);

        let waiter = await scheduleService.createWaiter('Lorenzo');

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

        let waiter = await scheduleService.createWaiter('Lorenzo');

        await scheduleService.createShift({
            waiter_id: waiter.id,
            day_number: 1
        });

        await scheduleService.createShift({
            waiter_id: waiter.id,
            day_number: 1
        });

        let shift = await scheduleService.getShiftsByWaiterId(waiter.id);

        assert.equal(1, shift.length);
    });

    it('should be able to get shift(s) by waiter id', async function () {
        let scheduleService = ScheduleService(pool);

        let waiter = await scheduleService.createWaiter('Lorenzo');

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

        let waiter = await scheduleService.createWaiter('Lorenzo');

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

        let waiter_2 = await scheduleService.createWaiter('Andre');

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
            status: 'red',
            waiters: ['Andre', 'Lorenzo']
        },
        {
            day: 'Tuesday',
            status: 'red',
            waiters: []
        },
        {
            day: 'Wednesday',
            status: 'red',
            waiters: ['Lorenzo']
        },
        {
            day: 'Thursday',
            status: 'red',
            waiters: ['Andre']
        },
        {
            day: 'Friday',
            status: 'red',
            waiters: ['Andre', 'Lorenzo']
        },
        {
            day: 'Saturday',
            status: 'red',
            waiters: []
        },
        {
            day: 'Sunday',
            status: 'red',
            waiters: []
        }
        ];

        assert.deepStrictEqual(expectedShift, listShifts);
    });

    it('should be able to update shift by waiter member', async function () {
        let scheduleService = ScheduleService(pool);

        let waiter = await scheduleService.createWaiter('Lorenzo');

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

        assert.equal(3, shift.length);
    });

    it('should be able to delete shift by waiter member', async function () {
        let scheduleService = ScheduleService(pool);

        let waiter = await scheduleService.createWaiter('Lorenzo');

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

        await scheduleService.deleteShiftByWaiterId(waiter.id);

        let shift = await scheduleService.getShiftsByWaiterId(waiter.id);

        assert.equal(0, shift.length);
    });

    it('should be able to delete all shifts and waiters', async function () {
        let scheduleService = ScheduleService(pool);

        let waiter = await scheduleService.createWaiter('Lorenzo');

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

        let waiter2 = await scheduleService.createWaiter('Andre');

        await scheduleService.createShift({
            waiter_id: waiter2.id,
            day_number: 1
        });

        await scheduleService.createShift({
            waiter_id: waiter2.id,
            day_number: 2
        });

        await scheduleService.createShift({
            waiter_id: waiter2.id,
            day_number: 3
        });

        await scheduleService.deleteShifts();
        await scheduleService.deleteWaiters();

        let shift = await scheduleService.getShifts();

        let expectedShift = [
            { day_number: 1, day_name: 'Monday', username: null },
            { day_number: 2, day_name: 'Tuesday', username: null },
            { day_number: 3, day_name: 'Wednesday', username: null },
            { day_number: 4, day_name: 'Thursday', username: null },
            { day_number: 5, day_name: 'Friday', username: null },
            { day_number: 6, day_name: 'Saturday', username: null },
            { day_number: 7, day_name: 'Sunday', username: null }
        ];

        assert.deepStrictEqual(expectedShift, shift);
    });

    after(function () {
        pool.end();
    });
});
