import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "chave_super_secreta";

export interface AuthRequest extends Request {
  user?: { id: number; tipo: string };
}

export function autenticarToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ mensagem: "Token não fornecido" });

  try {
    const user = jwt.verify(token, JWT_SECRET) as { id: number; tipo: string };
    req.user = user;
    next();
  } catch {
    return res.status(403).json({ mensagem: "Token inválido ou expirado" });
  }
}
