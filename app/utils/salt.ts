import { randomBytes, scrypt } from "node:crypto";

export function generateSalt() {
  return randomBytes(16).toString("hex");
}

export async function hash(password: string, salt: string) {
  return await new Promise<string>((resolve, reject) => {
    scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) {
        reject(error);
      }

      resolve(derivedKey.toString("hex"));
    });
  });
}
