'use strict';

const pidusage = require('pidusage');

async function startHardwareMonitoring({ job }) {
    return setInterval(async () => {
        const stats = await pidusage(job.process.pid);
        
        job.cpuSamples.push(stats.cpu || 1);

        if (stats.memory > job.peakMemory) {
            job.peakMemory = stats.memory / 1024 / 1024;
        }
    }, 250);
};

function stopHardwareMonitoring(monitoringInterval) {
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
        monitoringInterval = null;
    }
};

function getAverageCPU(job) {
    if (job.cpuSamples.length === 0) {
        return ;
    }
    const totalCpu = job.cpuSamples.reduce((sum, sample) => sum + sample, 0);
    return totalCpu / job.cpuSamples.length;
};


function getSharedArgsInHighMemoryJobs(completedJobs, memoryThresholdMB = 40) {

    const highMemoryJobs = completedJobs.filter(job => 
        job.peakMemory >= memoryThresholdMB
    );

    if (highMemoryJobs.length === 0) {
        return {
            threshold: memoryThresholdMB,
            highMemoryJobCount: 0,
            totalJobCount: completedJobs.length,
            sharedArguments: [],
            analysis: "No jobs exceeded the memory threshold"
        };
    }

    const argumentFrequency = new Map();
    const argumentJobMapping = new Map();

    highMemoryJobs.forEach(job => {
        job.arguments.forEach(arg => {
            if (!argumentFrequency.has(arg)) {
                argumentFrequency.set(arg, 0);
                argumentJobMapping.set(arg, []);
            }
            argumentFrequency.set(arg, argumentFrequency.get(arg) + 1);
            argumentJobMapping.get(arg).push({
                jobId: job.id,
                jobName: job.name,
                memoryUsage: job.peakMemory
            });
        });
    });

    const sharedArguments = [];
    argumentFrequency.forEach((count, arg) => {
        if (count > 1) {
            const jobs = argumentJobMapping.get(arg);
            const topMemory = jobs.reduce((sum, job) => sum + job.memoryUsage, 0) / jobs.length;
            
            sharedArguments.push({
                argument: arg,
                frequency: count,
                topMemoryUsage: `${Math.round(topMemory)}MB`,
                jobs: jobs
            });
        }
    });

    return {
        threshold: memoryThresholdMB,
        highMemoryJobCount: highMemoryJobs.length,
        totalJobCount: completedJobs.length,
        sharedArguments,
        analysis: sharedArguments.length > 0 
            ? `Found ${sharedArguments.length} shared arguments among high-memory jobs`
            : "No shared arguments found among high-memory jobs"
    };
}

module.exports = {
    startHardwareMonitoring,
    stopHardwareMonitoring,
    getAverageCPU,
    getSharedArgsInHighMemoryJobs
};