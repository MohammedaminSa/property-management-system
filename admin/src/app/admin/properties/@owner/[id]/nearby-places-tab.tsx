"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, MapPin } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  useGetNearbyPlacesQuery,
  useAddNearbyPlaceMutation,
  useUpdateNearbyPlaceMutation,
  useDeleteNearbyPlaceMutation
} from "@/hooks/api/use-nearby-places";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

const CATEGORY_OPTIONS = [
  { value: "ATTRACTION", label: "Attraction" },
  { value: "TRANSPORT", label: "Transport" },
  { value: "RESTAURANT", label: "Restaurant" },
];

const NearbyPlacesTab = ({ propertyId }: { propertyId: string }) => {
  const { data, isFetching, isError } = useGetNearbyPlacesQuery(propertyId);
  const addMutation = useAddNearbyPlaceMutation();
  const updateMutation = useUpdateNearbyPlaceMutation();
  const deleteMutation = useDeleteNearbyPlaceMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<{
    name: string;
    category: "ATTRACTION" | "TRANSPORT" | "RESTAURANT" | "";
    distance: string;
    icon: string;
  }>({
    name: "",
    category: "",
    distance: "",
    icon: "",
  });

  const nearbyPlaces = data?.data || [];

  // Group by category
  const groupedPlaces = {
    ATTRACTION: nearbyPlaces.filter((p: any) => p.category === "ATTRACTION"),
    TRANSPORT: nearbyPlaces.filter((p: any) => p.category === "TRANSPORT"),
    RESTAURANT: nearbyPlaces.filter((p: any) => p.category === "RESTAURANT"),
  };

  const handleOpenDialog = (place?: any) => {
    if (place) {
      setEditingId(place.id);
      setForm({
        name: place.name,
        category: place.category,
        distance: place.distance,
        icon: place.icon || "",
      });
    } else {
      setEditingId(null);
      setForm({ name: "", category: "", distance: "", icon: "" });
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.category || !form.distance) return;

    const dataToSend = {
      name: form.name,
      category: form.category as "ATTRACTION" | "TRANSPORT" | "RESTAURANT",
      distance: form.distance,
      icon: form.icon,
    };

    if (editingId) {
      updateMutation.mutate(
        { id: editingId, propertyId, data: dataToSend },
        { onSuccess: () => setDialogOpen(false) }
      );
    } else {
      addMutation.mutate(
        { propertyId, data: dataToSend },
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "ATTRACTION": return "bg-blue-100 text-blue-700";
      case "TRANSPORT": return "bg-green-100 text-green-700";
      case "RESTAURANT": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <TabsContent value="nearby-places">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Nearby Places</CardTitle>
              <CardDescription>Add nearby attractions, transport, and restaurants</CardDescription>
            </div>
            <Button size="sm" onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" /> Add Place
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : isError ? (
            <div className="text-center py-12 text-red-500">Failed to load nearby places.</div>
          ) : !nearbyPlaces.length ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No nearby places yet</h3>
              <p className="text-muted-foreground mb-4">Add nearby places to help guests explore the area</p>
              <Button variant="outline" onClick={() => handleOpenDialog()}>Add Place</Button>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedPlaces).map(([category, places]: [string, any[]]) => (
                places.length > 0 && (
                  <div key={category}>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Badge className={getCategoryColor(category)}>
                        {category.charAt(0) + category.slice(1).toLowerCase()}
                      </Badge>
                      <span className="text-muted-foreground">({places.length})</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {places.map((place: any) => (
                        <Card key={place.id} className="dark:bg-gray-800 dark:border-gray-700">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <CardTitle className="text-sm dark:text-gray-100">{place.name}</CardTitle>
                                  <p className="text-xs text-muted-foreground dark:text-gray-300 mt-1">{place.distance}</p>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(place)}>
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => setConfirmDeleteId(place.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Nearby Place" : "Add Nearby Place"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update the place details" : "Add a new nearby place"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="e.g. Bole International Airport"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(val) => setForm(f => ({ ...f, category: val as "ATTRACTION" | "TRANSPORT" | "RESTAURANT" }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Distance</Label>
              <Input
                placeholder="e.g. 2.5 km, 10 min walk"
                value={form.distance}
                onChange={e => setForm(f => ({ ...f, distance: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Icon (optional)</Label>
              <Input
                placeholder="e.g. Plane, Train, Utensils"
                value={form.icon}
                onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={!form.name || !form.category || !form.distance || addMutation.isPending || updateMutation.isPending}
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
            <AlertDialogTitle>Delete Nearby Place</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this nearby place.</AlertDialogDescription>
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

export default NearbyPlacesTab;
