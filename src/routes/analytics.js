'use strict';

const express = require('express');
const { HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES } = require('../config/httpConstants');
const router = express.Router();

function createAnalyticsRoutes(jobManager) {
    router.get('/', (req, res) => {
        try {
            const stats = jobManager.getMetrics();
            res.json(stats);
        } catch (error) {
            console.error('Error generating stats:', error);
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
                error: HTTP_STATUS_MESSAGES.INTERNAL_SERVER_ERROR
            });
        }
    });

    return router;
}

module.exports = createAnalyticsRoutes; 