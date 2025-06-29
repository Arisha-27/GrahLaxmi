'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/lib/firebase';
import { signOut } from 'firebase/auth';

import Filters from '@/app/govt_scheme/components/Filters';
import SchemeCard from '@/app/govt_scheme/components/SchemeCard';
import {
  Menu,
  Home,
  Landmark,
  MessageCircle,
  LogOut,
  X,
} from 'lucide-react';

export default function SchemePage() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [schemes, setSchemes] = useState([]);
  const [search, setSearch] = useState('');
  const [state, setState] = useState('');
  const [filters, setFilters] = useState({});
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const schemesPerPage = 6;

  useEffect(() => {
    fetch('/data/schemes.json')
      .then((res) => res.json())
      .then((data) => setSchemes(data));
  }, []);

  useEffect(() => {
    const result = schemes.filter((scheme) => {
      const matchSearch = !search || scheme['Scheme Name']?.toLowerCase().includes(search.toLowerCase());
      const matchState = !state || scheme.Residence_Cleaned?.toLowerCase().includes(state.toLowerCase());

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

        if (key === 'identity' || key === 'caste') {
          return scheme[val] === 1 || scheme[val] === '1';
        }

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

    setCurrentPage(1);
    setFilteredSchemes(result);
  }, [search, state, filters, schemes]);

  const indexOfLast = currentPage * schemesPerPage;
  const indexOfFirst = indexOfLast - schemesPerPage;
  const currentSchemes = filteredSchemes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredSchemes.length / schemesPerPage);

  const goTo = (path) => {
    router.push(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#fdf7ee] text-[#222] relative">

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white/90 backdrop-blur-md border-r border-[#f2c66d]/30 shadow-2xl p-6 pt-14 transition-transform duration-300 z-50 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 text-[#203C5B] hover:text-[#e28555] transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Profile & Navigation */}
        <div onClick={() => goTo('/dashboard')} className="cursor-pointer flex flex-col items-center mb-6">
          <Image
            src={user?.photoURL || '/default-avatar.png'}
            alt="Profile"
            width={60}
            height={60}
            className="rounded-full border-2 border-[#e28555]"
          />
          <h2 className="text-base font-semibold mt-2 text-[#203C5B]">
            {user?.displayName || 'User'}
          </h2>
          <p className="text-[#666] text-xs">{user?.email || ''}</p>
        </div>

        <nav className="flex flex-col gap-4 text-[#203C5B] font-medium text-sm">
          <p onClick={() => goTo('/dashboard')} className="flex items-center gap-2 cursor-pointer hover:text-[#e28555]">
            <Home className="w-5 h-5" /> Dashboard
          </p>
          <p onClick={() => goTo('/govt_scheme')} className="flex items-center gap-2 cursor-pointer hover:text-[#e28555]">
            <Landmark className="w-5 h-5" /> Govt Schemes
          </p>
          <p onClick={() => goTo('/chatbot')} className="flex items-center gap-2 cursor-pointer hover:text-[#e28555]">
            <MessageCircle className="w-5 h-5" /> Chatbot
          </p>
          <p
            onClick={async () => {
              await signOut(auth);
              router.push('/login');
            }}
            className="flex items-center gap-2 cursor-pointer text-red-500 hover:underline"
          >
            <LogOut className="w-5 h-5" /> Logout
          </p>
        </nav>
      </div>

      {/* Header */}
      <header className="bg-white border-b px-6 pl-4 md:pl-8 py-4 flex flex-col md:flex-row justify-between items-center shadow-sm gap-4">
        <div className="flex items-center space-x-3">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="bg-[#203C5B] p-2 rounded-full shadow-lg hover:bg-[#e28555] transition-colors"
              aria-label="Open Sidebar"
            >
              <Menu className="text-white w-6 h-6" />
            </button>
          )}
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

      {/* Page Content */}
      <div className="flex flex-col md:flex-row">
        <Filters state={state} setState={setState} filters={filters} setFilters={setFilters} />
        <main className="flex-1 p-6">
          <h2 className="text-lg font-semibold mb-6">
            {filteredSchemes.length} schemes found
          </h2>

          <div className="flex flex-wrap gap-3 justify-between">
            {currentSchemes.map((scheme, idx) => (
              <SchemeCard key={idx} scheme={scheme} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2 flex-wrap">
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

              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === page
                        ? 'bg-[#203C5B] text-white border-[#203C5B]'
                        : 'text-[#203C5B] border-[#203C5B] hover:bg-[#203C5B] hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

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
