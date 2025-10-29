import { HttpException, Injectable } from "@nestjs/common";
import { UsuarioRepositoryPort } from "../../application/ports/usuario-repository.port";
import { GetUsuarioDataDTO } from "../../dtos/getUsuarioData.dto";
import { PostUsuarioDataDTO } from "../../dtos/postUsuarioData.dto";
import { PutUsuarioDataDTO } from "../../dtos/putUsuarioData.dto";
import {
  AsaasCustomerData,
  AsaasCustomerResponse,
  IUsuario,
} from "../../interface/usuario.interface";
import { GetUsuarioRepository } from "../../repositories/getUsuario.repository";
import { PostUsuarioRepository } from "../../repositories/postUsuario.repository";
import { PutUsuarioRepository } from "../../repositories/putUsuario.repository";
import { DeleteUsuarioRepository } from "../../repositories/deleteUsuario.repository";

import { PostCustomerAsaasDataDTO } from "../../dtos/postCustomerAsaasData.dto";
import { PostCustomerAsaasRepository } from "../../repositories/postCustomerAsaas.repository";

@Injectable()
export class UsuarioRepositoryAdapter implements UsuarioRepositoryPort {
  constructor(
    private readonly getRepo: GetUsuarioRepository,
    private readonly postRepo: PostUsuarioRepository,
    private readonly putRepo: PutUsuarioRepository,
    private readonly deleteRepo: DeleteUsuarioRepository,
    private readonly costumerRepo: PostCustomerAsaasRepository
  ) {}

  async countUsuarios(params: GetUsuarioDataDTO): Promise<number> {
    return this.getRepo.countUsuarios(params);
  }

  async getUsuarios(params: GetUsuarioDataDTO): Promise<IUsuario[]> {
    return this.getRepo.getUsuarios(params);
  }

  async postUsuario(
    data: PostUsuarioDataDTO,
    createdBy: number
  ): Promise<void> {
    await this.postRepo.postUsuario(data, createdBy);
    return;
  }

  async findUsuario(idUsuario: number): Promise<boolean> {
    return this.putRepo.findUsuario(idUsuario);
  }

  async putUsuario(
    data: PutUsuarioDataDTO,
    updatedBy: number,
    idUsuario: number
  ): Promise<void> {
    await this.putRepo.putUsuario(data, updatedBy, idUsuario);
    return;
  }

  async deleteUsuario(executedBy: number, idUsuario: number): Promise<void> {
    await this.deleteRepo.deleteUsuario(executedBy, idUsuario);
    return;
  }

  async postCustomer(
    data: PostCustomerAsaasDataDTO
  ): Promise<AsaasCustomerResponse> {
    const response = await fetch(`${process.env.ASAAS_API_URL}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: process.env.ASAAS_API_KEY,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new HttpException(await response.json(), response.status);
    }

    return await response.json();
  }

  async getDadosUsuario(id_usuario: number): Promise<AsaasCustomerData | null> {
    return this.costumerRepo.getDadosUsuario(id_usuario);
  }

  async vincularCustomerId(
    id_usuario: number,
    customerId: string
  ): Promise<void> {
    return this.costumerRepo.vincularCustomerId(id_usuario, customerId);
  }
}
