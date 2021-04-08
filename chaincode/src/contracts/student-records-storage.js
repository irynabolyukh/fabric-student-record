'use strict';

const { Contract } = require('fabric-contract-api');
const { ClientIdentity } = require('fabric-shim');

class StudentRecordsStorage extends Contract {
  constructor() {
    super('org.fabric.studentRecordsStorage');
  }

  async createStudentRecord(ctx, studentEmail, fullName) {
    const identity = new ClientIdentity(ctx.stub);
    if(identity.cert.subject.organizationalUnitName !== 'admin'){
      throw new Error("Current user does not have access to this function.");
    }
    const recordAsBytes = await ctx.stub.getState(studentEmail);
    // recordAsBytes = {"type":"Buffer","data":[]}
    if(!!recordAsBytes){ //if not null
      if(recordAsBytes.toString().length !== 0) { //if not empty
        throw new Error("Student with current email already exists.");
      }
    }
    const recordExample = {
      fullName: fullName,
      semesters: []
    }
    const newRecordInBytes = Buffer.from(JSON.stringify(recordExample));
    await ctx.stub.putState(studentEmail, newRecordInBytes);
    return JSON.stringify(recordExample,null,2);
  }

  async addSubjectToStudentRecord(ctx, studentEmail, semesterNumber, subjectName) {
    const identity = new ClientIdentity(ctx.stub);
    if(identity.cert.subject.organizationalUnitName !== 'admin'){
      throw new Error("Current user does not have access to this function.");
    }
    const recordAsBytes = await ctx.stub.getState(studentEmail);
    if(!recordAsBytes || recordAsBytes.toString().length === 0) { //if null or empty
        throw new Error("Student with current email does not exist.");
    }
    const recordAsObject = JSON.parse(recordAsBytes.toString());
    recordAsObject.semesters[semesterNumber][subjectName] = {
      lector: identity.cert.subject.commonName,
      themes: []
    }
    const newRecordInBytes = Buffer.from(JSON.stringify(recordAsObject));
    await ctx.stub.putState(studentEmail, newRecordInBytes);
    return JSON.stringify(recordExample,null,2);
  }

  async addGradeToStudentRecord(ctx, studentEmail, semesterNumber, subjectName, themeTitle, themeRating) {
    const identity = new ClientIdentity(ctx.stub);
    if(identity.cert.subject.organizationalUnitName !== 'admin'){
      throw new Error("Current user does not have access to this function.");
    }
    const recordAsBytes = await ctx.stub.getState(studentEmail);
    if(!recordAsBytes || recordAsBytes.toString().length === 0) { //if null or empty
      throw new Error("Student with current email does not exist.");
    }
    const recordAsObject = JSON.parse(recordAsBytes.toString());
    recordAsObject.semesters[semesterNumber][subjectName] = {
      lector: identity.cert.subject.commonName,
      themes: [
        {
          title: themeTitle,
          rating: themeRating,
          date: Date.now()
        }
      ]
    }
    const newRecordInBytes = Buffer.from(JSON.stringify(recordAsObject));
    await ctx.stub.putState(studentEmail, newRecordInBytes);
    return JSON.stringify(recordExample,null,2);
  }
}

module.exports = StudentRecordsStorage;
