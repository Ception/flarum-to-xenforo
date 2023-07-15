const mariadb = require("mariadb");

const sourceDatabasePool = mariadb.createPool({
  host: "your_source_database_host",
  user: "your_source_database_user",
  password: "your_source_database_password",
  database: "your_source_database",
});

const destinationDatabasePool = mariadb.createPool({
  host: "your_destination_database_host",
  user: "your_destination_database_user",
  password: "your_destination_database_password",
  database: "your_destination_database",
});

async function migrateUsers() {
  try {
    const sourceConn = await sourceDatabasePool.getConnection();
    const users = await sourceConn.query(
      "SELECT xf_user.user_id, xf_user.username, xf_user.email, xf_user_authenticate.data FROM xf_user JOIN xf_user_authenticate ON xf_user.user_id = xf_user_authenticate.user_id"
    );

    sourceConn.release();

    for (const user of users) {
      const dataStr = user.data.toString("utf8");
      const passwordHashMatch = dataStr.match(/"hash";s:60:"(.*?)"/);
      if (!passwordHashMatch) {
        console.error(
          `Failed to extract password hash for user ${user.username}`
        );
        continue;
      }

      const passwordHash = passwordHashMatch[1];
      const newPasswordHash = passwordHash.replace("$2y$", "$2b$");

      const destinationConn = await destinationDatabasePool.getConnection();
      const [existingAccount] = await destinationConn.query(
        "SELECT * FROM accounts WHERE name = ? AND email = ?",
        [user.username, user.email]
      );

      if (!existingAccount) {
        try {
          await destinationConn.query(
            "INSERT INTO accounts (name, email, password) VALUES (?, ?, ?)",
            [user.username, user.email, newPasswordHash]
          );
          console.log(`Inserted user ${user.username}`);
        } catch (err) {
          if (err.code === "ER_DUP_ENTRY") {
            console.log(`Skipping duplicate user ${user.username}`);
          } else {
            throw err;
          }
        }
      }

      destinationConn.release();
    }
  } catch (err) {
    console.error(err);
  }
}

migrateUsers();
