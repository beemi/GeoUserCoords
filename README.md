# User geo coordinates API

## Description

This is a simple API that returns the geo coordinates of a user based on the postcode provided.

## Installation

```bash
npm install express axios morgan winston
```

### Development

To run the app in development mode, run the following commandm which will start the mongodb instance and the app.

```bash
docker-compose up -d
```
Build the Docker image for local development
    
```bash
docker build -t user-geo-coordinates-api .
```

### Project structure

```bash
your-app/
│
├── src/
│   ├── models/                # Mongoose models / schemas.
│   │   └── ...
│   ├── routes/                # Express route definitions.
│   │   └── ...
│   ├── services/              # Business logic and service layer.
│   │   ├── postcodeService.js # Service for handling postcode-related operations.
│   │   └── externalApi.js     # This is where you'd interact with external APIs.
│   ├── config/                # Configuration files.
│   │   └── ...
│   ├── utils/                 # Utility functions and helpers.
│   │   └── ...
│   ├── middleware/            # Custom middleware for Express.
│   │   └── ...
│   ├── app.js                 # Express app setup.
│   └── server.js              # Server entry point.
│
├── package.json               # Project manifest.
└── ...
```
