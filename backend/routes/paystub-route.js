const express = require('express');
const { generatePaystub, getAllPaystubs, getPaystubsByEmployeeId } = require('../controllers/paystubController');
const paystubController = require('../controllers/paystubController');
const router = express.Router();

router.post('/', generatePaystub);
router.get('/', getAllPaystubs);  
router.get('/employee/:id', getPaystubsByEmployeeId);
router.get('/paystub/employee/:id', paystubController.getPaystubsByEmployeeId);

module.exports = router;

