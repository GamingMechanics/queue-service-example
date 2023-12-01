import { createJob } from './queue-jobs-manager'

interface IMyJobData {
  title: string
  randomNumber: number
}

createJob<IMyJobData>('my-queue-1', {
  title: `Job created at ${new Date().toISOString()}`,
  randomNumber: Math.random()
}).then((job) => {
  console.log(`Job created with id ${job.id}`)
  job.on('succeeded', (result) => {
    console.log(`Job ${job.id} succeeded with result ${result}.`)
  })
  job.on('failed', () => {
    console.log(`Job ${job.id} failed.`)
  })
})
