import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { IS_PUBLIC_KEY } from './shared/decorators/public-route.decorator';

@Injectable()
export class AutenticacaoGuard implements CanActivate {
  constructor(
    @Inject('USUARIO_CLIENT')
    private readonly _client: ClientProxy,
    private readonly _reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const jwt = req.headers['authorization']?.split(' ')[1];

    const isPublic = this._reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = this._client
      .send({ role: 'auth', cmd: 'check' }, { jwt })
      .pipe(timeout(5000));
    const response = await lastValueFrom(request);

    if (!response) {
      throw new UnauthorizedException('Usuário não autenticado!');
    }

    return true;
  }
}
