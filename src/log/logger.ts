/* eslint-disable @typescript-eslint/no-explicit-any */

export enum LogLevel {
  TRACE = 1,
  DEBUG = 2,
  INFO = 3,
  WARN = 4,
  ERROR = 5,
  FATAL = 6,
}

let SELECTED_LOG_LEVEL: LogLevel = LogLevel.TRACE; // Default log level

// ----------------------- LOGGER -----------------------

// Log function
function logFunction(level: LogLevel, message?: string, ...args: any[]): void {
  if (process.env.NODE_ENV !== 'development') return;
  if (level < SELECTED_LOG_LEVEL) return;

  if (typeof window !== 'undefined' && window.console) {
    // Browser
    console.log(`%c[${LogLevel[level]}] ${message}`, browserStyles[level], ...args);
  } else {
    // Terminal / Node.js
    console.log(`${ansiStyles[level]}[${LogLevel[level]}] ${message ?? ''}${ansiReset}`, ...args);
  }
}

export const log = {
  // Sets the log level for filtering logs dynamically.
  setLogLevel: (level: LogLevel) => (SELECTED_LOG_LEVEL = level),

  // generic
  log: (level: LogLevel, message?: string, ...args: any[]) => logFunction(level, message, ...args),

  // For crucial business failures.
  fatal: (message?: string, ...args: any[]) => logFunction(LogLevel.FATAL, message, ...args), // LEVEL 1

  // Logs messages indicating functionalities not working correctly.
  error: (message?: string, ...args: any[]) => logFunction(LogLevel.ERROR, message, ...args), // LEVEL 2

  // Logs messages indicating unexpected behavior, allowing the application to continue.
  warn: (message?: string, ...args: any[]) => logFunction(LogLevel.WARN, message, ...args), // LEVEL 3

  // Logs informative messages indicating events during normal operations.
  info: (message?: string, ...args: any[]) => logFunction(LogLevel.INFO, message, ...args), // LEVEL 4

  // Logs messages useful for software debugging.
  debug: (message?: string, ...args: any[]) => logFunction(LogLevel.DEBUG, message, ...args), // LEVEL 5

  // Logs detailed messages showing step-by-step execution details.
  trace: (message?: string, ...args: any[]) => logFunction(LogLevel.TRACE, message, ...args), // LEVEL 6
};

// Style settings
type LogStyles = {
  [key in LogLevel]: string;
};

const ansiStyles: LogStyles = {
  [LogLevel.FATAL]: '\x1b[31;1m', // bright red
  [LogLevel.ERROR]: '\x1b[31m', // red
  [LogLevel.WARN]: '\x1b[33m', // yellow
  [LogLevel.INFO]: '\x1b[36m', // cyan
  [LogLevel.DEBUG]: '\x1b[37m', // white/gray
  [LogLevel.TRACE]: '\x1b[0m', // reset
};

const ansiReset = '\x1b[0m';

const browserStyles: LogStyles = {
  [LogLevel.FATAL]: 'color: red; font-weight: bold; font-size: 16px',
  [LogLevel.ERROR]: 'color: red; font-size: 14px',
  [LogLevel.WARN]: 'color: orange; font-size: 14px',
  [LogLevel.INFO]: 'color: cyan; font-size: 12px',
  [LogLevel.DEBUG]: 'color: gray; font-size: 12px',
  [LogLevel.TRACE]: 'color: inherit; font-size: inherit',
};
