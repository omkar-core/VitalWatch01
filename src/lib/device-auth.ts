import { NextRequest } from 'next/server';

const ALLOWED_DEVICES = (process.env.ALLOWED_DEVICES || '').split(',');
const EXPECTED_API_KEY = process.env.DEVICE_API_KEY;

/**
 * Validates incoming requests from the ESP32 device.
 * @param request The NextRequest object.
 * @returns An error message string if validation fails, otherwise null.
 */
export function validateDeviceRequest(request: NextRequest): string | null {
  const deviceId = request.headers.get('x-device-id');
  const apiKey = request.headers.get('x-api-key');

  if (!EXPECTED_API_KEY || !ALLOWED_DEVICES.length || (ALLOWED_DEVICES.length === 1 && !ALLOWED_DEVICES[0])) {
    console.error("Device API Key or Allowed Devices are not set in server environment variables.");
    return "Server configuration error.";
  }

  if (!deviceId || !ALLOWED_DEVICES.includes(deviceId)) {
    return `Invalid or unregistered device ID: ${deviceId}`;
  }

  if (apiKey !== EXPECTED_API_KEY) {
    return "Invalid API key.";
  }

  return null; // Request is valid
}
