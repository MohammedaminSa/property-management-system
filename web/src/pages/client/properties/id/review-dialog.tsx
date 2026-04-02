"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { useCreateReview } from "@/hooks/api/use-reviews";
import { Spinner } from "@/components/ui/spinner";

export default function ReviewDialog({
  reviewDialog,
  setReviewDialog,
  propertyId,
}: {
  reviewDialog: boolean;
  setReviewDialog: (open: boolean) => void;
  propertyId: string;
}) {
  const createReviewMutation = useCreateReview();

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  
  // Category ratings (1-5 scale)
  const [serviceRating, setServiceRating] = useState(0);
  const [cleanlinessRating, setCleanlinessRating] = useState(0);
  const [locationRating, setLocationRating] = useState(0);
  const [facilitiesRating, setFacilitiesRating] = useState(0);
  const [staffRating, setStaffRating] = useState(0);
  const [valueRating, setValueRating] = useState(0);

  // Hover states for category ratings
  const [serviceHover, setServiceHover] = useState(0);
  const [cleanlinessHover, setCleanlinessHover] = useState(0);
  const [locationHover, setLocationHover] = useState(0);
  const [facilitiesHover, setFacilitiesHover] = useState(0);
  const [staffHover, setStaffHover] = useState(0);
  const [valueHover, setValueHover] = useState(0);

  const handleSubmit = async () => {
    if (!reviewText.trim()) {
      toast.message("Review can't be empty!");
      return;
    }

    if (rating === 0) {
      toast.message("Please select a rating!");
      return;
    }

    await createReviewMutation.mutateAsync({
      content: reviewText,
      propertyId,
      rating,
      serviceRating,
      cleanlinessRating,
      locationRating,
      facilitiesRating,
      staffRating,
      valueRating,
    });

    setReviewText("");
    setRating(0);
    setServiceRating(0);
    setCleanlinessRating(0);
    setLocationRating(0);
    setFacilitiesRating(0);
    setStaffRating(0);
    setValueRating(0);
    setReviewDialog(false);
  };

  return (
    <Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
      <DialogContent className="sm:max-w-2xl sm:w-full z-[99999] max-h-[90vh] overflow-y-auto" style={{ zIndex: 99999 }}>
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Share your experience about this property.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-4">
          {/* Overall Star Rating */}
          <div className="flex flex-col gap-3">
            <Label className="text-sm font-medium text-foreground">
              Overall Rating
            </Label>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={32}
                    className={`cursor-pointer transition-all duration-200 ${
                      (hoverRating || rating) >= star
                        ? "text-yellow-400 fill-yellow-400 scale-110"
                        : "text-muted-foreground"
                    }`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <span
                  className={`text-base font-semibold ${
                    rating > 0 || hoverRating > 0
                      ? "text-yellow-500"
                      : "text-muted-foreground"
                  }`}
                >
                  {hoverRating || rating || 0}
                </span>
                <span className="text-muted-foreground">/ 5</span>
              </div>
            </div>
          </div>

          {/* Category Ratings */}
          <div className="border-t pt-4">
            <Label className="text-sm font-medium text-foreground mb-4 block">
              Rate by Category
            </Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Service */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm">Service</Label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      className={`cursor-pointer transition-all duration-200 ${
                        (serviceHover || serviceRating) >= star
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-muted-foreground"
                      }`}
                      onMouseEnter={() => setServiceHover(star)}
                      onMouseLeave={() => setServiceHover(0)}
                      onClick={() => setServiceRating(star)}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {serviceRating > 0 ? `${serviceRating}/5` : "Not rated"}
                  </span>
                </div>
              </div>

              {/* Cleanliness */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm">Cleanliness</Label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      className={`cursor-pointer transition-all duration-200 ${
                        (cleanlinessHover || cleanlinessRating) >= star
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-muted-foreground"
                      }`}
                      onMouseEnter={() => setCleanlinessHover(star)}
                      onMouseLeave={() => setCleanlinessHover(0)}
                      onClick={() => setCleanlinessRating(star)}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {cleanlinessRating > 0 ? `${cleanlinessRating}/5` : "Not rated"}
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm">Location</Label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      className={`cursor-pointer transition-all duration-200 ${
                        (locationHover || locationRating) >= star
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-muted-foreground"
                      }`}
                      onMouseEnter={() => setLocationHover(star)}
                      onMouseLeave={() => setLocationHover(0)}
                      onClick={() => setLocationRating(star)}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {locationRating > 0 ? `${locationRating}/5` : "Not rated"}
                  </span>
                </div>
              </div>

              {/* Facilities */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm">Facilities</Label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      className={`cursor-pointer transition-all duration-200 ${
                        (facilitiesHover || facilitiesRating) >= star
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-muted-foreground"
                      }`}
                      onMouseEnter={() => setFacilitiesHover(star)}
                      onMouseLeave={() => setFacilitiesHover(0)}
                      onClick={() => setFacilitiesRating(star)}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {facilitiesRating > 0 ? `${facilitiesRating}/5` : "Not rated"}
                  </span>
                </div>
              </div>

              {/* Staff */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm">Staff</Label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      className={`cursor-pointer transition-all duration-200 ${
                        (staffHover || staffRating) >= star
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-muted-foreground"
                      }`}
                      onMouseEnter={() => setStaffHover(star)}
                      onMouseLeave={() => setStaffHover(0)}
                      onClick={() => setStaffRating(star)}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {staffRating > 0 ? `${staffRating}/5` : "Not rated"}
                  </span>
                </div>
              </div>

              {/* Value for Money */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm">Value for Money</Label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      className={`cursor-pointer transition-all duration-200 ${
                        (valueHover || valueRating) >= star
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-muted-foreground"
                      }`}
                      onMouseEnter={() => setValueHover(star)}
                      onMouseLeave={() => setValueHover(0)}
                      onClick={() => setValueRating(star)}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {valueRating > 0 ? `${valueRating}/5` : "Not rated"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Review Text */}
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="review"
              className="text-sm font-medium text-foreground"
            >
              Your Review
            </Label>
            <Textarea
              id="review"
              placeholder="Write something..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={5}
              className="max-h-[400px]"
            />
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setReviewDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={createReviewMutation.isPending}
          >
            {createReviewMutation.isPending ? <Spinner /> : "Submit review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
