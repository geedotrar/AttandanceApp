import { Router } from "express";
import index from "../controllers/indexController";
import { verifyUser, superadminOnly } from "../middleware/authUser";

const router = Router();

const canUpdateUser = (req, res, next) => {
  if (req.role === "superadmin" || req.role === "admin" || req.userId === parseInt(req.params.id)) {
    return next();
  }
  return res.status(403).json({ msg: "Akses terlarang. Anda hanya dapat memperbarui profil Anda sendiri." });
};

router.get("/", verifyUser, index.userCtrl.findAll);
router.get("/:id", verifyUser, index.userCtrl.findOne);
router.post("/", verifyUser, superadminOnly, index.userCtrl.create);
router.put("/:id", verifyUser, canUpdateUser, index.userCtrl.update);
router.delete("/:id", verifyUser, superadminOnly, index.userCtrl.deleted);

export default router;

