
let isDbInitialized = false;

const GRIDDB_API_URL = process.env.GRIDDB_API_URL;
const GRIDDB_USERNAME = process.env.GRIDDB_USERNAME;
const GRIDDB_PASSWORD = process.env.GRIDDB_PASSWORD;

// This check needs to run at request time, not build time.
function getDbCredentials() {
    const apiUrl = process.env.GRIDDB_API_URL;
    const username = process.env.GRIDDB_USERNAME;
    const password = process.env.GRIDDB_PASSWORD;

    if (!apiUrl || !username || !password) {
      throw new Error("GridDB connection details are not configured in environment variables.");
    }
    return { apiUrl, username, password };
}


async function griddbFetch(endpoint: string, options: RequestInit) {
  if (!isDbInitialized) {
    await initializeDatabase();
    isDbInitialized = true;
    console.log("Database initialization completed.");
  }

  const { apiUrl, username, password } = getDbCredentials();
  const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
  const url = `${apiUrl}/${endpoint}`;

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

  // Handle cases where GridDB returns an empty success response
  const textBody = await response.text();
  try {
    return JSON.parse(textBody);
  } catch (e) {
    return textBody; // Return text if not valid JSON
  }
}

export async function createTable(tableName: string, columns: any[]) {
    const body = {
        "container_name": tableName,
        "container_type": "COLLECTION",
        "row_key": true,
        "columns": columns
    };
    try {
        await griddbFetch(`tables`, {
            method: 'POST',
            body: JSON.stringify(body)
        });
        console.log(`Table '${tableName}' created successfully.`);
    } catch (error: any) {
        // GridDB might error if the table already exists, which is fine.
        if (error.message.includes("already exists")) {
            console.log(`Table '${tableName}' already exists.`);
        } else {
            // Re-throw other errors
            throw error;
        }
    }
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
    return response;
}

export async function initializeDatabase() {
    try {
        console.log("Initializing GridDB database schema...");
        await createTable('health_vitals', [
            { "name": "timestamp", "type": "TIMESTAMP" },
            { "name": "device_id", "type": "STRING" },
            { "name": "heart_rate", "type": "DOUBLE" },
            { "name": "spo2", "type": "DOUBLE" },
            { "name": "ppg_raw", "type": "DOUBLE" },
            { "name": "predicted_bp_systolic", "type": "DOUBLE" },
            { "name": "predicted_bp_diastolic", "type": "DOUBLE" },
            { "name": "predicted_glucose", "type": "DOUBLE" },
            { "name": "alert_flag", "type": "BOOL" },
            { "name": "created_at", "type": "TIMESTAMP" },
        ]);
        
        const patientProfileColumns = [
            { "name": "patient_id", "type": "STRING" },
            { "name": "device_id", "type": "STRING" },
            { "name": "name", "type": "STRING" },
            { "name": "age", "type": "INTEGER" },
            { "name": "gender", "type": "STRING" },
            { "name": "email", "type": "STRING" },
            { "name": "phone", "type": "STRING" },
            { "name": "baseline_hr", "type": "DOUBLE" },
            { "name": "baseline_spo2", "type": "DOUBLE" },
            { "name": "baseline_bp_systolic", "type": "DOUBLE" },
            { "name": "baseline_bp_diastolic", "type": "DOUBLE" },
            { "name": "has_diabetes", "type": "BOOL" },
            { "name": "has_hypertension", "type": "BOOL" },
            { "name": "has_heart_condition", "type": "BOOL" },
            { "name": "alert_threshold_hr_high", "type": "DOUBLE" },
            { "name": "alert_threshold_hr_low", "type": "DOUBLE" },
            { "name": "alert_threshold_spo2_low", "type": "DOUBLE" },
            { "name": "alert_threshold_bp_systolic_high", "type": "DOUBLE" },
            { "name": "alert_threshold_glucose_high", "type": "DOUBLE" },
            { "name": "emergency_contact_name", "type": "STRING" },
            { "name": "emergency_contact_phone", "type": "STRING" },
            { "name": "created_at", "type": "TIMESTAMP" },
            { "name": "updated_at", "type": "TIMESTAMP" },
            { "name": "is_active", "type": "BOOL" }
        ];
        await createTable('patient_profiles', patientProfileColumns);

        await createTable('alert_history', [
            { "name": "alert_timestamp", "type": "TIMESTAMP" },
            { "name": "alert_id", "type": "STRING" },
            { "name": "device_id", "type": "STRING" },
            { "name": "patient_id", "type": "STRING" },
            { "name": "alert_type", "type": "STRING" },
            { "name": "severity", "type": "STRING" },
            { "name": "alert_message", "type": "STRING" },
            { "name": "heart_rate", "type": "DOUBLE" },
            { "name": "spo2", "type": "DOUBLE" },
            { "name": "ppg_raw", "type": "DOUBLE" },
            { "name": "predicted_bp_systolic", "type": "DOUBLE" },
            { "name": "predicted_bp_diastolic", "type": "DOUBLE" },
            { "name": "predicted_glucose", "type": "DOUBLE" },
            { "name": "acknowledged", "type": "BOOL" },
            { "name": "acknowledged_at", "type": "TIMESTAMP" },
            { "name": "created_at", "type": "TIMESTAMP" },
        ]);
        console.log("GridDB schema initialization check complete.");
    } catch (error) {
        console.error("Failed to initialize GridDB database:", error);
        // In a real app, you might want to handle this more gracefully
        // For now, we'll let it throw to prevent the app from starting in a bad state.
        throw error;
    }
}
