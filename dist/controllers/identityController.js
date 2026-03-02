"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identify = void 0;
const identityService_1 = require("../services/identityService");
const identify = async (req, res, next) => {
    try {
        const { email, phoneNumber } = req.body;
        // Both fields can be present, but at least one must be provided.
        if (!email && !phoneNumber) {
            res.status(400).json({ error: 'Either email or phoneNumber must be provided.' });
            return;
        }
        const result = await (0, identityService_1.reconcileIdentity)(email ? String(email) : null, phoneNumber ? String(phoneNumber) : null);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.identify = identify;
