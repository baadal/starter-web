import path from 'path';

import { readFile, writeFile, appendToFile, deleteDir } from '../lib/file-io';

export const make = (isServer: boolean) => {
  const files = ['client', 'server', 'done'];

  const clientFile = `build/.event/${files[0]}`;
  const serverFile = `build/.event/${files[1]}`;

  const pathList = [clientFile, serverFile];
  const index = isServer ? 1 : 0;

  const currPath = path.resolve(process.cwd(), pathList[index]);
  const currEmitted = !!readFile(currPath);

  if (currEmitted) writeFile(currPath, '');
};

const syncHelper = (isServer: boolean) => {
  const files = ['client', 'server', 'done'];

  const clientFile = `build/.event/${files[0]}`;
  const serverFile = `build/.event/${files[1]}`;
  const doneFile = `build/.event/${files[2]}`;

  const pathList = [clientFile, serverFile];
  const index = isServer ? 1 : 0;
  const currPath = path.resolve(process.cwd(), pathList[index]);
  const siblingPath = path.resolve(process.cwd(), pathList[1 - index]);

  const donePath = path.resolve(process.cwd(), doneFile);
  const currEmitted = !!readFile(currPath);
  const siblingEmitted = !!readFile(siblingPath);

  if (!currEmitted) {
    writeFile(currPath, `${Date.now()}`);
  }

  if (siblingEmitted) {
    writeFile(donePath, `${Date.now()}`);
  }
};

const eventCleanup = () => {
  const eventEmitDir = path.resolve(process.cwd(), 'build/.event');
  deleteDir(eventEmitDir);
};

export const appendLog = (content: string) => {
  const logPath = path.resolve(process.cwd(), 'build/.event/log');
  appendToFile(logPath, content);
};

export const done = (isServer: boolean) => {
  syncHelper(isServer);
};

export const run = () => {
  eventCleanup();
};
