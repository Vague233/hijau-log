import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { DatabaseAccordion } from './DatabaseAccordion';

export function DatabasePage() {
  const navigate = useNavigate();

  // Reset scroll when entering this page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-black min-h-screen relative overflow-hidden">
      <DatabaseAccordion 
        isOpen={true} 
        onClose={() => navigate('/dashboard')} 
      />
    </div>
  );
}
