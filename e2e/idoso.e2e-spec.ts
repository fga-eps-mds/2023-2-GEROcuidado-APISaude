import { Controller, INestApplication, ValidationPipe } from '@nestjs/common';
import {
  ClientProxy,
  ClientsModule,
  MessagePattern,
  Transport,
} from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { ETipoSanguineo } from '../src/idoso/classes/tipo-sanguineo.enum';
import { Idoso } from '../src/idoso/entities/idoso.entity';
import { AllExceptionsFilter } from '../src/shared/filters/all-exceptions.filter';
import { ModelNotFoundExceptionFilter } from '../src/shared/filters/model-not-found.exception-filter';
import { DataTransformInterceptor } from '../src/shared/interceptors/data-transform.interceptor';

@Controller()
class AutenticacaoController {
  @MessagePattern({ role: 'auth', cmd: 'check' })
  async validateToken(data: { jwt: string }) {
    return true;
  }
}

describe('E2E - Idoso', () => {
  let app: INestApplication;
  let client: ClientProxy;
  let repository: Repository<Idoso>;
  let token: string =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5ceyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  const idoso: Partial<Idoso> = {
    id: undefined,
    nome: 'Henrique',
    foto: '1' as any,
    idUsuario: 1,
    dataNascimento: new Date().toISOString() as any,
    tipoSanguineo: ETipoSanguineo.AB_Negativo,
    telefoneResponsavel: '123456789',
    descricao: 'Nova descricao',
    dataHora: new Date().toISOString() as any,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ClientsModule.register([
          {
            name: 'USUARIO_CLIENT',
            transport: Transport.TCP,
            options: {
              host: '0.0.0.0',
              port: 8001,
            },
          },
        ]),
      ],
      controllers: [AutenticacaoController],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    app.useGlobalInterceptors(new DataTransformInterceptor());
    app.useGlobalFilters(
      new AllExceptionsFilter(),
      new ModelNotFoundExceptionFilter(),
    );

    app.connectMicroservice({
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 8001,
      },
    });

    await app.startAllMicroservices();
    await app.init();

    client = app.get('USUARIO_CLIENT');
    await client.connect();

    repository = app.get<Repository<Idoso>>(getRepositoryToken(Idoso));
  });

  describe('POST - /api/saude/idoso', () => {
    it('should successfully add a new "idoso"', async () => {
      const res = await request(app.getHttpServer())
        .post('/idoso')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'bearer ' + token)
        .send(idoso);

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toEqual('Salvo com sucesso!');
      expect(res.body.data).toMatchObject({
        ...idoso,
        id: res.body.data.id,
      });

      Object.assign(idoso, res.body.data);
      delete idoso.foto;
    });

    it('should not add a new "idoso" when validations are incorrect', async () => {
      const res = await request(app.getHttpServer())
        .post('/idoso')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'bearer ' + token)
        .send({});

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBeInstanceOf(Array);
      expect(res.body.message).toEqual([
        'idUsuario should not be empty',
        'idUsuario must be a number conforming to the specified constraints',
        'nome must be longer than or equal to 5 characters',
        'nome must be shorter than or equal to 60 characters',
        'nome should not be empty',
        'nome must be a string',
        'dataNascimento should not be empty',
        'dataNascimento must be a valid ISO 8601 date string',
        'telefoneResponsavel must be shorter than or equal to 11 characters',
        'telefoneResponsavel must be longer than or equal to 9 characters',
        'telefoneResponsavel should not be empty',
        'telefoneResponsavel must be a string',
      ]);
      expect(res.body.data).toBeNull();
    });
  });

  describe('GET - /api/saude/idoso/:id', () => {
    it('should successfully get "idoso" by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/idoso/${idoso.id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'bearer ' + token)
        .send();

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBeNull();
      const data = res.body.data;
      delete data.foto;
      expect(data).toMatchObject(idoso);
    });

    it('should return status 400 when id is invalid', async () => {
      const wrongId = 'NaN';
      const res = await request(app.getHttpServer())
        .get(`/idoso/${wrongId}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'bearer ' + token)
        .send();

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBeInstanceOf(Array);
      expect(res.body.message).toEqual(['ID inválido']);
      expect(res.body.data).toBeNull();
    });

    it('should return status 404 when no "idoso" is found', async () => {
      const res = await request(app.getHttpServer())
        .get('/idoso/9999')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'bearer ' + token)
        .send();

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Registro(s) não encontrado(s)!');
      expect(res.body.data).toBeNull();
    });
  });

  describe('GET - /api/saude/idoso/', () => {
    it('should successfully findAll "idoso"', async () => {
      const filter = JSON.stringify({
        nome: idoso.nome,
        id: idoso.id,
      });

      const res = await request(app.getHttpServer())
        .get('/idoso?filter=' + JSON.stringify(filter))
        .set('Content-Type', 'application/json')
        .set('Authorization', 'bearer ' + token)
        .send();

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBeNull();
      expect(res.body.data.length).toEqual(1);
    });
  });

  describe('PATCH - /api/saude/idoso/:id', () => {
    it('should successfully update "idoso" by id', async () => {
      const update = { nome: 'Jose da Silva' };

      const res = await request(app.getHttpServer())
        .patch(`/idoso/${idoso.id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'bearer ' + token)
        .send(update);

      idoso.nome = update.nome;

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe('Atualizado com sucesso!');
      const data = res.body.data;
      delete data.foto;
      expect(data).toMatchObject(idoso);
    });
  });

  describe('DELETE - /api/saude/idoso/:id', () => {
    it('should successfully delete "idoso" by id', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/idoso/${idoso.id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'bearer ' + token)
        .send();

      delete idoso.id;

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe('Excluído com sucesso!');
      expect(res.body.data).toMatchObject(idoso);
    });
  });

  afterAll(async () => {
    await repository.query('TRUNCATE idoso CASCADE');
    await repository.delete({});
    await app.close();
    await client.close();
  });
});
