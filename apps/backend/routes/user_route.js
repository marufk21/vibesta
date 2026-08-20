import express from 'express';
import {
  editProfile,
  followOrUnfollow,
  getProfile,
  getSuggestedUsers,
  login,
  logout,
  register,
<<<<<<< HEAD:apps/backend/routes/user.route.js
} from '../controllers/user.controller.js';
=======
} from '../controllers/user_controller.js';
>>>>>>> 2682facc0a7f2697b0521bd6613db3248e315dfb:apps/backend/routes/user_route.js
import isAuthenticated from '../middlewares/is_authenticated.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated, getProfile);
router
  .route('/profile/edit')
  .post(isAuthenticated, upload.single('profilePhoto'), editProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow);

export default router;
