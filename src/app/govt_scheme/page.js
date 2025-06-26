'use client';

import { useState, useEffect } from 'react';
import Filters from '@/app/govt_scheme/components/Filters';
import SchemeCard from '@/app/govt_scheme/components/SchemeCard';
import Image from 'next/image';

export default function SchemePage() {
  const [schemes, setSchemes] = useState([]);
  const [search, setSearch] = useState('');
  const [state, setState] = useState('');
  const [filters, setFilters] = useState({});
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const schemesPerPage = 5;

  useEffect(() => {
    fetch('/data/schemes.json')
      .then((res) => res.json())
      .then((data) => setSchemes(data));
  }, []);

  useEffect(() => {
    const result = schemes.filter((scheme) => {
      const matchSearch =
        !search || scheme['Scheme Name']?.toLowerCase().includes(search.toLowerCase());

      const matchState =
        !state || scheme.Residence_Cleaned?.toLowerCase().includes(state.toLowerCase());

      const matchFilters = Object.entries(filters).every(([key, val]) => {
        if (!val || val === '') return true;

        if (key === 'age_range') {
          const [min, max] = val.split('-').map(Number);
          const sMin = parseInt(scheme.min_age || '0');
          const sMax = parseInt(scheme.max_age || '999');
          return sMin <= max && sMax >= min;
        }

        if (key === 'income_upper_limit') {
          return Number(scheme.income_upper_limit || 9999999) <= Number(val);
        }

        if (key === 'sub_categories') {
          try {
            const subs = JSON.parse(scheme.sub_categories?.replace(/'/g, '"') || '[]');
            return subs.includes(val);
          } catch {
            return false;
          }
        }

        if (key === 'identity') return scheme[val] === 1 || scheme[val] === '1';
        if (key === 'caste') return scheme[val] === 1 || scheme[val] === '1';

        if (['DBT', 'Minority_Cleaned', 'Disability_Cleaned', 'BPL_Clean'].includes(key)) {
          const schemeVal = String(scheme[key])?.toLowerCase();
          return val === 'Yes'
            ? schemeVal === '1' || schemeVal === 'yes'
            : schemeVal === '0' || schemeVal === 'no';
        }

        return String(scheme[key] || '').toLowerCase().includes(String(val).toLowerCase());
      });

      return matchSearch && matchState && matchFilters;
    });

    setCurrentPage(1); // Reset to page 1 when filters change
    setFilteredSchemes(result);
  }, [search, state, filters, schemes]);

  // Pagination calculations
  const indexOfLast = currentPage * schemesPerPage;
  const indexOfFirst = indexOfLast - schemesPerPage;
  const currentSchemes = filteredSchemes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredSchemes.length / schemesPerPage);

  return (
    <div className="min-h-screen bg-[#fdf7ee] text-[#222]">
      <header className="bg-white border-b px-6 py-4 flex flex-col md:flex-row justify-between items-center shadow-sm gap-4">
        <div className="flex items-center space-x-3">
          <Image src="/icons/logo.png" alt="GrahaLaxmi Logo" width={82} height={82} />
          <h1 className="text-2xl font-bold text-[#222]">
            Grah<span className="text-[#e28555]">Laxmi</span>
          </h1>
        </div>
        <input
          type="text"
          placeholder="Search schemes"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-[#f2c66d] bg-[#fffaf3] rounded-lg w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-[#e28555]"
        />
      </header>

      <div className="flex flex-col md:flex-row">
        <Filters
          state={state}
          setState={setState}
          filters={filters}
          setFilters={setFilters}
        />

        <main className="flex-1 p-6">
          <h2 className="text-lg font-semibold mb-6">
            {filteredSchemes.length} schemes found
          </h2>

          <div className="space-y-6">
            {currentSchemes.map((scheme, idx) => (
              <SchemeCard key={idx} scheme={scheme} />
            ))}
          </div>

          {/* Pagination Controls */}
{totalPages > 1 && (
  <div className="flex justify-center mt-8 gap-2 flex-wrap">
    {/* Prev Button */}
    <button
      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
      disabled={currentPage === 1}
      className={`px-3 py-1 border rounded ${
        currentPage === 1
          ? 'text-gray-400 border-gray-300'
          : 'text-[#203C5B] border-[#203C5B] hover:bg-[#203C5B] hover:text-white'
      }`}
    >
      Prev
    </button>

    {/* Page Number Buttons (limited to 10 at a time) */}
    {(() => {
      const pageButtons = [];
      const pageWindowSize = 10;
      const currentWindow = Math.floor((currentPage - 1) / pageWindowSize);
      const start = currentWindow * pageWindowSize + 1;
      const end = Math.min(start + pageWindowSize - 1, totalPages);

      for (let i = start; i <= end; i++) {
        pageButtons.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`px-3 py-1 border rounded ${
              currentPage === i
                ? 'bg-[#203C5B] text-white border-[#203C5B]'
                : 'text-[#203C5B] border-[#203C5B] hover:bg-[#203C5B] hover:text-white'
            }`}
          >
            {i}
          </button>
        );
      }

      return pageButtons;
    })()}

    {/* Next Button */}
    <button
      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
      disabled={currentPage === totalPages}
      className={`px-3 py-1 border rounded ${
        currentPage === totalPages
          ? 'text-gray-400 border-gray-300'
          : 'text-[#203C5B] border-[#203C5B] hover:bg-[#203C5B] hover:text-white'
      }`}
    >
      Next
    </button>
  </div>
)}

        </main>
      </div>
    </div>
  );
}
