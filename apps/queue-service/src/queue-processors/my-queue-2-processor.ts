import Queue from 'bee-queue'

const myQueueTwoProcessor = async (job: Queue.Job<unknown>, done: Queue.DoneCallback<void>) => {
  console.log(`Processing My Queue TWO events job ${job.id}.`)
  done(null)
}

export default myQueueTwoProcessor
