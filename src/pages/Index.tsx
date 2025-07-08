import { useState, useEffect } from "react";
import { BookmarkCard } from "@/components/BookmarkCard";
import { AddBookmarkDialog } from "@/components/AddBookmarkDialog";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Grid, Layout } from "lucide-react";

// Mock data for demonstration
const mockBookmarks = [
  {
    id: "1",
    url: "https://example.com/wireless-headphones",
    title: "Premium Wireless Noise-Cancelling Headphones",
    description: "Experience crystal-clear audio with active noise cancellation technology. Perfect for travel, work, and daily listening.",
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    price: 249.99,
    currency: "USD",
    domain: "example.com",
    tags: ["electronics", "audio", "wireless"],
  },
  {
    id: "2",
    url: "https://shop.example.com/smart-watch",
    title: "Smart Fitness Watch with Health Monitoring",
    description: "Track your fitness goals with this advanced smartwatch featuring heart rate monitoring, GPS, and 7-day battery life.",
    image_url: "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=500&fit=crop",
    price: 199.99,
    currency: "USD",
    domain: "shop.example.com",
    tags: ["wearables", "fitness", "health"],
  },
  {
    id: "3",
    url: "https://store.example.com/laptop-stand",
    title: "Adjustable Aluminum Laptop Stand",
    description: "Ergonomic laptop stand made from premium aluminum. Improves posture and reduces neck strain during long work sessions.",
    image_url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=350&fit=crop",
    price: 79.99,
    currency: "USD",
    domain: "store.example.com",
    tags: ["office", "ergonomic", "accessories"],
  },
  {
    id: "4",
    url: "https://fashion.example.com/winter-coat",
    title: "Sustainable Winter Coat",
    description: "Stay warm and stylish with this eco-friendly winter coat made from recycled materials. Water-resistant and ethically produced.",
    image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=600&fit=crop",
    price: 159.99,
    currency: "USD",
    domain: "fashion.example.com",
    tags: ["clothing", "sustainable", "winter"],
  },
  {
    id: "5",
    url: "https://tech.example.com/mechanical-keyboard",
    title: "RGB Mechanical Gaming Keyboard",
    description: "Professional gaming keyboard with Cherry MX switches, customizable RGB lighting, and programmable macros.",
    image_url: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=250&fit=crop",
    price: 129.99,
    currency: "USD",
    domain: "tech.example.com",
    tags: ["gaming", "peripherals", "mechanical"],
  },
  {
    id: "6",
    url: "https://home.example.com/coffee-maker",
    title: "Premium Espresso Coffee Machine",
    description: "Brew café-quality espresso at home with this professional-grade coffee machine. Features precise temperature control and steam wand.",
    image_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=450&fit=crop",
    price: 399.99,
    currency: "USD",
    domain: "home.example.com",
    tags: ["kitchen", "coffee", "appliances"],
  },
];

const Index = () => {
  const [bookmarks, setBookmarks] = useState(mockBookmarks);
  const [filteredBookmarks, setFilteredBookmarks] = useState(mockBookmarks);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"masonry" | "grid">("masonry");

  // Get all available tags
  const availableTags = Array.from(
    new Set(bookmarks.flatMap(bookmark => bookmark.tags || []))
  ).sort();

  // Filter bookmarks based on search and tags
  useEffect(() => {
    let filtered = bookmarks;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        bookmark =>
          bookmark.title?.toLowerCase().includes(query) ||
          bookmark.description?.toLowerCase().includes(query) ||
          bookmark.domain?.toLowerCase().includes(query) ||
          bookmark.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(bookmark =>
        selectedTags.every(selectedTag =>
          bookmark.tags?.includes(selectedTag)
        )
      );
    }

    setFilteredBookmarks(filtered);
  }, [bookmarks, searchQuery, selectedTags]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleBookmarkAdded = () => {
    // In real implementation, this would refetch data
    console.log("Bookmark added, should refetch data");
  };

  const handleDeleteBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
  };

  const handleEditBookmark = (id: string) => {
    console.log("Edit bookmark:", id);
    // TODO: Implement edit functionality
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Search Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-10 w-full mb-4" />
          </div>

          {/* Cards Skeleton */}
          <div className="masonry-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="masonry-item">
                <div className="bg-card rounded-lg overflow-hidden shadow-[var(--shadow-card)]">
                  <Skeleton className="w-full h-48" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Velora
            </h1>
            <p className="text-muted-foreground mt-1">
              Your beautiful bookmark canvas for tracking products and prices
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === "masonry" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("masonry")}
                className="h-8 w-8 p-0"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
              >
                <Layout className="h-4 w-4" />
              </Button>
            </div>
            <AddBookmarkDialog onBookmarkAdded={handleBookmarkAdded} />
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            availableTags={availableTags}
          />
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredBookmarks.length} {filteredBookmarks.length === 1 ? 'bookmark' : 'bookmarks'}
            {searchQuery || selectedTags.length > 0 ? ' found' : ' saved'}
          </p>
        </div>

        {/* Bookmarks Grid */}
        {filteredBookmarks.length > 0 ? (
          <div className={viewMode === "masonry" ? "masonry-grid" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"}>
            {filteredBookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                {...bookmark}
                onDelete={handleDeleteBookmark}
                onEdit={handleEditBookmark}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Grid className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No bookmarks found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedTags.length > 0
                ? "Try adjusting your search or filters"
                : "Start by adding your first bookmark"}
            </p>
            {!(searchQuery || selectedTags.length > 0) && (
              <AddBookmarkDialog onBookmarkAdded={handleBookmarkAdded} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
