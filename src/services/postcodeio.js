const axios = require('axios');

const {postcodeIoUrl} = require('../config/config-utils');

const getPostcodeData = async (postcode) => {
    try {
        const url = `${postcodeIoUrl}/postcodes/${encodeURIComponent(postcode)}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching data from postcodes.io:', error);
        throw error; // Rethrow the error so it can be caught by the caller
    }
};

module.exports = getPostcodeData;
