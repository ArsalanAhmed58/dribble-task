function success(message, data) {
    return {
        message,
        data,
        type: "success"
    };
}

function error(message, data = null, errors = []) {
    return {
        data,
        errors,
        message,
        type: "error"
    }
}

function response(message = "success", data) {
    return {
        data,
        type: "success",
        message
    }
}

const wrapRequestHandler = (fn) => (req, res, next) => fn(req, res, next).catch(next);

module.exports = {
    success,
    error,
    response,
    wrapRequestHandler
}
