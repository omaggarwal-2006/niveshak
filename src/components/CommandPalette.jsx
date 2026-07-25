import React, { useState, useEffect, useRef } from 'react';

export default function CommandPalette({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      return;
    }
    
    // Auto focus
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const routes = [
    { name: 'Dashboard (Home)', icon: '🏠', path: 'dashboard' },
    { name: 'Abhyas (Virtual Trading)', icon: '📈', path: 'abhyas' },
    { name: 'Seekho (Learn)', icon: '🎓', path: 'seekho' },
    { name: 'Scam Shield', icon: '🛡️', path: 'scammeter' },
    { name: 'Interactive Calculators', icon: '🧮', path: 'calculator' },
    { name: 'Profile & Settings', icon: '⚙️', action: 'OPEN_PROFILE' }
  ];

  const filteredRoutes = routes.filter(r => 
    r.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '10vh'
    }} onClick={onClose}>
      
      <div 
        style={{
          width: '90%', maxWidth: '600px',
          backgroundColor: '#121729',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '1.2rem',
              outline: 'none'
            }}
          />
        </div>
        
        <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '8px 0' }}>
          {filteredRoutes.length === 0 ? (
            <div style={{ padding: '16px', color: '#8FA0B5', textAlign: 'center' }}>
              No results found for "{query}"
            </div>
          ) : (
             filteredRoutes.map((route, i) => (
              <div
                key={i}
                onClick={() => {
                  onNavigate(route);
                  onClose();
                }}
                style={{
                  padding: '12px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#E8E4DA',
                  cursor: 'pointer',
                  borderLeft: '2px solid transparent'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderLeft = '2px solid var(--color-indigo)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderLeft = '2px solid transparent';
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{route.icon}</span>
                <span style={{ fontWeight: '500' }}>{route.name}</span>
                <span style={{ marginLeft: 'auto', color: '#8FA0B5', fontSize: '0.8rem' }}>Jump to →</span>
              </div>
            ))
          )}
        </div>
        
        <div style={{ padding: '12px 16px', backgroundColor: '#0A0D18', fontSize: '0.75rem', color: '#8FA0B5', display: 'flex', gap: '16px' }}>
          <span><kbd style={{ backgroundColor: '#1A223B', padding: '2px 6px', borderRadius: '4px' }}>↑</kbd> <kbd style={{ backgroundColor: '#1A223B', padding: '2px 6px', borderRadius: '4px' }}>↓</kbd> to navigate</span>
          <span><kbd style={{ backgroundColor: '#1A223B', padding: '2px 6px', borderRadius: '4px' }}>Enter</kbd> to select</span>
          <span><kbd style={{ backgroundColor: '#1A223B', padding: '2px 6px', borderRadius: '4px' }}>Esc</kbd> to close</span>
        </div>
      </div>

    </div>
  );
}
