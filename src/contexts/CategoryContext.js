import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => useContext(CategoryContext);

CategoryProvider.propTypes = {
  children: PropTypes.node.isRequired
};
