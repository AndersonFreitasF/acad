import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export function permitirRoles(...rolesPermitidos: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ mensagem: "Usuário não autenticado" });
    }

    if (!rolesPermitidos.includes(req.user.tipo)) {
      return res
        .status(403)
        .json({ mensagem: "Acesso negado para este perfil" });
    }

    next();
  };
}
