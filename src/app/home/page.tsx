'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Footer } from '@/components/footer';
import Header from '@/components/header';

interface Stats {
  totalWaypoints: number;
  totalVerifiedWaypoints: number;
  totalUsers: number;
  totalReviews: number;
  totalContributions: number;
}

interface SearchResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  region?: string;
}

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [wordIndex, setWordIndex] = useState(0);
  const words = ["water bubblers", "fountains", "refill stations"];

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Fetch stats
  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to fetch stats', err));
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch results
  useEffect(() => {
    async function search() {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/waypoints/search?q=${encodeURIComponent(debouncedQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.waypoints);
        }
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setLoading(false);
      }
    }

    search();
  }, [debouncedQuery]);

  const handleSelect = (result: SearchResult) => {
    router.push(`/?lat=${result.latitude}&lng=${result.longitude}&zoom=20`);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background flex flex-col">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center -mt-20">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Find{' '}
              <AnimatePresence mode="wait">
                <motion.span
                  key={words[wordIndex]}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="inline-block"
                >
                  {words[wordIndex]}
                </motion.span>
              </AnimatePresence>
              , <br className="hidden md:block" />
              <span className="text-blue-600 dark:text-blue-400">anywhere you go.</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Discover thousands of water bubblers, fountains, and refill stations contributed by the community.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative max-w-xl mx-auto w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <Input 
                className="pl-10 h-12 text-lg bg-white dark:bg-zinc-800 shadow-lg border-zinc-200 dark:border-zinc-700 rounded-full focus-visible:border-blue-600 dark:focus-visible:border-blue-400 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400"
                placeholder="Search by name, region, or description..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {loading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 animate-spin" />
              )}
            </div>

            {/* Results Dropdown */}
            {(results.length > 0 || (query && !loading && results.length === 0 && debouncedQuery)) && (
              <Card className="absolute top-full left-0 right-0 mt-2 p-2 shadow-xl z-10 max-h-80 overflow-y-auto">
                {results.length > 0 ? (
                  <div className="space-y-1">
                    {results.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleSelect(result)}
                        className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left cursor-pointer"
                      >
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full shrink-0 cursor-pointer">
                          <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="cursor-pointer">
                          <div className="font-medium text-zinc-900 dark:text-zinc-100">
                            {result.name}
                          </div>
                          {result.region && (
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">
                              {result.region}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-zinc-500">
                    No results found for "{query}"
                  </div>
                )}
              </Card>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/?lat=-33.8688&lng=151.2093&zoom=12">
                Sydney <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/?lat=-37.8136&lng=144.9631&zoom=12">
                Melbourne <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/?lat=-27.4698&lng=153.0251&zoom=12">
                Brisbane <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          {stats && (
            <div className="grid grid-cols-3 gap-4 md:gap-8 w-full max-w-2xl pt-8 mt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
              <div className="flex flex-col items-center">
                <div className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  {stats.totalContributions.toLocaleString()}
                </div>
                <div className="text-xs md:text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">
                  Contributions
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  {stats.totalVerifiedWaypoints.toLocaleString()}
                </div>
                <div className="text-xs md:text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">
                  Verified Fountains
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  {stats.totalUsers.toLocaleString()}
                </div>
                <div className="text-xs md:text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">
                  Users
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
