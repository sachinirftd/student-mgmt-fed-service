import { Module } from '@nestjs/common';
import { GraphQLFederationModule, GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { StudentModule } from './student/student.module';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    GraphQLFederationModule.forRoot({
      // cors: {
      //   origin: 'http://localhost:4200',
      //   credentials: true,
      // },
      autoSchemaFile: join(process.cwd(), 'src/graphql-schema.gql'),
      uploads: false,
      // context: req => ({ req }),
      // resolvers: {
      //   Upload: GraphQLUpload,
      // },
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ConfigModule.forRoot(),
    StudentModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
