import { readQueuesConfig, readRedisConfig } from '@gml/queue-service-example-utilities'
import Queue from 'bee-queue'
import 'dotenv/config'
import {
  RedisClientOptions,
  RedisModules,
  RedisFunctions,
  RedisScripts,
  createClient,
  RedisClientType
} from 'redis'

const redisConfig = readRedisConfig()
const queueNames = readQueuesConfig()
const queues: { [key: string]: Queue } = {}
let redisClient: RedisClientType<RedisModules, RedisFunctions, RedisScripts> | null = null

/**
 * Initialises the redis client with the given redis config.
 *
 * @param {RedisClientOptions<RedisModules, RedisFunctions, RedisScripts>} redisConfig The redis config.
 * @return {*}  {(Promise<RedisClientType<RedisModules, RedisFunctions, RedisScripts> | null>)} The initialised redis client, or null if the initialisation failed.
 */
const initRedisClient = async (
  redisConfig: RedisClientOptions<RedisModules, RedisFunctions, RedisScripts>
): Promise<RedisClientType<RedisModules, RedisFunctions, RedisScripts> | null> => {
  console.log('Connecting to redis', redisConfig)
  try {
    const client = await createClient(redisConfig)
      .on('error', (err) => {
        console.error('Redis failed', err)
      })
      .connect()

    console.log('Connected to Redis')
    return client
  } catch (err) {
    console.error('Redis failed', err)
    return null
  }
}

/**
 * Initialises the queues with the given queue names and redis client.
 *
 * @param {string[]} queueNames The queue names.
 * @param {RedisClientType<RedisModules, RedisFunctions, RedisScripts>} redisClient The redis client to be used to connect to the queues.
 * @return {*}  {Promise<void>} A promise that resolves when the queues have been initialised.
 */
const initQueues = async (
  queueNames: string[],
  redisClient: RedisClientType<RedisModules, RedisFunctions, RedisScripts>
): Promise<void> => {
  console.log('Initialising queues', queueNames)

  // Initialises all the queues from the config, assigning their specific processors.
  await Promise.all(
    queueNames.map(async (q) => {
      try {
        const newQueue = new Queue(q, {
          redis: redisClient,
          isWorker: false
        })

        await newQueue.ready()
        queues[q] = newQueue

        console.log(`Queue ${q} initialised.`)
      } catch (err) {
        console.error(`There was an error initialising queue ${q}.`, err)
      }
    })
  )
}

/**
 * Creates a job in the queue with the given name, with the given data.
 *
 * @template T The type of the data to be stored in the job.
 * @param {string} queueName The name of the queue to create the job in.
 * @param {T} data The data to be stored in the job.
 * @return {*}  {Promise<Queue.Job<T>>} The created job.
 */
export const createJob = async <T extends object>(
  queueName: string,
  data: T
): Promise<Queue.Job<T>> => {
  if (!queueNames.includes(queueName)) {
    throw new Error(`Queue ${queueName} not found in config.`)
  }

  if (!redisClient) {
    redisClient = await initRedisClient(redisConfig)
  }

  // TODO: handle redis client not being initialised after the attempt above.
  // TODO: handle errors in initialising the queues.
  if (!queues[queueName] && !!redisClient) {
    await initQueues(queueNames, redisClient)
  }

  const queue = queues[queueName]
  const job = queue.createJob<T>(data)
  await job.save()

  return job
}
