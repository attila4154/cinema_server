import * as jwt from "jsonwebtoken";
import * as crypto from "node:crypto";

export function createJWT(userInfo: {
  id: string;
  email: string;
}) {
  const token = jwt.sign({ userInfo }, "secret", {
    expiresIn: "1h",
  });

  return token;
}

export function generateRandomSalt() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashWithSalt({
  toHash,
  salt,
  algorithm = "sha256",
}: {
  algorithm?: string;
  toHash: string;
  salt: string;
}) {
  return crypto
    .createHash(algorithm)
    .update(toHash + salt)
    .digest("hex");
}
