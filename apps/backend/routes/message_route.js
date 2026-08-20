import express from 'express';
import isAuthenticated from '../middlewares/is_authenticated.js';
<<<<<<< HEAD:apps/backend/routes/message.route.js
import { getMessage, sendMessage } from '../controllers/message.controller.js';
=======
import { getMessage, sendMessage } from '../controllers/message_controller.js';
>>>>>>> 2682facc0a7f2697b0521bd6613db3248e315dfb:apps/backend/routes/message_route.js

const router = express.Router();

router.route('/send/:id').post(isAuthenticated, sendMessage);
router.route('/all/:id').get(isAuthenticated, getMessage);

export default router;
