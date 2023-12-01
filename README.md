# Queue Service Example

## Introduction

At [Gaming Mechanics](https://gamingmechanics.com), we believe in keeping things simple until they need to be complicated, and when requiring a job queueing service, while [RabbitMQ](https://www.rabbitmq.com/) is amazing, it is also very complex and most of the time that complexity isn't required. While searching for something easy to use that would scale well, we found [Bee-Queue](https://github.com/bee-queue/bee-queue) and fell in love with it.

Bee-Queue is focused on short, real-time jobs, and a distributed worker pool. It leverages Redis and is super-fast. It is regularly maintained and has a good, built-in Web GUI that makes debugging what is going on with the queue very easy. Bee-Queue does _not_ support job prioritisation and repeatable jobs, so, if those are a requirement than perhaps it is not for you.

This repository is an example of how to use Bee-Queue to set up two applications:

- A configurable worker that processes jobs in the queues and that can be run multiple times in a pool
- A job creator that receives the results once jobs are processed by the workers.

It also has a utilities package with functions shared between both applications.

## Requirements

Bee-Queue is based on Redis, so you will need to configure both the queue service and the backend to connect to the same Redis instance, which is done through environment variables.

An easy way to run a local Redis for testing is using [Docker](https://docker.com/) with the following command:

```bash
docker run -d -p 6379:6379 redis:6.2.6-alpine
```

The applications are built with [Node.js](https://nodejs.org/) version 18 or higher, using npm workspaces which require npm version 8.19 or higher (we recommend v9.6.7 or higher).

## The Queue Service

This is the worker that will process jobs sent to a queue. Several of these can run, and as long as they all connect to the same Redis instance, they will process the same queues without conflicting with each other.

The configuration is done through environment variables, please see the [.env.example](apps/queue-service/.env.example) to see what options are available.

The most important part of the queue service are the [queue processors](apps/queue-service/src/queue-processors/README.md). A couple of very simple examples have been provided for two queues called `my-queue-1` and `my-queue-2`.

The queue service also starts up an [Arena](https://github.com/bee-queue/arena) UI on port 4567 where you can see the status of queues and jobs.

## The Backend Example

This one is not currently a real application, it just creates a job in one of the example queues (`my-queue-1`) and ends. The most important part here is the [queue jobs manager](apps/backend/src/queue-jobs-manager.ts) which provides the public method to create a new job in a queue and, as part of that, handles the connection to Redis and the initialisation of queues.

Note that the queues initialised in the backend are marked as not being workers, meaning they do not process jobs - that is the queue service's job.

The future roadmap for this application includes:

- Moving the queue jobs manager to a separate package
- Creating an API backend that allows the creation of jobs and the querying of job statuses through HTTP requests

We believe that would be a better example of how to use the tool to create jobs.

## Running the applications

We recommend using `npm` instead of `yarn` as we are using [npm workspaces](https://docs.npmjs.com/cli/v9/using-npm/workspaces).

After cloning the repository, run `npm install` to install all the packages and pre-compile the utilities package.

To run both applications for development, run `npm run dev`. To run just the queue service, run `npm run dev -w @gml/queue-service` and to run just the backend, run `npm run dev -w @gml/queue-service-example-backend`.

To build the applications for production, run `npm run build` and, once built, they can be started with `npm start`.
