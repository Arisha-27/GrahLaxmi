'use client';

import { ExternalLink } from 'lucide-react';

export default function SchemeCard({ scheme }) {
  let subCategories = scheme.sub_categories;
  if (typeof subCategories === 'string') {
    try {
      subCategories = JSON.parse(subCategories.replace(/'/g, '"'));
    } catch {
      subCategories = [scheme.sub_categories];
    }
  }

  const tagColors = [
    'bg-[#D86C4F] text-white',
    'bg-[#D8A39D] text-[#222]',
    'bg-[#F2C66D] text-[#222]',
    'bg-[#E8D1A0] text-[#222]',
    'bg-[#B68B94] text-white',
    'bg-[#A6A37D] text-white',
  ];

  return (
    <div className="bg-[#fffaf3] border border-[#f2c66d] p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300 space-y-3">
      <h3 className="text-lg md:text-xl font-semibold text-[#222]">
        {scheme['Scheme Name']}
      </h3>

      <p className="text-sm text-[#666] leading-relaxed">
        {scheme.Description}
      </p>

      {Array.isArray(subCategories) && subCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {subCategories.map((cat, i) => (
            <span
              key={i}
              className={`text-xs font-medium px-3 py-1 rounded-full ${tagColors[i % tagColors.length]}`}
            >
              {cat}
            </span>
          ))}
        </div>
      )}

      {scheme['Apply Link'] && (
        <a
          href={scheme['Apply Link']}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1 bg-[#e28555] text-white text-xs font-medium rounded-full hover:bg-[#d86c4f] transition mt-2"
        >
          Apply Now
          <ExternalLink size={14} />
        </a>
      )}
    </div>
  );
}
