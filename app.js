const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('.src/config/swagger');

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
    console.log(`API Documentation on port http://localhost:${PORT}/api-docs`);

});