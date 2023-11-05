const  getPostcodeData  = require('./external/postcodeio');

const express = require('express')
const app = express()
const port = 3000

const morgan = require('morgan');

app.use(morgan('tiny'));
app.use(express.json());

const logger = require('./logger/logger');

app.get('/getLatLong/:postcode', async (req, res) => {

    const postcode = req.params.postcode;

    logger.info(`Request received for postcode: ${postcode}`);
    try {
        const data = await getPostcodeData(postcode);
        logger.info(`Data received from postcodeio: ${JSON.stringify(data)}`);
        res.send({
            latitude: data.result.latitude,
            longitude: data.result.longitude,
            created: Date.now()
        });
    } catch (error) {
        logger.error(`Error getting postcode data for ${postcode}: ${error}`);
        res.status(500).send(`Error getting postcode data for ${postcode}`);
    }
})

app.listen(port, () => {
    logger.info(`Example app listening at http://localhost:${port}`)
})
