export const readQueuesConfig = (): string[] => {
  if (!process.env.QUEUES) {
    throw new Error(
      `No queues defined. Please set the QUEUES environment variable with queue names separated by space.`
    )
  }

  const queues = process.env.QUEUES.split(' ')
  return queues
}
