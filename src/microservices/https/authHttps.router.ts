import { Request, Response, Router } from "express";
import {
  authAccessController,

  verifyRefreshTokenController,
} from "./authHttps.controller";

const router = Router();

router.post("/local-authenticate", authAccessController);

router.post("/local-verify-refrehtoken", verifyRefreshTokenController);



// router.get('/users',getAllUsersController);

export { router as AuthMicroServiceRouter };
