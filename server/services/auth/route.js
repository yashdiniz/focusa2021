const { secret } = require('../../config.js');
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

router.use(cookieParser());
router.use(session({ secret }));

