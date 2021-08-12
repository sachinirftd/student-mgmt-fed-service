import { Module } from '@nestjs/common';
import { GraphQLGatewayModule } from '@nestjs/graphql';
import FileUploadDataSource from '@profusion/apollo-federation-upload';

@Module({
  imports: [
    GraphQLGatewayModule.forRoot({
      server: {
        // ... Apollo server options
        cors: {
          credentials: true,
          allowedHeaders: ['Origin', 'X-Requested-With', 'content-type', 'set-cookie', 'cookie'],
          methods: ['GET, POST, OPTIONS, PUT, PATCH, DELETE'],
        },
      },
      gateway: {
        buildService: ({ url }) => new FileUploadDataSource({ url, useChunkedTransfer: true }),
        serviceList: [
          { name: 'crud', url: "http://localhost:3002/graphql" },
          { name: 'upload', url: "http://localhost:3001/graphql" },
        ]
      },
    }),
  ],
})
export class AppModule { }
