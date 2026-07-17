"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import PortalLayout from "@/components/PortalLayout";
import { Loader2, ArrowLeft, Send, Trash2, Plus, UploadCloud } from "lucide-react";

function EditFestivalForm() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const festivalId = searchParams.get("festivalId");

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
  const [published, setPublished] = useState(false);
  
  // Gallery list state
  const [galleryList, setGalleryList] = useState<string[]>([]);

  // New states for deck lock status, proposed lineup, and decks uploader
  const [mapLocked, setMapLocked] = useState(false);
  const [decksList, setDecksList] = useState<any[]>([]);
  const [proposedArtistLineup, setProposedArtistLineup] = useState("");

  const [loadingPage, setLoadingPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Fetch initial details
  useEffect(() => {
    if (!festivalId) {
      setError("Missing festivalId parameter.");
      setLoadingPage(false);
      return;
    }

    const loadDetails = async () => {
      try {
        const response = await fetch(`/api/festivals/${festivalId}`);
        if (!response.ok) throw new Error("Failed to load festival property.");
        const res = await response.json();
        const f = res.festival;
        
        setName(f.name);
        setType(f.type || "FESTIVAL");
        setCollegeName(f.collegeName);
        setLocation(f.location);
        setStartDate(f.startDate ? new Date(f.startDate).toISOString().split("T")[0] : "");
        setEndDate(f.endDate ? new Date(f.endDate).toISOString().split("T")[0] : "");
        setExpectedFootfall(f.expectedFootfall.toString());
        
        // Show proposed lineup as the editable state if published event has a pending proposal
        setArtistLineup(f.proposedArtistLineup || f.artistLineup || "");
        setProposedArtistLineup(f.proposedArtistLineup || "");
        
        setDemographics(f.demographics || "");
        setStallCapacity(f.stalls?.length?.toString() || "30");
        setBannerUrl(f.bannerUrl || "");
        setDefaultStallPrice(f.defaultStallPrice.toString());
        setLayoutMapUrl(f.layoutMapUrl || "");
        setInstagramUrl(f.instagramUrl || "");
        setTimeline(f.timeline || "");
        setPublished(f.published || false);
        setGalleryList(f.galleryUrls ? f.galleryUrls.split(",").map((url: string) => url.trim()).filter(Boolean) : []);
        setMapLocked(f.mapLocked || false);
        setDecksList(f.decks ? JSON.parse(f.decks) : []);
      } catch (err: any) {
        setError(err.message || "Failed to load details.");
      } finally {
        setLoadingPage(false);
      }
    };

    loadDetails();
  }, [festivalId]);

  // Helper for single file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (fieldName === "banner") {
          setBannerUrl(base64String);
        } else if (fieldName === "layout") {
          setLayoutMapUrl(base64String);
        }
        setUploadingField(null);
      };
      reader.onerror = () => {
        throw new Error("Failed to read file.");
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      alert(err.message || "File upload failed.");
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
      let loadedCount = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onloadend = () => {
          uploadedUrls.push(reader.result as string);
          loadedCount++;
          if (loadedCount === files.length) {
            setGalleryList((prev) => [...prev, ...uploadedUrls].slice(0, 10));
            setUploadingField(null);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      alert("Error uploading gallery images: " + err.message);
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

  const activeDecks = decksList.filter((d: any) => d.status !== "ARCHIVED");

  const handleDeckUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (activeDecks.length >= 3) {
      alert("You can upload a maximum of 3 active sponsorship decks.");
      return;
    }

    setUploadingField("deck");
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const newDeck = {
          id: "deck_" + Date.now(),
          name: file.name,
          url: base64String,
          status: "PENDING",
          uploadedAt: new Date().toISOString()
        };
        setDecksList((prev) => [...prev, newDeck]);
        setUploadingField(null);
      };
      reader.onerror = () => {
        throw new Error("Failed to read deck file.");
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      alert(err.message || "Deck upload failed.");
      setUploadingField(null);
    }
  };

  const handleRemoveDeck = (deckId: string) => {
    setDecksList((prev) =>
      prev.map((d) => (d.id === deckId ? { ...d, status: "ARCHIVED" } : d))
    );
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
      const response = await fetch("/api/festivals/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          festivalId,
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
          timeline,
          published,
          decks: JSON.stringify(decksList)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update event details.");
      }

      router.push("/dashboard/organizer");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  if (loadingPage) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand-secondary" />
      </div>
    );
  }

  return (
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
          Edit Property
        </h1>
        <p className="font-sans text-[13px] text-brand-secondary">
          Modify the details of your listing. Changes will update in real time across the Ground Zero catalog.
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
            <label className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">Venue / Host Name*</label>
            <input
              type="text"
              required
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              placeholder="e.g. IIT Bombay / NESCO Center"
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
            <label className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">
              Average Stall Price (₹)* {mapLocked && <span className="text-red-500 font-normal normal-case">(Locked by Admin)</span>}
            </label>
            <input
              type="number"
              required
              disabled={mapLocked}
              value={defaultStallPrice}
              onChange={(e) => setDefaultStallPrice(e.target.value)}
              placeholder="e.g. 35000"
              className={`w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[13px] ${mapLocked ? "opacity-50 cursor-not-allowed" : ""}`}
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
          <div className="flex justify-between items-center">
            <label className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">Artist Lineup</label>
            {published && (
              <span className="text-[10px] text-yellow-500 font-medium">Changes require Admin approval</span>
            )}
          </div>
          <input
            type="text"
            value={artistLineup}
            onChange={(e) => setArtistLineup(e.target.value)}
            placeholder="e.g. Diljit Dosanjh, Divine, Amit Trivedi (comma-separated)"
            className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[13px]"
          />
          {published && proposedArtistLineup && (
            <div className="mt-1.5 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-xs text-yellow-600 dark:text-yellow-400 font-medium">
              ⚠️ A proposed artist lineup change is currently pending review by the admin:
              <div className="mt-1 font-serif text-[13px] text-brand-primary">"{proposedArtistLineup}"</div>
            </div>
          )}
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
          <label className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">
            Venue layout blueprint Map {mapLocked && <span className="text-red-500 font-normal normal-case">(Locked by Admin)</span>}
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              disabled={mapLocked}
              value={layoutMapUrl}
              onChange={(e) => setLayoutMapUrl(e.target.value)}
              placeholder="Paste floorplan image URL or upload local file"
              className={`flex-grow px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-brand-primary placeholder:text-brand-secondary/40 focus:outline-none focus:border-brand-primary text-[13px] ${mapLocked ? "opacity-50 cursor-not-allowed" : ""}`}
            />
            <div className="relative shrink-0">
              <input
                type="file"
                disabled={mapLocked}
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "layout")}
                id="layout-file-upload"
                className="hidden"
              />
              <label
                htmlFor={mapLocked ? "" : "layout-file-upload"}
                className={`btn-liquid-glass py-3 px-5 text-xs flex justify-center items-center gap-1.5 h-full select-none ${mapLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                {uploadingField === "layout" ? <Loader2 size={12} className="animate-spin" /> : <UploadCloud size={12} />}
                Upload Image
              </label>
            </div>
          </div>
        </div>

        {/* Pitch Decks Uploader */}
        <div className="flex flex-col gap-4 border-t border-brand-border pt-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-0.5">
              <span className="uppercase tracking-wider font-semibold text-[10px] text-brand-secondary">
                Sponsorship / Pitch Decks (Up to 3)
              </span>
              <span className="text-[10px] text-brand-secondary">
                Upload PDF or Presentation decks. Admins must verify and approve decks before they go public.
              </span>
            </div>
            {activeDecks.length < 3 && (
              <div className="relative shrink-0">
                <input
                  type="file"
                  accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                  onChange={handleDeckUpload}
                  disabled={uploadingField === "deck"}
                  id="deck-file-upload"
                  className="hidden"
                />
                <label
                  htmlFor="deck-file-upload"
                  className="btn-liquid-glass py-2 px-4 text-xs flex justify-center items-center gap-1.5 h-full cursor-pointer select-none"
                >
                  {uploadingField === "deck" ? <Loader2 size={12} className="animate-spin" /> : <UploadCloud size={12} />}
                  Upload Deck
                </label>
              </div>
            )}
          </div>

          {activeDecks.length > 0 ? (
            <div className="flex flex-col gap-2">
              {activeDecks.map((deck: any) => (
                <div key={deck.id} className="flex items-center justify-between p-3 rounded-xl border border-brand-border bg-brand-bg text-[12px]">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📄</span>
                    <div className="flex flex-col">
                      <a href={deck.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline text-brand-primary">
                        {deck.name}
                      </a>
                      <span className="text-[10px] text-brand-secondary">
                        Uploaded on {deck.uploadedAt ? new Date(deck.uploadedAt).toLocaleDateString() : "unknown date"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                      deck.status === "APPROVED" 
                        ? "bg-green-500/10 text-green-500 border border-green-500/20"
                        : deck.status === "REJECTED"
                        ? "bg-red-500/10 text-red-500 border border-red-500/20"
                        : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                    }`}>
                      {deck.status === "APPROVED" ? "Approved" : deck.status === "REJECTED" ? "Rejected" : "Pending Approval"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDeck(deck.id)}
                      className="p-1 text-brand-secondary hover:text-red-500 transition-colors"
                      title="Delete deck"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 border border-dashed border-brand-border rounded-xl text-center text-[11.5px] text-brand-secondary">
              No pitch decks uploaded yet. You can upload up to 3 PDF/PPT files.
            </div>
          )}
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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EditFestivalPage() {
  return (
    <PortalLayout activeTab="my festivals">
      <Suspense fallback={
        <div className="flex h-96 items-center justify-center">
          <Loader2 size={32} className="animate-spin text-brand-secondary" />
        </div>
      }>
        <EditFestivalForm />
      </Suspense>
    </PortalLayout>
  );
}
