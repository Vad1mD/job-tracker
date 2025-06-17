'use strict';

const { JOB_STATUS } = require('../config/constants');

class Job {
    constructor(id, name, args = []) {
        this.id = id;
        this.name = name;
        this.arguments = args;
        this.status = JOB_STATUS.RUNNING;
        this.startTime = new Date();
        this.endTime = null;
        this.output = [];
        this.errors = [];
        this.retryCount = 0;
        this.maxRetries = 1;
        this.process = null;
        this.duration = null;
        this.peakMemory = null;
        this.cpuSamples = [];
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            arguments: this.arguments,
            status: this.status,
            startTime: this.startTime,
            endTime: this.endTime,
            output: this.output,
            errors: this.errors,
            retryCount: this.retryCount,
            maxRetries: this.maxRetries,
            duration: this.duration,
            peakMemory: this.peakMemory,
            cpuSamples: this.cpuSamples
        };
    }

    toSummary() {
        return {
            id: this.id,
            name: this.name,
            arguments: this.arguments,
            status: this.status
        };
    }
}

module.exports = Job; 