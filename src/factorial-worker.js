import { parentPort, workerData } from 'worker_threads';

const numbers = workerData;

const calculateFactorial = numArray =>
  numArray.reduce((acc, val) => acc * val, 1);

const result = calculateFactorial(numbers);

parentPort.postMessage(result);
