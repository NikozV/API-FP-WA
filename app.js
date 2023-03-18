const express = require('express');
const qrcode = require('qrcode');
const { Client, MessageMedia } = require('whatsapp-web.js');
const { LocalAuth } = require('whatsapp-web.js');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Configurar body-parser para analizar JSON y urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar multer para procesar la carga de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

/* const client = new Client({ puppeteer: { args: ['--no-sandbox'] } }); */

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { args: ['--no-sandbox'] }
});

let qrResponse;

app.get('/api/qr', async (req, res) => {
  async function getQr() {
    return new Promise((resolve) => {
      qrResponse = { send: resolve };
      client.on('qr', qrResponse.send);
    });
  }

  const qr = await getQr();

  const qrImage = await qrcode.toDataURL(qr, { scale: 4 });
  const html = `
    <html>
      <body>
        <div style="text-align: center;">
          <img src="${qrImage}" alt="WhatsApp QR Code">
          <p>Scanear el QR para entrar - facilpos.co</p>
        </div>
      </body>
    </html>
  `;

  res.send(html);
});
client.on('ready', () => {
  console.log('Conetado!');
});
client.initialize();

function sendErrorResponse(res, message) {
  res.status(400).json({ error: { message: message } });

}
const sendMessageToNumber = async (number, message, res) => {
  const chat = await client.getChatById(`${number}@c.us`);
  if (!chat) {
    sendErrorResponse(res, `No se pudo encontrar el chat con el número ${number}`);
    return;
  }
  await chat.sendMessage(message);
};
const sendImageToNumber = async (number, imagePath, caption, res) => {
  const chat = await client.getChatById(`${number}@c.us`);
  if (!chat) {
    sendErrorResponse(res, `No se pudo encontrar el chat con el número ${number}`);
    return;
  }
  const imageBuffer = fs.readFileSync(imagePath);
  const imageBase64 = imageBuffer.toString('base64');
  const imageMedia = new MessageMedia('image/jpeg', imageBase64);

  await chat.sendMessage(imageMedia, { caption: caption });
};
// Ruta para enviar mensajes
app.post('/api/send-message', async (req, res) => {
  const { number, message } = req.body;
  await sendMessageToNumber(number, message, res);
  res.send({ response: 'Mensaje enviado con éxito' });
});

const sendMessageToNumbers = async (numbers, message) => {
  // Verificar que los números se hayan pasado correctamente
  if (!Array.isArray(numbers) || numbers.length === 0) {
    console.log('Error: números no válidos');
    return;
  }
  // Enviar mensaje a cada número
  for (const number of numbers) {
    const chat = await client.getChatById(`${number}@c.us`);
    if (!chat) {
      console.log(`No se pudo encontrar el chat con el número ${number}`);
      continue;
    }
    await chat.sendMessage(message);
  }
};
// Ruta para enviar mensajes a múltiples números
app.post('/api/send-multimessage', async (req, res) => {
  const { numbers, message } = req.body;
  await sendMessageToNumbers(numbers, message, res);
  res.send({ response: 'Mensaje enviado con éxito a múltiples números' });
});

// Ruta para enviar imágenes
app.post('/api/send-image', upload.single('image'), async (req, res) => {
  const { number, message } = req.body;
  const imagePath = req.file.path;
  await sendImageToNumber(number, imagePath, message, res);
  res.send({ response: 'Imagen enviada con éxito' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});