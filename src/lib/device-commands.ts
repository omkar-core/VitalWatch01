'use client';

import { doc, setDoc, serverTimestamp, Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Sends a command to a device by writing to its command document in Firestore.
 * This is intended to be picked up by a backend service (e.g., a Cloud Function)
 * that listens for changes and forwards the command to the physical device.
 *
 * @param db The Firestore instance.
 * @param deviceId The ID of the target device.
 * @param command The command to send (e.g., 'start_scan').
 */
export function sendCommandToDevice(
  db: Firestore,
  deviceId: string,
  command: string
) {
  if (!deviceId || !command) {
    throw new Error('Device ID and command must be provided.');
  }

  const commandRef = doc(db, 'deviceCommands', deviceId);
  const commandData = {
    command: command,
    timestamp: serverTimestamp(),
    status: 'pending',
  };

  setDoc(commandRef, commandData)
    .catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: commandRef.path,
        operation: 'create',
        requestResourceData: commandData,
      });
      errorEmitter.emit('permission-error', permissionError);
    });
}
