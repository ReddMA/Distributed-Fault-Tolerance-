function LoadingSpinner({ size = 'medium', text = 'Loading...' }) {
  const sizes = {
    small: '24px',
    medium: '40px',
    large: '60px'
  };

  const spinnerSize = sizes[size] || sizes.medium;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        width: spinnerSize,
        height: spinnerSize,
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #007bff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      {text && (
        <p style={{
          marginTop: '1rem',
          color: '#6c757d',
          fontSize: '1rem'
        }}>
          {text}
        </p>
      )}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default LoadingSpinner;
