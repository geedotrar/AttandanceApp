import { Router } from "express";
import index from "../controllers/indexController";

const router = Router();

router.get("/", index.kegiatanCtrl.findAll);
router.get("/:id", index.kegiatanCtrl.findOne);
router.post("/", index.kegiatanCtrl.create);
router.put("/:id", index.kegiatanCtrl.update);

export default router;
