import { Router } from "express";
import {
  signup,
  login,
  githubCallback,
  logout,
  getMe,
} from "../controllers/auth";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/github", (_req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `${process.env.BACKEND_URL}/api/auth/github/callback`;
  const scope = "user:email";
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`,
  );
});
router.get("/github/callback", githubCallback);
router.post("/logout", logout);
router.get("/me", authenticateToken, getMe);

export default router;
