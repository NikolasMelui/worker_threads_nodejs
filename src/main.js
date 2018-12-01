import http from 'http';
import os from 'os';
import path from 'path';
import url from 'url';
import { Worker } from 'worker_threads';

import {} from 'dotenv/config';
// import { getServerHost, getServerPort } from './helpers';

const SERVER_PORT = 3030;

const workerPath = path.resolve(__dirname, 'factorial-worker.js');

const userCPUCount = os.cpus().length;

const calculateFactorial = number => {
  return new Promise(async (parentResolve, parentReject) => {
    if (number === 0) {
      return 1;
    }
    const numbers = [...new Array(number)].map((_, index) => index + 1);
    const segmentSize = Math.ceil(numbers.length / userCPUCount);

    const segments = [];

    for (let segmentIndex = 0; segmentIndex < userCPUCount; segmentIndex++) {
      const start = segmentIndex * segmentSize;
      const end = start + segmentSize;
      const segment = numbers.slice(start, end);
      segments.push(segment);
    }

    try {
      const results = await Promise.all(
        segments.map(
          segment =>
            new Promise((resolve, reject) => {
              const worker = new Worker(workerPath, {
                workerData: segment
              });
              worker.on('message', resolve);
              worker.on('error', reject);
              worker.on('exit', errorCode => {
                if (errorCode !== 0)
                  reject(new Error(`Worker stopped with code: ${errorCode}`));
              });
            })
        )
      );

      const finalResult = results.reduce((acc, value) => acc * value, 1);
      parentResolve(finalResult);
    } catch (err) {
      console.error(err);
      parentReject(err);
    }
  });
};

http
  .createServer((req, res) => {
    res.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });
    const curUrl = url.parse(req.url, true);
    const parentInteger = curUrl.query.integer;

    calculateFactorial(Number(parentInteger)).then(result => {
      console.log(result);
      res.end(`The factorial is ${result}`);
    });
  })
  .listen(SERVER_PORT, () =>
    console.log(`Server is listening on port ${SERVER_PORT}`)
  );
