'use strict';

const express = require('express');
const createJobRoutes = require('./routes/jobs');
const createAnalyticsRoutes = require('./routes/analytics');
const jobManager = require('./models/JobManager');

function createApp() {
    const app = express();

    app.use(express.json());

    const jm = jobManager.getInstance();

    app.use('/jobs', createJobRoutes(jm));
    app.use('/stats', createAnalyticsRoutes(jm));

    return app;
}

module.exports = createApp; 