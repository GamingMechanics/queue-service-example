import Queue from 'bee-queue'

/**
 * Dynamically imports the queue processor based on the queue name.
 *
 * @param {string} queueName The name of the queue to get the processor for.
 * @return {*}  {(Promise<((job: Queue.Job<unknown>, done: Queue.DoneCallback<void>) => Promise<void>) | null>)} The queue processor function, or null if no processor was found.
 */
const getQueueProcessor = async (
  queueName: string
): Promise<((job: Queue.Job<unknown>, done: Queue.DoneCallback<void>) => Promise<void>) | null> => {
  // Dynamically import the queue processor based on the queue name.
  try {
    const queueProcessor = await import(`./${queueName}-processor`)
    return queueProcessor.default
  } catch (e) {
    return null
  }
}

export default getQueueProcessor
