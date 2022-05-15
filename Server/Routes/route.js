import express from 'express'
import { getPayment,paytmCallback } from '../controller/controller.js';
const router = express.Router();


router.post("/payment",getPayment );
router.post("/callback",paytmCallback );

export {router};

