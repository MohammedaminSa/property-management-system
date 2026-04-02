"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Clock, FileText } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  useGetPolicyQuery,
  useCreateOrUpdatePolicyMutation
} from "@/hooks/api/use-policies";

const PoliciesTab = ({ propertyId }: { propertyId: string }) => {
  const { data, isFetching, isError } = useGetPolicyQuery(propertyId);
  const saveMutation = useCreateOrUpdatePolicyMutation();

  const [form, setForm] = useState({
    checkInTime: "15:00",
    checkOutTime: "12:00",
    cancellationPolicy: "",
    childrenPolicy: "",
    petsPolicy: "",
    smokingPolicy: "",
    extraInfo: "",
  });

  useEffect(() => {
    if (data?.data) {
      setForm({
        checkInTime: data.data.checkInTime || "15:00",
        checkOutTime: data.data.checkOutTime || "12:00",
        cancellationPolicy: data.data.cancellationPolicy || "",
        childrenPolicy: data.data.childrenPolicy || "",
        petsPolicy: data.data.petsPolicy || "",
        smokingPolicy: data.data.smokingPolicy || "",
        extraInfo: data.data.extraInfo || "",
      });
    }
  }, [data]);

  const handleSave = () => {
    saveMutation.mutate({ propertyId, data: form });
  };

  return (
    <TabsContent value="policies">
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">Property Policies</CardTitle>
          <CardDescription className="dark:text-gray-300">
            Set check-in/check-out times and property policies
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : isError ? (
            <div className="text-center py-12 text-red-500">Failed to load policies.</div>
          ) : (
            <div className="space-y-6">
              {/* Check-in/Check-out Times */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="dark:text-gray-100">Check-in Time</Label>
                  <Input
                    type="time"
                    value={form.checkInTime}
                    onChange={e => setForm(f => ({ ...f, checkInTime: e.target.value }))}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="dark:text-gray-100">Check-out Time</Label>
                  <Input
                    type="time"
                    value={form.checkOutTime}
                    onChange={e => setForm(f => ({ ...f, checkOutTime: e.target.value }))}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="space-y-2">
                <Label className="dark:text-gray-100">Cancellation Policy</Label>
                <Textarea
                  rows={3}
                  placeholder="Describe your cancellation policy..."
                  value={form.cancellationPolicy}
                  onChange={e => setForm(f => ({ ...f, cancellationPolicy: e.target.value }))}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
              </div>

              {/* Children Policy */}
              <div className="space-y-2">
                <Label className="dark:text-gray-100">Children Policy</Label>
                <Textarea
                  rows={2}
                  placeholder="Describe your policy regarding children..."
                  value={form.childrenPolicy}
                  onChange={e => setForm(f => ({ ...f, childrenPolicy: e.target.value }))}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
              </div>

              {/* Pets Policy */}
              <div className="space-y-2">
                <Label className="dark:text-gray-100">Pets Policy</Label>
                <Select 
                  value={form.petsPolicy} 
                  onValueChange={(val) => setForm(f => ({ ...f, petsPolicy: val }))}
                >
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                    <SelectValue placeholder="Select pets policy" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                    <SelectItem value="ALLOWED" className="dark:text-gray-100">Allowed</SelectItem>
                    <SelectItem value="NOT_ALLOWED" className="dark:text-gray-100">Not Allowed</SelectItem>
                    <SelectItem value="CONTACT_PROPERTY" className="dark:text-gray-100">Contact Property</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Smoking Policy */}
              <div className="space-y-2">
                <Label className="dark:text-gray-100">Smoking Policy</Label>
                <Select 
                  value={form.smokingPolicy} 
                  onValueChange={(val) => setForm(f => ({ ...f, smokingPolicy: val }))}
                >
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                    <SelectValue placeholder="Select smoking policy" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                    <SelectItem value="ALLOWED" className="dark:text-gray-100">Allowed</SelectItem>
                    <SelectItem value="NOT_ALLOWED" className="dark:text-gray-100">Not Allowed</SelectItem>
                    <SelectItem value="DESIGNATED_AREAS" className="dark:text-gray-100">Designated Areas Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Extra Information */}
              <div className="space-y-2">
                <Label className="dark:text-gray-100">Extra Information</Label>
                <Textarea
                  rows={3}
                  placeholder="Any additional policy information..."
                  value={form.extraInfo}
                  onChange={e => setForm(f => ({ ...f, extraInfo: e.target.value }))}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSave} 
                  disabled={saveMutation.isPending}
                  className="min-w-[120px]"
                >
                  {saveMutation.isPending ? <Spinner /> : "Save Policy"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default PoliciesTab;
