'use strict';

const { Contract } = require('fabric-contract-api');
const { ClientIdentity } = require('fabric-shim');

class StudentRecordsStorage extends Contract {
  constructor() {
    super('org.fabric.studentRecordsStorage');
  }

  async createStudentRecord(ctx) {
    const identity = new ClientIdentity(ctx.stub);
    console.log(JSON.stringify(identity, null, 2))
    console.log(JSON.stringify(identity.cert, null, 2))

  }
}

module.exports = StudentRecordsStorage;
