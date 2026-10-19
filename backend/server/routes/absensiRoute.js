// absensiRoute
import { Router } from "express";
import index from "../controllers/indexController";
import { verifyUser } from "../middleware/authUser";
const router = Router();

router.get("/", verifyUser, index.absensiCtrl.findAll);
router.get("/:id", verifyUser, index.absensiCtrl.findOne);
router.post("/", verifyUser, index.absensiCtrl.create);
router.put("/:id", verifyUser, index.absensiCtrl.update);
router.delete("/:id", verifyUser, index.absensiCtrl.deleted);
router.get("/user/:id", verifyUser, index.absensiCtrl.findOneByUserId);

export default router;
