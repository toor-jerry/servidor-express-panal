$(function() {
    //socket iniciado
    var socket = io();
    //variables
    var message = $('#chat-message');
    var chat = $('#chat');
    var contacto = $('#contacto');
    var img = $('#imagen');

    message.focus();
    $('#conectarse').click(() => {
      // Registro del socket
      user_data = {
        id_usuario: message.val(),
        tipo_usuario: "usuario"

      };
      socket.emit('registro_sesion', user_data , status =>{
        console.log(status);
      });
    });
    $('#enviarNot').click(() =>{
      notificacion = {
        tipo: "urgente",
        mensaje: "esta es una notificacion",
        from: contacto.val()
      }
      //Enviar notificacion
      room = "usuario";
      socket.emit('enviar_notificacion', room, notificacion, status =>{
        console.log(status);
      })
    });

    $('#enviarMSG').click(()=> {
      data ={
        id_usuario: message.val(),
        mensaje: "mensaje",
        contacto: contacto.val(),
        img: img
      }
        socket.emit('enviar_msg', data, (status) =>{
        console.log(status);
        });
        // message.val(' ');
    });

    // Al recibir un nuevo mensaje
    socket.on("nuevo_msg",(data) =>{
      console.log(data);
    })

    // Al recibir una notificacion
    socket.on("nueva_notificacion",data =>{
      console.log(data);
    })
    // Al conectarse (socket)
    socket.on('conectado', data => {
      console.log(data);
    });

    // Al desconectarse
    socket.on('disconnect', data =>{
      console.log("No cuenta con conexion");
    })
});
