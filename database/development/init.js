db.createCollection("users");

db.users.createIndex({ email: 1, deletedTime: 1 }, { unique: true });

db.createCollection("emailVerifications");
