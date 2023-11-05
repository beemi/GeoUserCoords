require('dotenv').config();
const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const postcodeRoutes = require('./src/routes/postcodeRoutes');
const morgan = require('morgan');
const logger = require('./src/utils/logger');

app.use(morgan('tiny'));
app.use(express.json());
app.use('/postcode', postcodeRoutes);

app.use((error, req, res, next) => {
    logger.error(`Error: ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
    logger.info(`Example app listening at http://localhost:${port}`)
})
