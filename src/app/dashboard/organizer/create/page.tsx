"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import PortalLayout from "@/components/PortalLayout";
import { Loader2, ArrowLeft, Send, Trash2, ArrowLeftRight, UploadCloud, Plus } from "lucide-react";

export default function CreateFestival() {
  const { user } = useAuth();
  const router = useRouter();

  // Form states
  const [name, setName] = useState("");
  const [type, setType] = useState("FESTIVAL");
  const [collegeName, setCollegeName] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expectedFootfall, setExpectedFootfall] = useState("10000");
  const [artistLineup, setArtistLineup] = useState("");
  const [demographics, setDemographics] = useState("80% student youth, 20% external public");
  const [stallCapacity, setStallCapacity] = useState("30");
  const [bannerUrl, setBannerUrl] = useState("");
  const [defaultStallPrice, setDefaultStallPrice] = useState("35000");
  const [layoutMapUrl, setLayoutMapUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [timeline, setTimeline] = useState("");
  
  // Gallery list state
  const [galleryList, setGalleryList] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Helper for single file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image.");
      }

      const res = await response.json();
      if (fieldName === "banner") {
        setBannerUrl(res.url);
      } else if (fieldName === "layout") {
        setLayoutMapUrl(res.url);
      }
    } catch (err: any) {
      alert(err.message || "File upload failed.");
    } finally {
      setUploadingField(null);
    }
  };

  // Helper for multiple gallery files upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (galleryList.length + files.length > 10) {
      alert("You can upload a maximum of 10 gallery photos per event.");
      return;
    }

    setUploadingField("gallery");
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/uploads", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const res = await response.json();
          uploadedUrls.push(res.url);
        }
      }
      setGalleryList((prev) => [...prev, ...uploadedUrls].slice(0, 10));
    } catch (err: any) {
      alert("Error uploading gallery images: " + err.message);
    } finally {
      setUploadingField(null);
    }
  };

  // Gallery ordering helpers
  const moveGalleryItem = (index: number, direction: "left" | "right") => {
    const newList = [...galleryList];
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newList.length) return;

    // Swap elements
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;
    setGalleryList(newList);
  };

  const removeGalleryItem = (index: number) => {
    setGalleryList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !collegeName || !location || !startDate || !endDate || !expectedFootfall || !defaultStallPrice) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/festivals/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizerId: user?.id,
          name,
          type,
          collegeName,
          location,
          startDate,
          endDate,
          expectedFootfall,
          artistLineup,
          demographics,
          stallCapacity,
          bannerUrl: bannerUrl || undefined,
          galleryUrls: galleryList.join(",") || undefined,
          defaultStallPrice,
          layoutMapUrl: layoutMapUrl || undefined,
          instagramUrl: instagramUrl || undefined,
          timeline
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register festival.");
      }

      router.push("/dashboard/organizer");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <PortalLayout activeTab="my festivals">
      <div className="flex flex-col gap-12 max-w-2xl mx-auto">
        {/* Navigation Backlink */}
        <div>
          <Link href="/dashboard/organizer" className="group flex items-center gap-2 text-[12px] text-brand-secondary hover:text-brand-primary transition-colors uppercase tracking-wider">
            <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Console
          </Link>
        </div>

        {/* Title Block */}
        <div className="flex flex-col gap-3">
          <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-brand-secondary">
            DIRECTORY REGISTRY
          </span>
          <h1 className="font-serif text-[40px] font-medium tracking-tight text-brand-primary">
            Register Property
          </h1>
          <p className="font-sans text-[13px] text-brand-secondary">
            Submit your college cultural festival or commercial event to Ground Zero. Awaiting administrative review before directory publishing.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-500 font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-brand-card border border-brand-border rounded-[24px] p-8 shadow-sm flex flex-col gap-6 font-sans text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">Property Name*</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mood Indigo '26"
                className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[13px]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">Listing Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary focus:outline-none focus:border-brand-primary text-[13px]"
              >
                <option value="FESTIVAL">🎪 Festival (College)</option>
                <option value="EVENT">🎸 Event (Concert/Comedy)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">Campus / College Name*</label>
              <input
                type="text"
                required
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="e.g. IIT Bombay"
                className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[13px]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">Location (City, State)*</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Powai, Mumbai"
                className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[13px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">Start Date*</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary focus:outline-none focus:border-brand-primary text-[13px]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">End Date*</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary focus:outline-none focus:border-brand-primary text-[13px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">Expected Footfall (Total Attendees)*</label>
              <input
                type="number"
                required
                value={expectedFootfall}
                onChange={(e) => setExpectedFootfall(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[13px]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">Estimated Stall Capacity</label>
              <input
                type="number"
                value={stallCapacity}
                onChange={(e) => setStallCapacity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[13px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">Average Stall Price (₹)*</label>
              <input
                type="number"
                required
                value={defaultStallPrice}
                onChange={(e) => setDefaultStallPrice(e.target.value)}
                placeholder="e.g. 35000"
                className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[13px]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">Instagram URL (Handle Page Link)</label>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="e.g. https://instagram.com/moodindigo.iitb"
                className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[13px]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">Artist Lineup</label>
            <input
              type="text"
              value={artistLineup}
              onChange={(e) => setArtistLineup(e.target.value)}
              placeholder="e.g. Diljit Dosanjh, Divine, Amit Trivedi (comma-separated)"
              className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[13px]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">Target Demographics Description</label>
            <input
              type="text"
              value={demographics}
              onChange={(e) => setDemographics(e.target.value)}
              placeholder="e.g. 85% affluent student youth (18-25), 15% corporate professionals"
              className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[13px]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">Event List & Schedule Timeline (Each timeline milestone on a new line)</label>
            <textarea
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              placeholder="e.g.&#10;Day 1: 10:00 AM - Cultural Parades&#10;Day 1: 06:00 PM - Pronite Band performance&#10;Day 2: 12:00 PM - Street Play Finals"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[13px] leading-relaxed"
            />
          </div>

          {/* Banner Upload */}
          <div className="flex flex-col gap-2">
            <label className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">Event Banner Image</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="Paste banner image URL or upload local file"
                className="flex-grow px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[13px]"
              />
              <div className="relative shrink-0">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "banner")}
                  id="banner-file-upload"
                  className="hidden"
                />
                <label
                  htmlFor="banner-file-upload"
                  className="btn-liquid-glass py-3 px-5 text-xs flex justify-center items-center gap-1.5 h-full cursor-pointer select-none"
                >
                  {uploadingField === "banner" ? <Loader2 size={12} className="animate-spin" /> : <UploadCloud size={12} />}
                  Upload Image
                </label>
              </div>
            </div>
          </div>

          {/* Blueprint Upload */}
          <div className="flex flex-col gap-2">
            <label className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">Venue layout blueprint Map</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={layoutMapUrl}
                onChange={(e) => setLayoutMapUrl(e.target.value)}
                placeholder="Paste floorplan image URL or upload local file"
                className="flex-grow px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[13px]"
              />
              <div className="relative shrink-0">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "layout")}
                  id="layout-file-upload"
                  className="hidden"
                />
                <label
                  htmlFor="layout-file-upload"
                  className="btn-liquid-glass py-3 px-5 text-xs flex justify-center items-center gap-1.5 h-full cursor-pointer select-none"
                >
                  {uploadingField === "layout" ? <Loader2 size={12} className="animate-spin" /> : <UploadCloud size={12} />}
                  Upload Image
                </label>
              </div>
            </div>
          </div>

          {/* Local Photo Gallery (Up to 10 images with Reordering controls) */}
          <div className="flex flex-col gap-4 border-t border-brand-border pt-6">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-0.5">
                <span className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">Event Gallery Photos (Up to 10)</span>
                <span className="text-[10px] text-brand-secondary">Upload local photos and arrange them in your preferred catalog order</span>
              </div>
              <div className="relative shrink-0">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  disabled={uploadingField === "gallery" || galleryList.length >= 10}
                  id="gallery-file-upload"
                  className="hidden"
                />
                <label
                  htmlFor="gallery-file-upload"
                  className={`btn-liquid-glass py-2 px-4 text-xs flex justify-center items-center gap-1.5 h-full cursor-pointer select-none ${
                    galleryList.length >= 10 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {uploadingField === "gallery" ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                  Add Photos
                </label>
              </div>
            </div>

            {galleryList.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {galleryList.map((url, idx) => (
                  <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-brand-border bg-brand-bg group">
                    <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                    
                    {/* Reordering Controls Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeGalleryItem(idx)}
                          className="p-1.5 bg-red-600/80 rounded-lg text-white hover:bg-red-600 transition-colors focus:outline-none cursor-pointer"
                          title="Remove Photo"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      <div className="flex justify-between items-center gap-2">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveGalleryItem(idx, "left")}
                          className="p-1 bg-white/20 rounded text-white disabled:opacity-30 hover:bg-white/40 transition-all cursor-pointer"
                          title="Move Left"
                        >
                          ◀
                        </button>
                        <span className="text-[10px] text-white/90 font-sans font-bold">#{idx + 1}</span>
                        <button
                          type="button"
                          disabled={idx === galleryList.length - 1}
                          onClick={() => moveGalleryItem(idx, "right")}
                          className="p-1 bg-white/20 rounded text-white disabled:opacity-30 hover:bg-white/40 transition-all cursor-pointer"
                          title="Move Right"
                        >
                          ▶
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 border border-dashed border-brand-border rounded-xl text-center text-[11.5px] text-brand-secondary">
                No gallery photos added yet. Upload local files to build a rich visual presentation.
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 mt-4 border-t border-brand-border pt-6">
            <Link href="/dashboard/organizer" className="btn-liquid-glass py-3 px-6 text-xs justify-center text-center">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-liquid-glass-dark py-3 px-6 text-xs flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={12} />}
              Submit Registry Prospectus
            </button>
          </div>
        </form>
      </div>
    </PortalLayout>
  );
}
