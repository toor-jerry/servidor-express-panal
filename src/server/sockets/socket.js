const { io } = require('../app');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

// const socketioJwt = require('socketio-jwt');

// io.set('authorization', socketioJwt.authorize({
//     secret: process.env.SEED,
//     handshake: true
// }));

io.on('connection', (socket) => {

    console.log('nuevo usuarioconectado');
    console.warn('USER CONECT');
    socket.emit("conectado");

    socket.on('register', (token) => {
        console.log(`ON REGISTER: \x1b[36m${token}\x1b[0m`);
        if (!token) {
            return;
        }
        const payload = jwt.decode(token);

        UserModel.findById(payload.user._id, 'seed', (err, user) => {

            if (err) return socket.emit('error', err);

            if (!user) return socket.emit('error', 'User not found!!');

            jwt.verify(token, process.env.SEED + user.seed, (err, decoded) => {
                if (err) return socket.emit('unauthorized', err);
                try {
                    const user = decoded.user._id;
                    const activeUsers = socket.client.conn.server.clientsCount;
                    socket.user = user;
                    socket.join(user);
                    io.in(user).allSockets()
                        .then(clients => io.to(user).emit('new-conection', clients.size))
                        .catch(err => console.error(`Clients err: \x1b${err}[31m`));

                    console.log('Roms: ', socket.rooms, 'USER ', user, 'USUARIOS: ', activeUsers, 'I: ', io.in(user).allSockets(), 'CLIENTS ', io.allSockets());
                } catch (err) {
                    console.error(`ON REGISTER: \x1b${err}[31m`);
                    socket.emit('unauthorized', err);
                }
            });
        });
    });


    socket.on('logout', (user) => {
        if (!user)
            return;
        socket.leave(user);
        io.in(user).allSockets()
            .then(clients => {
                console.log('Clients logout: ', clients);
                if (clients.size === 0) {
                    io.emit('user-disconnect', user);
                }
                io.to(user).emit('i-logout', clients.size);
            })
            .catch(err => console.error(`Clients err: \x1b${err}[31m`));
        socket.disconnect(true);

    });

    socket.on('disconnect', () => {
        console.log('Socket disconnect');
        io.in(socket.user).allSockets()
            .then(clients => {
                console.log('Clients logout: ', clients);
                if (clients.size === 0) {
                    io.emit('user-disconnect', socket.user);
                }
                io.to(user).emit('i-logout', clients.size);
            })
            .catch(err => console.error(`Clients err: \x1b${err}[31m`));
    });

});





// client.emit('enviarMsg', {
//     message: 'bienvenido'
// });

// client.on('disconnect', () => {
//     console.log('usuario desconectado');
// });

// client.on('enviarMsg', (message, callback) => {
//     console.log(message);
//     callback();
// });



// socket.on('enviar_msg', async(data, status) => {
//     try {
//         let nuevoMsg = new Chat({
//             id_conversacion: uuid.v1(),
//             remitente: data.id_usuario,
//             destinatario: data.contacto,
//             mensaje: data.mensaje,
//             status: "guardado"
//         });
//         console.log(data.img);

//         await nuevoMsg.save();

//         socket.to(data.contacto).to(data.id_usuario).emit("nuevo_msg", data);

//         status(true);
//     } catch (err) {
//         console.log(err);
//     }
// });

// socket.on('enviar_notificacion', (room, data, status) => {
//     try {
//         socket.to(room).emit("nueva_notificacion", data);
//         status(true);
//     } catch (err) {
//         console.warn(err);
//     }
// });