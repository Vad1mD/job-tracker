'use strict';

const JOB_STATUS = {
    RUNNING: 'running',
    COMPLETED: 'completed',
    FAILED: 'failed',
    RETRYING: 'retrying'
};

const CONFIG = {
    PORT: process.env.PORT || 3000,
    DEFAULT_MAX_RETRIES: 1,
    RETRY_DELAY: 1000,
    DEFAULT_MEMORY_THRESHOLD: 1024,
    COST: {
        FREE_MEMORY_MB: 1024,
        MEMORY_UNIT_MB: 256,
        MEMORY_UNIT_COST: 10, // 10 cents per 256MB!
        CPU_COST_MULTIPLIER: 0.01, // 1 cent per 1%!
        DURATION_COST_MULTIPLIER: 0.05 // 5 cents per second!
    }
};

module.exports = {
    JOB_STATUS,
    CONFIG
}; 