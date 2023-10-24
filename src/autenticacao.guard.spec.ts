import { UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { AutenticacaoGuard } from './autenticacao.guard';

describe('AutenticacaoGuard', () => {
  let guard: AutenticacaoGuard;
  let reflector: Reflector;

  const mockClientProxy = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutenticacaoGuard,
        {
          provide: 'AUTH_CLIENT',
          useValue: mockClientProxy,
        },
        Reflector,
      ],
    }).compile();

    guard = module.get<AutenticacaoGuard>(AutenticacaoGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should pass if route is public', async () => {
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            authorization: 'Bearer valid_token',
          },
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    };
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    const result = await guard.canActivate(context as any);

    expect(result).toBe(true);
  });

  it('should pass if authentication is successful', async () => {
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            authorization: 'Bearer valid_token',
          },
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    };
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    mockClientProxy.send.mockReturnValue(of(true));

    const result = await guard.canActivate(context as any);

    expect(result).toBe(true);
  });

  it('should not pass if authentication is unsuccessful', async () => {
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            authorization: 'Bearer invalid_token',
          },
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    };
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    mockClientProxy.send.mockReturnValue(of(false));

    guard
      .canActivate(context as any)
      .catch((err) =>
        expect(err).toEqual(
          new UnauthorizedException('Usuário não autenticado!'),
        ),
      );
  });
});
