# Manual de Usuario - WhatsApp API - facilpos

## Descripción

Este proyecto proporciona una API para enviar mensajes y archivos multimedia a través de WhatsApp utilizando la librería `whatsapp-web.js`. La API expone tres rutas para enviar mensajes a un solo número, enviar imágenes a un solo número y enviar mensajes a múltiples números.

## Requisitos

-   Node.js
-   WhatsApp en un dispositivo móvil
-   Conexión a internet estable

## Dependencias
	

> package.json

    {    
        "dependencies": {    
        "axios": "^1.3.4",    
        "body-parser": "^1.20.2",    
        "express": "^4.18.2",    
        "fs": "^0.0.1-security",    
        "multer": "^1.4.5-lts.1",    
        "path": "^0.12.7",    
        "qrcode": "^1.5.1",    
        "whatsapp-web.js": "^1.19.4"    
        }   
    }

## Instalación

1.  Clonar este repositorio en su computadora.
2.  Abrir la terminal y navegar hasta el directorio del repositorio.
3.  Ejecutar `npm install` para instalar todas las dependencias necesarias.
4.  Iniciar el servidor ejecutando `node app.js`.
5.  Escanear el código QR que aparece en la página web generada en la ruta `/qr` utilizando WhatsApp en su dispositivo móvil.
6.  La API está lista para recibir peticiones.

## Uso

### Enviar mensaje a un solo número

Enviar un mensaje a un solo número utilizando la ruta `/api/send-message`. Enviar una petición POST con el siguiente cuerpo:

    {
      "number": "número de teléfono con el prefijo del país (Ejemplo: +573123456789)",
      "message": "mensaje a enviar"
    } 

### Enviar imagen a un solo número

Enviar una imagen a un solo número utilizando la ruta `/api/send-image`. Enviar una petición POST con el siguiente cuerpo:

    {
      "number": "número de teléfono con el prefijo del país (Ejemplo: +573123456789)",
      "message": "mensaje a enviar",
      "image": "archivo de imagen a enviar"
    }

El archivo de imagen debe ser enviado como un formulario multipart utilizando `multipart/form-data`.

### Enviar mensaje a múltiples números

Enviar un mensaje a múltiples números utilizando la ruta `/api/send-multimessage`. Enviar una petición POST con el siguiente cuerpo:

    {
      "numbers": ["número de teléfono 1 con el prefijo del país", "número de teléfono 2 con el prefijo del país", ...],
      "message": "mensaje a enviar"
    }

## Notas

-   Para enviar archivos multimedia (imágenes, videos, documentos), se puede utilizar la función `sendImageToNumber` como se muestra en el código proporcionado.
-   El código proporcionado utiliza `multer` para procesar la carga de archivos. Puede ser necesario configurar la ruta de destino y los nombres de archivo en la función `filename` en la definición de `storage` dependiendo de sus necesidades.
-   La API utiliza un código QR generado por `whatsapp-web.js` para conectarse a WhatsApp. Este código debe ser escaneado utilizando WhatsApp en su dispositivo móvil cada vez que inicie la API.