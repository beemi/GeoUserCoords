require('dotenv').config();
const express = require('express')
const expressJSDocSwagger = require('express-jsdoc-swagger');
const port = process.env.PORT || 3000;
const postcodeRoutes = require('./src/routes/postcodeRoutes');
const morgan = require('morgan');
const logger = require('./src/utils/logger');
const swaggerOptions = require('./src/config/swaggerOptions');

const app = express()

app.use(morgan('default'));
app.use(express.json());
app.use('/api/v1/postcode', postcodeRoutes);

expressJSDocSwagger(app)(swaggerOptions);

app.use((error, req, res, next) => {
    logger.error(`Error: ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
    logger.info(`Example app listening at http://localhost:${port}`)
})
