import { RequestHandler } from 'express';
import { reconcileIdentity } from '../services/identityService';

export const identify: RequestHandler = async (req, res, next) => {
    const { email, phoneNumber } = req.body || {};

    // Both fields can be present, but at least one must be provided.
    if (!email && !phoneNumber) {
        res.status(400).json({ error: 'Either email or phoneNumber must be provided.' });
        return;
    }

    const result = await reconcileIdentity(
        email ? String(email) : null,
        phoneNumber ? String(phoneNumber) : null
    );

    res.status(200).json(result);
};
