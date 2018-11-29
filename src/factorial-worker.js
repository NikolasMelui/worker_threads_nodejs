import { Worker, isMainThread, parentPort, workerData } from 'worker-thread';

const number = workerData;
const result = 0;
parentPort.postMessage(result);
