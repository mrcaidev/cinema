db.createCollection("users");

db.users.createIndex({ email: 1, deletedTime: 1 }, { unique: true });

db.createCollection("emailVerifications");

db.createCollection("rooms");

db.rooms.createIndex({ slug: 1 }, { unique: true });
