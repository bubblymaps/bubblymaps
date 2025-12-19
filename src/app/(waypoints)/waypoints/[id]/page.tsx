'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  MapPin,
  Star,
  Clock,
  Flag,
  Edit3,
  Share2,
  ChevronLeft,
  Droplets,
  Dog,
  Accessibility,
  Building,
  MapPinned,
  ExternalLink,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle2,
  History,
  Navigation,
  Copy,
  Check,
  Plus,
  Pencil,
  Trash2,
  FileEdit,
  RefreshCw,
  ArrowUpRight,
} from 'lucide-react';

import type { Waypoint, WaypointLog } from '@/types/waypoints';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Verified } from '@/components/badges/verified';
import { Moderator } from '@/components/badges/moderator';

interface Review {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  user: {
    id: string;
    handle?: string;
    displayName?: string;
    image?: string;
    verified?: boolean;
    moderator?: boolean;
  };
}

interface LogUser {
  id: string;
  handle?: string;
  displayName?: string;
  image?: string | null;
  verified?: boolean;
  moderator?: boolean;
}

interface WaypointLogWithUser extends WaypointLog {
  user?: LogUser;
}

interface WaypointWithReviews extends Waypoint {
  addedBy?: {
    id: string;
    handle?: string;
    displayName?: string;
    image?: string;
    verified?: boolean;
    moderator?: boolean;
  };
  reviews?: Review[];
}

const actionIcons: Record<string, React.ReactNode> = {
  CREATE: <Plus className="w-4 h-4" />,
  UPDATE: <Pencil className="w-4 h-4" />,
  DELETE: <Trash2 className="w-4 h-4" />,
};

const actionColors: Record<string, string> = {
  CREATE: 'bg-green-500/10 text-green-600 dark:text-green-400',
  UPDATE: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  DELETE: 'bg-red-500/10 text-red-600 dark:text-red-400',
};

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-zinc-200 text-zinc-200 dark:fill-zinc-700 dark:text-zinc-700'
          }`}
        />
      ))}
    </div>
  );
}

function InteractiveStarRating({ 
  rating, 
  onRatingChange 
}: { 
  rating: number; 
  onRatingChange: (rating: number) => void;
}) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="cursor-pointer transition-transform hover:scale-110"
        >
          <Star
            className={`w-7 h-7 ${
              star <= (hoverRating || rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-zinc-200 text-zinc-200 dark:fill-zinc-700 dark:text-zinc-700'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Skeleton className="w-10 h-10 rounded-full mb-6" />
        <Skeleton className="w-full h-64 rounded-xl mb-6" />
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-6" />
        <div className="flex gap-2 mb-6">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-20 w-full mb-6" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}

function RelativeTime({ date }: { date: string | Date }) {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return <span>just now</span>;
  if (minutes < 60) return <span>{minutes}m ago</span>;
  if (hours < 24) return <span>{hours}h ago</span>;
  if (days < 7) return <span>{days}d ago</span>;
  return <span>{d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>;
}

const fieldLabels: Record<string, string> = {
  name: 'Name',
  description: 'Description',
  latitude: 'Latitude',
  longitude: 'Longitude',
  region: 'Region',
  maintainer: 'Maintainer',
  amenities: 'Amenities',
  image: 'Image',
  verified: 'Verified',
  approved: 'Approved',
};

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'string') return value || '—';
  return JSON.stringify(value);
}

function getChangedFields(
  oldData: Record<string, unknown> | null | undefined,
  newData: Record<string, unknown> | null | undefined
): { field: string; oldValue: unknown; newValue: unknown }[] {
  const changes: { field: string; oldValue: unknown; newValue: unknown }[] = [];
  const allKeys = new Set([...Object.keys(oldData || {}), ...Object.keys(newData || {})]);
  
  const ignoredKeys = ['id', 'createdAt', 'updatedAt', 'addedByUserId', 'bubblerId'];
  
  allKeys.forEach((key) => {
    if (ignoredKeys.includes(key)) return;
    const oldVal = oldData?.[key];
    const newVal = newData?.[key];
    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      changes.push({ field: key, oldValue: oldVal, newValue: newVal });
    }
  });
  
  return changes;
}

export default function WaypointPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const [waypoint, setWaypoint] = useState<WaypointWithReviews | null>(null);
  const [logs, setLogs] = useState<WaypointLogWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);
  
  // Report dialog state
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  // UI state
  const [copied, setCopied] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    async function fetchWaypoint() {
      try {
        const res = await fetch(`/api/waypoints/${id}`);
        if (!res.ok) throw new Error('Failed to load waypoint');
        const data = await res.json();
        setWaypoint(data.waypoint);
        if (data.logs) setLogs(data.logs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchWaypoint();
  }, [id]);

  const handleSubmitReview = async () => {
    if (reviewRating === 0) return;
    
    setSubmittingReview(true);
    try {
      const res = await fetch(`/waypoints/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
      });
      
      if (!res.ok) throw new Error('Failed to submit review');
      
      // Refresh waypoint data
      const waypointRes = await fetch(`/api/waypoints/${id}`);
      const data = await waypointRes.json();
      setWaypoint(data.waypoint);
      
      // Reset form
      setReviewRating(0);
      setReviewComment('');
      setShowReviewForm(false);
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    setDeletingReviewId(reviewId);
    try {
      const res = await fetch(`/waypoints/${id}/reviews?id=${reviewId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete review');

      // Refresh waypoint data
      const waypointRes = await fetch(`/api/waypoints/${id}`);
      const data = await waypointRes.json();
      setWaypoint(data.waypoint);
    } catch (err) {
      console.error('Failed to delete review:', err);
    } finally {
      setDeletingReviewId(null);
    }
  };

  const handleSubmitReport = async () => {
    if (!reportReason.trim()) return;
    
    setSubmittingReport(true);
    try {
      const res = await fetch(`/api/waypoints/${id}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reportReason }),
      });
      
      if (!res.ok) throw new Error('Failed to submit report');
      
      setReportDialogOpen(false);
      setReportReason('');
    } catch (err) {
      console.error('Failed to submit report:', err);
    } finally {
      setSubmittingReport(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: waypoint?.name,
          text: waypoint?.description,
          url,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const averageRating = waypoint?.reviews?.length
    ? waypoint.reviews.reduce((sum, r) => sum + r.rating, 0) / waypoint.reviews.length
    : 0;

  const userHasReviewed = waypoint?.reviews?.some(
    (review) => review.user.id === session?.user?.id
  );

  if (loading) return <LoadingSkeleton />;

  if (error || !waypoint) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-background px-4">
        <div className="flex flex-col items-center gap-6 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <MapPin className="w-8 h-8 text-zinc-400" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Waypoint Not Found</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            The waypoint you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild className="cursor-pointer">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="cursor-pointer rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="cursor-pointer rounded-full">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleShare} className="cursor-pointer">
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
                {copied ? 'Copied!' : 'Share'}
              </DropdownMenuItem>
              {session?.user && (
                <>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={`/waypoints/${id}/edit`}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Waypoint
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setReportDialogOpen(true)}
                    className="cursor-pointer text-red-600 dark:text-red-400"
                  >
                    <Flag className="w-4 h-4 mr-2 text-red-600 dark:text-red-400" />
                    Report Abuse
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Image */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6 bg-zinc-100 dark:bg-zinc-800">
          {waypoint.image ? (
            <img
              src={waypoint.image}
              alt={waypoint.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Droplets className="w-12 h-12 text-zinc-300 dark:text-zinc-600" />
            </div>
          )}
        </div>

        {/* Title & Location */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            {waypoint.name} {waypoint.verified && <Verified content={`Verified by ${waypoint.maintainer}.`} />}
          </h1>
          <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-2">
            <MapPin className="w-3.5 h-3.5  -mr-1" />
            <span>{waypoint.region || 'Unknown location'}</span>
            {waypoint.maintainer && (
              <>
                <span>·</span>
                <span>Maintained by {waypoint.maintainer}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
            {waypoint.reviews && waypoint.reviews.length > 0 ? (
              <div className="flex items-center gap-1.5">
                <StarRating rating={Math.round(averageRating)} size="sm" />
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {averageRating.toFixed(1)}
                </span>
                <span>({waypoint.reviews.length})</span>
              </div>
            ) : (
              <span className="text-zinc-400"></span>
            )}
          </div>
        </div>

        {/* Amenities */}
        {waypoint.amenities && waypoint.amenities.length > 0 && (
          <div className="mt-0 flex flex-wrap gap-2 mt-3 -mr-3 mb-3">
            {waypoint.amenities.map((amenity, idx) => (
              <span
                key={idx}
                className="text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full"
              >
                {amenity}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        {waypoint.description && (
          <p className="text-zinc-700 dark:text-zinc-300 mb-6 leading-relaxed">
            {waypoint.description}
          </p>
        )}

        {/* Details */}
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-6">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Added {new Date(waypoint.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <a
            href={`/?lat=${waypoint.latitude}&lng=${waypoint.longitude}&zoom=20`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <span>{waypoint.latitude.toFixed(4)}, {waypoint.longitude.toFixed(4)}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Added By */}
        {waypoint.addedBy && (
          <div className="flex items-center gap-3 mb-8">
            <Link href={`/profile/${waypoint.addedBy.handle}`}>
              <Avatar className="w-10 h-10">
                <AvatarImage src={waypoint.addedBy.image || ''} alt={waypoint.addedBy.displayName || ''} />
                <AvatarFallback>
                  {(waypoint.addedBy.displayName || waypoint.addedBy.handle || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <Link
                  href={`/profile/${waypoint.addedBy.handle}`}
                  className="text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:underline"
                >
                  @{waypoint.addedBy.handle}
                </Link>
                {waypoint.addedBy.verified && (
                  <Verified content="Official account of a government, organization, or recognized entity." />
                )}
                {waypoint.addedBy.moderator && <Moderator />}
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">Added this waypoint</span>
            </div>
          </div>
        )}

        <Separator className="mb-4" />

        {/* Reviews Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Reviews</h2>
            {!showReviewForm && !userHasReviewed && session?.user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReviewForm(true)}
                className="cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 -mr-2"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Review
              </Button>
            )}
          </div>

          {/* Add Review Form */}
          {showReviewForm && (
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-1 mb-4">
                <InteractiveStarRating rating={reviewRating} onRatingChange={setReviewRating} />
              </div>
              <Textarea
                placeholder="Share your experience (optional)"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="mb-3 bg-white dark:bg-zinc-800"
                rows={2}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewRating(0);
                    setReviewComment('');
                  }}
                  className="cursor-pointer flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitReview}
                  disabled={reviewRating === 0 || submittingReview}
                  className="cursor-pointer flex-1"
                >
                  {submittingReview ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </div>
          )}

          {/* Sign In Prompt */}
          {!session?.user && (
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6 mb-6 text-center">
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-2">Have you been here?</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Sign in to share your experience and help others discover great places.
              </p>
              <Button asChild className="cursor-pointer">
                <Link href="/login">Sign In to Review</Link>
              </Button>
            </div>
          )}

          {/* Reviews List */}
          {waypoint.reviews && waypoint.reviews.length > 0 ? (
            <div className="space-y-3">
              {waypoint.reviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-zinc-100 dark:border-zinc-800 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Link href={`/profile/${review.user.handle}`}>
                        <Avatar className="w-7 h-7">
                          <AvatarImage src={review.user.image || ''} alt={review.user.displayName || ''} />
                          <AvatarFallback className="text-xs">
                            {(review.user.displayName || review.user.handle || 'U').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/profile/${review.user.handle}`}
                          className="text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:underline"
                        >
                          @{review.user.handle}
                        </Link>
                        {review.user.verified && <Verified content="Official account of a government, organization, or recognized entity." />}
                        {review.user.moderator && <Moderator />}
                        <span className="text-xs text-zinc-400">·</span>
                        <span className="text-xs text-zinc-400">
                          <RelativeTime date={review.createdAt} />
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} size="sm" />
                      {session?.user?.id === review.user.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteReview(review.id)}
                          disabled={deletingReviewId === review.id}
                          className="h-6 w-6 text-zinc-400 hover:text-red-600"
                        >
                          {deletingReviewId === review.id ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 pl-9">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-400 text-center py-6">
              No reviews yet
            </p>
          )}
        </div>

        {/* History */}
        {logs.length > 0 && (
          <>
            <Separator className="mb-6" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <History className="w-4 h-4" />
                  Edit History
                </h2>
                {logs.length > 3 && (
                  <button
                    onClick={() => setShowAllHistory(!showAllHistory)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    {showAllHistory ? 'Show less' : `Show all (${logs.length})`}
                  </button>
                )}
              </div>
              <div className="space-y-1">
                {(showAllHistory ? logs : logs.slice(0, 3)).map((log) => {
                  const changes = getChangedFields(log.oldData, log.newData);
                  const hasChanges = changes.length > 0 || log.action === 'CREATE';
                  return (
                    <Collapsible key={log.id}>
                      <CollapsibleTrigger asChild>
                        <button className="w-full flex items-center gap-2.5 text-sm py-2 px-2 -mx-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer text-left">
                          <div className={`p-1 rounded-full ${actionColors[log.action] || 'bg-zinc-100 dark:bg-zinc-800'}`}>
                            {actionIcons[log.action] || <RefreshCw className="w-3.5 h-3.5" />}
                          </div>
                          <div className="flex-1 min-w-0 flex items-center gap-1.5">
                            {log.user ? (
                              <Link
                                href={`/profile/${log.user.handle}`}
                                className="font-medium text-zinc-700 dark:text-zinc-300 hover:underline truncate"
                              >
                                @{log.user.handle}
                              </Link>
                            ) : (
                              <span className="text-zinc-500">Unknown</span>
                            )}
                            {log.user?.verified && <Verified content="Official account of a government, organization, or recognized entity." />}
                            {log.user?.moderator && <Moderator />}
                            <span className="text-zinc-400">
                              {log.action === 'CREATE' && 'added the waypoint'}
                              {log.action === 'UPDATE' && 'edited information'}
                              {log.action === 'DELETE' && 'deleted the waypoint'}
                            </span>
                          </div>
                          <span className="text-xs text-zinc-400 shrink-0">
                            <RelativeTime date={log.createdAt} />
                          </span>
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="ml-8 mt-1 mb-2 text-xs space-y-1.5">
                          {log.action === 'CREATE' && log.newData && (
                            <p className="text-zinc-500 dark:text-zinc-400 italic">
                              Created waypoint &quot;{String((log.newData as Record<string, unknown>).name || 'Untitled')}&quot;
                            </p>
                          )}
                          {log.action === 'UPDATE' && changes.length > 0 && (
                            <div className="space-y-1">
                              {changes.map(({ field, oldValue, newValue }) => (
                                <div key={field} className="flex items-start gap-2">
                                  <span className="text-zinc-500 dark:text-zinc-400 shrink-0">
                                    {fieldLabels[field] || field}:
                                  </span>
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="text-red-500/70 line-through truncate max-w-[120px]">
                                      {formatValue(oldValue)}
                                    </span>
                                    <span className="text-zinc-400">→</span>
                                    <span className="text-green-600 dark:text-green-400 truncate max-w-[120px]">
                                      {formatValue(newValue)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {log.action === 'DELETE' && (
                            <p className="text-zinc-500 dark:text-zinc-400 italic">
                              Waypoint was deleted
                            </p>
                          )}
                          {log.action === 'UPDATE' && changes.length === 0 && (
                            <p className="text-zinc-500 dark:text-zinc-400 italic">
                              No changes have been logged.
                            </p>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Report Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Report This Waypoint
            </DialogTitle>
            <DialogDescription>
              Help us keep the community safe by reporting inappropriate or incorrect content.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Please describe the issue..."
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReportDialogOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleSubmitReport}
              disabled={!reportReason.trim() || submittingReport}
              className="cursor-pointer"
            >
              {submittingReport ? 'Submitting...' : 'Submit Report'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}