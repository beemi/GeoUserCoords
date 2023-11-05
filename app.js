require('dotenv').config();
const express = require('express')
const expressJSDocSwagger = require('express-jsdoc-swagger');
const port = process.env.PORT || 3000;
const postcodeRoutes = require('./src/routes/postcodeRoutes');
const morgan = require('morgan');
const logger = require('./src/utils/logger');


const options = {
    info: {
        version: '1.0.0',
        title: 'User Geo Location API',
        description: 'User Geo Location API',
        contact: {
            email: 'beemi.raja@gmail.com',
            name: 'Beemi Raja',
        },
        license: {
            name: 'MIT',
        },
    },
    security: {
        BasicAuth: {
            type: 'http',
            scheme: 'basic',
        },
    },
    baseDir: __dirname,
    filesPattern: './**/*.js',
    swaggerUIPath: '/api-docs',
    exposeSwaggerUI: true,
    exposeApiDocs: false,
    apiDocsPath: '/v3/api-docs',
    notRequiredAsNullable: false,
    swaggerUiOptions: {},
    multiple: true,
};

const app = express()

app.use(morgan('default'));
app.use(express.json());
app.use('/api/v1/postcode', postcodeRoutes);

expressJSDocSwagger(app)(options);

app.use((error, req, res, next) => {
    logger.error(`Error: ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
    logger.info(`Example app listening at http://localhost:${port}`)
})
