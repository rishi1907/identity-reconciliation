"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const identityController_1 = require("../controllers/identityController");
const router = (0, express_1.Router)();
router.post('/identify', identityController_1.identify);
exports.default = router;
