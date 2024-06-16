/* eslint-disable react/prop-types */
import React from 'react';
import { Select, Input, DatePicker, InputNumber } from 'antd';
import './Select.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Filter = ({
  userProfile,
  currentUser,
  selectedStatus,
  setSelectedStatus,
  selectedSortOrder,
  setSelectedSortOrder,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  priceRange,
  setPriceRange,
  dateRange,
  setDateRange,
  clearFilters
}) => {
  return (
    <>
      {/* First row */}
      <div className="mb-4 flex items-start gap-4">
        {userProfile.username === currentUser && (
          <Select
            value={selectedStatus}
            placeholder="Select status"
            onChange={(value) => setSelectedStatus(value)}
            mode="multiple"
            className="w-32">
            <Option value="Uploaded">Uploaded</Option>
            <Option value="Verified">Verified</Option>
            <Option value="Sold">Sold</Option>
            <Option value="Rejected">Rejected</Option>
          </Select>
        )}
        <Select
          value={selectedSortOrder}
          placeholder="Sort by price"
          onChange={(value) => setSelectedSortOrder(value)}>
          <Option value="asc">Price: Low to High</Option>
          <Option value="desc">Price: High to Low</Option>
        </Select>
        <Select
          value={selectedCategory}
          placeholder="Select category"
          onChange={(value) => setSelectedCategory(value)}
          mode="multiple"
          className="w-36">
          <Option value="Painting">Painting</Option>
          <Option value="Sculpture">Sculpture</Option>
          <Option value="Photography">Photography</Option>
        </Select>
        <Input
          placeholder="Search artworks"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-72"
        />
      </div>

      {/* Second row */}
      <div className="flex items-start gap-4">
        <RangePicker
          value={dateRange}
          onChange={(range) => setDateRange(range)}
          placeholder={['Start Date', 'End Date']}
        />
        <div className="flex items-center gap-2">
          <InputNumber
            min={0}
            max={100000}
            value={priceRange[0]}
            onChange={(value) => setPriceRange([value, priceRange[1]])}
            placeholder="Min Price"
            addonAfter="€"
            className="w-28"
          />
          <div className="w-4 border-b border-gray-300"></div>
          <InputNumber
            min={0}
            max={100000}
            value={priceRange[1]}
            onChange={(value) => {
              // Ensure that the second price is not larger than the first
              if (value >= priceRange[0]) {
                setPriceRange([priceRange[0], value]);
              }
            }}
            placeholder="Max Price"
            addonAfter="€"
            className="w-28"
          />
        </div>
        <button onClick={clearFilters} className="mb-4 rounded-md bg-red-500 px-8 py-1 text-white">
          Clear Filters
        </button>
      </div>
    </>
  );
};

export default Filter;
