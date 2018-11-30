import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

const number = workerData;
const result = 0;
parentPort.postMessage(result);
