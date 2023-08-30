const { validationResult } = require("express-validator");
module.exports =  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.path + ": " + error.msg);
      return res.status(400).json({ errors: errorMessages });
    }
    next();
};
