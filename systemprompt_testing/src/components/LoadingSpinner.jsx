import React from 'react';

// Component hiển thị hiệu ứng loading
const LoadingSpinner = () => {
  const spinnerStyle = {
    border: '4px solid rgba(0, 0, 0, 0.1)',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    borderLeftColor: 'var(--primary-color)',
    animation: 'spin 1s linear infinite',
    display: 'inline-block',
    verticalAlign: 'middle',
    marginRight: '10px',
  };

  // Keyframes cho animation cần được inject
  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={spinnerStyle}></div>
    </>
  );
};

export default LoadingSpinner;
