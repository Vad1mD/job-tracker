'use strict';

const { spawn } = require('child_process');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Job = require('./Job');
const { JOB_STATUS, CONFIG } = require('../config/constants');
const hardwareService = require('../services/hardwareService');
const statisticsService = require('../services/statisticsService');

class JobManager {
    constructor() {
        if (JobManager.instance) {
            return JobManager.instance;
        }
        this.jobs = new Map();
        JobManager.instance = this;
    }

    static getInstance() {
        if (!JobManager.instance) {
            JobManager.instance = new JobManager();
        }
        return JobManager.instance;
    }

    async createJobAsync(jobName, jobArgs = []) {
        const jobId = uuidv4();
        const job = new Job(jobId, jobName, jobArgs);
        
        this.jobs.set(jobId, job);
        await this.startJobAsync(job);
        
        return job;
    }

    async startJobAsync(job) {
        console.log(`Starting job ${job.id}: ${job.name}`);
        
        const processArgs = [job.name, ...job.arguments];
        
        const childProcess = spawn('node', [path.join(__dirname, '../../dummy-job.js'), ...processArgs], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        job.process = childProcess;
        job.startTime = new Date();
        job.status = job.retryCount > 0 ? JOB_STATUS.RETRYING : JOB_STATUS.RUNNING;

        childProcess.on('spawn', async () => {
            console.log(`Starting hardware monitoring for job ${job.id} (PID: ${childProcess.pid})`);
            job.monitoringInterval = await hardwareService.startHardwareMonitoring({ job });
        });

        childProcess.on('exit', (code, signal) => {
            hardwareService.stopHardwareMonitoring(job.monitoringInterval);
            
            job.endTime = new Date();
            job.duration = job.endTime - job.startTime;
            job.process = null;

            job.averageCpuUsage = hardwareService.getAverageCPU(job);
            
            console.log(`Job ${job.id} peak memory usage: ${job.peakMemory}MB`);
            console.log(`Job ${job.id} average CPU usage: ${job.averageCpuUsage}%`);

            if (code === 0) {
                job.status = JOB_STATUS.COMPLETED;
            } else if (code === 1) {
                if (job.retryCount < job.maxRetries) {
                    job.retryCount++;
                    console.log(`Retrying job ${job.id} (attempt ${job.retryCount + 1})`);
                    setTimeout(() => this.startJobAsync(job), CONFIG.RETRY_DELAY);
                } else {
                    job.status = JOB_STATUS.FAILED;
                }
            } else {
                job.status = JOB_STATUS.FAILED;
            }
        });

        childProcess.on('error', (error) => {
            hardwareService.stopHardwareMonitoring(job.monitoringInterval);
            
            job.endTime = new Date();
            job.duration = job.endTime - job.startTime;
            job.status = JOB_STATUS.FAILED;
        });
    }

    getJob(jobId) {
        return this.jobs.get(jobId);
    }

    getAllJobs() {
        return Array.from(this.jobs.values());
    }

    getMetrics() {
        return statisticsService.getMetrics(this.getAllJobs());
    }
}

module.exports = JobManager;
