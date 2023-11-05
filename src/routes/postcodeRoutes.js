const db = require('../config/db');
const express = require('express');
const router = express.Router();
const getPostcodeData = require('../services/postcodeio');
const logger = require('../utils/logger');
const Postcode = require('../models/Postcode');

const asyncHandler = require('express-async-handler');

// POST /postcode/getLatLong/:postcode
router.post('/getLatLong/:postcode', asyncHandler(async (req, res) => {
    const postcode = req.params.postcode;
    logger.info(`Request received for postcode: ${postcode}`);
    try {
        // check if the zip code is in the database first
        const cursor = db.collection('postcodes').find({postcode: postcode});
        const result = await cursor.toArray();
        logger.debug(`Data retrieved from database: ${JSON.stringify(result)}`);
        if (result.length > 0) {
            res.status(200).json({
                status: 'success',
                latitude: result[0].data.latitude,
                longitude: result[0].data.longitude,
                created: result[0].date,
            });
            return;
        }

        const data = await getPostcodeData(postcode);
        logger.info(`Data received from postcodeio: ${JSON.stringify(data)}`);

        // Save the data to the database
        const postcodeData = new Postcode({
            postcode: postcode,
            data: {
                latitude: data.result.latitude,
                longitude: data.result.longitude,
            },
            date: Date.now(),
        });

        await postcodeData.save();
        logger.debug(`Data saved to database: ${JSON.stringify(postcodeData)}`);

        res.status(200).json({
            latitude: data.result.latitude,
            longitude: data.result.longitude,
            created: Date.now(),
        });
    } catch (error) {
        logger.error(`Error getting postcode data for ${postcode}: ${error}`);
        throw error;
    }
}));

// GET /postcode/getLatLong/:postcode
router.get('/getLatLong/:postcode', asyncHandler(async (req, res) => {
    const postcode = req.params.postcode;
    logger.info(`Request received for postcode: ${postcode}`);
    try {
        // check if the zip code is in the database first
        const cursor = db.collection('postcodes').find({postcode: postcode});
        const result = await cursor.toArray();
        logger.debug(`Data retrieved from database: ${JSON.stringify(result)}`);
        if (result.length > 0) {
            res.status(200).json({
                status: 'success',
                latitude: result[0].data.latitude,
                longitude: result[0].data.longitude,
                created: result[0].date,
            });
        } else {
            // send a 404 with a message as the postcode is not in the database
            res.status(404).json({
                status: 'error',
                message: 'Postcode not found in database',
            });
        }
    } catch (error) {
        logger.error(`Error getting postcode data for ${postcode}: ${error}`);
        throw error;
    }
}));

//GET /postcode/getAllPostcodes
router.get('/getAllPostcodes', asyncHandler(async (req, res) => {
    try {
        const cursor = db.collection('postcodes').find();
        const result = await cursor.toArray();
        logger.debug(`Data retrieved from database: ${JSON.stringify(result)}`);
        if (result.length > 0) {
            res.status(200).json({
                status: 'success',
                data: result
            });
        } else {
            // send a 404 with a message as the postcode is not in the database
            res.status(404).json({
                status: 'error',
                message: 'No postcodes found in database',
            });
        }
    } catch (error) {
        logger.error(`Error getting postcode data: ${error}`);
        throw error;
    }
}));

// DELETE /postcode/delete/:postcode
router.delete('/delete/:postcode', asyncHandler(async (req, res) => {
    const postcode = req.params.postcode;
    try {
        // check if the zip code is in the database first
        const cursor = db.collection('postcodes').find({postcode: postcode});
        const result = await cursor.toArray();
        logger.debug(`Data retrieved from database: ${JSON.stringify(result)}`);
        if (result.length > 0) {
            await db.collection('postcodes').deleteOne({postcode: postcode});
            res.status(200).json({
                status: 'success',
                message: `Postcode ${postcode} deleted`,
            });
        } else {
            // send a 404 with a message as the zip code is not in the database
            res.status(404).json({
                status: 'error',
                message: 'Postcode not found in database',
            });
        }
    } catch (error) {
        logger.error(`Error getting postcode data for ${postcode}: ${error}`);
        throw error;
    }
}));

module.exports = router;
