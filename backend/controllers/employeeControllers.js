const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const Employee = require('../models/employeeSchema');
const mongoose = require('mongoose');

const getemployeeById = async (req, res, next) => {
    const employeeId = req.params.employeeId;

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
        const error = new HttpError('Invalid employee ID format. Sorry, could not find an employee for the ID you provided.', 400);
        return next(error);
    }

    let employee;
    try {
        employee = await Employee.findById(employeeId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not retrieve employee.', 500);
        return next(error);
    }

    if (!employee) {
        const error = new HttpError('Could not find an employee for the ID you provided.', 404);
        return next(error);
    }

    res.json({ employee: employee.toObject({ getters: true }) });
};

const createemployee = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid input, please check your data.', 422));
    }

    const { firstname, lastname, phonenumber, email, sinnumber, bankaccount, transit, hourlyrate, workedhours, taxes } = req.body;
    const createdemployee = new Employee({
        firstname,
        lastname,
        phonenumber,
        email,
        sinnumber,
        bankaccount,
        transit,
        hourlyrate,
        workedhours,
        taxes,
    });

    try {
        await createdemployee.save();
    } catch (err) {
        const error = new HttpError('Creating employee failed, try again.', 500);
        return next(error);
    }

    res.status(201).json({ employee: createdemployee });
};

const updateemployee = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid input, please check your data.', 422));
    }

    const employeeId = req.params.employeeId;
    const { firstname, lastname, phonenumber, email, sinnumber, bankaccount, transit, hourlyrate, workedhours, taxes } = req.body;

    let employee;
    try {
        employee = await Employee.findById(employeeId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update employee.', 500);
        return next(error);
    }

    if (!employee) {
        const error = new HttpError('Could not find an employee for the ID you provided.', 404);
        return next(error);
    }

    employee.firstname = firstname !== undefined ? firstname : employee.firstname;
    employee.lastname = lastname !== undefined ? lastname : employee.lastname;
    employee.phonenumber = phonenumber !== undefined ? phonenumber : employee.phonenumber;
    employee.email = email !== undefined ? email : employee.email;
    employee.sinnumber = sinnumber !== undefined ? sinnumber : employee.sinnumber;
    employee.bankaccount = bankaccount !== undefined ? bankaccount : employee.bankaccount;
    employee.transit = transit !== undefined ? transit : employee.transit;
    employee.hourlyrate = hourlyrate !== undefined ? hourlyrate : employee.hourlyrate;
    employee.workedhours = workedhours !== undefined ? workedhours : employee.workedhours;
    employee.taxes = taxes !== undefined ? taxes : employee.taxes;

    try {
        await employee.save();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update employee.', 500);
        return next(error);
    }

    res.status(200).json({ employee: employee.toObject({ getters: true }) });
};

const deleteemployee = async (req, res, next) => {
    const employeeId = req.params.employeeId;
    console.log('Received request to delete employee with ID:', employeeId);
  
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      console.log('Invalid employee ID format:', employeeId);
      const error = new HttpError('Invalid employee ID format. Sorry, could not find an employee for the ID you provided.', 400);
      return next(error);
    }
  
    let employee;
    try {
      employee = await Employee.findById(employeeId);
      if (!employee) {
        console.log('Employee not found for ID:', employeeId);
        const error = new HttpError('Could not find an employee for the ID you provided.', 404);
        return next(error);
      }
    } catch (err) {
      console.log('Error finding employee:', err);
      const error = new HttpError('Something went wrong, could not delete employee.', 500);
      return next(error);
    }
  
    try {
      await Employee.deleteOne({ _id: employeeId });
      console.log('Employee deleted successfully:', employeeId);
    } catch (err) {
      console.log('Error deleting employee:', err);
      const error = new HttpError('Something went wrong, could not delete employee.', 500);
      return next(error);
    }
  
    res.status(200).json({ message: 'Employee deleted successfully.' });
  };
  

exports.getemployeeById = getemployeeById;
exports.createemployee = createemployee;
exports.updateemployee = updateemployee;
exports.deleteemployee = deleteemployee;
