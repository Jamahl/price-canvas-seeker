import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Heart, MoreVertical, TrendingDown, TrendingUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BookmarkCardProps {
  id: string;
  url: string;
  title?: string;
  description?: string;
  image_url?: string;
  price?: number;
  currency?: string;
  domain?: string;
  tags?: string[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function BookmarkCard({
  id,
  url,
  title,
  description,
  image_url,
  price,
  currency = "USD",
  domain,
  tags,
  onDelete,
  onEdit,
}: BookmarkCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  const handleVisitSite = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="masonry-item card-hover overflow-hidden border-0 shadow-[var(--shadow-card)] bg-card">
      {/* Image */}
      {image_url && !imageError && (
        <div className="relative">
          <img
            src={image_url}
            alt={title || "Product image"}
            className={`w-full h-auto object-cover transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart
                className={`h-4 w-4 ${
                  isLiked ? "fill-primary text-primary" : "text-muted-foreground"
                }`}
              />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(id)}>
                  Edit bookmark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete?.(id)} className="text-destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        {price && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(price, currency)}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 text-green-500" />
              <span>Track price</span>
            </div>
          </div>
        )}

        {/* Title */}
        {title && (
          <h3 className="font-semibold text-card-foreground line-clamp-2 mb-2">
            {title}
          </h3>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {description}
          </p>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Domain & Visit Button */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{domain}</span>
          <Button size="sm" onClick={handleVisitSite} className="h-8">
            <ExternalLink className="h-3 w-3 mr-1" />
            Visit
          </Button>
        </div>
      </div>
    </Card>
  );
}