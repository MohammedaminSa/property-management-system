import { useState, useRef, useEffect } from "react";
import FormatedAmount from "@/components/shared/formatted-amount";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { GuestDetailHouseResponse } from "@/hooks/api/types/property.types";
import { useNavigate } from "react-router-dom";
import PropertyDetails from "./location";
import ReviewsContainer from "./reviews-container";
import { useGetHighlights } from "@/hooks/api/use-highlights";
import { useGetNearbyPlaces } from "@/hooks/api/use-nearby-places";
import { useGetCategoryRatingsQuery } from "@/hooks/api/use-reviews";
import { useGetPolicy } from "@/hooks/api/use-policies";
import {
  ArrowLeft, Bath, BedDouble, MapPin, Phone, Mail,
  Wifi, Car, UtensilsCrossed, Users, Heart,
  ChevronRight, CheckCircle2, Image as ImageIcon, X, ChevronLeft,
  Plane, CarFront, Coffee, Clock, ShoppingBag, Store, Utensils, Building2, Train, Bus, Dumbbell, Ticket, Coffee as Breakfast, Monitor
} from "lucide-react";
import { FaStar } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface Props { data: GuestDetailHouseResponse; }

const NAV_TABS = ["Overview", "Rooms", "Trip recommendations", "Facilities", "Reviews", "Location", "Policies"];
const PANEL_TABS = ["Facilities", "Reviews", "Location", "Policies"];

const DataContainer = ({ data }: Props) => {
  const property = data.data;
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [stickyNav, setStickyNav] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState<"all" | "rooms" | "property" | "nearby">("all");
  const [galleryStartIdx, setGalleryStartIdx] = useState(0);
  const [panelTab, setPanelTab] = useState<string | null>(null);
  const [nearbyTab, setNearbyTab] = useState<"attractions" | "transport" | "restaurants">("attractions");
  const heroRef = useRef<HTMLDivElement>(null);

  // Fetch highlights, nearby places, and category ratings
  const { data: highlightsData } = useGetHighlights(property.id);
  const { data: nearbyPlacesData } = useGetNearbyPlaces(property.id);
  const { data: categoryRatingsData } = useGetCategoryRatingsQuery({ propertyId: property.id });
  const { data: policyData } = useGetPolicy(property.id);

  const highlights = highlightsData?.data || [];
  const nearbyPlaces = nearbyPlacesData?.data || [];
  const categoryRatings = categoryRatingsData?.categoryRatings;
  const policy = policyData?.data;

  const avgRating = property.reviews?.length
    ? property.reviews.reduce((sum: number, r: any) => sum + (r.rating ?? 0), 0) / property.reviews.length
    : 0;

  const ratingLabel =
    avgRating >= 4.5 ? "Exceptional"
    : avgRating >= 4 ? "Excellent"
    : avgRating >= 3.5 ? "Very Good"
    : avgRating > 0 ? "Good" : null;

  const starCount = Math.round(avgRating);

  const allImages = (property.images || []).filter((img: any) => !img.category || img.category === "property");
  const nearbyImgs = (property.images || []).filter((img: any) => img.category === "nearby");
  const mainImg = allImages[0]?.url;

  const roomImgs = (property.rooms || []).flatMap((r: any) => r.images || []);
  const gridSources = [...roomImgs, ...allImages.slice(1)];
  const thumbs = Array.from({ length: 6 }, (_, i) => gridSources[i] || null);

  const lightboxImages = [...allImages, ...roomImgs, ...nearbyImgs];

  const filteredGalleryImages =
    galleryFilter === "rooms" ? roomImgs
    : galleryFilter === "property" ? allImages
    : galleryFilter === "nearby" ? nearbyImgs
    : lightboxImages;

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const obs = new IntersectionObserver(([e]) => setStickyNav(!e.isIntersecting), { threshold: 0 });
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (PANEL_TABS.includes(tab)) {
      setPanelTab(tab);
    } else {
      scrollTo(tab.toLowerCase().replace(" ", "-"));
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Gallery Modal */}
      {galleryOpen && lightboxImages.length > 0 && (
        <div className="fixed inset-0 z-[9998] flex items-start justify-center pt-8 px-4" onClick={() => { setGalleryOpen(false); setGalleryStartIdx(0); setGalleryFilter("all"); }}>
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="relative bg-white rounded-xl shadow-2xl flex w-full max-w-5xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 shrink-0">
                {galleryStartIdx > 0 && (
                  <button onClick={() => setGalleryStartIdx(0)} className="p-1.5 hover:bg-gray-100 rounded-full">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-primary text-primary text-sm font-medium">
                  <ImageIcon className="w-4 h-4" /> Property Images
                </button>
                <button onClick={() => { setGalleryOpen(false); setGalleryStartIdx(0); setGalleryFilter("all"); }} className="ml-auto p-1.5 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-0 px-4 border-b border-gray-100 shrink-0 overflow-x-auto">
                {[
                  { label: `All (${lightboxImages.length})`, key: "all" as const },
                  ...(roomImgs.length > 0 ? [{ label: `Rooms (${roomImgs.length})`, key: "rooms" as const }] : []),
                  ...(allImages.length > 0 ? [{ label: `Property views (${allImages.length})`, key: "property" as const }] : []),
                  ...(nearbyImgs.length > 0 ? [{ label: `Nearby attractions (${nearbyImgs.length})`, key: "nearby" as const }] : []),
                ].map((tab) => (
                  <button key={tab.key}
                    onClick={() => { setGalleryFilter(tab.key); setGalleryStartIdx(0); }}
                    className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${galleryFilter === tab.key ? "border-primary text-primary" : "border-transparent text-gray-600 hover:text-gray-900"}`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {galleryStartIdx > 0 ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 relative bg-black flex items-center justify-center min-h-0">
                    <button className="absolute left-3 top-1/2 -translate-y-1/2 text-white p-2.5 bg-black/40 hover:bg-black/60 rounded-full z-10"
                      onClick={() => setGalleryStartIdx(i => Math.max(1, i - 1))}>
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <img src={(filteredGalleryImages[galleryStartIdx - 1] as any)?.url} alt="" className="max-h-full max-w-full object-contain" />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-white p-2.5 bg-black/40 hover:bg-black/60 rounded-full z-10"
                      onClick={() => setGalleryStartIdx(i => Math.min(filteredGalleryImages.length, i + 1))}>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="h-[72px] bg-black flex items-center gap-1 px-2 overflow-x-auto shrink-0">
                    <button onClick={() => setGalleryStartIdx(0)} className="flex flex-col items-center gap-0.5 px-2 py-1 text-white text-xs shrink-0">
                      <div className="w-7 h-7 bg-white/20 rounded flex items-center justify-center">
                        <ImageIcon className="w-3.5 h-3.5" />
                      </div>
                      Gallery
                    </button>
                    {filteredGalleryImages.map((img, i) => (
                      <button key={i} onClick={() => setGalleryStartIdx(i + 1)}
                        className={`shrink-0 h-[56px] w-[72px] rounded overflow-hidden border-2 transition-colors ${galleryStartIdx === i + 1 ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}>
                        <img src={(img as any).url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-3">
                  <div className="grid grid-cols-3 gap-1.5">
                    {filteredGalleryImages.map((img, i) => (
                      <button key={i} onClick={() => setGalleryStartIdx(i + 1)}
                        className="aspect-video rounded-lg overflow-hidden hover:opacity-90 transition-opacity">
                        <img src={(img as any).url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                  {filteredGalleryImages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                      <ImageIcon className="w-12 h-12 mb-2 opacity-30" />
                      <p className="text-sm">No images in this category</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="w-[220px] shrink-0 border-l border-gray-200 flex flex-col p-4 overflow-y-auto">
              <h3 className="font-bold text-sm mb-3">Things you'll love</h3>
              <ul className="space-y-2 mb-6 flex-1">
                {property.facilities?.slice(0, 4).map((f: any) => (
                  <li key={f.id} className="flex items-center gap-2 text-xs text-gray-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                    {f.name}
                  </li>
                ))}
                {property.location?.city && (
                  <li className="flex items-center gap-2 text-xs text-gray-700">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    Located in {property.location.city}
                  </li>
                )}
              </ul>
              <Button className="w-full rounded-full text-sm" onClick={() => { setGalleryOpen(false); setGalleryFilter("all"); scrollTo("rooms"); }}>
                Check availability
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="py-3 px-4">
        <button
          onClick={() => {
            if (window.history.length > 2) {
              navigate(-1);
            } else {
              navigate("/properties");
            }
          }}
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to search results
        </button>
      </div>

      {/* Photo Grid - 1 large + 2x3 grid */}
      <div ref={heroRef} className="px-4 mb-6">
        <div className="flex gap-2 rounded-xl overflow-hidden h-[420px]">
          {/* Main large image */}
          <div className="flex-[3] relative bg-muted cursor-pointer" onClick={() => { setGalleryStartIdx(0); setGalleryOpen(true); }}>
            {mainImg ? (
              <img src={mainImg} alt={property.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <ImageIcon className="w-16 h-16 opacity-20" />
              </div>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); setSaved(s => !s); }}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white shadow"
            >
              <Heart className={cn("w-5 h-5", saved ? "fill-red-500 text-red-500" : "text-gray-600")} />
            </button>
            {/* Photo count overlay */}
            <button 
              onClick={() => { setGalleryStartIdx(0); setGalleryOpen(true); }}
              className="absolute bottom-4 left-4 px-4 py-2 bg-white rounded-lg shadow-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ImageIcon className="w-4 h-4" />
              {lightboxImages.length} property photos
            </button>
          </div>
          {/* 2x3 thumbnail grid */}
          <div className="flex-[2] grid grid-cols-2 grid-rows-3 gap-2">
            {thumbs.map((img, i) => (
              <div key={i} className="relative bg-muted overflow-hidden cursor-pointer" onClick={() => { if (img) { setGalleryStartIdx(i + 1); setGalleryOpen(true); } }}>
                {img ? (
                  <img src={(img as any).url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <ImageIcon className="w-8 h-8 text-muted-foreground opacity-20" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Navigation Tabs */}
      <div className={cn(
        "bg-white dark:bg-zinc-900 border-b border-border transition-all duration-300 z-30",
        stickyNav ? "fixed top-16 left-0 right-0 shadow-md" : "relative"
      )}>
        <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto">
          {NAV_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={cn(
                "px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors shrink-0",
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      {stickyNav && <div className="h-[49px]" />}

      {/* Main Layout - Left Content + Right Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6 px-4 py-6">
        {/* LEFT MAIN CONTENT */}
        <div className="flex-1 min-w-0">
          
          {/* Property Name & Basic Info */}
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">{property.type}</Badge>
              {starCount > 0 && (
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: Math.min(starCount, 5) }).map((_, i) => (
                    <FaStar key={i} className="w-3.5 h-3.5 text-yellow-400" />
                  ))}
                </div>
              )}
            </div>
            <h1 className="font-bold text-3xl mb-3">{property.name}</h1>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 shrink-0 text-primary" />
              <span>{property.address}</span>
            </div>
          </section>

          {/* HIGHLIGHTS SECTION */}
          <section id="overview" className="mb-8">
            <h2 className="text-xl font-bold mb-4">Highlights</h2>
            {highlights.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highlights.map((highlight: any) => (
                  <div key={highlight.id} className="flex items-start gap-3 p-4 border border-border dark:border-gray-700 rounded-lg hover:shadow-sm transition-shadow dark:bg-gray-800">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-lg">{highlight.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold mb-1 dark:text-gray-100">{highlight.title}</p>
                      <p className="text-xs text-muted-foreground dark:text-gray-300">{highlight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No highlights available yet</p>
              </div>
            )}
          </section>

          {/* FACILITIES SECTION */}
          <section id="facilities" className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Facilities</h2>
              <button onClick={() => setPanelTab("Facilities")} className="text-sm text-primary hover:underline font-medium">
                See all
              </button>
            </div>
            <div className="border border-border dark:border-gray-700 rounded-xl p-6 dark:bg-gray-800">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Facilities</p>
              {(property.facilities?.length > 0) ? (
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {property.facilities.slice(0, 6).map((f: any) => (
                    <div key={f.id} className="flex items-center gap-2 bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20 rounded-lg px-3 py-2.5 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-medium dark:text-gray-100">{f.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic mb-6">No facilities available at the moment.</p>
              )}

              {(() => {
                const allServices = Array.from(new Map(
                  (property.rooms || []).flatMap((r: any) => r.services || []).map((s: any) => [s.name, s])
                ).values());
                return allServices.length > 0 ? (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Room Services</p>
                    <div className="flex flex-col gap-2">
                      {allServices.slice(0, 4).map((s: any) => (
                        <div key={s.id} className="flex items-center justify-between py-2.5 px-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                            <span className="text-sm font-medium text-green-800 dark:text-green-300">{s.name}</span>
                          </div>
                          <span className="text-xs font-semibold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-full">
                            {s.price ? `ETB ${s.price}` : "Free"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : null;
              })()}
            </div>
          </section>

          {/* ABOUT US SECTION */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">About us</h2>
            <div className="text-sm text-muted-foreground leading-relaxed">
              {property.about?.description ? (
                <>
                  <p className="line-clamp-3">{property.about.description}</p>
                  <button onClick={() => setPanelTab("Facilities")} className="text-primary hover:underline mt-2 font-medium">
                    Read more
                  </button>
                </>
              ) : (
                <p>
                  Welcome to our property. We offer comfortable accommodations with modern amenities 
                  to ensure your stay is pleasant and memorable. Our dedicated staff is available 24/7 
                  to assist you with any needs during your visit.
                </p>
              )}
            </div>
          </section>

          {/* ROOM SELECTION SECTION */}
          <section id="rooms" className="mb-8">
            <h2 className="text-xl font-bold mb-4">Select your room</h2>
            
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button className="px-3 py-1.5 text-xs font-medium border border-border rounded-full hover:bg-muted transition-colors">
                Breakfast included
              </button>
              <button className="px-3 py-1.5 text-xs font-medium border border-border rounded-full hover:bg-muted transition-colors">
                Pay at the hotel
              </button>
              <button className="px-3 py-1.5 text-xs font-medium border border-border rounded-full hover:bg-muted transition-colors">
                Non-smoking
              </button>
              <button className="px-3 py-1.5 text-xs font-medium border border-border rounded-full hover:bg-muted transition-colors">
                Recommended Room
              </button>
              <button className="px-3 py-1.5 text-xs font-medium border border-border rounded-full hover:bg-muted transition-colors">
                Balcony/terrace
              </button>
              <button className="px-3 py-1.5 text-xs font-medium border border-border rounded-full hover:bg-muted transition-colors">
                Bed type
              </button>
              <button className="px-3 py-1.5 text-xs font-medium border border-border rounded-full hover:bg-muted transition-colors">
                City view
              </button>
            </div>

            {/* Room cards */}
            <div className="flex flex-col gap-4">
              {property?.rooms?.length > 0 ? property.rooms.map((r: any) => {
                const bedrooms = r.features?.filter((f: any) => f.category?.toLowerCase() === "bedroom").length ?? 0;
                const bathrooms = r.features?.filter((f: any) => f.category?.toLowerCase() === "bathroom").length ?? 0;
                return (
                  <div key={r.id} className="border border-border rounded-xl overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow">
                    <div className="sm:w-64 w-full shrink-0 bg-muted">
                      {r.images?.[0]?.url ? (
                        <img src={r.images[0].url} alt={r.name} className="w-full h-48 sm:h-full object-cover" />
                      ) : (
                        <div className="w-full h-48 sm:h-full flex items-center justify-center">
                          <ImageIcon className="w-10 h-10 text-muted-foreground opacity-30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <Badge variant="secondary" className="mb-2 text-xs">{r.type}</Badge>
                            <h3 className="font-bold text-lg text-primary hover:underline cursor-pointer" onClick={() => navigate(`/rooms/${r.id}`)}>
                              {r.name}
                            </h3>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs text-muted-foreground mb-1">per night</p>
                            <FormatedAmount amount={r.price} className="font-bold text-xl text-red-500" />
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          {bedrooms > 0 && <span className="flex items-center gap-1"><BedDouble className="w-4 h-4" />{bedrooms} bed</span>}
                          {bathrooms > 0 && <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{bathrooms} bath</span>}
                          <span className="flex items-center gap-1"><Users className="w-4 h-4" />Max {r.maxOccupancy}</span>
                        </div>
                        {r.services?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {r.services.slice(0, 4).map((s: any) => (
                              <span key={s.id} className="text-xs bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 px-2.5 py-1 rounded-md border border-green-100 dark:border-green-800">
                                {s.name}{s.price ? ` (+ETB ${s.price})` : " (Free)"}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button className="mt-3 w-full sm:w-auto sm:self-end px-8" onClick={() => navigate(`/rooms/${r.id}`)}>
                        Book
                      </Button>
                    </div>
                  </div>
                );
              }) : (
                <div className="border border-border rounded-xl p-8 text-center text-muted-foreground">
                  <BedDouble className="w-10 h-10 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No rooms available at this time.</p>
                </div>
              )}
            </div>
          </section>

          {/* TRIP RECOMMENDATIONS */}
          <section id="trip-recommendations" className="mb-8">
            <h2 className="text-xl font-bold mb-2">Plan your journey to your hotel</h2>
            <p className="text-sm text-muted-foreground mb-4">Book your ride in advance for a hassle-free trip</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-border rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
                    <Plane className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Book your airport transfer</p>
                    <p className="text-xs text-muted-foreground mt-1">Get to your hotel easily and securely</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">Search</Button>
              </div>
              <div className="border border-border rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
                    <CarFront className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Rent a car</p>
                    <p className="text-xs text-muted-foreground mt-1">Find an ideal ride for your trip</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">Search</Button>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="lg:w-[320px] shrink-0">
          <div className="sticky top-24 space-y-4">
            
            {/* GUEST REVIEWS CARD */}
            {avgRating > 0 && (
              <div className="border border-border dark:border-gray-700 rounded-xl p-5 bg-white dark:bg-gray-800 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-base font-bold dark:text-gray-100">Guest reviews</h3>
                  <button onClick={() => setPanelTab("Reviews")} className="text-xs text-primary hover:underline">
                    See all
                  </button>
                </div>
                
                {/* Large score badge */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-[#003B95] dark:bg-[#1e3a8a] text-white font-bold text-3xl w-16 h-16 flex items-center justify-center rounded-lg shadow-md">
                    {avgRating.toFixed(1)}
                  </div>
                  <div>
                    <p className="text-lg font-bold dark:text-gray-100">{ratingLabel}</p>
                    <p className="text-sm text-muted-foreground dark:text-gray-300">{property.reviews?.length ?? 0} reviews</p>
                  </div>
                </div>

                {/* Category bars */}
                <div className="space-y-3 mb-4">
                  {categoryRatings ? (
                    <>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium dark:text-gray-300">Service</span>
                          <span className="text-xs font-bold dark:text-gray-100">{categoryRatings.service.toFixed(1)}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-[#003B95] rounded-full" style={{ width: `${(categoryRatings.service / 10) * 100}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium dark:text-gray-300">Cleanliness</span>
                          <span className="text-xs font-bold dark:text-gray-100">{categoryRatings.cleanliness.toFixed(1)}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-[#003B95] rounded-full" style={{ width: `${(categoryRatings.cleanliness / 10) * 100}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium dark:text-gray-300">Location</span>
                          <span className="text-xs font-bold dark:text-gray-100">{categoryRatings.location.toFixed(1)}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-[#003B95] rounded-full" style={{ width: `${(categoryRatings.location / 10) * 100}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium dark:text-gray-300">Facilities</span>
                          <span className="text-xs font-bold dark:text-gray-100">{categoryRatings.facilities.toFixed(1)}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-[#003B95] rounded-full" style={{ width: `${(categoryRatings.facilities / 10) * 100}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium dark:text-gray-300">Staff</span>
                          <span className="text-xs font-bold dark:text-gray-100">{categoryRatings.staff.toFixed(1)}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-[#003B95] rounded-full" style={{ width: `${(categoryRatings.staff / 10) * 100}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium dark:text-gray-300">Value</span>
                          <span className="text-xs font-bold dark:text-gray-100">{categoryRatings.value.toFixed(1)}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-[#003B95] rounded-full" style={{ width: `${(categoryRatings.value / 10) * 100}%` }} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium dark:text-gray-300">Service</span>
                          <span className="text-xs font-bold dark:text-gray-100">N/A</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gray-300 rounded-full" style={{ width: '0%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium dark:text-gray-300">Cleanliness</span>
                          <span className="text-xs font-bold dark:text-gray-100">N/A</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gray-300 rounded-full" style={{ width: '0%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium dark:text-gray-300">Facilities</span>
                          <span className="text-xs font-bold dark:text-gray-100">N/A</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gray-300 rounded-full" style={{ width: '0%' }} />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Quote */}
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground italic">
                    "Loved this place would return for a third visit!"
                  </p>
                </div>
              </div>
            )}

            {/* LOCATION CARD */}
            <div className="border border-border dark:border-gray-700 rounded-xl p-5 bg-white dark:bg-gray-800 shadow-sm">
              <h3 className="text-base font-bold mb-3 dark:text-gray-100">Exceptional location</h3>
              <p className="text-sm text-muted-foreground dark:text-gray-300 mb-3">Location rated 9.5 by guests</p>
              
              <div className="flex items-center gap-2 mb-4 text-sm dark:text-gray-100">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>Exceptional for walking</span>
              </div>

              {/* Map thumbnail placeholder */}
              <div className="w-full h-32 bg-muted dark:bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-muted-foreground opacity-30" />
              </div>

              <Button variant="outline" className="w-full" onClick={() => setPanelTab("Location")}>
                See map
              </Button>
            </div>

            {/* NEARBY PLACES CARD */}
            <div className="border border-border dark:border-gray-700 rounded-xl p-5 bg-white dark:bg-gray-800 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-base font-bold dark:text-gray-100">Nearby places</h3>
                <button className="text-xs text-primary hover:underline">See all</button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border mb-3">
                <button
                  onClick={() => setNearbyTab("attractions")}
                  className={cn(
                    "flex-1 px-2 py-2 text-xs font-medium transition-colors",
                    nearbyTab === "attractions"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Attractions
                </button>
                <button
                  onClick={() => setNearbyTab("transport")}
                  className={cn(
                    "flex-1 px-2 py-2 text-xs font-medium transition-colors",
                    nearbyTab === "transport"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Transport
                </button>
                <button
                  onClick={() => setNearbyTab("restaurants")}
                  className={cn(
                    "flex-1 px-2 py-2 text-xs font-medium transition-colors",
                    nearbyTab === "restaurants"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Restaurants
                </button>
              </div>

              {/* Content */}
              <div className="space-y-2.5">
                {nearbyTab === "attractions" && (
                  <>
                    {nearbyPlaces.filter((p: any) => p.category === "ATTRACTION").length > 0 ? (
                      nearbyPlaces.filter((p: any) => p.category === "ATTRACTION").map((place: any) => (
                        <div key={place.id} className="flex items-center gap-2 text-xs">
                          <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span className="flex-1">{place.name}</span>
                          <span className="text-muted-foreground">{place.distance}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No attractions added yet</p>
                    )}
                  </>
                )}
                {nearbyTab === "transport" && (
                  <>
                    {nearbyPlaces.filter((p: any) => p.category === "TRANSPORT").length > 0 ? (
                      nearbyPlaces.filter((p: any) => p.category === "TRANSPORT").map((place: any) => (
                        <div key={place.id} className="flex items-center gap-2 text-xs">
                          <Train className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span className="flex-1">{place.name}</span>
                          <span className="text-muted-foreground">{place.distance}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No transport options added yet</p>
                    )}
                  </>
                )}
                {nearbyTab === "restaurants" && (
                  <>
                    {nearbyPlaces.filter((p: any) => p.category === "RESTAURANT").length > 0 ? (
                      nearbyPlaces.filter((p: any) => p.category === "RESTAURANT").map((place: any) => (
                        <div key={place.id} className="flex items-center gap-2 text-xs">
                          <Utensils className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span className="flex-1">{place.name}</span>
                          <span className="text-muted-foreground">{place.distance}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No restaurants added yet</p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* PROPERTY POLICIES CARD */}
            <div className="border border-border dark:border-gray-700 rounded-xl p-5 bg-white dark:bg-gray-800 shadow-sm">
              <h3 className="text-base font-bold mb-4 dark:text-gray-100">Property Policies</h3>
              
              {policy ? (
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground dark:text-gray-400">Check-in</p>
                      <p className="font-medium dark:text-gray-100">From {policy.checkInTime}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground dark:text-gray-400">Check-out</p>
                      <p className="font-medium dark:text-gray-100">Until {policy.checkOutTime}</p>
                    </div>
                  </div>

                  {policy.extraInfo && (
                    <div className="pt-3 border-t border-border dark:border-gray-700">
                      <p className="text-xs font-semibold mb-1 dark:text-gray-100">Extras</p>
                      <p className="text-xs text-muted-foreground dark:text-gray-300">
                        {policy.extraInfo}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground dark:text-gray-400">No policies set</p>
                </div>
              )}

              <button onClick={() => setPanelTab("Policies")} className="text-xs text-primary hover:underline mt-4 font-medium">
                Full policy
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* SLIDE-IN PANEL */}
      {panelTab && (
        <div className="fixed inset-0 z-[9998]" onClick={() => setPanelTab(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute right-0 top-0 h-full w-full max-w-2xl bg-background shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-border dark:border-gray-700">
              <div className="flex items-center justify-between px-6 pt-4 pb-0">
                <h2 className="text-lg font-bold dark:text-gray-100">Property Information</h2>
                <button onClick={() => setPanelTab(null)} className="p-2 hover:bg-muted dark:hover:bg-gray-700 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex overflow-x-auto">
                {PANEL_TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setPanelTab(tab)}
                    className={cn(
                      "px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors shrink-0",
                      panelTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground dark:hover:text-gray-100"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {panelTab === "Facilities" && (
                <div>
                  <h3 className="text-lg font-bold mb-5 dark:text-gray-100">Services & Facilities</h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-gray-400 mb-3">Facilities</p>
                  {(property.facilities?.length > 0) ? (
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {property.facilities.map((f: any) => (
                        <div key={f.id} className="flex items-center gap-2 bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20 rounded-lg px-3 py-2.5 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                          <span className="font-medium dark:text-gray-100">{f.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground dark:text-gray-400 italic mb-6">No facilities available at the moment.</p>
                  )}

                  {(() => {
                    const allServices = Array.from(new Map(
                      (property.rooms || []).flatMap((r: any) => r.services || []).map((s: any) => [s.name, s])
                    ).values());
                    return (
                      <>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-gray-400 mb-3">Room Services</p>
                        {allServices.length > 0 ? (
                          <div className="flex flex-col gap-2">
                            {allServices.map((s: any) => (
                              <div key={s.id} className="flex items-center justify-between py-2.5 px-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                                  <span className="text-sm font-medium text-green-800 dark:text-green-300">{s.name}</span>
                                </div>
                                <span className="text-xs font-semibold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-full">
                                  {s.price ? `ETB ${s.price}` : "Free"}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground dark:text-gray-400 italic">No services available at the moment.</p>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              {panelTab === "Reviews" && (
                <div>
                  {avgRating > 0 && (
                    <div className="flex items-center gap-4 mb-6 p-4 bg-muted/30 dark:bg-gray-700/30 rounded-xl">
                      <div className="bg-primary text-white font-bold text-xl w-12 h-12 flex items-center justify-center rounded-xl shrink-0">
                        {avgRating.toFixed(1)}
                      </div>
                      <div>
                        <p className="font-bold dark:text-gray-100">{ratingLabel}</p>
                        <p className="text-sm text-muted-foreground dark:text-gray-300">{property.reviews?.length ?? 0} verified reviews</p>
                      </div>
                    </div>
                  )}
                  <ReviewsContainer propertyId={property.id} />
                </div>
              )}

              {panelTab === "Location" && (
                <div>
                  <h3 className="text-lg font-bold mb-4 dark:text-gray-100">Location</h3>
                  <PropertyDetails
                    contact={property.contact}
                    facilities={property.facilities as any}
                    location={property.location}
                  />
                </div>
              )}

              {panelTab === "Policies" && (
                <div>
                  <h3 className="text-lg font-bold mb-4 dark:text-gray-100">Property policies</h3>
                  {policy ? (
                    <div className="space-y-4">
                      <div className="flex justify-between py-3 border-b border-border dark:border-gray-700">
                        <span className="text-muted-foreground dark:text-gray-400">Check-in</span>
                        <span className="font-medium dark:text-gray-100">From {policy.checkInTime}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-border dark:border-gray-700">
                        <span className="text-muted-foreground dark:text-gray-400">Check-out</span>
                        <span className="font-medium dark:text-gray-100">Until {policy.checkOutTime}</span>
                      </div>
                      {policy.cancellationPolicy && (
                        <div className="py-3 border-b border-border dark:border-gray-700">
                          <span className="text-muted-foreground dark:text-gray-400 block mb-2">Cancellation</span>
                          <span className="font-medium dark:text-gray-100">{policy.cancellationPolicy}</span>
                        </div>
                      )}
                      {policy.childrenPolicy && (
                        <div className="py-3 border-b border-border dark:border-gray-700">
                          <span className="text-muted-foreground dark:text-gray-400 block mb-2">Children</span>
                          <span className="font-medium dark:text-gray-100">{policy.childrenPolicy}</span>
                        </div>
                      )}
                      {policy.petsPolicy && (
                        <div className="py-3 border-b border-border dark:border-gray-700">
                          <span className="text-muted-foreground dark:text-gray-400 block mb-2">Pets</span>
                          <span className="font-medium dark:text-gray-100">
                            {policy.petsPolicy === "ALLOWED" ? "Allowed" : 
                             policy.petsPolicy === "NOT_ALLOWED" ? "Not allowed" : 
                             "Contact property for details"}
                          </span>
                        </div>
                      )}
                      {policy.smokingPolicy && (
                        <div className="py-3 border-b border-border dark:border-gray-700">
                          <span className="text-muted-foreground dark:text-gray-400 block mb-2">Smoking</span>
                          <span className="font-medium dark:text-gray-100">
                            {policy.smokingPolicy === "ALLOWED" ? "Allowed" : 
                             policy.smokingPolicy === "NOT_ALLOWED" ? "Not allowed" : 
                             "Designated areas only"}
                          </span>
                        </div>
                      )}
                      {policy.extraInfo && (
                        <div className="py-3">
                          <span className="text-muted-foreground dark:text-gray-400 block mb-2">Additional Information</span>
                          <p className="text-sm dark:text-gray-300">{policy.extraInfo}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground dark:text-gray-400">No policies have been set for this property yet.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataContainer;
