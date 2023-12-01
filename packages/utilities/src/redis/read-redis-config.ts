import { RedisClientOptions, RedisFunctions, RedisModules, RedisScripts } from 'redis'

export const readRedisConfig = (): RedisClientOptions<
  RedisModules,
  RedisFunctions,
  RedisScripts
> => {
  const socketAttributes: { tls?: boolean; rejectUnauthorized?: boolean } = {}

  const useTLS = process.env.REDIS_USE_TLS === 'true'
  if (useTLS) {
    socketAttributes['tls'] = true
    socketAttributes['rejectUnauthorized'] = false
  }

  return {
    username: process.env.REDIS_USERNAME || '',
    password: process.env.REDIS_PASSWORD || '',
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port:
        process.env.REDIS_PORT && !Number.isNaN(Number(process.env.REDIS_PORT))
          ? Number(process.env.REDIS_PORT)
          : 6379,
      ...socketAttributes
    }
  }
}
