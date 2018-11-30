// import http from 'http';
import os from 'os';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

import {} from 'dotenv/config';
// import { getServerHost, getServerPort } from './helpers';

const userCPUCount = os.cpus().length;

const calculateFactorial = number => {
  if (number === 0) {
    return 1;
  }
  return new Promise((resolve, reject) => {
    const numbers = [...new Array(number)].map((_, index) => index + 1);
    const segmentSize = Math.ceil(numbers.length / userCPUCount);
    const segments = [];

    for (let segmentIndex = 0; segmentIndex < userCPUCount; segmentIndex++) {
      const start = segmentIndex * segmentSize;
      const end = start + segmentSize;
      const segment = numbers.slice(start, end);
      segments.push(segment);
    }

    segments.forEach(segment => {
      const worker = new Worker('factorial-worker.js', {
        workerData: segment
      });
      worker.on('mesage', resolve);
      worker.on('error', reject);
      worker.on('exit', errorCode => {
        if (errCode !== 0)
          reject(new Error(`Worker stopped with code: ${errorCode}`));
      });
    });
  });
};

calculateFactorial(30);

// http
//   .createServer((req, res) => {
//     res.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });
//     res.end(
//       `Hello from ${getServerHost(req)}:${getServerPort(
//         req
//       )} and welcome to the multikey-node-boilerplate!`
//     );
//   })
//   .listen(process.env.SERVER_PORT, () =>
//     console.log(`Server is listening on port ${process.env.SERVER_PORT}`)
//   );
