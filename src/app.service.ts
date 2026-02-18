import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApi(): { name: string; status: string } {
    return { name: 'iWallet Backend', status: 'ok' };
  }
}
