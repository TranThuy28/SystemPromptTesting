import React from 'react';

// Component Header để điều hướng giữa các trang
const Header = ({ currentPage, setCurrentPage }) => {
  const styles = {
    header: {
      backgroundColor: 'var(--background-color)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      padding: '0 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: 'var(--primary-color)',
      textDecoration: 'none',
    },
    nav: {
      display: 'flex',
      gap: '1rem',
    },
    navLink: {
      padding: '1.5rem 1rem',
      textDecoration: 'none',
      color: 'var(--light-text-color)',
      fontWeight: '500',
      borderBottom: '3px solid transparent',
      transition: 'color 0.2s, border-bottom-color 0.2s',
    },
    activeLink: {
       color: 'var(--primary-color)',
       borderBottomColor: 'var(--primary-color)',
    }
  };

  const navItems = [
    { id: 'tester', name: 'System Prompt Tester' },
    { id: 'battle', name: 'Model Battle' },
    { id: 'comparer', name: 'Ground Truth Comparer' },
  ];

  return (
    <header style={styles.header}>
      <a href="#tester" style={styles.logo} onClick={() => setCurrentPage('tester')}>
        LLM Suite
      </a>
      <nav style={styles.nav}>
        {navItems.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            style={{
                ...styles.navLink,
                ...(currentPage === item.id ? styles.activeLink : {})
            }}
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(item.id);
            }}
          >
            {item.name}
          </a>
        ))}
      </nav>
    </header>
  );
};

export default Header;