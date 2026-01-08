"use client";

import { useState, useEffect, useRef } from "react";
import type { Waypoint } from "@/types/waypoints";

interface SearchBarProps {
  waypoints?: Waypoint[];
  onSelect?: (waypoint: Waypoint) => void;
}

export function SearchBar({ waypoints = [], onSelect }: SearchBarProps) {
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [results, setResults] = useState<Waypoint[]>([]);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), 300);
    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!debouncedValue.trim()) {
      setResults([]);
      return;
    }

    const search = debouncedValue.toLowerCase();
    const filtered = waypoints.filter(w => {
      if (!w) return false;
      const name = w.name ? String(w.name).toLowerCase() : '';
      const description = w.description ? String(w.description).toLowerCase() : '';
      return name.includes(search) || description.includes(search);
    }).slice(0, 5);

    setResults(filtered);
  }, [debouncedValue, waypoints]);

  const handleSelect = (waypoint: Waypoint) => {
    setValue(waypoint.name);
    setDebouncedValue(waypoint.name);
    setShowResults(false);
    onSelect?.(waypoint);
  };

  return (
    <div ref={containerRef} className="relative z-50">
      <form
        className="group flex items-center rounded-full border border-input shadow-md h-10 w-full max-w-[90vw] sm:w-72 md:w-80 lg:w-96 xl:w-[28rem] transition-all duration-300 bg-white dark:bg-zinc-900/80 dark:backdrop-blur-sm dark:text-white px-3 min-w-0 focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 focus-within:ring-offset-white dark:focus-within:ring-offset-zinc-900"
        onSubmit={e => {
          e.preventDefault();
          if (results.length > 0 && results[0]) {
            handleSelect(results[0]);
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5 mr-2 flex-shrink-0 text-zinc-400 dark:text-zinc-500"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <div className="relative flex-1 min-w-0 flex items-center">
          <input
            type="text"
            value={value}
            onChange={e => {
              setValue(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            className="pr-8 overflow-x-auto whitespace-nowrap border-none shadow-none focus:ring-0 hover:shadow-none bg-transparent p-0 h-full w-full rounded-none outline-none"
            placeholder={`Search ${waypoints.length} bubblers...`}
            aria-label="Search"
            style={{ minWidth: 0 }}
          />
          {value && (
            <button
              type="button"
              onClick={() => {
                setValue("");
                setResults([]);
              }}
              className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors p-1 rounded-full bg-transparent focus:bg-zinc-100 dark:focus:bg-zinc-800"
              aria-label="Clear search"
              tabIndex={0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {showResults && value.trim() && (
        <div className="absolute top-12 left-0 right-0 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden max-h-60 overflow-y-auto z-[100]">
          {results.length > 0 ? (
            results.map((waypoint) => (
              <button
                key={waypoint.id}
                onClick={() => handleSelect(waypoint)}
                className="w-full text-left px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border-b border-zinc-100 dark:border-zinc-800 last:border-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{waypoint.name}</span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">#{waypoint.id}</span>
                </div>
                {waypoint.description && (
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                    {waypoint.description}
                  </div>
                )}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 text-center">
              {waypoints.length === 0 ? "Loading data..." : "No results found"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}