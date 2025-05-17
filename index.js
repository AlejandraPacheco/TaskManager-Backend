require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);

    // Test de conexión con la base de datos
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión con la base de datos exitosa.');
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error);
    }
});
