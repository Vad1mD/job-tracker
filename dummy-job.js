#!/usr/bin/env node

// Dummy job simulator that executes random Node.js commands
// This script randomly selects and executes arbitrary commands

const { execSync } = require('child_process');

const commands = [
    'node -e "console.log(\'Hello from random command!\')"',
    'node -e "console.log(Math.random())"',
    'node -e "console.log(new Date().toISOString())"',
    'node -e "console.log(process.version)"',
    'node -e "console.log(\'Processing data...\'); setTimeout(() => console.log(\'Done!\'), 100)"',
    'node -e "console.log(JSON.stringify({status: \'ok\', timestamp: Date.now()}))"',
    'node -e "const arr = [1,2,3,4,5]; console.log(arr.map(x => x*2))"',
    'node -e "console.log(\'Job execution:\', Math.floor(Math.random() * 1000))"'
];

const processingTime = Math.random() * 1500 + 1000;

setTimeout(() => {
    try {
        if (Math.random() < 0.15) {
            console.error(`Job failed randomly (15% failure rate)`);
            process.exit(1);
        }

        const randomCommand = commands[Math.floor(Math.random() * commands.length)];
        console.log(`Executing: ${randomCommand}`);
        
        const output = execSync(randomCommand, { encoding: 'utf8' });
        console.log('Command output:', output.trim());
                
        console.log(`Job completed successfully`);
        process.exit(0);
        
    } catch (error) {
        console.error(`Job failed with error: ${error.message}`);
        process.exit(1);
    }
}, processingTime);
