import { RoleEnum } from "src/common/enum/role.enum";

export interface IUsuario {
  id_usuario: number;

  nome_usuario: string;

  email: string;

  senha: string;

  tipo: RoleEnum;

  perfilAtivo: boolean;
}
