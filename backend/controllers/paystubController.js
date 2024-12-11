const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Paystub = require('../models/paystub');
const Employee = require('../models/employeeSchema');

const generatePaystub = async (req, res, next) => {
  const { hourlyRate, workedHours, employeeId } = req.body;

  if (!hourlyRate || !workedHours || hourlyRate <= 0 || workedHours <= 0 || !mongoose.Types.ObjectId.isValid(employeeId)) {
    return next(new HttpError('Invalid input values.', 422));
  }

  let employee;
  try {
    employee = await Employee.findById(employeeId);
    if (!employee) {
      return next(new HttpError('Employee not found.', 404));
    }
  } catch (err) {
    return next(new HttpError('Fetching employee failed, please try again later.', 500));
  }

  const PROVINCIAL_TAX_RATE = 0.0505; 
  const CPP_RATE = 0.0525
  const EI_RATE = 0.0164;            

  const grossPay = hourlyRate * workedHours;
  const provincialTax = grossPay * PROVINCIAL_TAX_RATE;
  const cpp = grossPay * CPP_RATE;
  const ei = grossPay * EI_RATE;

  const totalDeductions = provincialTax + cpp + ei;
  const netPay = grossPay - totalDeductions;


  const paystub = new Paystub({
    hourlyRate,
    workedHours,
    grossPay: grossPay.toFixed(2),
    deductions: {
      provincialTax: provincialTax.toFixed(2),
      cpp: cpp.toFixed(2),
      ei: ei.toFixed(2),
    },
    totalDeductions: totalDeductions.toFixed(2),
    netPay: netPay.toFixed(2),
    employee: employeeId
  });

  try {
    await paystub.save();
  } catch (err) {
    return next(new HttpError('Saving paystub failed, please try again later.', 500));
  }

  res.status(201).json({
    paystub,
    employee: {
      firstname: employee.firstname,
      lastname: employee.lastname,
      phonenumber: employee.phonenumber,
      email: employee.email,
    }
  });
};

const getAllPaystubs = async (req, res, next) => {
  let paystubs;
  try {
    paystubs = await Paystub.find().populate('employee');
  } catch (err) {
    return next(new HttpError('Fetching paystubs failed, please try again later.', 500));
  }

  res.status(200).json({ paystubs });
};


const getPaystubsByEmployeeId = async (req, res, next) => {
  const employeeId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    console.log('Invalid employee ID');
    return next(new HttpError('Invalid employee ID.', 422));
  }

  let employee;
  try {
    employee = await Employee.findById(employeeId);
    if (!employee) {
      console.log('Employee not found');
      return next(new HttpError('Employee not found.', 404));
    }
  } catch (err) {
    console.log('Error fetching employee:', err);
    return next(new HttpError('Fetching employee failed, please try again later.', 500));
  }

  let paystubs;
  try {
    paystubs = await Paystub.find({ employee: employeeId }).populate({
      path: 'employee',
      select: 'firstname lastname phonenumber email'
    });
    if (paystubs.length === 0) {
      console.log('No paystubs generated for this employee yet.')
      return res.status(200).json({ message: 'No paystubs have been generated for this employee.', paystubs: [] });
    }
    console.log('Paystubs:', paystubs);
  } catch (err) {
    console.log('Error fetching paystubs:', err);
    return next(new HttpError('Fetching paystubs failed, please try again later.', 500));
  }

  res.status(200).json({ paystubs });
};



module.exports = { generatePaystub, getPaystubsByEmployeeId, getAllPaystubs };
