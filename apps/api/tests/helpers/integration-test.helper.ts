import { PrismaTestingHelper } from '@chax-at/transactional-prisma-testing';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AppModule } from '../../src/app.module';

export class IntegrationTestHelper {
  private testingModule!: TestingModule;
  private prisma!: PrismaClient;
  private prismaTestingHelper!: PrismaTestingHelper<PrismaClient>;

  static async create(): Promise<IntegrationTestHelper> {
    const helper = new IntegrationTestHelper();
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

    await this.testingModule.init();
  }

  getService<T>(service: new (...args: any[]) => T): T {
    return this.testingModule.get<T>(service);
  }

  getPrisma(): PrismaClient {
    return this.prisma;
  }

  async startNewTransaction(): Promise<void> {
    await this.prismaTestingHelper.startNewTransaction();
  }

  rollbackCurrentTransaction(): void {
    this.prismaTestingHelper.rollbackCurrentTransaction();
  }

  async close(): Promise<void> {
    await this.prisma.$disconnect();
    await this.testingModule.close();
  }
}
