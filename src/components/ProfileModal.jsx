import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  Database, 
  ShieldCheck, 
  Bell, 
  Download, 
  Upload, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  X, 
  Sun, 
  Moon, 
  Globe,
  Sparkles,
  Award,
  Zap
} from 'lucide-react';

export default function ProfileModal({
  isOpen,
  onClose,
  userName,
  setUserName,
  lang,
  setLang,
  theme,
  setTheme,
  completedLessons = [],
  completedTracks = [],
  scanHistory = [],
  profiles = [],
  activeProfileId = 'default_profile',
  onSwitchProfile,
  onCreateProfile,
  onExportData,
  onImportData,
  notifyEnabled,
  onToggleNotifications,
  onLogout,
  getTxt
}) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'switcher', 'data', 'settings'
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName || '');
  const [newProfName, setNewProfName] = useState('');
  const [avatarIcon, setAvatarIcon] = useState(() => localStorage.getItem('safalniveshak_avatar') || '🛡️');

  if (!isOpen) return null;

  // Calculate XP & Level
  const lessonsXP = completedLessons.length * 50;
  const tracksXP = completedTracks.length * 200;
  const scansXP = scanHistory.length * 25;
  const totalXP = lessonsXP + tracksXP + scansXP;
  
  const xpPerLevel = 300;
  const level = Math.floor(totalXP / xpPerLevel) + 1;
  const xpInCurrentLevel = totalXP % xpPerLevel;
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpPerLevel) * 100));

  // Determine Investor Rank
  const getRankTitle = () => {
    if (level >= 10) return { en: 'Sovereign Wealth Director 💎', hi: 'सॉवरेन वेल्थ डायरेक्टर 💎' };
    if (level >= 5) return { en: 'Alpha Portfolio Strategist 🚀', hi: 'अल्फा पोर्टफोलियो रणनीतिकार 🚀' };
    if (level >= 3) return { en: 'Certified Smart Investor 📈', hi: 'प्रमाणित स्मार्ट निवेशक 📈' };
    return { en: 'Retail Learning Pioneer 🌱', hi: 'रिटेल लर्निंग पायनियर 🌱' };
  };

  const rank = getRankTitle();

  const avatarOptions = ['🛡️', '⚡', '🏆', '💎', '🚀', '🧠', '🦁', '🦉'];

  const handleSaveName = (e) => {
    e.preventDefault();
    if (tempName.trim()) {
      setUserName(tempName.trim());
      localStorage.setItem('safalniveshak_username', tempName.trim());
      setIsEditingName(false);
    }
  };

  const handleSelectAvatar = (icon) => {
    setAvatarIcon(icon);
    localStorage.setItem('safalniveshak_avatar', icon);
  };

  const handleResetData = () => {
    const confirmText = lang === 'en' 
      ? "Are you sure you want to reset your local progress, portfolios, and history? This action cannot be undone."
      : "क्या आप अपनी स्थानीय प्रगति, पोर्टफोलियो और इतिहास को रीसेट करना चाहते हैं? इस क्रिया को पूर्ववत नहीं किया जा सकता है।";
    if (window.confirm(confirmText)) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(3, 7, 18, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: '20px'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            backgroundColor: 'rgba(10, 18, 40, 0.92)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '24px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            color: '#fff'
          }}
        >
          {/* Header Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                boxShadow: '0 0 16px rgba(168, 85, 247, 0.4)'
              }}>
                {avatarIcon}
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '900', margin: 0, color: '#fff' }}>
                  {userName || getTxt('Investor Profile', 'निवेशक प्रोफ़ाइल')}
                </h3>
                <span style={{ fontSize: '0.72rem', color: '#c084fc', fontWeight: '700', letterSpacing: '0.04em' }}>
                  {getTxt(rank.en, rank.hi)}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            >
              <X size={18} />
            </button>
          </div>

          {/* Tab Navigation Capsule */}
          <div style={{
            display: 'flex',
            gap: '4px',
            padding: '10px 24px',
            backgroundColor: 'rgba(6, 11, 40, 0.6)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            overflowX: 'auto'
          }}>
            {[
              { id: 'profile', label: getTxt('Profile & Level', 'प्रोफ़ाइल व स्तर'), icon: User },
              { id: 'switcher', label: getTxt('Switch Profile', 'प्रोफ़ाइल स्विच'), icon: Zap },
              { id: 'data', label: getTxt('Data & Backup', 'डेटा व बैकअप'), icon: Database },
              { id: 'settings', label: getTxt('Preferences', 'सेटिंग्स'), icon: Settings }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    background: isActive ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(6, 182, 212, 0.2) 100%)' : 'transparent',
                    color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                    boxShadow: isActive ? '0 4px 12px rgba(168, 85, 247, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <Icon size={14} color={isActive ? '#a855f7' : 'currentColor'} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content Body */}
          <div style={{
            padding: '24px',
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {/* TAB 1: PROFILE OVERVIEW & LEVEL */}
            {activeTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* User Name & Avatar Customization */}
                <div style={{
                  padding: '20px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '800' }}>
                    {getTxt("User Credentials", "उपयोगकर्ता पहचान")}
                  </span>

                  <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    {isEditingName ? (
                      <form onSubmit={handleSaveName} style={{ display: 'flex', gap: '8px', flex: 1, maxWidth: '360px' }}>
                        <input
                          type="text"
                          value={tempName}
                          onChange={e => setTempName(e.target.value)}
                          style={{
                            flex: 1,
                            backgroundColor: 'rgba(6, 11, 40, 0.8)',
                            border: '1px solid rgba(168, 85, 247, 0.5)',
                            borderRadius: '10px',
                            color: '#fff',
                            padding: '8px 14px',
                            fontSize: '0.9rem',
                            outline: 'none'
                          }}
                          autoFocus
                        />
                        <button type="submit" className="btn-3d" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                          {getTxt("Save", "सहेजें")}
                        </button>
                      </form>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#fff', margin: 0 }}>
                          {userName}
                        </h4>
                        <button
                          onClick={() => setIsEditingName(true)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#fb923c',
                            fontSize: '0.75rem',
                            fontWeight: '800',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          ✏️ {getTxt("Edit Name", "नाम बदलें")}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Avatar Picker */}
                  <div style={{ marginTop: '16px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.5)', fontWeight: '700' }}>
                      {getTxt("Select Avatar Icon:", "अवतार आइकन चुनें:")}
                    </span>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
                      {avatarOptions.map(icon => (
                        <button
                          key={icon}
                          onClick={() => handleSelectAvatar(icon)}
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            border: avatarIcon === icon ? '2px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
                            background: avatarIcon === icon ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Level Telemetry Dial & Progress */}
                <div style={{
                  padding: '20px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(168, 85, 247, 0.05)',
                  border: '1px solid rgba(168, 85, 247, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    position: 'relative',
                    width: '80px',
                    height: '80px',
                    flexShrink: 0
                  }}>
                    <svg style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                      <circle cx="40" cy="40" r="34" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="6" fill="transparent" />
                      <circle
                        cx="40" cy="40" r="34"
                        stroke="url(#modalDialGrad)" strokeWidth="6" fill="transparent"
                        strokeDasharray="213.6"
                        strokeDashoffset={213.6 - (213.6 * progressPercent) / 100}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                      />
                      <defs>
                        <linearGradient id="modalDialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.1rem', color: '#fff' }}>
                      Lvl {level}
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8rem' }}>
                      <span style={{ fontWeight: '800', color: '#fff' }}>{totalXP} XP</span>
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>{progressPercent}% to Lvl {level + 1}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${progressPercent}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #a855f7, #06b6d4)',
                        boxShadow: '0 0 10px #06b6d4'
                      }} />
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.65)', marginTop: '8px', margin: '8px 0 0' }}>
                      {getTxt(`${completedLessons.length} lessons completed • ${completedTracks.length} tracks mastered`, `${completedLessons.length} पाठ पूर्ण • ${completedTracks.length} ट्रैक मास्टर किए`)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PROFILE SWITCHER */}
            {activeTab === 'switcher' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)', margin: 0, lineHeight: 1.5 }}>
                  {getTxt(
                    "Switch between different investor personas or Sandbox profiles. Each profile maintains isolated portfolios and progress.",
                    "विभिन्न निवेशक प्रोफ़ाइलों के बीच स्विच करें। प्रत्येक प्रोफ़ाइल अलग पोर्टफोलियो और प्रगति बनाए रखती है।"
                  )}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {profiles.map(prof => {
                    const isActive = prof.id === activeProfileId;
                    return (
                      <div
                        key={prof.id}
                        onClick={() => onSwitchProfile(prof.id)}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '14px 18px',
                          borderRadius: '14px',
                          backgroundColor: isActive ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                          border: isActive ? '1.5px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.08)',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '10px',
                            background: isActive ? 'linear-gradient(135deg, #a855f7, #06b6d4)' : 'rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem'
                          }}>
                            👤
                          </div>
                          <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0, color: '#fff' }}>
                              {prof.name}
                            </h4>
                            <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                              {prof.xp || 0} XP • {getTxt("Created", "निर्मित")}: {prof.created_at || 'Recently'}
                            </span>
                          </div>
                        </div>

                        {isActive ? (
                          <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#a855f7', background: 'rgba(168, 85, 247, 0.2)', padding: '4px 10px', borderRadius: '12px' }}>
                            ✓ {getTxt("Active", "सक्रिय")}
                          </span>
                        ) : (
                          <button className="btn-3d" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                            {getTxt("Switch", "स्विच करें")}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Create New Profile Form */}
                <form onSubmit={onCreateProfile} style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder={getTxt("Enter new profile name...", "नया प्रोफ़ाइल नाम दर्ज करें...")}
                    value={newProfName}
                    onChange={e => setNewProfName(e.target.value)}
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(6, 11, 40, 0.8)',
                      border: '1px solid rgba(168, 85, 247, 0.4)',
                      borderRadius: '12px',
                      color: '#fff',
                      padding: '10px 16px',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                  <button type="submit" className="btn-3d" style={{ padding: '8px 18px', fontSize: '0.82rem' }}>
                    <Plus size={14} style={{ marginRight: '4px' }} />
                    {getTxt("Create", "बनाएं")}
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: DATA MANAGEMENT & BACKUP */}
            {activeTab === 'data' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  padding: '16px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#fff', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Database size={16} color="#06b6d4" />
                    {getTxt("Offline Data Storage & Backup", "ऑफलाइन डेटा स्टोरेज और बैकअप")}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                    {getTxt(
                      "SafalNiveshak runs 100% offline. Export your learning history, badges, and trading ledgers to a JSON file to transfer across devices.",
                      "सफल निवेशक १००% ऑफलाइन चलता है। उपकरणों में स्थानांतरित करने के लिए अपनी प्रगति और व्यापार खाता बही को JSON फ़ाइल में एक्सपोर्ट करें।"
                    )}
                  </p>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button onClick={onExportData} className="btn-3d" style={{ padding: '10px 18px', fontSize: '0.82rem' }}>
                      <Download size={14} style={{ marginRight: '6px' }} />
                      {getTxt("Export Data (JSON)", "डेटा एक्सपोर्ट करें")}
                    </button>

                    <label className="btn-3d" style={{ padding: '10px 18px', fontSize: '0.82rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                      <Upload size={14} style={{ marginRight: '6px' }} />
                      {getTxt("Import Backup", "बैकअप इम्पोर्ट करें")}
                      <input type="file" accept=".json" onChange={onImportData} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>

                {/* Reset local data */}
                <div style={{
                  padding: '16px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(239, 68, 68, 0.05)',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#f87171', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Trash2 size={16} color="#f87171" />
                    {getTxt("Danger Zone: Clear Local Storage", "खतरा क्षेत्र: लोकल डेटा साफ़ करें")}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 12px 0' }}>
                    {getTxt("Reset all completed lessons, portfolio balances, and scan history.", "सभी पूर्ण पाठों, पोर्टफोलियो शेष और स्कैन इतिहास को रीसेट करें।")}
                  </p>
                  <button
                    onClick={handleResetData}
                    className="btn-3d"
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      borderColor: '#ef4444',
                      color: '#f87171',
                      padding: '8px 16px',
                      fontSize: '0.8rem'
                    }}
                  >
                    {getTxt("Reset All Data", "सभी डेटा रीसेट करें")}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: PREFERENCES & SETTINGS */}
            {activeTab === 'settings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Language setting */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 18px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Globe size={18} color="#fb923c" />
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0, color: '#fff' }}>
                        {getTxt("Language / भाषा", "भाषा / Language")}
                      </h4>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>
                        {lang === 'en' ? 'English (International)' : 'हिन्दी (भारतीय)'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
                    className="btn-3d"
                    style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                  >
                    {lang === 'en' ? 'EN ➔ हि' : 'हि ➔ EN'}
                  </button>
                </div>

                {/* Theme setting */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 18px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {theme === 'dark' ? <Moon size={18} color="#a78bfa" /> : <Sun size={18} color="#fb923c" />}
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0, color: '#fff' }}>
                        {getTxt("Theme Mode", "थीम मोड")}
                      </h4>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>
                        {theme === 'dark' ? getTxt('Dark Aurora Indigo', 'डार्क ऑरोरा इंडिगो') : getTxt('Light Warm Ledger', 'लाइट लेजर')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    className="btn-3d"
                    style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                  >
                    {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
                  </button>
                </div>

                {/* Notifications toggle */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 18px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Bell size={18} color="#22c55e" />
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0, color: '#fff' }}>
                        {getTxt("Daily Quiz & SIP Alerts", "दैनिक क्विज़ और एसआईपी अलर्ट")}
                      </h4>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>
                        {notifyEnabled ? getTxt("Notifications active", "सूचनाएं सक्रिय हैं") : getTxt("Notifications disabled", "सूचनाएं अक्षम हैं")}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={onToggleNotifications}
                    className="btn-3d"
                    style={{
                      borderColor: notifyEnabled ? '#22c55e' : 'rgba(255,255,255,0.1)',
                      background: notifyEnabled ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.04)',
                      color: notifyEnabled ? '#22c55e' : 'rgba(255,255,255,0.8)',
                      padding: '6px 14px',
                      fontSize: '0.78rem'
                    }}
                  >
                    {notifyEnabled ? getTxt("ON", "चालू") : getTxt("OFF", "बंद")}
                  </button>
                </div>

                {/* Logout */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 18px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(239, 68, 68, 0.05)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  marginTop: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ color: '#f87171' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0, color: '#f87171' }}>
                        {getTxt("Log Out", "लॉग आउट करें")}
                      </h4>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>
                        {getTxt("Sign out of your account", "अपने खाते से साइन आउट करें")}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={onLogout}
                    className="btn-3d"
                    style={{
                      borderColor: '#ef4444',
                      background: 'rgba(239, 68, 68, 0.15)',
                      color: '#f87171',
                      padding: '6px 14px',
                      fontSize: '0.78rem'
                    }}
                  >
                    {getTxt("Logout", "लॉग आउट")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
