{
  "name": "openmusic-api",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start-prod": "NODE_ENV=production node ./src/server.js",
    "start": "nodemon ./src/server.js",
    "lint": "eslint ./src",
    "migrate": "node-pg-migrate"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@hapi/hapi": "^20.2.2",
    "auto-bind": "^5.0.1",
    "dotenv": "^16.0.3",
    "joi": "^17.6.2",
    "nanoid": "^4.0.0",
    "node-pg-migrate": "^6.2.2",
    "pg": "^8.8.0"
  },
  "devDependencies": {
    "eslint": "^8.25.0",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-plugin-import": "^2.26.0",
    "nodemon": "^2.0.20"
  },
  "description": ""
}