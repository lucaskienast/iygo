const asyncWrapper = (fct) => {
    return async (req, res, next) => {
        try {
            await fct(req, res, next);
        } catch (error) {
            next(error);
        }
    }
};

module.exports = asyncWrapper;