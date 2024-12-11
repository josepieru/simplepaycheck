const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const User = require("../models/user");
const { Types } = require('mongoose');
const Employee = require('../models/employeeSchema'); 

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return next(new HttpError("Fetching users failed, Please try again later.", 500));
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid input passed, please check your data.", 422));
  }

  const { name, email, role, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Signing up failed, Please try again later.", 500));
  }

  if (existingUser) {
    return next(new HttpError("User already exists, please login instead.", 422));
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new HttpError("Could not create user, please try again.", 500));
  }

  const createdUser = new User({
    name,
    email,
    role,
    password: hashedPassword
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign({ userId: createdUser.id, email: createdUser.email }, "supersecret_dont_share", { expiresIn: "1h" });
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again", 500);
    return next(error);
  }

  res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Logging in failed, Please try again later.", 500));
  }

  if (!existingUser) {
    return next(new HttpError("Invalid Credentials, Could not log you in!", 403));
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return next(new HttpError("Could not log you in, please check your credentials and try again.", 500));
  }

  if (!isValidPassword) {
    return next(new HttpError("Invalid Credentials, Could not log you in!", 403));
  }

  let token;
  try {
    token = jwt.sign({ userId: existingUser.id, email: existingUser.email }, "supersecret_dont_share", { expiresIn: "1h" });
  } catch (err) {
    const error = new HttpError("Logging in failed, please try again", 500);
    return next(error);
  }

  res.json({ userId: existingUser.id, email: existingUser.email, token: token });
};

const deleteemployee = async (req, res, next) => {
  const employeeId = req.params.employeeId;
  console.log('Received request to delete employee with ID:', employeeId);

  if (!Types.ObjectId.isValid(employeeId)) {
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

exports.deleteemployee = deleteemployee;
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
