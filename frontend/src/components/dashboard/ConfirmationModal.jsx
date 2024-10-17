import React from 'react';

const ConfirmationModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <h3>Are you sure you want to log out?</h3>
        <div style={styles.modalButtons}>
          <button onClick={onConfirm} style={styles.confirmButton}>
            Yes
          </button>
          <button onClick={onCancel} style={styles.cancelButton}>
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
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  modalButtons: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '15px',
  },
  confirmButton: {
    padding: '10px 20px',
    backgroundColor: '#1a3042',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#ccc',
    color: '#000',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default ConfirmationModal;
