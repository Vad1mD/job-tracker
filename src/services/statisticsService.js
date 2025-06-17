'use strict';

const { JOB_STATUS } = require('../config/constants');
const { getHourlyFailureStats } = require('./timeService');
const { calculateAverageCost } = require('./costCalculationService');
const { getSharedArgsInHighMemoryJobs } = require('./hardwareService');

function getMetrics(jobs) {
    const allJobs = jobs;
    const completedJobs = allJobs.filter(job => 
        [JOB_STATUS.COMPLETED, JOB_STATUS.FAILED].includes(job.status)
    );

    if (completedJobs.length === 0) {
        return {
            totalJobs: allJobs.length,
            completedJobs: 0,
            overallSuccessRate: 0,
            metrics: {}
        };
    }

    const successfulJobs = completedJobs.filter(job => job.status === JOB_STATUS.COMPLETED);
    const overallSuccessRate = successfulJobs.length / completedJobs.length;

    const metrics = {
        hourlyFailure: getHourlyFailureStats(completedJobs),
        averageExecutionCost: calculateAverageCost(completedJobs),
        argumentToCpuUsageCorrelation: getSharedArgsInHighMemoryJobs(completedJobs)
    }
  
    return {
        totalJobs: allJobs.length,
        completedJobs: completedJobs.length,
        overallSuccessRate: parseFloat(overallSuccessRate.toFixed(3)),
        metrics
    };
}


module.exports = { getMetrics }; 