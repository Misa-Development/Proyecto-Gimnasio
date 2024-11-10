const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');  // Pon aquí tu clave API de SendGrid

const sendConfirmationEmail = (user) => {
    const msg = {
        to: 'development.now.arg@gmail.com',  // Correo del administrador
        from: 'development.now.arg@gmail.com',  // Tu dirección de correo verificada en SendGrid
        subject: 'Confirmación de Registro de Usuario',
        text: `
            Se ha registrado un nuevo usuario. Por favor, confirma su registro.
            Nombre: ${user.name}
            Apellido: ${user.surname}
            Edad: ${user.age}
            Email: ${user.email}
            Enfermedades: ${user.diseases}
            Apta Médica: ${user.medicalClearance ? 'Sí' : 'No'}
            Inicio de Membresía: ${user.membershipStart}
            Vencimiento de Membresía: ${user.membershipEnd}
            
            Confirma el registro haciendo clic en el siguiente enlace:
            http://localhost:3000/admin/confirm/${user._id}
        `,
    };

    sgMail.send(msg)
        .then(() => {
            console.log('Email enviado');
        })
        .catch((error) => {
            console.error(error);
        });
};

const sendUserConfirmationEmail = (user) => {
    const msg = {
        to: user.email,  // Correo del usuario
        from: 'development.now.arg@gmail.com',  // Tu dirección de correo verificada en SendGrid
        subject: 'Confirma tu Dirección de Correo',
        text: `
            Hola ${user.name},
            
            Gracias por registrarte. Por favor, confirma tu dirección de correo electrónico haciendo clic en el siguiente enlace:
            http://localhost:3000/auth/confirm-email/${user._id}
        `,
    };

    sgMail.send(msg)
        .then(() => {
            console.log('Email de confirmación enviado al usuario');
        })
        .catch((error) => {
            console.error(error);
        });
};

module.exports = { sendConfirmationEmail, sendUserConfirmationEmail };
