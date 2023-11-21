import { Request, Response, Router } from "express";
import { authAccessContoller, getAllUsersContoller, localLoginContoller, localRegisterContoller, logoutContoller, verifyRefreshTokenContoller  } from "../controllers/auth.controller";
import { AuthRequest } from "../types/AuthRequest.Interface";

const router = Router();

router.post("/",(req,res)=>{
    console.log("In simple auth post ")
    return res.status(200).json("Succeess")
})
router.post("/local-register",localRegisterContoller)
// router.post("/local-authenticate",authenticate)
router.post("/local-authenticate",authAccessContoller)

router.post("/local-verify-refrehtoken",verifyRefreshTokenContoller);

router.post("/local-signin",localLoginContoller)
router.post("/local-signout",logoutContoller) 
// router.get("/verifyToken",verifyToken,(req:AuthRequest,res:Response)=>{
//     return res.json({
//         "response":req.user
//     })
// })

router.get('/users',getAllUsersContoller);


export {
    router as AuthRouter
}