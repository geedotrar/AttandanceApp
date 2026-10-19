import { Router } from "express";
import index from "../controllers/indexController";

const router = Router();

router.get("/me", index.authCtrl.Me);
router.post("/login", index.authCtrl.Login);
router.delete("/logout", index.authCtrl.logOut);

export default router;
