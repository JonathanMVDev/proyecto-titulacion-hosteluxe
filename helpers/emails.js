import nodemailer from "nodemailer";

const emailConfirmacion = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, name, token } = datos;

  await transport.sendMail({
    from: "Restaurante.com",
    to: email,
    subject: "Confirme su cuenta en Hoteleria.com",
    text: "Confirme su cuenta en Hoteleria.com",
    html: `
        </style>
        <div style="background: #845e02;padding:4px;">
          <div style="padding: 10px 15px;background: white;font-size: 17px;">
            <div style="border-bottom: 1px black solid;margin-bottom: 5px;padding-bottom: 5px;">
              <p style="margin-left:10px;font-weight:700;">Hotelería</p>
            </div>
            <div style="margin: 10px 0;">
              <p style="margin:0;">Hola ${name}.</p>
              <p style="margin:0;">Has creado una cuenta en hoteleria.com</p>
              <p style="margin:0;">Sigue el siguiente enlace para confirmar su cuenta:
              <a href="${process.env.URL}/auth/mensaje/${token}">Confirmar mi cuenta</a></p>
              <p style="margin:0;">Si tu no has creado una cuenta, puedes ignorar el mensaje</p>
            </div>
            <div style="border-top: 1px black solid;padding-top: 5px; margin-left:5px;">
            <p style="font-weight:700;margin:0;"> Contacto</p>
            <p style="margin-left:10px;margin:0;"><span  style="font-weight:700;">Teléfono:</span> +56 912345678</p>
            <p style="margin-left:10px;margin:0;"><span  style="font-weight:700;">Correo Electrónico: </span> Hoteleria@gmail.com</p>
            </div>
          </div>
        </div>
          `,
  });
};

const emailOlvidePassword = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  const { email, name, token } = datos;

  // Enviar el email
  await transport.sendMail({
    from: "Restaurante.com",
    to: email,
    subject: "Restablece tu Password en Hoteleria.com",
    text: "Restablece tu Password en Hoteleria.com",
    html: `
        </style>
        <div style="background: #845e02;padding:4px;">
          <div style="padding: 10px 15px;background: white;font-size: 17px;">
            <div style="border-bottom: 1px black solid;margin-bottom: 5px;padding-bottom: 5px;">
              <p style="margin-left:10px;font-weight:700;">Hotelería</p>
            </div>
            <div style="margin: 10px 0;">
              <p style="margin:0;">Hola ${name}.</p>
              <p style="margin:0;">Has solicitado restablecer tu contraseña en hoteleria.com</p>
              <p style="margin:0;">Sigue el siguiente enlace para generar una contraseña nueva:
              <a href="${process.env.URL}/auth/cambiarPassword/${token}">Restablecer Contraseña</a></p>
              <p style="margin:0;">Si tu no solicitaste el cambio de password, puedes ignorar el mensaje</p>
            </div>
            <div style="border-top: 1px black solid;padding-top: 5px; margin-left:5px;">
            <p style="font-weight:700;margin:0;"> Contacto</p>
            <p style="margin-left:10px;margin:0;"><span  style="font-weight:700;">Teléfono:</span> +56 912345678</p>
            <p style="margin-left:10px;margin:0;"><span  style="font-weight:700;">Correo Electrónico: </span> Hoteleria@gmail.com</p>
            </div>
          </div>
        </div>
          `,
  })
}

const emailMensajeEnviado = async email => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Enviar el email
  await transport.sendMail({
    from: "Restaurante.com",
    to: email,
    subject: "Muchas gracias por ponerse en contacto con Hoteleria.com",
    text: "Muchas gracias por ponerse en contacto con Hoteleria.com",
    html: `
        </style>
        <div style="background: #845e02;padding:4px;">
          <div style="padding: 10px 15px;background: white;font-size: 17px;">
            <div style="border-bottom: 1px black solid;margin-bottom: 5px;padding-bottom: 5px;">
              <p style="margin-left:10px;font-weight:700;">Hotelería</p>
            </div>
            <div style="margin: 10px 0;">
              <p style="margin:0;">Buenas tardes.</p>
              <p style="margin:0;">Has enviado un mensaje en hoteleria.com</p>
              <p style="margin:0;">La respuesta será enviada en los próximos días.</p>
              <p style="margin:0;">Si tu no enviaste este mensaje, puedes ignorar este correo.</p>
            </div>
            <div style="border-top: 1px black solid;padding-top: 5px; margin-left:5px;">
            <p style="font-weight:700;margin:0;"> Contacto</p>
            <p style="margin-left:10px;margin:0;"><span  style="font-weight:700;">Teléfono:</span> +56 912345678</p>
            <p style="margin-left:10px;margin:0;"><span  style="font-weight:700;">Correo Electrónico: </span> Hoteleria@gmail.com</p>
            </div>
          </div>
        </div>
          `,
  })
}


const emailReserva = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  const { name, email, fechaInicio, fechaFin } = datos;

  // Enviar el email
  await transport.sendMail({
    from: "Restaurante.com",
    to: email,
    subject: "Gracias por reservar en Hoteleria.com",
    text: "Gracias por reservar en Hoteleria.com",
    html: `
        </style>
        <div style="background: #845e02;padding:4px;">
          <div style="padding: 10px 15px;background: white;font-size: 17px;">
            <div style="border-bottom: 1px black solid;margin-bottom: 5px;padding-bottom: 5px;">
              <p style="margin-left:10px;font-weight:700;">Hotelería</p>
            </div>
            <div style="margin: 10px 0;">
              <p style="margin:0;">Hola ${name}.</p>
              <p style="margin:0;">Has realizado una reserva en hoteleria.com</p>
              <p style="margin:0;">Recuerde que su día de inicio es: ${fechaInicio} y su día de termino es: ${fechaFin}</p>
              <p style="margin:0;">Le agradecemos por su preferencia, si necesita más información puede revisarla</p>
              <p style="margin:0;">en Perfil -> Reservas</p>
            </div>
            <div style="border-top: 1px black solid;padding-top: 5px; margin-left:5px;">
            <p style="font-weight:700;margin:0;"> Contacto</p>
            <p style="margin-left:10px;margin:0;"><span  style="font-weight:700;">Teléfono:</span> +56 912345678</p>
            <p style="margin-left:10px;margin:0;"><span  style="font-weight:700;">Correo Electrónico: </span> Hoteleria@gmail.com</p>
            </div>
          </div>
        </div>
          `,
  })
}

export {
  emailConfirmacion,
  emailOlvidePassword,
  emailMensajeEnviado,
  emailReserva
}