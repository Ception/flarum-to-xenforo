# Flarum to Xenforo Migration Script

This script is used to migrate user data from a Flarum forum board to a Xenforo software board. It connects to both databases, retrieves user information from the Xenforo board, and inserts the corresponding user data into the Flarum board.

## Usage

1. Replace the placeholders in the `sourceDatabasePool` and `destinationDatabasePool` creation code with your actual database connection details.

2. Run the script using Node.js:

`node migrationScript.js`

**_Please note that the placeholders in the script need to be replaced with actual database connection information for your source (Xenforo) and destination (Flarum) databases. Also ensure to handle the data carefully as it contains sensitive user information._**
