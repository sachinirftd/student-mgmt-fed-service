import { Processor, Process, InjectQueue, OnQueueCompleted, OnQueueFailed, OnQueueError } from "@nestjs/bull";
import { Job, Queue } from "bull";
import { Student } from "./entity/student.entity";
const excelToJson = require('convert-excel-to-json');
const xlsxFile = require('read-excel-file/node');
const XLSX = require('xlsx');
import { request } from "graphql-request";
import * as socketClusterClient from 'socketcluster-client';
import { Logger } from "@nestjs/common";

@Processor('file-upload-queue')
export class UploadConsumer {

  endPoint = process.env.DB_CONNECTION;
  students: Student[] = [];
  stud: Student;

  socket = socketClusterClient.create({
    hostname: 'localhost',
    port: 8000
  });

  myChannel = this.socket.subscribe('myChannel');

  constructor(@InjectQueue('file-upload-queue') private fileUploadQueue: Queue) { }

  @Process('upload')
  async readOperationJob(job: Job<any>) {
    this.students = [];
    let filename = job.data.filename;
    await xlsxFile(`./uploads/${filename}`).then((rows) => {
      const columnNames = rows.shift(); // Separate first row with column names
      rows.map((row) => { // Map the rest of the rows into objects
        const obj: any = {}; // Create object literal for current row
        row.forEach((cell, i) => {
          obj[columnNames[i]] = cell; // Use index from current cell to get column name, add current cell to new object
        });

        this.stud = {
          id: obj.Id,
          name: obj.Name,
          email: obj.Email,
          age: this.calculateAge(obj.Dob),
          dob: obj.Dob
        };
        this.students.push(this.stud);
      });
    });

    const mutation = `mutation ($createStudents: [CreateStudentInput!]!) {
      saveAllStudents (createStudents: $createStudents)           
            }`
    return request(process.env.STUDENT_API, mutation, {
      createStudents: this.students
    }).then(() => {
      return true;
    }, () => {
      return false
    });
  }

  @OnQueueCompleted()
  async onCompleted(jobId: number) {
    const job = await this.fileUploadQueue.getJob(jobId);
    (async () => {
      // Publish data to the channel from the socket and await for
      // the message to reach the server.
      try {
        await this.socket.invokePublish('myChannel', 'Success');
      } catch (error) {
        Logger.log(error, `Job ${job.id} complete process: error from SC`);
      }
    })();
  }


  @OnQueueFailed()
  async onFailed(jobId: number) {
    const job = await this.fileUploadQueue.getJob(jobId);
    (async () => {
      // Publish data to the channel from the socket and await for
      // the message to reach the server.
      try {
        await this.socket.invokePublish('myChannel', 'Failed');
      } catch (error) {
        Logger.log(error, `Job ${job.id} failed with error from SC`);
      }
    })();
  }

  @OnQueueError()
  async onError(jobId: number) {
    const job = await this.fileUploadQueue.getJob(jobId);
    (async () => {
      // Publish data to the channel from the socket and await for
      // the message to reach the server.
      try {
        await this.socket.invokePublish('myChannel', 'Error');
      } catch (error) {
        // Handle error.
      }
    })();
  }

  calculateAge(birthday: Date) {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
}