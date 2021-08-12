import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class DeleteStudentInput {
    @Field((type) => Int) 
    @IsNotEmpty()
    id: number;
}