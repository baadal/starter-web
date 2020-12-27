/* eslint-disable @typescript-eslint/naming-convention */

const colors = {
  Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  fg: {
    Red: '\x1b[31m',
    Yellow: '\x1b[33m',
    Green: '\x1b[32m',
    Blue: '\x1b[34m',
    Magenta: '\x1b[35m',
    Cyan: '\x1b[36m',
  },
};

const print = (msg: any[], type: string, newline = false, padding = 0) => {
  let color = colors.fg.Blue;
  if (type === 'log') color = colors.fg.Green;
  else if (type === 'warn') color = colors.fg.Yellow;
  else if (type === 'error') color = colors.fg.Red;
  else if (type === 'cyan') color = colors.fg.Cyan;

  if (process.stdout) {
    process.stdout.write('  ');
    if (padding) process.stdout.write(' '.repeat(padding));
    process.stdout.write(color);
    process.stdout.write(colors.Bright);
    msg.forEach((item, idx) => {
      if (typeof item === 'number' || typeof item === 'string') {
        process.stdout.write(item + '');
      } else {
        process.stdout.write(`\n${JSON.stringify(item, null, 2)}`);
      }
      if (idx < msg.length - 1) process.stdout.write(' ');
    });
    process.stdout.write(colors.Reset);
    if (newline) process.stdout.write('\n');
  } else {
    let mlog = '';
    msg.forEach((item, idx) => {
      if (typeof item === 'number' || typeof item === 'string') {
        mlog += item + '';
      } else {
        mlog += `\n${JSON.stringify(item, null, 2)}`;
      }
      if (idx < msg.length - 1) mlog += ' ';
    });
    if (type === 'warn') console.warn(mlog);
    else if (type === 'error') console.error(mlog);
    else console.log(mlog);
  }
};

const log_ = (...msg: any[]) => print(msg, 'log');

const warn_ = (...msg: any[]) => print(msg, 'warn');

const error_ = (...msg: any[]) => print(msg, 'error');

const cyan_ = (...msg: any[]) => print(msg, 'cyan');

const log = (...msg: any[]) => print(msg, 'log', true);

const warn = (...msg: any[]) => print(msg, 'warn', true);

const error = (...msg: any[]) => print(msg, 'error', true);

const cyan = (...msg: any[]) => print(msg, 'cyan', true);

export default {
  log_,
  warn_,
  error_,
  cyan_,
  log,
  warn,
  error,
  cyan,
};
