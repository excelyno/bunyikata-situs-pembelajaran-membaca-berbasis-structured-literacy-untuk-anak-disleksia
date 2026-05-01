import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "default_secret";

export const signToken = (payload: object) => {
  return jwt.sign(payload, SECRET, { expiresIn: "1d" }); // Token aktif 1 hari
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET) as any;
  } catch (error) {
    return null;
  }
};