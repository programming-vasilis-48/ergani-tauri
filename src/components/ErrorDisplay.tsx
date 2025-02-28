import React from 'react';
import { useAppState } from '../hooks/useAppState';

export default function ErrorDisplay(): JSX.Element {
  const { data: { error }, setState } = useAppState();

  if (!error) {
    return <></>;
  }

  const handleClose = () => {
    setState({ error: null });
  };

  return (
    <div id="error-display" className="alert alert-danger" role="alert">
      <div className="d-flex justify-content-between align-items-start">
        <div>{error}</div>
        <button 
          type="button" 
          className="btn-close" 
          aria-label="Close"
          onClick={handleClose}
        />
      </div>
    </div>
  );
} 