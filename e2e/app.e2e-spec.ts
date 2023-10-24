import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/shared/filters/all-exceptions.filter';
import { ModelNotFoundExceptionFilter } from '../src/shared/filters/model-not-found.exception-filter';
import { DataTransformInterceptor } from '../src/shared/interceptors/data-transform.interceptor';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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

    await app.init();
  });

  describe('GET: /api/saude/not-found', () => {
    it('/api/saude/not-found (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get('/not-found')
        .set('Content-Type', 'application/json')
        .send();

      expect(response.statusCode).toBe(404);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
