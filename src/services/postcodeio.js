const axios = require('axios');

const getPostcodeData = async (postcode) => {
    try {
        const url = `https://postcodes.io/postcodes/${encodeURIComponent(postcode)}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching data from postcodes.io:', error);
        throw error; // Rethrow the error so it can be caught by the caller
    }
};

module.exports = getPostcodeData;
