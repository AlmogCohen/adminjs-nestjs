import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { AdminModule } from '../../src/index';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Admin } from './mongoose/admin-model';
import { MongooseSchemasModule } from './mongoose/mongoose.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest'),
    AdminModule.createAdminModule({
      imports: [
        MongooseSchemasModule,
      ],
      inject: [
        getModelToken('Admin'),
      ],
      useFactory: (adminModel: Model<Admin>) => ({
        adminBroOptions: {
          rootPath: '/admin',
          resources: [
            { resource: adminModel },
          ],
        },
        auth: {
          authenticate: async (email, password) => Promise.resolve({ test: 'test' }),
          cookieName: 'test',
          cookiePassword: 'testPass',
        },
      }),
    }),
    MongooseSchemasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
