import { Response } from "express";
import { prisma } from "../db";
import { AuthRequest } from "../middleware/auth";

export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const notes = await prisma.note.findMany({
      where: { user_id: req.userId },
      orderBy: { created_at: "desc" },
    });

    res.json({ notes });
  } catch (error) {
    console.error("GetNotes error:", error);
    res.status(500).json({ error: "Failed to get notes" });
  }
};

export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const { description, tags } = req.body;

    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    const tagsArray = tags
      ? Array.isArray(tags)
        ? tags
        : tags
            .split(",")
            .map((t: string) => t.trim())
            .filter(Boolean)
      : [];

    const note = await prisma.note.create({
      data: {
        description,
        tags: tagsArray,
        user_id: req.userId!,
      },
    });

    res.json({ note });
  } catch (error) {
    console.error("CreateNote error:", error);
    res.status(500).json({ error: "Failed to create note" });
  }
};

export const updateNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { description, tags } = req.body;

    const existingNote = await prisma.note.findFirst({
      where: { id, user_id: req.userId },
    });

    if (!existingNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    const tagsArray = tags
      ? Array.isArray(tags)
        ? tags
        : tags
            .split(",")
            .map((t: string) => t.trim())
            .filter(Boolean)
      : existingNote.tags;

    const note = await prisma.note.update({
      where: { id },
      data: {
        description: description || existingNote.description,
        tags: tagsArray,
      },
    });

    res.json({ note });
  } catch (error) {
    console.error("UpdateNote error:", error);
    res.status(500).json({ error: "Failed to update note" });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existingNote = await prisma.note.findFirst({
      where: { id, user_id: req.userId },
    });

    if (!existingNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    await prisma.note.delete({
      where: { id },
    });

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("DeleteNote error:", error);
    res.status(500).json({ error: "Failed to delete note" });
  }
};

export const exportNotesCsv = async (req: AuthRequest, res: Response) => {
  try {
    const notes = await prisma.note.findMany({
      where: { user_id: req.userId },
      orderBy: { created_at: "desc" },
    });

    const csvHeader = "ID,Description,Tags,Created At,Updated At\n";
    const csvRows = notes
      .map((note) => {
        const desc = note.description.replace(/"/g, '""');
        return `"${note.id}","${desc}","${note.tags.join(", ")}","${note.created_at.toISOString()}","${note.updated_at.toISOString()}"`;
      })
      .join("\n");

    const csv = csvHeader + csvRows;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=notes.csv");
    res.send(csv);
  } catch (error) {
    console.error("ExportNotesCsv error:", error);
    res.status(500).json({ error: "Failed to export notes" });
  }
};
