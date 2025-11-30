function ErrorMessage({ message, onClose }) {
  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      minWidth: '300px',
      maxWidth: '600px',
      padding: '1rem 1.5rem',
      backgroundColor: '#f8d7da',
      color: '#721c24',
      borderRadius: '4px',
      border: '1px solid #f5c6cb',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            marginLeft: '1rem',
            padding: '0.25rem 0.5rem',
            backgroundColor: 'transparent',
            color: '#721c24',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
