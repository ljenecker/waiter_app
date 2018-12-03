module.exports = function (scheduleService) {

    async function show (req, res, next) {
        try {
            res.render('home');
        } catch (err) {
            next(err);
        }
    };

    return {
      show
    }
};
