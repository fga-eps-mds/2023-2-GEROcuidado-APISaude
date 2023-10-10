import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  heathCheck() {
    return {
      message: 'GEROcuidadoAPISaude health check Ok!',
      data: {},
    };
  }
}
