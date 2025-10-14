import { IUsuario } from "src/modules/usuario/interface/usuario.interface";

export class Professor implements IUsuario {
  id_usuario: number;

  nome_usuario: string;

  email: string;

  senha: string;

  tipo: string;

  perfilAtivo: boolean;
}
