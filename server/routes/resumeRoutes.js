import express from 'express';
import protect from '../middleware/authMiddleware.js';
import upload from '../configs/multer.js';
import {
  createResume,
  deleteResume,
  getPublicResumeById,
  getResumeById,
  updateResume
} from '../controllers/ResumeController.js';

const router = express.Router();

router.post('/create', protect, createResume);
router.put('/update', protect, upload.single('image'), updateResume);
router.delete('/delete/:resumeId', protect, deleteResume);
router.get('/get/:resumeId', protect, getResumeById);
router.get('/public/:resumeId', getPublicResumeById);

export default router;
