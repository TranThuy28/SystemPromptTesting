import React from 'react';

// Component Card tái sử dụng để tạo layout nhất quán
const Card = ({ title, children }) => {
  const cardStyle = {
    backgroundColor: 'var(--background-color)',
    borderRadius: 'var(--border-radius)',
    boxShadow: 'var(--box-shadow)',
    padding: '2rem',
    height: '100%',
  };

  const cardTitleStyle = {
    marginTop: 0,
    fontSize: '1.5rem',
    fontWeight: 600,
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '1rem',
    marginBottom: '1.5rem'
  };

  return (
    <div style={cardStyle}>
      {title && <h3 style={cardTitleStyle}>{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
