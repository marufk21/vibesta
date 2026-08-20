import express from 'express';
import {
  editProfile,
  followOrUnfollow,
  getFollowersList,
  getFollowingList,
  getProfile,
  getSuggestedUsers,
  login,
  logout,
  testLogin,
      register,
} from '../controllers/user_controller.js';
import isAuthenticated from '../middlewares/is_authenticated.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/test-login').get(testLogin);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated, getProfile);
router
  .route('/profile/edit')
  .post(isAuthenticated, upload.single('profilePhoto'), editProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/followers/:id').get(isAuthenticated, getFollowersList);
router.route('/following/:id').get(isAuthenticated, getFollowingList);
router.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow);

export default router;
