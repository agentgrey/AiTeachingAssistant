const express = require('express');
const router = express.Router();

const authRoute = require('./authRoute');
const assignmentRoute = require('./assignmentRoute');

router.use('/auth', authRoute);
router.use('/assignment', assignmentRoute);

module.exports = router;