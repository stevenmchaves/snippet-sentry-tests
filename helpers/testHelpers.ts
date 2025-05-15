import { format } from 'date-fns';
import { Mutex } from 'async-mutex';
import fs from 'fs';
import path from 'path';

const logFilePath = path.resolve(__dirname, 'log.lock');
const mutex = new Mutex();


// Singleton function for getFormattedDateTime
export const getFormattedDateTime = (() => {
  let instance: string | null = null;

  return () => {
    if (!instance) {
      instance = format(new Date(), "yyyy-MM-dd_HH-mm-ss");
    }
    return instance;
  };
})();

export async function logOnce(message: string) {
  await mutex.acquire();
  try {
      if (!fs.existsSync(logFilePath)) {
          console.debug(message);
          fs.writeFileSync(logFilePath, 'logged');
      }
  } finally {
      mutex.release();
  }
}


export function areArraysEqual(actual: any[], expected: any[]): boolean {
  if (actual.length !== expected.length) {
    return false;
  }

  const sortedActual = actual.sort();
  const sortedExpected = expected.sort();

  for (let i = 0; i < actual.length; i++) {
    if (sortedActual[i] !== sortedExpected[i]) {
      console.log(
        `Mismatch at index ${i}: ${sortedActual[i]} !== ${sortedExpected[i]}`,
      );
      return false;
    }
  }
  return true;
}

export function getEnvVar(value: string): string {
  if (value.startsWith('$')) {
    const envVarName = value.substring(1); // Remove the '$' at the start
    const envVarValue = process.env[envVarName];
    return envVarValue || '';
  }
  return value;
}
