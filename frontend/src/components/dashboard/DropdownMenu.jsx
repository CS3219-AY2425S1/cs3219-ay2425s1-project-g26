/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

const DropdownMenu = ({ dropdownVisible, toggleDropdown, navigate, confirmLogout }) => {
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      toggleDropdown(false); 
    }
  };

  useEffect(() => {
    if (dropdownVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside); 
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); 
    };
  }, [dropdownVisible]);

  return (
    <div style={{ position: 'absolute', top: '30px', right: '30px' }}>
      {/* Settings Icon */}
      <div 
        onClick={toggleDropdown}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'transparent', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        {/* Font Awesome Settings Icon */}
        <FontAwesomeIcon icon={faCog} size="2x" color="white" />
      </div>
      
      {dropdownVisible && (
        <div ref={dropdownRef} style={{
          position: 'absolute',
          top: '50px',
          right: '0',
          backgroundColor: 'white',
          borderRadius: '5px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
          minWidth: '150px',
          width: '150px',
        }}>
          <div 
            onClick={() => navigate('/manage-profile')}
            style={{
              padding: '10px 15px',
              cursor: 'pointer',
              borderBottom: '1px solid #ccc',
              textAlign: 'center',
              transition: 'color 0.3s',
              color: 'black',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#007bff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'black'}
          >
            Manage Profile
          </div>
          <div 
            onClick={confirmLogout}
            style={{
              padding: '10px 15px',
              cursor: 'pointer',
              backgroundColor: 'white',
              color: '#f44336',
              borderBottomLeftRadius: '5px',
              borderBottomRightRadius: '5px',
              borderTopLeftRadius: '0',
              borderTopRightRadius: '0',
              textAlign: 'center',
              transition: 'color 0.3s, background-color 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#d32f2f';
              e.currentTarget.style.backgroundColor = '#fce4e4';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#f44336';
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            Logout
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
