import { Test, TestingModule } from '@nestjs/testing';
import { CreateStudentInput } from './dto/input/create.student.input';
import { DeleteStudentInput } from './dto/input/delete.student.input';
import { UpdateStudentInput } from './dto/input/update.student.input';
import { StudentService } from './student.service';

describe('StudentService', () => {

  let service: StudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentService],
    }).compile();

    service = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new student', () => {
    const studentSpy = jest.spyOn(service, 'saveStudent');
    const dto = new CreateStudentInput();
    service.saveStudent(dto);
    expect(studentSpy).toHaveBeenCalledWith(dto);
  });

  it('should update student', () => {
    const studentSpy = jest.spyOn(service, 'updateStudent');
    const dto = new UpdateStudentInput();
    service.updateStudent(dto);
    expect(studentSpy).toHaveBeenCalledWith(dto);
  });

  it('should delete student', () => {
    const studentSpy = jest.spyOn(service, 'deleteStudent');
    const dto = new DeleteStudentInput();
    service.deleteStudent(dto);
    expect(studentSpy).toHaveBeenCalledWith(dto);
  });

});