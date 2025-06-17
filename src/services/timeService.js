const { JOB_STATUS } = require('../config/constants');

// Failure to time correlation metric
function getHourlyFailureStats(jobs) {
    if (!jobs || jobs?.length === 0) {
        return [];
    }
    
    const hourlyStats = {};
    jobs.forEach(job => {
        const hour = job.startTime.getHours().toString();
        if (!hourlyStats[hour]) {
            hourlyStats[hour] = { total: 0, failed: 0 };
        }
        hourlyStats[hour].total++;
        if (JOB_STATUS.FAILED === job.status) {
            hourlyStats[hour].failed++;
        }
    });

    return hourlyStats;
}

module.exports = { getHourlyFailureStats };