
const GRIDDB_API_URL = process.env.GRIDDB_API_URL;
const GRIDDB_USERNAME = process.env.GRIDDB_USERNAME;
const GRIDDB_PASSWORD = process.env.GRIDDB_PASSWORD;

if (!GRIDDB_API_URL || !GRIDDB_USERNAME || !GRIDDB_PASSWORD) {
  throw new Error("GridDB connection details are not configured in environment variables.");
}

const authHeader = `Basic ${Buffer.from(`${GRIDDB_USERNAME}:${GRIDDB_PASSWORD}`).toString('base64')}`;

async function griddbFetch(endpoint: string, options: RequestInit) {
  const url = `${GRIDDB_API_URL}/${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': authHeader,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("GridDB API Error:", errorBody);
    throw new Error(`GridDB API request failed with status ${response.status}: ${errorBody}`);
  }

  return response;
}

export async function createTable(tableName: string, columns: any[]) {
    const body = {
        "container_name": tableName,
        "container_type": "COLLECTION",
        "row_key": true,
        "columns": columns
    };
    await griddbFetch(`tables`, {
        method: 'POST',
        body: JSON.stringify(body)
    });
    console.log(`Table '${tableName}' checked/created successfully.`);
}


export async function putRows(tableName: string, rows: any[]) {
    await griddbFetch(`tables/${tableName}/rows`, {
        method: 'PUT',
        body: JSON.stringify(rows)
    });
}

export async function getRows(tableName: string, query: string) {
    const response = await griddbFetch(`tql?query=select * from ${tableName} where ${query}`, {
        method: 'GET'
    });
    return await response.json();
}

export async function initializeDatabase() {
    try {
        await createTable('health_vitals', [
            { "name": "timestamp", "type": "TIMESTAMP", "options": { "not_null": true } },
            { "name": "device_id", "type": "STRING", "options": { "not_null": true } },
            { "name": "heart_rate", "type": "DOUBLE", "options": { "not_null": true } },
            { "name": "spo2", "type": "DOUBLE", "options": { "not_null": true } },
            { "name": "ppg_raw", "type": "DOUBLE", "options": { "not_null": true } },
            { "name": "predicted_bp_systolic", "type": "DOUBLE" },
            { "name": "predicted_bp_diastolic", "type": "DOUBLE" },
            { "name": "predicted_glucose", "type": "DOUBLE" },
            { "name": "alert_flag", "type": "BOOL", "options": { "not_null": true } },
            { "name": "created_at", "type": "TIMESTAMP", "options": { "not_null": true } },
        ]);
        await createTable('patient_profiles', [
            { "name": "patient_id", "type": "STRING", "options": { "not_null": true } },
            { "name": "device_id", "type": "STRING", "options": { "not_null": true } },
            { "name": "name", "type": "STRING" },
            { "name": "age", "type": "INTEGER" },
            // ... all other patient_profiles columns
            { "name": "is_active", "type": "BOOL", "options": { "not_null": true } },
            { "name": "created_at", "type": "TIMESTAMP", "options": { "not_null": true } },
            { "name": "updated_at", "type": "TIMESTAMP", "options": { "not_null": true } },
        ]);
        await createTable('alert_history', [
            { "name": "alert_timestamp", "type": "TIMESTAMP", "options": { "not_null": true } },
            { "name": "alert_id", "type": "STRING", "options": { "not_null": true } },
            // ... all other alert_history columns
            { "name": "acknowledged", "type": "BOOL", "options": { "not_null": true } },
            { "name": "created_at", "type": "TIMESTAMP", "options": { "not_null": true } },
        ]);
    } catch (error) {
        console.error("Failed to initialize GridDB database:", error);
        // In a real app, you might want to handle this more gracefully
        // For now, we'll let it throw to prevent the app from starting in a bad state.
        throw error;
    }
}
