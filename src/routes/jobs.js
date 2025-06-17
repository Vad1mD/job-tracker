'use strict';

const express = require('express');
const { HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES } = require('../config/httpConstants');
const router = express.Router();

function createJobRoutes(jobManager) {
    router.post('/', async (req, res) => {
        try {
            const { jobName, arguments: jobArgs = [] } = req.body;
            
            if (!jobName) {
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ 
                    error: HTTP_STATUS_MESSAGES.JOB_NAME_REQUIRED
                }); 
            }

            if (!Array.isArray(jobArgs)) {
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ 
                    error: HTTP_STATUS_MESSAGES.ARGUMENTS_MUST_BE_AN_ARRAY
                });
            }

            const job = await jobManager.createJobAsync(jobName, jobArgs);
            
            res.status(HTTP_STATUS_CODES.CREATED).json({
                id: job.id,
                name: job.name,
                arguments: job.arguments,
                status: job.status,
                startTime: job.startTime
            });
        } catch (error) {
            console.error('Error creating job:', error);
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
                error: HTTP_STATUS_MESSAGES.INTERNAL_SERVER_ERROR
            });
        }
    });

    router.get('/', (req, res) => {
        try {
            const allJobs = jobManager.getAllJobs();
            
            const jobsResponse = allJobs.map(job => job.toSummary());

            res.json({
                jobs: jobsResponse
            });
        } catch (error) {
            console.error('Error getting jobs:', error);
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
                error: HTTP_STATUS_MESSAGES.INTERNAL_SERVER_ERROR
            });
        }
    });

    return router;
}

module.exports = createJobRoutes; 