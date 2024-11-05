import express from 'express';
import { currentUser } from '@powidl2024/common__powidl2024';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
