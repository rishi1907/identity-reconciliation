import { Router } from 'express';
import { identify } from '../controllers/identityController';

const router = Router();

router.get('/', (req, res) => {
    res.send('Identity Reconciliation Service is running!');
});

router.post('/identify', identify);

export default router;
