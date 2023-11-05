const express = require('express')
const app = express()
const port = 3000

const morgan = require('morgan');

app.use(morgan('tiny'));

const logger = require('./logger/logger');

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    logger.info(`Example app listening at http://localhost:${port}`)
})
