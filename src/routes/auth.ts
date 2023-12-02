import { Request, Response, Router } from "express";
import {
  authAccessController,
  getAllUsersController,
  localLoginController,
  localRegisterController,
  logoutController,
  verifyRefreshTokenController,
} from "../controllers/auth.controller";

const router = Router();

router.post("/local-register", localRegisterController);
router.post("/local-authenticate", authAccessController);

router.post("/local-verify-refrehtoken", verifyRefreshTokenController);

router.post("/local-signin", localLoginController);
router.post("/local-signout", logoutController);

// router.get('/users',getAllUsersController);

export { router as AuthRouter };
