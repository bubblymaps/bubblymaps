"use client";

import { useState } from "react";

export function SearchBar() {
  const [value, setValue] = useState("");
  return (
    <form
      className="group flex items-center rounded-full border border-input shadow-md h-10 w-60 max-w-[90vw] sm:w-72 md:w-80 lg:w-96 xl:w-[28rem] transition-all duration-300 bg-white dark:bg-zinc-900/80 dark:backdrop-blur-sm dark:text-white px-3 min-w-0 focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 focus-within:ring-offset-white dark:focus-within:ring-offset-zinc-900"
      onSubmit={e => {
        e.preventDefault();
        console.log("Search:", value);
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
          onChange={e => setValue(e.target.value)}
          className="w-full bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm pr-8 overflow-x-auto whitespace-nowrap transition-all duration-200"
          placeholder="Search for bubblers..."
          aria-label="Search"
          style={{ minWidth: 0 }}
        />
        {value && (
          <button
            type="button"
            onClick={() => setValue("")}
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
  );
}