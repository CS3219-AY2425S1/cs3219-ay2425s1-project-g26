import React from 'react';

const ConfirmationModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <h3 style={styles.modalTitle}>Are you sure you want to end session?</h3>
        <div style={styles.modalButtons}>
          <button onClick={onConfirm} style={{ ...styles.button, ...styles.confirmButton }}>
            Yes
          </button>
          <button onClick={onCancel} style={{ ...styles.button, ...styles.cancelButton }}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    width: '90%', 
    maxWidth: '400px', 
    fontFamily: 'Figtree, sans-serif', 
  },
  modalTitle: {
    marginBottom: '20px',
    fontSize: '20px',
    color: '#333',
  },
  modalButtons: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '20px',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontFamily: 'Figtree, sans-serif',
    fontSize: '16px',
    transition: 'background-color 0.3s',
    width: '45%',
  },
  confirmButton: {
    backgroundColor: '#1a3042',
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    color: '#000',
  },
};

export default ConfirmationModal;
