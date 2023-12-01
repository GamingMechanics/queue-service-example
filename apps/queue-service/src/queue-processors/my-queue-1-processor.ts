import Queue from 'bee-queue'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const myQueueOneProcessor = async (job: Queue.Job<unknown>, done: Queue.DoneCallback<void>) => {
  console.log(`Processing My Queue ONE events job ${job.id}.`)
  console.log('Job data:', job.data)

  // Simulates a long-running async process.
  await sleep(5000)

  // Completes job with no errors and no results.
  done(null)
}

export default myQueueOneProcessor
