import { NextRequest } from 'next/server';

const EXPECTED_DEVICE_ID = process.env.DEVICE_ID;
const EXPECTED_API_KEY = process.env.DEVICE_API_KEY;

/**
 * Validates incoming requests from the ESP32 device.
 * @param request The NextRequest object.
 * @returns An error message string if validation fails, otherwise null.
 */
export function validateDeviceRequest(request: NextRequest): string | null {
  const deviceId = request.headers.get('x-device-id');
  const apiKey = request.headers.get('x-api-key');

  if (!EXPECTED_DEVICE_ID || !EXPECTED_API_KEY) {
    console.error("Device ID or API Key is not set in server environment variables.");
    return "Server configuration error.";
  }

  if (deviceId !== EXPECTED_DEVICE_ID) {
    return "Invalid device ID.";
  }

  if (apiKey !== EXPECTED_API_KEY) {
    return "Invalid API key.";
  }

  return null; // Request is valid
}
