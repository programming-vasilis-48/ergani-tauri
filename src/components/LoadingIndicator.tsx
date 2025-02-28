import React from 'react';
import { useAppState } from '../hooks/useAppState';

export default function LoadingIndicator(): JSX.Element {
  const { data: { isProcessing } } = useAppState();

  if (!isProcessing) {
    return <></>;
  }

  return (
    <div id="loading-indicator" className="text-center my-3">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2">Processing your request...</p>
    </div>
  );
} 