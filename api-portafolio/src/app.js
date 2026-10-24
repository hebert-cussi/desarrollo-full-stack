require('dotenv').config({ quiet: true });
const express = require('express');
const cors = require('cors');

const { swaggerUi, swaggerSpec } = require('./config/swagger');

const proyectoRoutes = require('./routes/proyecto.routes');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',')??'*'
}));

app.use(express.json());

const doc= process.env.DOCUMENTATION||'/documentation'

app.use(doc, 
    swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/proyectos',proyectoRoutes);

app.use((req, res)=> res.status(404).json({ error: 'Ruta no encontrada'} ));

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Swagger UI disponible en http://localhost:${PORT}/${doc}`);
})