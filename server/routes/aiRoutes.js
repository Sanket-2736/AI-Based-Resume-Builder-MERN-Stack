import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { enhaceProfessionalSummary, enhanceJobDescription, uploadResume } from '../controllers/aiController.js';

const router = express.Router();

router.post('/enhance-pro-sum', protect, enhaceProfessionalSummary);
router.post('/enhance-job-desc', protect, enhanceJobDescription);
router.post('/upload-resume', protect, uploadResume);

export default router;