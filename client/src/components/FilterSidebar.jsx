import React from 'react';
import { Filter, RotateCcw, Star, Check } from 'lucide-react';

export default function FilterSidebar({ filters, setFilters, onReset }) {
  const categories = ['Standard', 'Deluxe', 'Executive Suite', 'Presidential Suite'];
  const amenitiesList = [
    'Free WiFi',
    'Swimming Pool',
    'Free Breakfast',
    'Spa',
    'Bathtub',
    'Private Balcony',
    'Air Conditioning'
  ];

  const handleCategoryChange = (cat) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === cat ? '' : cat
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenity: prev.amenity === amenity ? '' : amenity
    }));
  };

  return (
    <aside style={{
      background: '#ffffff',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid #e5edf7',
      boxShadow: '0 4px 16px rgba(5, 20, 48, 0.04)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #edf2f9', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '16px', color: '#1a2b48' }}>
          <Filter size={18} color="#006ce4" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            color: '#e41b23',
            background: 'none',
            fontWeight: 600
          }}
        >
          <RotateCcw size={12} />
          Reset All
        </button>
      </div>

      {/* Price Range Slider */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
          <span>Max Price per Night</span>
          <span style={{ color: '#006ce4' }}>₹{Number(filters.maxPrice || 25000).toLocaleString('en-IN')}</span>
        </div>
        <input
          type="range"
          min="2000"
          max="30000"
          step="500"
          value={filters.maxPrice || 25000}
          onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
          style={{ width: '100%', accentColor: '#006ce4', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#8d9ba8', marginTop: '4px' }}>
          <span>₹2,000</span>
          <span>₹30,000+</span>
        </div>
      </div>

      {/* Room Category */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: '#7e8e9f', marginBottom: '10px' }}>
          Room Type / Tier
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {categories.map(cat => (
            <label
              key={cat}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                cursor: 'pointer',
                color: filters.category === cat ? '#006ce4' : '#334155',
                fontWeight: filters.category === cat ? 700 : 500
              }}
            >
              <input
                type="radio"
                name="categoryFilter"
                checked={filters.category === cat}
                onChange={() => handleCategoryChange(cat)}
                style={{ accentColor: '#006ce4' }}
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Popular Amenities */}
      <div>
        <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: '#7e8e9f', marginBottom: '10px' }}>
          Popular Amenities
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {amenitiesList.map(item => (
            <label
              key={item}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                cursor: 'pointer',
                color: filters.amenity === item ? '#006ce4' : '#334155',
                fontWeight: filters.amenity === item ? 700 : 500
              }}
            >
              <input
                type="checkbox"
                checked={filters.amenity === item}
                onChange={() => handleAmenityChange(item)}
                style={{ accentColor: '#006ce4' }}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
