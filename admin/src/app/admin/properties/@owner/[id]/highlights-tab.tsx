"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Lightbulb } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  useGetHighlightsQuery,
  useAddHighlightMutation,
  useUpdateHighlightMutation,
  useDeleteHighlightMutation
} from "@/hooks/api/use-highlights";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ICON_OPTIONS = [
  { value: "Bus", label: "Bus" },
  { value: "Coffee", label: "Coffee" },
  { value: "Clock", label: "Clock" },
  { value: "Dumbbell", label: "Dumbbell" },
  { value: "Wifi", label: "Wifi" },
  { value: "Car", label: "Car" },
  { value: "Utensils", label: "Utensils" },
  { value: "Shield", label: "Shield" },
  { value: "Users", label: "Users" },
  { value: "MapPin", label: "MapPin" },
];

const HighlightsTab = ({ propertyId }: { propertyId: string }) => {
  const { data, isFetching, isError } = useGetHighlightsQuery(propertyId);
  const addMutation = useAddHighlightMutation();
  const updateMutation = useUpdateHighlightMutation();
  const deleteMutation = useDeleteHighlightMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    icon: "",
    title: "",
    description: "",
  });

  const highlights = data?.data || [];

  const handleOpenDialog = (highlight?: any) => {
    if (highlight) {
      setEditingId(highlight.id);
      setForm({
        icon: highlight.icon,
        title: highlight.title,
        description: highlight.description,
      });
    } else {
      setEditingId(null);
      setForm({ icon: "", title: "", description: "" });
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.icon || !form.title || !form.description) return;

    if (editingId) {
      updateMutation.mutate(
        { id: editingId, propertyId, data: form },
        { onSuccess: () => setDialogOpen(false) }
      );
    } else {
      addMutation.mutate(
        { propertyId, data: form },
        { onSuccess: () => setDialogOpen(false) }
      );
    }
  };

  const handleDelete = () => {
    if (confirmDeleteId) {
      deleteMutation.mutate(
        { id: confirmDeleteId, propertyId },
        { onSuccess: () => setConfirmDeleteId(null) }
      );
    }
  };

  return (
    <TabsContent value="highlights">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Highlights</CardTitle>
              <CardDescription>Showcase key features of your property</CardDescription>
            </div>
            <Button size="sm" onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" /> Add Highlight
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : isError ? (
            <div className="text-center py-12 text-red-500">Failed to load highlights.</div>
          ) : !highlights.length ? (
            <div className="text-center py-12">
              <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No highlights yet</h3>
              <p className="text-muted-foreground mb-4">Add highlights to showcase your property's best features</p>
              <Button variant="outline" onClick={() => handleOpenDialog()}>Add Highlight</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {highlights.map((highlight: any) => (
                <Card key={highlight.id} className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-md">
                          <span className="text-sm font-medium">{highlight.icon}</span>
                        </div>
                        <div>
                          <CardTitle className="text-base dark:text-gray-100">{highlight.title}</CardTitle>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(highlight)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setConfirmDeleteId(highlight.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground dark:text-gray-300">{highlight.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Highlight" : "Add Highlight"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update the highlight details" : "Add a new highlight to showcase your property"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select value={form.icon} onValueChange={(val) => setForm(f => ({ ...f, icon: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="e.g. Free Airport Shuttle"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                rows={3}
                placeholder="Describe this highlight..."
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={!form.icon || !form.title || !form.description || addMutation.isPending || updateMutation.isPending}
            >
              {(addMutation.isPending || updateMutation.isPending) ? <Spinner /> : editingId ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!confirmDeleteId} onOpenChange={(o) => !o && setConfirmDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Highlight</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this highlight.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TabsContent>
  );
};

export default HighlightsTab;
