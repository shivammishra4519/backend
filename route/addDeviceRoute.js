const express = require('express');
const router = express.Router();
const { addDevice, viewDevices,updateDetails,viewReport,viewDeviceImei } = require('../controler/addDeviceControler');

// Add a new device with image upload
router.post('/addDevice',  addDevice);
router.post('/viewdevice',  viewDevices);
router.post('/update',updateDetails  );
router.post('/viewreport',viewReport  );
router.post('/viewdevice/imei',viewDeviceImei  );
// router.post('/addDevice', upload.single('bill'), addDevice);

module.exports = router;
