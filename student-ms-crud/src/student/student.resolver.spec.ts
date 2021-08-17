import { BullModule } from '@nestjs/bull';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateStudentInput } from './dto/input/create.student.input';
import { DeleteStudentInput } from './dto/input/delete.student.input';
import { UpdateStudentInput } from './dto/input/update.student.input';
import { StudentResolver } from './student.resolver';
import { StudentService } from './student.service';

describe('StudentResolver', () => {
  let resolver: StudentResolver;
  const mockService = {
    saveStudent: jest.fn(dto => {
      return {
        data: {
          createStudent: {
            __typename: 'Student'
          }
        }
      }
    }),

    updateStudent: jest.fn(dto => {
      return {
        data: {
          updateStudent: {
            __typename: 'Student'
          }
        }
      }
    }),

    deleteStudent: jest.fn(dto => {
      return {
        data: {
          deleteStudent: {
            __typename: 'Student'
          }
        }
      }
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentService, StudentResolver],
    }).overrideProvider(StudentService).useValue(mockService).compile();

    resolver = module.get<StudentResolver>(StudentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should define save student method', () => {
    expect(resolver.saveStudent).toBeDefined();
  });

  it('should define save all students method', () => {
    expect(resolver.saveAllStudents).toBeDefined();
  });

  it('should define get all students method', () => {
    expect(resolver.getAllStudents).toBeDefined();
  });

  it('should define update student method', () => {
    expect(resolver.updateStudent).toBeDefined();
  });

  it('should define delete student method', () => {
    expect(resolver.deleteStudent).toBeDefined();
  });
  
  it('should create new student', () => {
    const dto: CreateStudentInput = {
      id: 1,
      name: "TestOne",
      //   age: 20,
      dob: new Date("2000-12-12"),
      email: "sach@123.com"
    }

    expect(resolver.saveStudent(dto)).resolves.toEqual({
      data: {
        createStudent: {
          __typename: 'Student'
        }
      }
    });
    expect(mockService.saveStudent).toHaveBeenCalledWith(dto);
  });

  it('should update student', () => {
    const dto: UpdateStudentInput = {
      id: 1,
      name: "TestOne",
      age: 20,
      dob: new Date("2000-12-12"),
      email: "sach@123.com"
    }
    expect(resolver.updateStudent(dto)).resolves.toEqual({
      data: {
        updateStudent: {
          __typename: 'Student'
        }
      }
    });
    expect(mockService.updateStudent).toHaveBeenCalledWith(dto);
  });

  it('should delete student', () => {
    const dto: DeleteStudentInput = {
      id: 1
    }
    expect(resolver.deleteStudent(dto)).resolves.toEqual({
      data: {
        deleteStudent: {
          __typename: 'Student'
        }
      }
    });
    expect(mockService.deleteStudent).toHaveBeenCalledWith(dto);
  });

});

