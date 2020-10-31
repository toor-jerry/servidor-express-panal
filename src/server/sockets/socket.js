const { io } = require('../app');

io.on('connect', (client) => {

    console.log('nuevo usuarioconectado');

    client.emit('enviarMsg', {
        message: 'bienvenido'
    });

    client.on('disconnect', () => {
        console.log('usuario desconectado');
    });

    client.on('enviarMsg', (message, callback) => {
        console.log(message);
        callback();
    });
});