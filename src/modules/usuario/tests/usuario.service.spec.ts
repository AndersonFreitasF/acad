import { describe, it, beforeAll, afterAll, expect, vi } from "vitest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as request from "supertest";

import { Role } from "src/common/enum/role.enum";
import { AppModule } from "src/app.module";

describe("Usuario E2E Flow (CRUD completo)", () => {
  let app: INestApplication;
  let jwtToken: string;
  let createdUserId: number;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    const loginResponse = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "admin@example.com", senha: "admin123" })
      .expect(201);

    jwtToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it("deve listar todos os usuários", async () => {
    const res = await request(app.getHttpServer())
      .get("/usuario/")
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it("deve criar um novo usuário", async () => {
    const newUser = {
      nome: "Teste User",
      email: "testeuser@example.com",
      senha: "123456",
      tipo: Role.ALUNO,
    };

    const res = await request(app.getHttpServer())
      .post("/usuario/")
      .set("Authorization", `Bearer ${jwtToken}`)
      .send(newUser)
      .expect(201);

    expect(res.body).toHaveProperty("id_usuario");
    createdUserId = res.body.id_usuario;
  });

  it("deve listar todos os usuários e ver o novo usuário", async () => {
    const res = await request(app.getHttpServer())
      .get("/usuario/")
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(200);

    const found = res.body.find((u: any) => u.id_usuario === createdUserId);
    expect(found).toBeDefined();
    expect(found.nome).toBe("Teste User");
  });

  it("deve atualizar o usuário criado", async () => {
    const updateData = { nome: "Teste User Editado", senha: "654321" };

    await request(app.getHttpServer())
      .put(`/usuario/update/${createdUserId}`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .send(updateData)
      .expect(200);

    const res = await request(app.getHttpServer())
      .get("/usuario/")
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(200);

    const updated = res.body.find((u: any) => u.id_usuario === createdUserId);
    expect(updated.nome).toBe("Teste User Editado");
  });

  it("deve deletar o usuário criado", async () => {
    await request(app.getHttpServer())
      .delete(`/usuario/delete/${createdUserId}`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(200);

    const res = await request(app.getHttpServer())
      .get("/usuario/")
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(200);

    const deleted = res.body.find((u: any) => u.id_usuario === createdUserId);
    expect(deleted).toBeUndefined();
  });
});
