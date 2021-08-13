
import { Injectable } from '@nestjs/common';
import { request, gql } from 'graphql-request';
import { CreateStudentInput } from './dto/input/create.student.input';
import { DeleteStudentInput } from './dto/input/delete.student.input';
import { UpdateStudentInput } from './dto/input/update.student.input';
import { Student } from './entity/student.entity';

@Injectable()
export class StudentService {
  endPoint = process.env.DB_CONNECTION;

  constructor() { }
  async saveStudent(createStudent: CreateStudentInput): Promise<Student> {

    const mutation = `mutation CreateStudent($createStudent: StudentInput!) {
            createStudent(input: { student: $createStudent }) { 
                __typename      
            }
          }`

    return request(this.endPoint, mutation, {
      createStudent: createStudent
    }).then((data) => {
      return data;
    }, (error) => {
    });
  }

  async getAllStudents(): Promise<Student[]> {
    const query = gql`query MyQuery {
            allStudents {
              nodes {
                id
                name
                age
                email
                dob
              }}}`

    return await request(this.endPoint, query).then(async (data) => {
      return await data.allStudents.nodes;
    });
  }

  async updateStudent(updateStudent: UpdateStudentInput): Promise<Student> {

    updateStudent.age = this.calculateAge(updateStudent.dob);
    const mutation = gql`mutation UpdateStudentById($id: Int!, $updateStudent: StudentPatch!) {
            updateStudentById(input: { id: $id, studentPatch: $updateStudent }) {
              __typename
            }
          }`

    return request(this.endPoint, mutation, {
      id: updateStudent.id,
      updateStudent: updateStudent
    }).then((data) => {
      return data.updateStudentById;
    });
  }

  async deleteStudent(deleteStudent: DeleteStudentInput): Promise<boolean> {
    const mutation = `mutation DeleteStudentById($id: Int!){
            deleteStudentById(input: {id: $id}) {
                student {
                    id
                  }
            }
          }`

    return request(this.endPoint, mutation, {
      id: deleteStudent.id,
    }).then((data) => {
      return true;
    });
  }

  async saveAllStudents(createStudents: CreateStudentInput[]): Promise<boolean> {
    const mutation = `mutation StudentBulkUpload($createStudents: [StudentInput!]!) {
      createBulkUpload(input: {students: $createStudents}) {
        __typename
      }
    }`

    return request(this.endPoint, mutation, {
      createStudents: createStudents
    }).then((data) => {
      return true;
    }, (error) => {
      return false
    });
  }


  calculateAge(birthday: Date) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
}
