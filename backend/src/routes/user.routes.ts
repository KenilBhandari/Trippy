import {Router} from "express";
import { googleLogin } from "../controllers/auth.controller";

const router = Router();

router.post("/auth/google", googleLogin);

export default router;
