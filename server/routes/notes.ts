import { Router } from "express";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  exportNotesCsv,
} from "../controllers/notes";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.use(authenticateToken);

router.get("/notes", getNotes);
router.post("/notes", createNote);
router.put("/notes/:id", updateNote);
router.delete("/notes/:id", deleteNote);
router.get("/notes/export", exportNotesCsv);

export default router;
