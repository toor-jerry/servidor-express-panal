const response200 = (res, data = undefined) => {
    return res.status(200).json({
        ok: true,
        data
    });
}

const response201 = (res, data = undefined) => {
    return res.status(201).json({
        ok: true,
        data
    });
}

const response400 = (res, message = undefined, err = undefined) => {
    return res.status(400).json({
        ok: false,
        message: message || 'Bad Request.',
        errors: err
    });
}

const response401 = (res, message = undefined, err = undefined) => {
    return res.status(401).json({
        ok: false,
        message: message || 'Unauthorized.',
        errors: err
    });
}

const response500 = (res, err, message = undefined) => {
    return res.status(500).json({
        ok: false,
        message: message || 'Internal Server Error',
        errors: err
    });
}


module.exports = {
    response200,
    response201,
    response400,
    response401,
    response500
}