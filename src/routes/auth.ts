import { Request, Response, Router } from "express";
import { authenticate, getAllUsers, localLogin, localRegister, logout  } from "../controllers/auth.controller";
import { AuthRequest } from "../types/AuthRequest.Interface";

const router = Router();

router.post("/local-register",localRegister)
router.post("/local-authenticate",authenticate)
router.post("/local-signin",localLogin)
router.post("/local-signout",logout) 
// router.get("/verifyToken",verifyToken,(req:AuthRequest,res:Response)=>{
//     return res.json({
//         "response":req.user
//     })
// })

router.get('/users',getAllUsers);

export {
    router as AuthRouter
}