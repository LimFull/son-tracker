import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }

  async tot(): Promise<any> {
    const result = await fetch('https://www.tottenhamhotspur.com/fixtures/men');
    // console.log('reulst', result.text());
    return result.text();
  }
}
