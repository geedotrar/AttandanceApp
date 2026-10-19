import { Router } from "express";
import index from "../controllers/indexController";
import { verifyUser, adminOnly } from "../middleware/authUser";

const router = Router();

router.get("/", verifyUser, adminOnly, index.userCtrl.findAll);
router.get("/:id", verifyUser, adminOnly, index.userCtrl.findOne);
router.post("/", verifyUser, adminOnly, index.userCtrl.create);
router.put("/:id", verifyUser, adminOnly, index.userCtrl.update);
router.delete("/:id", verifyUser, adminOnly, index.userCtrl.deleted);

export default router;
