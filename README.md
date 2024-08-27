# Xenforo to Custom Platform Migration Script

This script is used to migrate user data from a Xenforo forum board to a custom platform's database. It connects to both the source Xenforo database and the destination database, retrieves user information, and inserts the corresponding user data into the destination platform.

## How It Works

1. The script establishes connections to the source Xenforo database and the destination database using MariaDB.
2. It retrieves user information, including user IDs, usernames, emails, and password data, from the Xenforo database.
3. The script then extracts the password hash from the Xenforo authentication data, modifies the hash to be compatible with the destination platform, and checks if the user already exists in the destination database.
4. If the user does not exist in the destination database, the script inserts the user data, including the modified password hash, into the destination platform's `accounts` table.

## Usage

1. Replace the placeholders in the `sourceDatabasePool` and `destinationDatabasePool` configuration objects with your actual database connection details.
   - `host`: The database host (e.g., `localhost` or `database.example.com`).
   - `user`: The database username.
   - `password`: The database password.
   - `database`: The name of the database.

2. Run the script using Node.js:

```bash
node migrationScript.js
```
