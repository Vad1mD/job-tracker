'use strict';

const { CONFIG } = require('../config/constants');

function calculateMemoryCost(memoryUsageMB) {
    if (!memoryUsageMB || memoryUsageMB <= CONFIG.COST.FREE_MEMORY_MB) {
        return 0; // First 1GB is free
    }
    
    const chargeableMemory = memoryUsageMB - CONFIG.COST.FREE_MEMORY_MB;
    const memoryUnits = Math.ceil(chargeableMemory / CONFIG.COST.MEMORY_UNIT_MB);
    
    return memoryUnits * CONFIG.COST.MEMORY_UNIT_COST;
}

// job execution average cost metric: duration * cpuUsage * memoryCost
// this is some arbitrary metric I came up with...
function calculateAverageCost(jobs) {
    return jobs.map(job => {
        return {
            id: job.id,
            averageCost: `${calculateSingleJobAverageCost(job)}$`
        }
    });
}

function calculateSingleJobAverageCost(job) {
    if (!job.duration || !job.averageCpuUsage || !job.peakMemory) {
        return null;
    }

    const durationSeconds = job.duration / 1000;
    const durationFactor = durationSeconds * CONFIG.COST.DURATION_COST_MULTIPLIER;
    
    const cpuFactor = (job.averageCpuUsage / 100) * CONFIG.COST.CPU_COST_MULTIPLIER;
    
    const memoryCost = calculateMemoryCost(job.peakMemory);
    
    const baseCost = durationFactor * cpuFactor;
    const totalCost = baseCost + memoryCost;
    
    return totalCost.toFixed(5);
}

module.exports = { calculateAverageCost }; 