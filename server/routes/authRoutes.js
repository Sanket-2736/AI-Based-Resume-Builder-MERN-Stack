import express from 'express';
const router = express.Router();
import {
    getUserById, getUserResume, loginUser, registeredUser
} from '../controllers/UserController.js'
import protect from '../middleware/authMiddleware.js';

router.post('/register', registeredUser);
router.post('/login', loginUser);
router.get('/data', protect, getUserById);
router.get('/resumes', protect, getUserResume);

export default router;