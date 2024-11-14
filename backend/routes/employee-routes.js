const express = require('express');
const { check } = require('express-validator');
const employeesControllers = require('../controllers/employeeControllers.js');

const router = express.Router();

// Endpoints
router.get('/:employeeId', employeesControllers.getemployeeById);
router.post(
    "/",
    [
        check("firstname").not().isEmpty().isLength({ min: 3 }),
        check("lastname").not().isEmpty().isLength({ min: 2 }),
        check("phonenumber").not().isEmpty(),
        check("email").not().isEmpty().isEmail(),
        check("sinnumber").optional().isInt(),
        check("bankaccount").optional().isInt(),
        check("transit").optional().isInt(),
        check("hourlyrate").optional().isFloat({ gt: 0 }),
        check("workedhours").optional().isFloat({ gt: 0 }),
        check("taxes").optional().isFloat({ gt: 0 })
    ],
    employeesControllers.createemployee
);

// Add PATCH route to update employee by ID
router.patch(
    '/:employeeId',
    [
        check("firstname").optional().isLength({ min: 3 }),
        check("lastname").optional().isLength({ min: 2 }),
        check("phonenumber").optional().isInt(),
        check("email").optional().isEmail(),
        check("sinnumber").optional().isInt(),
        check("bankaccount").optional().isInt(),
        check("transit").optional().isInt(),
        check("hourlyrate").optional().isFloat({ gt: 0 }),
        check("workedhours").optional().isFloat({ gt: 0 }),
        check("taxes").optional().isFloat({ gt: 0 })
    ],
    employeesControllers.updateemployee
);

// Add DELETE route to delete employee by ID
router.delete('/:employeeId', employeesControllers.deleteemployee);

module.exports = router;
