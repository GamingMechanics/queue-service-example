import { readQueuesConfig, readRedisConfig } from '@gml/queue-service-example-utilities'
import Queue from 'bee-queue'
import Arena from 'bull-arena'
import 'dotenv/config'
import {
  RedisClientOptions,
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
  createClient
} from 'redis'

import getQueueProcessor from './queue-processors'

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
 * Initialises the Arena UI with the given redis config and queue names.
 *
 * @param {RedisClientOptions<RedisModules, RedisFunctions, RedisScripts>} redisConfig The redis config.
 * @param {string[]} queueNames The queue names.
 * @return {*}  {Promise<void>} A promise that resolves when the Arena UI has been initialised.
 */
const initArenaUI = async (
  redisConfig: RedisClientOptions<RedisModules, RedisFunctions, RedisScripts>,
  queueNames: string[]
): Promise<void> => {
  const redisClient = await initRedisClient(redisConfig)

  // Starts the Arena web UI on port 4567.
  Arena({
    Bee: Queue,
    queues: queueNames.map((q) => ({
      name: q,
      hostId: 'InPlay Queue Server',
      type: 'bee',
      redis: redisClient
    }))
  })
}

/**
 * Initialises the queues with the given queue names and redis client.
 *
 * @param {RedisClientOptions<RedisModules, RedisFunctions, RedisScripts>} redisConfig The redis config.
 * @param {string[]} queueNames The queue names.
 * @return {*}  {Promise<void>} A promise that resolves when the queues have been initialised.
 */
const initQueues = async (
  redisConfig: RedisClientOptions<RedisModules, RedisFunctions, RedisScripts>,
  queueNames: string[]
): Promise<void> => {
  const redisClient = await initRedisClient(redisConfig)
  console.log('Initialising queues', queueNames)

  // Initialises all the queues from the config, assigning their specific processors.
  queueNames.forEach(async (q) => {
    const queueProcessor = await getQueueProcessor(q)
    if (!queueProcessor) {
      console.error(`No processor found for queue ${q}. This queue will not be initialised.`)
      console.debug(
        `Please create a processor file named ${q}-processor.ts in the queue-processors folder.`
      )
    } else {
      try {
        const newQueue = new Queue(q, {
          redis: redisClient
        })

        newQueue.process(queueProcessor)
        await newQueue.ready()
        console.log(`Queue ${q} initialised.`)
      } catch (err) {
        console.error(`There was an error initialising queue ${q}.`, err)
      }
    }
  })
}

const redisConfig = readRedisConfig()
const queues = readQueuesConfig()
initArenaUI(redisConfig, queues)
initQueues(redisConfig, queues)
