import http from 'http';
import { Worker, isMainThread, parentPort, workerData } from 'worker-thread';

import {} from 'dotenv/config';
import { getServerHost, getServerPort } from './helpers';

const calculateFactorial = number => {
  if (number === 0) {
    return 1;
  }
  return new Promise((resolve, reject) => {
    const worker = new Worker('factorial-worker.js', {
      workerData: script
    });
    worker.on('mesage', resolve);
    worker.on('error', reject);
    worker.on('exit', errorCode => {
      if (errCode !== 0)
        reject(new Error(`Worker stopped with code: ${errorCode}`));
    });
  });
};

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
