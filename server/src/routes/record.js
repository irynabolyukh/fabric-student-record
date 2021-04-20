import express from 'express';
import { X509WalletMixin } from 'fabric-network';
import {getCA, getConnectedWallet, registerUser, sendTransaction} from '../utils';

const router = express.Router();
const createStudentRecord = async (req, res) => {
    const {certificate, privateKey, studentEmail, studentFullName} = req.body;
    try {
      const mixin = X509WalletMixin.createIdentity(
          'Org1MSP',
          certificate,
          privateKey
      );
      const gateway = await getConnectedWallet('Org1MSP', mixin);
      const result = await sendTransaction(gateway,{
          name: 'createStudentRecord',
          props: [studentEmail, studentFullName]
      });
      gateway.disconnect();
      res.status(201).json({ data: result });
    }
    catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const getStudentData = async (req, res) => {
    const {certificate, privateKey, studentEmail} = req.body;
    try {
        const mixin = X509WalletMixin.createIdentity(
            'Org1MSP',
            certificate,
            privateKey
        );
        const gateway = await getConnectedWallet('Org1MSP', mixin);
        const result = await sendTransaction(gateway,{
            name: 'getStudentRecord',
            props: [studentEmail]
        });
        gateway.disconnect();
        res.status(201).json({ data: result });
    }
    catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const addSubjectToStudentRecord = async (req, res) => {
    const {certificate, privateKey, studentEmail, semesterNumber, subjectName} = req.body;
    try {
        const mixin = X509WalletMixin.createIdentity(
            'Org1MSP',
            certificate,
            privateKey
        );
        const gateway = await getConnectedWallet('Org1MSP', mixin);
        const result = await sendTransaction(gateway,{
            name: 'addSubjectToStudentRecord',
            props: [studentEmail, semesterNumber, subjectName]
        });
        gateway.disconnect();
        res.status(201).json({ data: result });
    }
    catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const addGradeToStudentRecord = async (req, res) => {
    const {certificate, privateKey, studentEmail, semesterNumber, subjectName, themeTitle, themeRating} = req.body;
    try {
        const mixin = X509WalletMixin.createIdentity(
            'Org1MSP',
            certificate,
            privateKey
        );
        const gateway = await getConnectedWallet('Org1MSP', mixin);
        const result = await sendTransaction(gateway,{
            name: 'addGradeToStudentRecord',
            props: [studentEmail, semesterNumber, subjectName, themeTitle, themeRating]
        });
        gateway.disconnect();
        res.status(201).json({ data: result });
    }
    catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const getAllStudentGrades = async (req, res) => {
    const {certificate, privateKey, studentEmail} = req.body;
    try {
        const mixin = X509WalletMixin.createIdentity(
            'Org1MSP',
            certificate,
            privateKey
        );
        const gateway = await getConnectedWallet('Org1MSP', mixin);
        const result = await sendTransaction(gateway,{
            name: 'getAllStudentGrades',
            props: [studentEmail]
        });
        gateway.disconnect();
        res.status(201).json({ data: result });
    }
    catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const getAllStudentGradesForSemester = async (req, res) => {
    const {certificate, privateKey, studentEmail, semester} = req.body;
    try {
        const mixin = X509WalletMixin.createIdentity(
            'Org1MSP',
            certificate,
            privateKey
        );
        const gateway = await getConnectedWallet('Org1MSP', mixin);
        const result = await sendTransaction(gateway,{
            name: 'getAllStudentGradesForSemester',
            props: [studentEmail, semester]
        });
        gateway.disconnect();
        res.status(201).json({ data: result });
    }
    catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const getAverageStudentGradeForSubjectInSemester = async (req, res) => {
    const {certificate, privateKey, studentEmail, semester, subjectName} = req.body;
    try {
        const mixin = X509WalletMixin.createIdentity(
            'Org1MSP',
            certificate,
            privateKey
        );
        const gateway = await getConnectedWallet('Org1MSP', mixin);
        const result = await sendTransaction(gateway,{
            name: 'getAverageStudentGradeForSubjectInSemester',
            props: [studentEmail, semester, subjectName]
        });
        gateway.disconnect();
        res.status(201).json({ data: result });
    }
    catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const getAverageStudentGradeForSemester = async (req, res) => {
    const {certificate, privateKey, studentEmail, semester} = req.body;
    try {
        const mixin = X509WalletMixin.createIdentity(
            'Org1MSP',
            certificate,
            privateKey
        );
        const gateway = await getConnectedWallet('Org1MSP', mixin);
        const result = await sendTransaction(gateway,{
            name: 'getAverageStudentGradeForSemester',
            props: [studentEmail, semester]
        });
        gateway.disconnect();
        res.status(201).json({ data: result });
    }
    catch (e) {
        res.status(400).json({ message: e.message });
    }
};

router.post('/add', createStudentRecord);
router.post('/subject/add', addSubjectToStudentRecord);
router.post('/grade/add', addGradeToStudentRecord);
router.get('/', getStudentData);
router.get('/grades', getAllStudentGrades);
router.get('/grades/semester', getAllStudentGradesForSemester);
router.get('/grades/semester/average/themes', getAverageStudentGradeForSubjectInSemester);
router.get('/grades/semester/average', getAverageStudentGradeForSemester);

export default router;
