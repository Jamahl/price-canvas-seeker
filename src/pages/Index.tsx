import { useState, useEffect } from "react";
import { BookmarkCard } from "@/components/BookmarkCard";
import { AddBookmarkDialog } from "@/components/AddBookmarkDialog";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Grid, Layout } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Bookmark {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  price: number | null;
  currency: string | null;
  domain: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

const Index = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"masonry" | "grid">("masonry");
  const { toast } = useToast();

  // Get all available tags
  const availableTags = Array.from(
    new Set(bookmarks.flatMap(bookmark => bookmark.tags || []))
  ).sort();

  // Fetch bookmarks from Supabase
  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setBookmarks([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookmarks:', error);
        toast({
          title: "Error",
          description: "Failed to load bookmarks.",
          variant: "destructive",
        });
        return;
      }

      setBookmarks(data || []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      toast({
        title: "Error",
        description: "Failed to load bookmarks.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load bookmarks on component mount
  useEffect(() => {
    fetchBookmarks();
  }, []);

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

    // Add price similarity indicator
    const filteredWithPriceInfo = filtered.map(bookmark => {
      if (bookmark.price) {
        const similarPriceItems = bookmarks.filter(b => 
          b.id !== bookmark.id && 
          b.price && 
          Math.abs(b.price - bookmark.price!) <= bookmark.price! * 0.2 // Within 20% price range
        );
        return { ...bookmark, similarPriceCount: similarPriceItems.length };
      }
      return bookmark;
    });

    setFilteredBookmarks(filteredWithPriceInfo);
  }, [bookmarks, searchQuery, selectedTags]);

  const handleBookmarkAdded = () => {
    fetchBookmarks(); // Refetch data when new bookmark is added
  };

  const handleDeleteBookmark = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting bookmark:', error);
        toast({
          title: "Error",
          description: "Failed to delete bookmark.",
          variant: "destructive",
        });
        return;
      }

      setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
      toast({
        title: "Bookmark deleted",
        description: "Bookmark has been removed successfully.",
      });
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to delete bookmark.",
        variant: "destructive",
      });
    }
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
                similarPriceCount={(bookmark as any).similarPriceCount}
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
