import { EventEmitter } from 'events';

// Use a global symbol to ensure the emitter is a singleton.
const EMITTER_KEY = Symbol.for('firebase.error.emitter');

const globalWithEmitter = global as typeof global & {
  [EMITTER_KEY]: EventEmitter;
};

if (!globalWithEmitter[EMITTER_KEY]) {
  globalWithEmitter[EMITTER_KEY] = new EventEmitter();
}

export const errorEmitter = globalWithEmitter[EMITTER_KEY];
