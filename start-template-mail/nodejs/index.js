import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import { body, validationResult } from 'express-validator';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());


// const transporter = nodemailer.createTransport({
//   host: 'smtp.ukr.net',
//   port: 465, // у Ukr.net тільки SSL-порт
//   secure: true, // обов’язково true для 465
//   auth: {
//     user: process.env.EMAIL,      // твоя повна адреса, напр. test@ukr.net
//     pass: process.env.EMAIL_PASS, // пароль від пошти
//   },
// });

const transporter = nodemailer.createTransport({
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
})

function trimReplace(value) {
  if (typeof value === 'string') {
    return value.trim().replace(/\s+/g, ' ');
  }
  return value;
}

function trimOnly(value) {
  if (typeof value === 'string') {
    return value.trim(); // тільки обрізає по краях, зберігаючи пробіли всередині
  }
  return value;
}


function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Форматування повідомлення так, щоб пробіли та переводи рядків точно зберігалися
function formatMessageSafe(message) {
  if (typeof message !== 'string') return '';
  const escaped = escapeHtml(message);
  const lines = escaped.split('\n');
  return lines.map(line => `<div style="white-space: pre;">${line}</div>`).join('');
}

function formatMessageWithSpaces(message) {
  if (typeof message !== 'string') return '';
  const escapeHtml = (text) =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  // Екрануємо HTML
  const escaped = escapeHtml(message);

  // Перетворюємо пробіли на &nbsp; та перенос рядків на <br>
  return escaped
    .replace(/ /g, '&nbsp;')
    .replace(/\n/g, '<br>');
}

// Валідація данних підчас обрабки POST-запиту від клієнта
const validateData = [
  body('name').customSanitizer(trimReplace).notEmpty().withMessage('Відсутнє ПІП.')
    .isLength({ min: 5, max: 50 }).withMessage('ПІП має бути 5-50 символів.'),
  body('phone').customSanitizer(trimReplace).notEmpty().withMessage('відсутній телефон.')
    // .matches(/^\+[0-9]{5,15}$/).withMessage('Не корректний телефон.'),
    .matches(/^0\d{9}$/).withMessage('Не корректний телефон.'),
  body('email').customSanitizer(trimReplace).notEmpty().withMessage('Відсутній Email.')
    .isEmail().isLength({ min: 5, max: 100 }).withMessage('Не корректный Email'),
  body('message').customSanitizer(trimOnly).notEmpty().withMessage('Відсутній текст повідомлення.')
    .isLength({ min: 20, max: 400 }).withMessage('Повідомлення має бути 20-400 символів.'),
  // body('message').notEmpty().withMessage('Відсутній текст повідомлення.')
  //   .isLength({ min: 20, max: 400 }).withMessage('Повідомлення має бути 20-400 символів.'),
];

app.post('/send-email', validateData, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, phone, email, message } = req.body;

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: `Замовлення від: ${name} email: ${email}`,
      // html: `<p><strong>Email:</strong>${email}</p>
      //       <p><strong>Phone:</strong>${phone}</p>
      //       <p><strong>Повідомлення:</strong></p>
      //       <div>
      //         <pre style="font-family: inherit; line-height: 1.4;">${formatMessageWithSpaces(message)}</pre>
      //       </div>
      //       `,
      text: `
      Email: ${email}
      Phone: ${phone}

      Повідомлення:
      ${message}
        `,
      replyTo: email
    });

    res.send('Повідомлення відправлено');
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});



app.listen(PORT, (err) => {
  if (err) {
    return console.log(err)
  }
  console.log(`Відбувся старт сервера на порту: ${PORT}`);
})
