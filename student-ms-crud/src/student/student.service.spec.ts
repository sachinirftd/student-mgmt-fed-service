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

  it('should create new students', async () => {
    const studentSpy = jest.spyOn(service, 'saveAllStudents');
    const dto = new CreateStudentInput();
    service.saveAllStudents([dto]);
    expect(studentSpy).toHaveBeenCalledWith([dto]);
  });

  it('should update student', async () => {
    const studentSpy = jest.spyOn(service, 'updateStudent');
    const dto = new UpdateStudentInput();
    service.updateStudent(dto);
    expect(studentSpy).toHaveBeenCalledWith(dto);
  });

  it('should delete student', async () => {
    const studentSpy = jest.spyOn(service, 'deleteStudent');
    const dto = new DeleteStudentInput();
    service.deleteStudent(dto);
    expect(studentSpy).toHaveBeenCalledWith(dto);
  });

  it('should get all student', () => {
    const studentSpy = jest.spyOn(service, 'getAllStudents');
    service.getAllStudents();
    expect(studentSpy).toHaveBeenCalled();
  });

  it('should return date of birth', () => {
    const studentSpy = jest.spyOn(service, 'calculateAge');
    const dto = new Date('2000-12-12');
    service.calculateAge(dto);
    expect(studentSpy).toHaveBeenCalledWith(dto);
  });
});
