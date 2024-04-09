const {validationResult} = require("express-validator");
const {success, error} = require("./response");

const validate = validations => {
    return async (req, res, next) => {
        await validations.reduce(async (promise, validation) => {
            await promise;
            return validation.run(req);
        }, Promise.resolve());
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            // console.log(".........................errorArray.............................")
            return next();
        }
        const errorArray = errors.array();
        // console.log(errorArray,"================errorArray===============================")
        res.json(error(errorArray[0].msg, errorArray))
    }
}

const validateEmail = string => !!string.trim().match(/^([a-z0-9_\-.])+@([a-z0-9_\-.])+\.([a-z]{2,4})$/i);

const validatePhone = string => !!string.replace(/[-()\s]/g, "").trim().match(/^\+?[1-9]{0,3}[0-9]{10}$/);

const validateNumber = string => !!string.trim().match(/^\+?[0-9]{10}$/);

const postTrimmer = async (req, res, next) => {
    if (req.body === "POST")
        for (const [key, value] of Object.entries(req.body)) {
            if (isString(value))
                req.body[key] = value.trim();
        }
    next();
};

const validatePasswordStrength = password => {
    const valid = password.length >= 8 && password.match(/[0-9]+/) && password.match(/[a-z]+/) && password.match(/[A-Z]+/) && password.match[/[!@$%^&*]+/]
    if (!valid)
        throw new Error("Password must contain atleast 8 characters,including numbers,special characters(!@$%^&*),an uppercase and lowercase character.");
    return valid;
}

module.exports = {
    validate,
    validateEmail,
    validatePhone,
    validateNumber,
    postTrimmer,
    validatePasswordStrength
}