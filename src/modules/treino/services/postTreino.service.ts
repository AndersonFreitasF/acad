import { Injectable } from "@nestjs/common";
import { TreinoRepositoryPort } from "../application/ports/treino-repository.port";
import { PostTreinoDataDTO } from "../dtos/postTreinoData.dto";
import { Exercicio } from "src/modules/exercicio/interface/exercicio.interface";

@Injectable()
export class PostTreinoService{
constructor(private readonly repo: TreinoRepositoryPort){}

async execute(data:PostTreinoDataDTO, id_professor: number){
       let exercicio: Exercicio[]
    try{
        let treino = await this.repo.postTreino(data,id_professor)
  
        for(let i; i<= data.exercicios; i++){
         
            exercicio.push(data.exercicios[i])
    
        }
        await this.repo.addExercicio(exercicio,treino)
    }catch(error){
}

}
}