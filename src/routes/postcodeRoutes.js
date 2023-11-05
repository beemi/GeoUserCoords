const db = require('../config/db');
const express = require('express');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const bodyParser = require('body-parser');
const router = express.Router();
const getPostcodeData = require('../services/postcodeio');
const logger = require('../utils/logger');
const Postcode = require('../models/Postcode');

const asyncHandler = require('express-async-handler');

/**
 * POST /api/v1/postcode/getLatLong/{postcode}
 * @summary This endpoint retrieves the latitude and longitude for a given postcode
 * @param {string} postcode.path - The postcode to retrieve the latitude and longitude for
 * @return {object} 200 - success response - application/json
 * @example response - 200 - success response example
 * {
 *    "status": "success",
 *    "latitude": 51.557962,
 *    "longitude": 0.067261,
 *    "created": "2023-11-05T17:31:13.475Z"
 *    }
 */
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

/**
 * GET /api/v1/postcode/getLatLong/{postcode}
 * @summary This endpoint retrieves the latitude and longitude for a given postcode
 * @param {string} postcode.path - The postcode to retrieve the latitude and longitude for
 * @return {object} 200 - success response - application/json
 * @example response - 200 - success response example
 * {
 *   "status": "success",
 *   "latitude": 51.557962,
 *   "longitude": 0.067261,
 *   "created": "2023-11-05T17:31:13.475Z"
 *   }
 */
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

/**
 * GET /api/v1/postcode/getAllPostcodes
 * @summary This endpoint retrieves all postcodes from the database
 * @return {object} 200 - success response - application/json
 * @example response - 200 - success response example
 * {
 *   "status": "success",
 *   "data": [
 *     {
 *       "_id": "6547d161e96d1792f30e863a",
 *       "postcode": "IG12FJ",
 *       "data": {
 *         "latitude": 51.557962,
 *         "longitude": 0.067261
 *       },
 *       "date": "2023-11-05T17:31:13.475Z",
 *       "__v": 0
 *     }
 *   ]
 * }
 */
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

/**
 * DELETE /api/v1/postcode/delete/{postcode}
 * @summary This endpoint deletes a postcode from the database
 * @param {string} postcode.path - The postcode to delete from the database
 * @return {object} 200 - success response - application/json
 * @example response - 200 - success response example
 * {
 *    "status": "success",
 *    "message": "Postcode RM176EY deleted"
 *    }
 */
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
