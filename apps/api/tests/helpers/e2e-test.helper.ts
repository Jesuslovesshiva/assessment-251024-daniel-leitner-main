import { PrismaTestingHelper } from '@chax-at/transactional-prisma-testing';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

export class E2ETestHelper {
  private testingModule!: TestingModule;
  private app!: NestFastifyApplication;
  private prisma!: PrismaClient;
  private prismaTestingHelper!: PrismaTestingHelper<PrismaClient>;

  static async create(): Promise<E2ETestHelper> {
    const helper = new E2ETestHelper();
    await helper.initialize();
    return helper;
  }

  private async initialize(): Promise<void> {
    const originalPrismaClient = new PrismaClient();
    await originalPrismaClient.$connect();

    this.prismaTestingHelper = new PrismaTestingHelper(originalPrismaClient);
    this.prisma = this.prismaTestingHelper.getProxyClient();

    this.testingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(this.prisma)
      .compile();

    this.app = this.testingModule.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    this.app.setGlobalPrefix('api');

    await this.app.init();
    await this.app.getHttpAdapter().getInstance().ready();
  }

  getApp(): NestFastifyApplication {
    return this.app;
  }

  getPrisma(): PrismaClient {
    return this.prisma;
  }

  getService<T>(serviceOrToken: string | (new (...args: any[]) => T)): T {
    return this.testingModule.get<T>(serviceOrToken);
  }

  async startNewTransaction(): Promise<void> {
    await this.prismaTestingHelper.startNewTransaction();
  }

  rollbackCurrentTransaction(): void {
    this.prismaTestingHelper.rollbackCurrentTransaction();
  }

  async close(): Promise<void> {
    await this.prisma.$disconnect();
    await this.app.close();
  }
}
