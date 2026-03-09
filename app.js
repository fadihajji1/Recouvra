require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');
const connectDB = require('./src/config/db');

connectDB();


const app = express();
app.use(express.json());
app.use(express.static("public"));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/clients', require('./src/routes/clientRoutes'));
app.use('/api/invoices', require('./src/routes/invoiceRoutes'));


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
    console.log(`API Documentation on port http://localhost:${PORT}/api-docs`);

});
