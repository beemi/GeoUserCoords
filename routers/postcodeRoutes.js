const express = require('express');
const router = express.Router();
const getPostcodeData = require('../external/postcodeio');
const logger = require('../logger/logger');

// Wrap async functions for error handling
const asyncHandler = require('express-async-handler');

router.get('/getLatLong/:postcode', asyncHandler(async (req, res) => {
    const postcode = req.params.postcode;
    logger.info(`Request received for postcode: ${postcode}`);
    try {
        const data = await getPostcodeData(postcode);
        logger.info(`Data received from postcodeio: ${JSON.stringify(data)}`);
        res.status(200).json({
            latitude: data.result.latitude,
            longitude: data.result.longitude,
            created: Date.now(),
        });
    } catch (error) {
        logger.error(`Error getting postcode data for ${postcode}: ${error}`);
        // Pass the error to the error-handling middleware
        throw error;
    }
}));

module.exports = router;
