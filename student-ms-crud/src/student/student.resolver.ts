import { Resolver, Query, Mutation, Args, ResolveReference } from '@nestjs/graphql';
import { Student } from './entity/student.entity';
import { StudentService } from './student.service';
import { CreateStudentInput } from './dto/input/create.student.input'
import { UpdateStudentInput } from './dto/input/update.student.input';
import { DeleteStudentInput } from './dto/input/delete.student.input';

@Resolver(() => Student)
export class StudentResolver {
    constructor(private readonly studentService: StudentService) { }

    @Mutation(() => Student) //bool denoted return type from the query
    async saveStudent(@Args('createStudentInput') createStudentInput: CreateStudentInput): Promise<Student> {
        return await this.studentService.saveStudent(createStudentInput);
    }
    @Query(() => [Student], { name: 'user', nullable: 'itemsAndList' }) //name=> name for the query
    async getAllStudents(): Promise<Student[]> {
        return await this.studentService.getAllStudents();
    }

    @Mutation(() => Student) //bool denoted return type from the query
    async updateStudent(@Args('updateStudentInput') updateStudentInput: UpdateStudentInput): Promise<boolean> {
        return await this.studentService.updateStudent(updateStudentInput);
    }

    @Mutation(() => Boolean) //bool denoted return type from the query
    async deleteStudent(@Args('deleteStudentInput') deleteStudentInput: DeleteStudentInput): Promise<boolean> {
        return await this.studentService.deleteStudent(deleteStudentInput);
    }
    @Mutation(() => Boolean) //bool denoted return type from the query
    async saveAllStudents(@Args({name:'createStudents', type: () => [CreateStudentInput]}) createStudents: CreateStudentInput[]): Promise<boolean> {
        return await this.studentService.saveAllStudents(createStudents);
    }
}
