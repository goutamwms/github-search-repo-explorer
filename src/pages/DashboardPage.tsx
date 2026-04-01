import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Trash2, Edit2, Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { notesApi, type Note } from "@/services/api";
import { formatDate } from "@/helper";

export function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({ description: "", tags: "" });
  const [editNote, setEditNote] = useState({ description: "", tags: "" });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user]);

  const loadNotes = async () => {
    try {
      const { notes } = await notesApi.getAll();
      setNotes(notes);
    } catch (error) {
      console.error("Failed to load notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.description.trim()) return;

    setSaving(true);
    try {
      const { note } = await notesApi.create(newNote.description, newNote.tags);
      setNotes([note, ...notes]);
      setNewNote({ description: "", tags: "" });
    } catch (error) {
      console.error("Failed to create note:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateNote = async (id: string) => {
    if (!editNote.description.trim()) return;

    setSaving(true);
    try {
      const { note } = await notesApi.update(
        id,
        editNote.description,
        editNote.tags,
      );
      setNotes(notes.map((n) => (n.id === id ? note : n)));
      setEditingId(null);
      setEditNote({ description: "", tags: "" });
    } catch (error) {
      console.error("Failed to update note:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await notesApi.delete(id);
      setNotes(notes.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const handleExport = async () => {
    try {
      const csv = await notesApi.exportCsv();
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "notes.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export notes:", error);
    }
  };

  const startEditing = (note: Note) => {
    setEditingId(note.id);
    setEditNote({
      description: note.description,
      tags: note.tags.join(", "),
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditNote({ description: "", tags: "" });
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || user?.email}
          </p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Note</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateNote} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Input
                id="description"
                placeholder="Enter your note..."
                value={newNote.description}
                onChange={(e) =>
                  setNewNote({ ...newNote, description: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium">
                Tags (comma separated)
              </label>
              <Input
                id="tags"
                placeholder="react, typescript, tutorial"
                value={newNote.tags}
                onChange={(e) =>
                  setNewNote({ ...newNote, tags: e.target.value })
                }
              />
            </div>
            <Button type="submit" disabled={saving} className="gap-2">
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add Note
            </Button>
          </form>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-4">
        Your Notes ({notes.length})
      </h2>

      {notes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No notes yet. Create your first note above!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Card key={note.id} className="flex flex-col">
              {editingId === note.id ? (
                <CardContent className="pt-6 space-y-4 flex-1">
                  <textarea
                    className="w-full min-h-[100px] p-2 rounded-md border border-input bg-background text-sm"
                    value={editNote.description}
                    onChange={(e) =>
                      setEditNote({ ...editNote, description: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Tags (comma separated)"
                    value={editNote.tags}
                    onChange={(e) =>
                      setEditNote({ ...editNote, tags: e.target.value })
                    }
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleUpdateNote(note.id)}
                      disabled={saving}
                      className="gap-1"
                    >
                      <Save className="h-3 w-3" /> Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={cancelEditing}
                      className="gap-1"
                    >
                      <X className="h-3 w-3" /> Cancel
                    </Button>
                  </div>
                </CardContent>
              ) : (
                <>
                  <CardContent className="flex-1">
                    <p className="whitespace-pre-wrap pt-6">
                      {note.description}
                    </p>
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {note.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-3">
                      {formatDate(note.created_at)}
                    </p>
                  </CardContent>
                  <div className="flex gap-2 p-4 pt-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEditing(note)}
                      className="gap-1"
                    >
                      <Edit2 className="h-3 w-3" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteNote(note.id)}
                      className="gap-1 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </Button>
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
