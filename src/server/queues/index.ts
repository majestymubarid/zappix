import { Queue, QueueEvents } from 'bullmq'

const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
}

// Status Posts Queue
export const statusQueue = new Queue('status-posts', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 100,
  },
})

// Broadcasts Queue
export const broadcastQueue = new Queue('broadcasts', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 100,
  },
})

// Ad Delivery Queue
export const adDeliveryQueue = new Queue('ad-delivery', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 100,
  },
})

// Queue Events for monitoring
export const statusQueueEvents = new QueueEvents('status-posts', { connection })
export const broadcastQueueEvents = new QueueEvents('broadcasts', { connection })
export const adDeliveryQueueEvents = new QueueEvents('ad-delivery', { connection })

// Initialize workers (implementation in respective phase files)
// Workers will be created in Phase 3 (Status), Phase 4 (Broadcasts), Phase 9 (Ads)
