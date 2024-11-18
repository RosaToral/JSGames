const express = require('express');
const path = require('path');
const app = express();
const port = 3030;

// Servir archivos estáticos desde la carpeta 'src' y sus subcarpetas
app.use(express.static(path.join(__dirname, 'src')));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
