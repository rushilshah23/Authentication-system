import { Request, Response, Router } from "express";
import {
  authAccessContoller,
  getAllUsersContoller,
  localLoginContoller,
  localRegisterContoller,
  logoutContoller,
  verifyRefreshTokenContoller,
} from "../controllers/auth.controller";

const router = Router();

router.post("/local-register", localRegisterContoller);
router.post("/local-authenticate", authAccessContoller);

router.post("/local-verify-refrehtoken", verifyRefreshTokenContoller);

router.post("/local-signin", localLoginContoller);
router.post("/local-signout", logoutContoller);

// router.get('/users',getAllUsersContoller);

export { router as AuthRouter };
