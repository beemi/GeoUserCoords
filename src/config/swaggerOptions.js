const swaggerOptions = {
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
    baseDir: __dirname,
    filesPattern: '../**/*.js',
    swaggerUIPath: '/api-docs',
    exposeSwaggerUI: true,
    exposeApiDocs: false,
    apiDocsPath: '/v3/api-docs',
    notRequiredAsNullable: false,
    swaggerUiOptions: {},
    multiple: true,
};

module.exports = swaggerOptions;
