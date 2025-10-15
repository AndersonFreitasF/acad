import { GetUsuarioDataDTO } from "../../dtos/getUsuarioData.dto";
import { PostUsuarioDataDTO } from "../../dtos/postUsuarioData.dto";
import { PutUsuarioDataDTO } from "../../dtos/putUsuarioData.dto";
import { IUsuario } from "../../interface/usuario.interface";

export const UsuarioRepositoryPortToken = "UsuarioRepositoryPort" as const;

export interface UsuarioRepositoryPort {
  countUsuarios(params: GetUsuarioDataDTO): Promise<number>;
  getUsuarios(params: GetUsuarioDataDTO): Promise<IUsuario[]>;
  postUsuario(data: PostUsuarioDataDTO, createdBy: number): Promise<void>;
  findUsuario(idUsuario: number): Promise<boolean>;
  putUsuario(
    data: PutUsuarioDataDTO,
    updatedBy: number,
    idUsuario: number
  ): Promise<void>;
  deleteUsuario(executedBy: number, idUsuario: number): Promise<void>;
}

