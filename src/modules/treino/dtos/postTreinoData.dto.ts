import { Exercicio } from "src/modules/exercicio/interface/exercicio.interface";

export class PostTreinoDataDTO {
  titulo: string;

  descricao: string;

  id_professor: number;

  exercicios: Exercicio[];
}
