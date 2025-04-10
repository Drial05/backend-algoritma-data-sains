import { Request, Response, NextFunction } from "express";
import jwt, { decode } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) throw new Error("JWT_SECRET_KEY is not defined");

interface AuthRoutes extends Request {
  userId?: number;
}

export const authenticate = (
  req: AuthRoutes,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, SECRET_KEY, (err, decode: any) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.userId = decode.id;
    next();
  });
};
