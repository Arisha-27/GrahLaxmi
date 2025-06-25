'use client';

import { userBenefits } from '@/data/data'; 

const KeyBenefits = () => {
  return (
    <section
      className="py-20 text-gray-700 px-6 md:px-8 lg:px-24 max-w-full"
      style={{
        background: "linear-gradient(to bottom, #ffffff, #fdf5eb, #fffaf3)"
      }}
    >
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
        {userBenefits.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-start gap-6">
              <Icon className="w-10 h-10 mt-1 shrink-0" style={{ color: '#2F0089' }} />
              <div>
                <p className="text-2xl font-semibold mb-2 text-black">
                  {item.title}
                </p>
                <ul className="list-disc pl-5 text-gray-600 text-base space-y-1">
                  {item.description.map((desc, idx) => (
                    <li key={idx}>{desc}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default KeyBenefits;
