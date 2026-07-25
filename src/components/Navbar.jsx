import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Flame, Shield, HelpCircle, AlertCircle, PhoneCall } from 'lucide-react';

/**
 * Senior SaaS Header & Navigation (Linear / Stripe / Notion Aesthetic)
 * Single-row nav dock, top utility strip, active solid fill rule, compact chips.
 */
export default function Navbar({ 
  currentRoute, 
  setCurrentRoute, 
  lang, 
  setLang, 
  theme, 
  setTheme,
  userName = 'Investor',
  completedLessons = [],
  completedTracks = [],
  scanHistory = [],
  streak = 1,
  onOpenProfileModal
}) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [avatarIcon, setAvatarIcon] = useState(() => localStorage.getItem('safalniveshak_avatar') || '🛡️');
  const [showMoreNav, setShowMoreNav] = useState(false);
  const moreNavRef = useRef(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreNavRef.current && !moreNavRef.current.contains(e.target)) {
        setShowMoreNav(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update avatar icon on storage change
  useEffect(() => {
    const updateAvatar = () => {
      setAvatarIcon(localStorage.getItem('safalniveshak_avatar') || '🛡️');
    };
    window.addEventListener('storage', updateAvatar);
    return () => window.removeEventListener('storage', updateAvatar);
  }, []);

  // Calculate Level
  const lessonsXP = completedLessons.length * 50;
  const tracksXP = completedTracks.length * 200;
  const scansXP = scanHistory.length * 25;
  const totalXP = lessonsXP + tracksXP + scansXP;
  const level = Math.floor(totalXP / 300) + 1;

  const toggleLang = () => {
    setLang(lang === 'en' ? 'hi' : 'en');
  };

  const primaryNavItems = [
    { id: 'home', labelEn: 'Home', labelHi: 'होम', icon: '🏠' },
    { id: 'seekho', labelEn: 'Seekho', labelHi: 'सीखो', icon: '🎓' },
    { id: 'abhyas', labelEn: 'Abhyas', labelHi: 'अभ्यास', icon: '📈' },
    { id: 'bachao', labelEn: 'Scam Shield', labelHi: 'स्कैम शील्ड', icon: '🛡️' },
  ];

  const secondaryNavItems = [
    { id: 'safalmitra', labelEn: 'SafalMitra AI', labelHi: 'सफलमित्र AI', icon: '💬' },
    { id: 'leaderboard', labelEn: 'Leaderboard', labelHi: 'लीडरबोर्ड', icon: '🏆' },
    { id: 'about', labelEn: 'About', labelHi: 'विवरण', icon: 'ℹ️' },
  ];

  const allNavItems = [...primaryNavItems, ...secondaryNavItems];
  const isSecondaryActive = secondaryNavItems.some(item => item.id === currentRoute);

  const getTxt = (en, hi) => (lang === 'en' ? en : hi);

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 1000, width: '100%' }}>
      {/* 1. SLIM UTILITY STRIP (~36px tall) */}
      <div style={{
        height: '34px',
        backgroundColor: '#050811',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        fontSize: '0.73rem',
        color: '#8E9BAE',
        fontFamily: 'var(--font-body)',
        fontWeight: '500'
      }}>
        {/* Left Side: System Status & Compliance */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: isOnline ? '#33D090' : '#FB923C',
              boxShadow: isOnline ? '0 0 8px #33D090' : '0 0 8px #FB923C'
            }} />
            <span style={{ color: isOnline ? '#33D090' : '#FB923C', fontWeight: '600' }}>
              {isOnline ? getTxt("All systems operational", "सभी सिस्टम सक्रिय हैं") : getTxt("Offline Mode Active", "ऑफ़लाइन मोड सक्रिय")}
            </span>
          </div>

          <span style={{ color: 'rgba(255, 255, 255, 0.15)' }}>|</span>

          <span style={{ color: '#8E9BAE', cursor: 'pointer', display: 'var(--mobile-hide, inline)' }} onClick={() => setCurrentRoute('about')}>
            {getTxt("Disclosures & Help Centre", "प्रकटीकरण व सहायता केंद्र")}
          </span>
        </div>

        {/* Right Side: Quick Support Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#8E9BAE', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <PhoneCall size={12} color="#8B7FFF" />
            {getTxt("Helpline: 1930", "हेल्पलाइन: १९३०")}
          </span>
        </div>
      </div>

      {/* 2. MAIN NAVBAR (~64px tall) */}
      <header style={{
        height: '64px',
        backgroundColor: 'rgba(8, 11, 20, 0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          padding: '0 20px',
          gap: '16px'
        }}>
          
          {/* LEFT: LOGO MARK & WORDMARK */}
          <button 
            onClick={() => setCurrentRoute('home')}
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: 0,
              flexShrink: 0
            }}
            aria-label="SafalNiveshak Home"
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #8B7FFF 0%, #2CD9C5 100%)',
              boxShadow: '0 0 16px rgba(44, 217, 197, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              color: '#fff'
            }}>
              🛡️
            </div>
            <div style={{ textAlign: 'left' }}>
              <h1 style={{ 
                fontFamily: 'Sora, sans-serif', 
                fontSize: '1.15rem', 
                fontWeight: '800', 
                color: '#FFFFFF', 
                margin: 0, 
                lineHeight: 1.1,
                letterSpacing: '-0.02em'
              }}>
                SafalNiveshak
              </h1>
              <span style={{ 
                fontFamily: 'Inter, sans-serif', 
                fontSize: '0.58rem', 
                color: '#8E9BAE',
                letterSpacing: '0.06em',
                fontWeight: '700',
                textTransform: 'uppercase',
                display: 'block'
              }}>
                SOVEREIGN TRUST SHIELD
              </span>
            </div>
          </button>

          {/* CENTER: SINGLE ROW NAV CONTAINER */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: '30px',
            padding: '3px',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.4)'
          }} aria-label="Main Navigation">
            
            {/* Primary Nav Items */}
            {primaryNavItems.map(item => {
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentRoute(item.id)}
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.78rem',
                    fontWeight: isActive ? '700' : '600',
                    borderRadius: '24px',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    background: isActive ? 'linear-gradient(135deg, #8B7FFF 0%, #6C63F5 100%)' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#8E9BAE',
                    boxShadow: isActive ? '0 4px 14px rgba(108, 99, 245, 0.4)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span style={{ fontSize: '0.85rem' }}>{item.icon}</span>
                  {lang === 'en' ? item.labelEn : item.labelHi}
                </button>
              );
            })}

            {/* Secondary Nav Items or Dropdown "+More" */}
            <div ref={moreNavRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowMoreNav(!showMoreNav)}
                style={{
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  fontWeight: isSecondaryActive ? '700' : '600',
                  borderRadius: '24px',
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  background: isSecondaryActive ? 'linear-gradient(135deg, #8B7FFF 0%, #6C63F5 100%)' : 'transparent',
                  color: isSecondaryActive ? '#FFFFFF' : '#8E9BAE',
                  boxShadow: isSecondaryActive ? '0 4px 14px rgba(108, 99, 245, 0.4)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                onMouseEnter={e => {
                  if (!isSecondaryActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                }}
                onMouseLeave={e => {
                  if (!isSecondaryActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>✨</span>
                {getTxt("More", "और")}
                <ChevronDown size={12} style={{ transform: showMoreNav ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {/* Dropdown Menu */}
              {showMoreNav && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '180px',
                  backgroundColor: '#121729',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
                  padding: '6px',
                  zIndex: 9999,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}>
                  {secondaryNavItems.map(item => {
                    const isActive = currentRoute === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentRoute(item.id);
                          setShowMoreNav(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '10px',
                          border: 'none',
                          outline: 'none',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          textAlign: 'left',
                          background: isActive ? 'rgba(139, 127, 255, 0.2)' : 'transparent',
                          color: isActive ? '#FFFFFF' : '#8E9BAE'
                        }}
                        onMouseEnter={e => {
                          if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                        }}
                        onMouseLeave={e => {
                          if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <span>{item.icon}</span>
                        {lang === 'en' ? item.labelEn : item.labelHi}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </nav>

          {/* RIGHT UTILITY GROUP */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            
            {/* Search Icon Button */}
            <button
              onClick={() => setCurrentRoute('sebi')}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#8E9BAE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#FFFFFF'}
              aria-label="Search SEBI advisors"
            >
              <Search size={14} />
            </button>

            {/* Bilingual Toggle Pill */}
            <button
              onClick={toggleLang}
              style={{
                padding: '5px 12px',
                fontSize: '0.75rem',
                fontWeight: '700',
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#2CD9C5',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(44, 217, 197, 0.4)'}
            >
              {lang === 'en' ? 'EN ➔ हि' : 'हि ➔ EN'}
            </button>

            {/* Streak Chip (Warm Orange Tint, NOT Solid) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'rgba(251, 146, 60, 0.12)',
              border: '1px solid rgba(251, 146, 60, 0.25)',
              borderRadius: '20px',
              padding: '4px 10px',
              color: '#FB923C',
              fontSize: '0.75rem',
              fontWeight: '800'
            }}>
              <Flame size={14} fill="#FB923C" />
              <span>{streak}d</span>
            </div>

            {/* Profile Chip (Avatar Circle + Name + Level) */}
            <button
              onClick={onOpenProfileModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px 4px 5px',
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                color: '#FFFFFF',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139, 127, 255, 0.4)'}
            >
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8B7FFF, #2CD9C5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                fontWeight: '800'
              }}>
                {avatarIcon}
              </div>
              <span style={{ fontSize: '0.76rem', fontWeight: '700', color: '#FFFFFF' }}>
                {userName.length > 9 ? userName.slice(0, 7) + '..' : userName}
              </span>
              <span style={{ 
                fontSize: '0.62rem', 
                color: '#8B7FFF', 
                backgroundColor: 'rgba(139, 127, 255, 0.15)',
                border: '1px solid rgba(139, 127, 255, 0.3)',
                borderRadius: '10px',
                padding: '1px 6px',
                fontWeight: '800' 
              }}>
                Lvl {level}
              </span>
            </button>

          </div>

        </div>
      </header>
    </div>
  );
}
