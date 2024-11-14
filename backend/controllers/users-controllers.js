const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password'); // Exclude the password field
  } catch (err) {
    const error = new HttpError('Fetching users failed, please try again later.', 500);
    return next(error);
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { name, email, password, role } = req.body;

  const createdUser = new User({
    name,
    email,
    password,
    role
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again later.', 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Logging in failed, please try again later.', 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError('Invalid credentials, could not log you in.', 401);
    return next(error);
  }

  if (existingUser.password !== password) {
    const error = new HttpError('Invalid credentials, could not log you in.', 401);
    return next(error);
  }

  res.json({ message: 'Logged in!' });
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


exports.deleteemployee = deleteemployee;
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;