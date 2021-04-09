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
    if(!!recordAsBytes && recordAsBytes.toString().length !== 0) { //if not empty
      throw new Error("Student with this email already exists.");
    }
    const recordExample = {
      fullName: fullName,
      semesters: []
    }
    const newRecordInBytes = Buffer.from(JSON.stringify(recordExample));
    await ctx.stub.putState(studentEmail, newRecordInBytes);
    return JSON.stringify(recordExample,null,2);
  }

  async getStudentRecord(ctx, studentEmail) {
    const recordAsBytes = await ctx.stub.getState(studentEmail);
    if (!recordAsBytes || recordAsBytes.toString().length === 0) {
      throw new Error("Student with this email does not exist.");
    }
    return JSON.parse(recordAsBytes.toString());
  }

  async addSubjectToStudentRecord(ctx, studentEmail, semesterNumber, subjectName) {
    const identity = new ClientIdentity(ctx.stub);
    if(identity.cert.subject.organizationalUnitName !== 'admin'){
      throw new Error("Current user does not have access to this function.");
    }
    const recordAsObject = await getStudentRecord(ctx, studentEmail);
    if (!recordAsObject.semesters[semesterNumber]) {
      recordAsObject.semesters[semesterNumber] = {};
    }
    recordAsObject.semesters[semesterNumber][subjectName] = {
      lector: identity.cert.subject.commonName,
      themes: []
    }
    const newRecordInBytes = Buffer.from(JSON.stringify(recordAsObject));
    await ctx.stub.putState(studentEmail, newRecordInBytes);
    return JSON.stringify(recordAsObject,null,2);
  }

  async addGradeToStudentRecord(ctx, studentEmail, semesterNumber, subjectName, themeTitle, themeRating) {
    const identity = new ClientIdentity(ctx.stub);
    if(identity.cert.subject.organizationalUnitName !== 'admin'){
      throw new Error("Current user does not have access to this function.");
    }
    const recordAsObject = await this.getStudentRecord(ctx, studentEmail);
    if (!recordAsObject.semesters[semesterNumber]?.[subjectName]) {
      throw new Error("This student does not have this subject in this semester.");
    }
    recordAsObject.semesters[semesterNumber][subjectName].themes.push([
      {
        title: themeTitle,
        rating: themeRating,
        date: Date.now()
        // date: ctx.stub.getTxTimestamp().seconds.low
      }
    ]);
    // getTxTimestamp() => Returns the timestamp when the transaction was created. This is taken from the transaction ChannelHeader, therefore it will indicate the client's timestamp, and will have the same value across all endorsers. Object returned: { seconds: [Long] { low: [int32], high: [int32], unsigned: [bool] }, nanos: [int32] }
    const newRecordInBytes = Buffer.from(JSON.stringify(recordAsObject));
    await ctx.stub.putState(studentEmail, newRecordInBytes);
    return JSON.stringify(recordAsObject,null,2);
  }

  async getAllStudentGrades(ctx, studentEmail) {
    const recordAsObject = await this.getStudentRecord(ctx, studentEmail);
    return JSON.stringify(recordAsObject.semesters, null, 2);
  }

  async getAllStudentGradesForSemester(ctx, studentEmail, semester) {
    const recordAsObject = await this.getStudentRecord(ctx, studentEmail);
    return JSON.stringify(recordAsObject.semesters[semester] || [], null, 2);
  }
}

module.exports = StudentRecordsStorage;
