const express = require('express')
const app = express()
const port = 3000
const  getPostcodeData  = require('./external/postcodeio');
const postcodeRoutes = require('./routers/postcodeRoutes');
const morgan = require('morgan');
const logger = require('./logger/logger');

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
