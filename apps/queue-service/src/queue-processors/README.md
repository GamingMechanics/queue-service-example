# Queue Processors

Each queue requires a function to process a job received by the queue. These are the queue processors, and each one is a function that looks like this:

```ts
const exampleQueueProcessor = async (job: Queue.Job<unknown>, done: Queue.DoneCallback<void>) => {
  console.log(`Processing job ${job.id}.`)
  // Does things with the job...
  // ...
  // Once finished successfully, calls `done` with an error or null, and an optional result.
  done(null)
}
```

This queue service creates queues dynamically based on configuration and each queue processor is also dynamically loaded when the queue is initialised. To allow this to happen, queue processors files are named based on a convention of `[queue-name]-processor.ts` and they are expected to export the processor function as default.

Note that in this example, while the [example environment configuration](../../.env.example) suggests 3 queues (`my-queue-1`, `my-queue-2` and `my-queue-3`) to be configured, one of them (`my-queue-3`) does not have a processor created, which demonstrates that the queue service does not fail if that is the case but the third queue will not be initialised and an error message will be displayed, while the other two queues will be initialised and processed.
