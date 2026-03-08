<<<<<<< HEAD
const express = require('express');
const app = express();

app.use(express.static("public"));




=======
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
>>>>>>> 94368a329c820a2d7de5dd256e667eede011f8d1

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
<<<<<<< HEAD
});

=======
    console.log(`API Documentation on port http://localhost:${PORT}/api-docs`);

});
>>>>>>> 94368a329c820a2d7de5dd256e667eede011f8d1
