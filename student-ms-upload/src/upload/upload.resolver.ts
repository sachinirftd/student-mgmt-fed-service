import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { UploadService } from './upload.service';

@Resolver('upload')
export class UploadResolver {

    constructor(private uploadService: UploadService) { }

    @Mutation(() => Boolean)
    async uploadFile(@Args({ name: 'file', type: () => GraphQLUpload })
    {
        createReadStream,
        filename
    }: FileUpload) {
        return this.uploadService.uploadFile(filename, createReadStream);
    }

    @Query(() => String)
    uploadResolver(): string {
        return 'Upload works!';
    }
}
