// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log
interface ExtendedWindow extends Window {
  console: Console;
}

const app = window.top as ExtendedWindow | null;
if (app) {
  const log = app.console.log;
  app.console.log = (...args: unknown[]) => {
    if (
      args.length === 1 &&
      typeof args[0] === 'string' &&
      args[0].includes('Download the React DevTools')
    ) {
      return;
    }
    log(...args);
  };
} 