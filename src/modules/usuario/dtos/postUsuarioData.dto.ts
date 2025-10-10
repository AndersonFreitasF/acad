import { RoleEnum } from "src/common/enum/role.enum";

export class PostUsuarioDataDTO {
  nome: string;

  email: string;

  senha: string;

  tipo: RoleEnum;

  perfilAtivo: boolean;
}
