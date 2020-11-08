const crearMensaje = (nombre, mensaje) => {

    return {
        nombre,
        mensaje,
        fecha: new Date().getTime()
    };

}

const error500 = (res, err, message = undefined) => {
    return res.status(500).json({
        ok: false,
        message: message || 'Internal Server Error',
        errors: err
    });
}

const response200 = (res, data = undefined) => {
    return res.status(200).json({
        ok: true,
        data
    });
}

module.exports = {
    error500,
    response200
}