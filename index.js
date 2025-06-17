'use strict';

const createApp = require('./src/app');
const { CONFIG } = require('./src/config/constants');

const app = createApp();

// Start server
app.listen(CONFIG.PORT, () => {
    console.log(`Job Tracker Service running on port ${CONFIG.PORT}`);
    console.log(`\nAvailable endpoints:`);
    console.log(`  POST /jobs             - Start a new job`);
    console.log(`  GET  /jobs             - List all jobs`);
    console.log(`  GET  /stats            - Get statistical insights`);
});
