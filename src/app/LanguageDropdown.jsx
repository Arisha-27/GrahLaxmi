"use client";

const LanguageDropdown = () => {
  return (
    <select style={{ border: '2px solid #333', padding: '7px 12px', cursor: 'pointer' }}>
      <option>English</option>
      <option>Hindi</option>
      <option>Tamil</option>
      <option>Telugu</option>
    </select>
  );
};

export default LanguageDropdown;
