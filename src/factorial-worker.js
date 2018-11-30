import { Worker, parentPort, workerData } from 'worker_threads';

const numbers = workerData;

const calculateFactorial = numArray =>
  numArray.reduce((acc, value) => acc * value, 1);

const result = calculateFactorial(numbers);

parentPort.postMessage(result);
