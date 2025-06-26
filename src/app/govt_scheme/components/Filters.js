'use client';

import {
  FunnelIcon,
  ArrowPathIcon,
  GlobeAsiaAustraliaIcon,
  UserIcon,
  CurrencyRupeeIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  UsersIcon,
  HomeIcon,
  HeartIcon,
  IdentificationIcon,
  KeyIcon,
} from '@heroicons/react/24/solid';

import { useEffect, useState } from 'react';
import schemes from '@/data/schemes.json';

export default function Filters({ state, setState, filters, setFilters }) {
  const [dropdownOptions, setDropdownOptions] = useState({});

  useEffect(() => {
    const extractUniqueOptions = (field) => {
      const values = schemes.map((scheme) => scheme[field]);
      return Array.from(new Set(values.filter(Boolean))).sort();
    };

    const extractArrayField = (field) => {
      const values = schemes.flatMap((scheme) => {
        try {
          return typeof scheme[field] === 'string'
            ? JSON.parse(scheme[field].replace(/'/g, '"') || '[]')
            : [];
        } catch {
          return [];
        }
      });
      return Array.from(new Set(values)).sort();
    };

    const validAgeRanges = ['5-19', '20-34', '35-49', '50-64', '65-79', '80-94'];

    setDropdownOptions({
      ageRanges: validAgeRanges,
      income_upper_limit: ['50000', '100000', '200000', '300000', '500000'],
      caste: [
        { label: 'SC', value: 'caste_sc' },
        { label: 'ST', value: 'caste_st' },
        { label: 'OBC', value: 'caste_obc' },
        { label: 'EWS', value: 'caste_ews' },
        { label: 'General', value: 'caste_general' },
        { label: 'Minority', value: 'caste_minority' },
      ],
      identity: [
        { label: 'Woman', value: 'is_woman' },
        { label: 'Student', value: 'is_student' },
        { label: 'Disabled', value: 'is_disabled' },
        { label: 'Widow', value: 'is_widow' },
        { label: 'Pregnant', value: 'is_pregnant' },
        { label: 'Farmer', value: 'is_farmer' },
        { label: 'Entrepreneur', value: 'is_entrepreneur' },
        { label: 'Orphan', value: 'is_orphan' },
        { label: 'Elderly', value: 'is_elderly' },
      ],
      DBT: ['Yes', 'No'],
      income_category: extractUniqueOptions('income_category'),
      sub_categories: extractArrayField('sub_categories'),
      primary_category: extractUniqueOptions('primary_category'),
      Residence_Cleaned: extractUniqueOptions('Residence_Cleaned'),
      Minority_Cleaned: ['Yes', 'No'],
      Disability_Cleaned: ['Yes', 'No'],
      Benefit_Category: extractUniqueOptions('Benefit_Category'),
      Marital_Status_Clean: extractUniqueOptions('Marital_Status_Clean'),
      BPL_Clean: ['Yes', 'No'],
      Employment_Status_Clean: extractUniqueOptions('Employment_Status_Clean'),
      Application_Mode_Clean: extractUniqueOptions('Application_Mode_Clean'),
      Scheme_Type_Clean: extractUniqueOptions('Scheme_Type_Clean'),
      Location_Clean: extractUniqueOptions('Location_Clean'),
    });
  }, []);

  const handleSelect = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const renderDropdown = (label, field, options, Icon) =>
    options?.length > 0 && (
      <div className="space-y-1">
        <label className="text-sm text-[#222] font-medium flex items-center gap-2">
          <Icon className="w-4 h-4 text-[#e28555]" />
          {label}
        </label>
        <select
          className="w-full p-2 border border-[#f2c66d] bg-[#fffaf3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e28555] transition"
          value={filters[field] || ''}
          onChange={(e) => handleSelect(field, e.target.value)}
        >
          <option value="">All</option>
          {options.map((option) =>
            typeof option === 'string' ? (
              <option key={option} value={option}>{option}</option>
            ) : (
              <option key={option.value} value={option.value}>{option.label}</option>
            )
          )}
        </select>
      </div>
    );

return (
  <aside className="w-full md:w-64 lg:w-1/5 bg-[#fffef9] p-5 border-r border-[#f2c66d] shadow-sm space-y-4 overflow-y-auto rounded-tr-2xl rounded-br-2xl min-h-[100vh]">

    {/* Header: Filter By + Badge + Reset */}
    <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-[#e28555] flex items-center gap-1">
          <FunnelIcon className="w-5 h-5 text-[#e28555]" />
          Filter By
        </h2>
        <span className="text-xs bg-[#f2c66d] text-[#222] px-2 py-0.5 rounded-full shadow-sm font-semibold">
          {Object.keys(filters).filter((key) => filters[key]).length}
        </span>
      </div>

      <button
        onClick={() => {
          setFilters({});
          setState('');
        }}
        className="group flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#203C5B] text-[#203C5B] hover:bg-[#203C5B] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#203C5B]"
      >
        <ArrowPathIcon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
        <span className="text-sm font-semibold">Reset Filters</span>
      </button>
    </div>

    {/* Dropdowns */}
    {renderDropdown('State', 'Residence_Cleaned', dropdownOptions.Residence_Cleaned, GlobeAsiaAustraliaIcon)}
    {renderDropdown('Age Range', 'age_range', dropdownOptions.ageRanges, UserIcon)}
    {renderDropdown('Income Limit', 'income_upper_limit', dropdownOptions.income_upper_limit, CurrencyRupeeIcon)}
    {renderDropdown('Income Category', 'income_category', dropdownOptions.income_category, CurrencyRupeeIcon)}
    {renderDropdown('Sub Category', 'sub_categories', dropdownOptions.sub_categories, AcademicCapIcon)}
    {renderDropdown('Primary Category', 'primary_category', dropdownOptions.primary_category, AcademicCapIcon)}
    {renderDropdown('Benefit Type', 'Benefit_Category', dropdownOptions.Benefit_Category, CurrencyRupeeIcon)}
    {renderDropdown('Marital Status', 'Marital_Status_Clean', dropdownOptions.Marital_Status_Clean, HeartIcon)}
    {renderDropdown('BPL', 'BPL_Clean', dropdownOptions.BPL_Clean, CurrencyRupeeIcon)}
    {renderDropdown('Employment Status', 'Employment_Status_Clean', dropdownOptions.Employment_Status_Clean, BriefcaseIcon)}
    {renderDropdown('Application Mode', 'Application_Mode_Clean', dropdownOptions.Application_Mode_Clean, KeyIcon)}
    {renderDropdown('Scheme Type', 'Scheme_Type_Clean', dropdownOptions.Scheme_Type_Clean, HomeIcon)}
    {renderDropdown('Location', 'Location_Clean', dropdownOptions.Location_Clean, GlobeAsiaAustraliaIcon)}
    {renderDropdown('Minority', 'Minority_Cleaned', dropdownOptions.Minority_Cleaned, IdentificationIcon)}
    {renderDropdown('Disability', 'Disability_Cleaned', dropdownOptions.Disability_Cleaned, IdentificationIcon)}
    {renderDropdown('DBT (Direct Benefit Transfer)', 'DBT', dropdownOptions.DBT, KeyIcon)}
    {renderDropdown('Caste Category', 'caste', dropdownOptions.caste, UsersIcon)}
    {renderDropdown('Special Identity', 'identity', dropdownOptions.identity, UserIcon)}
  </aside>
);
}
