import { GetProfessorDataDTO } from "../../dtos/getProfessorData.dto";
import { PostProfessorDataDTO } from "../../dtos/postProfessorData.dto";
import { PutProfessorDataDTO } from "../../dtos/putProfessorData.dto";
import { Professor } from "../../interface/professor.interface";

export const ProfessorRepositoryPortToken = "ProfessorRepositoryPort" as const;

export interface ProfessorRepositoryPort {
  countProfessores(params: GetProfessorDataDTO): Promise<number>;
  getProfessores(params: GetProfessorDataDTO): Promise<Professor[]>;
  postUsuario(data: PostProfessorDataDTO, createdBy: number): Promise<void>;
  findUsuario(idUsuario: number): Promise<boolean>;
  putProfessor(
    data: PutProfessorDataDTO,
    updatedBy: number,
    idUsuario: number
  ): Promise<void>;
  deleteProfessor(executedBy: number, idUsuario: number): Promise<void>;
}


