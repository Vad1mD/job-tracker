# Job Tracker Service

### Note - Brainstormed and implemented using Cursor and Claude-4-Sonnet

A Node.js service for tracking, managing, and analyzing job execution with built-in cost monitoring and performance analytics.

## Job Metrics analysed
- Hour of the day failures - counting how many failures we have for a specific hour 
(can be extended to lower resolution - minutes and so, or to higher resolution - day of the week / month / year)
- Average job execution cost - simulated calculation of the job cost - duration * average cpu usage + memory usage (1GB free, every 256 MB above payed)
- High memory usage arguments - find repetitive arguments that cause high memory usage

## Features

- **Job Management**: Start, monitor, and track job execution
- **Real-time Analytics**: Get statistical insights on job performance
- **Cost Tracking**: Monitor resource usage and associated costs
- **Retry Logic**: Automatic retry mechanism for failed jobs
- **Memory Monitoring**: Track memory usage with configurable thresholds
- **RESTful API**: Simple HTTP endpoints for job operations

## API Endpoints

### Job Management

- **POST /jobs** - Start a new job
  ```bash
  curl -X POST http://localhost:3000/jobs \
    -H "Content-Type: application/json" \
    -d '{"jobName": "your-job-here"
         "arguments": [list, of, args]}'
  ```

- **GET /jobs** - List all jobs
  ```bash
  curl http://localhost:3000/jobs
  ```

### Analytics

- **GET /stats** - Get statistical insights
  ```bash
  curl http://localhost:3000/stats
  ```

## Configuration

The service can be configured through environment variables or by modifying `src/config/constants.js`:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |
| `DEFAULT_MAX_RETRIES` | 1 | Maximum retry attempts for failed jobs |
| `RETRY_DELAY` | 1000ms | Delay between retry attempts |
| `DEFAULT_MEMORY_THRESHOLD` | 40MB | Memory usage threshold | For demo situation

### Cost Configuration

The service includes cost tracking with the following defaults:
- Free memory allocation: 1024MB
- Memory unit cost: $0.10 per 256MB
- CPU cost multiplier: $0.01 per 1% CPU usage
- Duration cost: $0.05 per second

## Job Status Types

Jobs can have the following statuses:
- `running` - Job is currently executing
- `completed` - Job finished successfully
- `failed` - Job failed to execute
- `retrying` - Job is being retried after failure

## Testing
Real men test in production

## Development

### Project Structure

```
job-tracker/
├── src/
│   ├── app.js              # Express app setup
│   ├── config/             # Configuration files
│   ├── models/             # Data models and the main JobManager class
│   ├── routes/             # API routes
│   └── services/           # Metric logic
├── dummy-job.js            # Example job for testing
├── index.js                # Application entry point
└── package.json            # Dependencies and scripts
```

### Example Usage

The included `dummy-job.js` demonstrates a sample job that:
- Executes random Node.js commands
- Has a configurable processing time
- Includes a 15% random failure rate for testing retry logic

You can run it directly:
```bash
node dummy-job.js
```
