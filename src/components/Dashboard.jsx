import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  BookOpen, 
  ShieldAlert, 
  Calculator, 
  Search, 
  MessageSquare, 
  TrendingUp, 
  Flame, 
  ArrowRight,
  ShieldCheck,
  Download,
  Upload,
  Trophy,
  Zap,
  Award
} from 'lucide-react';
import { tracks } from '../data/lessons';

// --- Reusable CountUp Component ---
function CountUp({ end, duration = 1200, suffix = '', prefix = '' }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const cleaned = typeof end === 'string' ? end.replace(/[^0-9.-]/g, '') : end;
    const endValue = parseFloat(cleaned);
    
    if (isNaN(endValue) || endValue === 0) {
      setValue(end);
      return;
    }
    
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = progress * (2 - progress);
      const currentVal = Math.floor(easeProgress * endValue);
      setValue(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setValue(endValue);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  const formatVal = () => {
    if (typeof end === 'string' && end.includes('₹')) {
      return `₹${value.toLocaleString('en-IN')}`;
    }
    return prefix + value.toLocaleString('en-IN') + suffix;
  };

  return <span className="numeric-data" style={{ fontFamily: 'Inter, monospace', fontWeight: 800 }}>{formatVal()}</span>;
}

// --- Reusable 3D TiltCard Component ---
function TiltCard({ children, className, style }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [5, -5]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-5, 5]), { stiffness: 300, damping: 30 });

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }
  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 800, ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

export default function Dashboard({ 
  lang, 
  setLang, 
  userName = 'Investor',
  completedLessons = [], 
  completedTracks = [], 
  scanHistory = [], 
  setCurrentRoute, 
  getTxt,
  onOpenProfileModal,
  onGlobalSearch
}) {
  const [streak, setStreak] = useState(1);
  const [portfolioValue, setPortfolioValue] = useState(1000000);
  const [portfolioReturn, setPortfolioReturn] = useState(0);

  useEffect(() => {

    try {
      const storedStreak = localStorage.getItem('safalniveshak_streak');
      if (storedStreak) setStreak(parseInt(storedStreak, 10));
    } catch (e) {}

    // Load active simulated portfolio metrics
    try {
      const storedPortfolio = localStorage.getItem('abhyas_portfolio_v2');
      if (storedPortfolio) {
        const parsed = JSON.parse(storedPortfolio);
        if (parsed && parsed.balance !== undefined) {
          const totalHoldingsValue = (parsed.holdings || []).reduce((sum, item) => {
            const livePrice = item.avgBuyPrice * (1 + (Math.random() * 0.1 - 0.04));
            return sum + item.quantity * livePrice;
          }, 0);
          const currentNetWorth = parsed.balance + totalHoldingsValue;
          setPortfolioValue(currentNetWorth);
          const initialCapital = 1000000;
          const ret = ((currentNetWorth - initialCapital) / initialCapital) * 100;
          setPortfolioReturn(ret);
        }
      }
    } catch (err) {}
  }, [getTxt]);

  // Data Export & Import Handlers deprecated in favor of Cloud Sync
  const handleExportData = () => {
    alert("Data is now securely synced to your cloud account.");
  };

  const handleImportData = (e) => {
    alert("Data import is disabled. Cloud sync is active.");
  };

  // Calculate XP and Levels
  const lessonsXP = completedLessons.length * 50;
  const tracksXP = completedTracks.length * 200;
  const scansXP = scanHistory.length * 25;
  const totalXP = lessonsXP + tracksXP + scansXP;
  
  const xpPerLevel = 300;
  const level = Math.floor(totalXP / xpPerLevel) + 1;
  const xpInCurrentLevel = totalXP % xpPerLevel;
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpPerLevel) * 100));

  // Determine next lesson/module to learn
  const getContinueLesson = () => {
    let nextL = null;
    for (let t of tracks) {
      for (let l of t.lessons) {
        if (!completedLessons.includes(l.id)) {
          nextL = { trackId: t.id, lessonId: l.id, titleEn: l.titleEn, titleHi: l.titleHi, trackName: t.titleEn };
          break;
        }
      }
      if (nextL) break;
    }
    return nextL;
  };

  const nextLesson = getContinueLesson();

  const quickAccessItems = [
    { id: 'seekho', label: getTxt('Seekho Classroom', 'सीखो पाठशाला'), icon: BookOpen, desc: getTxt('Bilingual financial lessons', 'द्विभाषी वित्तीय पाठ'), color: '#8B7FFF' },
    { id: 'abhyas', label: getTxt('Abhyas Arena', 'अभ्यास सिमुलेटर'), icon: TrendingUp, desc: getTxt('Virtual stock & MF trading', 'वर्चुअल स्टॉक व म्यूचुअल फंड'), color: '#2CD9C5' },
    { id: 'hisab', label: getTxt('Hisab Calculator', 'हिसाब कैलकुलेटर'), icon: Calculator, desc: getTxt('SIP, CAGR & LTCG Tax tools', 'एसआईपी व टैक्स कैलकुलेटर'), color: '#06b6d4' },
    { id: 'bachao', label: getTxt('Scam Shield', 'स्कैम शील्ड'), icon: ShieldAlert, desc: getTxt('Check fraud tips & links', 'स्कैम टिप्स की जांच करें'), color: '#f87171' },
    { id: 'safalmitra', label: getTxt('SafalMitra AI', 'सफलमित्र AI'), icon: MessageSquare, desc: getTxt('Offline support chatbot', 'ऑफ़लाइन सपोर्ट बोट'), color: '#33D090' },
    { id: 'leaderboard', label: getTxt('Leaderboard', 'लीडरबोर्ड'), icon: Trophy, desc: getTxt('Top investor rankings', 'शीर्ष निवेशक रैंकिंग'), color: '#F0B84A' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="perspective-container">
      
      {/* 3. HERO SECTION CARD (Senior SaaS Aesthetic) */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'relative',
          padding: '36px 32px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #0E1322 0%, #121729 60%, #0A0F1D 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px'
        }}
      >
        {/* Soft Radial Glow Accents */}
        <div style={{
          position: 'absolute',
          top: '-30%',
          left: '10%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 127, 255, 0.14) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(50px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          right: '5%',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(44, 217, 197, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(45px)'
        }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Top Row: Two OUTLINE/tinted Badges (NOT solid fill) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(139, 127, 255, 0.12)',
              border: '1px solid rgba(139, 127, 255, 0.3)',
              color: '#A594FF',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '700'
            }}>
              <Zap size={13} fill="#A594FF" />
              {getTxt(`Sovereign Level ${level}`, `सॉवरेन स्तर ${level}`)}
            </span>

            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(44, 217, 197, 0.12)',
              border: '1px solid rgba(44, 217, 197, 0.3)',
              color: '#2CD9C5',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '700'
            }}>
              <ShieldCheck size={13} color="#2CD9C5" />
              {getTxt("100% Offline Secured", "१००% ऑफ़लाइन सुरक्षित")}
            </span>
          </div>

          {/* Large Geometric Display Heading (Sora) */}
          <h2 style={{ 
            fontFamily: 'Sora, sans-serif',
            fontSize: '2.2rem', 
            fontWeight: '800', 
            color: '#FFFFFF', 
            margin: '0 0 10px 0', 
            letterSpacing: '-0.02em',
            lineHeight: 1.15
          }}>
            {getTxt(`Namaste, ${userName} 👋`, `नमस्ते, ${userName} 👋`)}
          </h2>

          {/* Constrained Max-Width Subtext */}
          <p style={{ 
            color: '#8E9BAE', 
            fontSize: '0.96rem', 
            margin: 0, 
            maxWidth: '580px', 
            lineHeight: 1.6,
            fontFamily: 'Inter, sans-serif'
          }}>
            {getTxt(
              'Master virtual portfolios, verify SEBI licenses, and protect your capital from fraudulent chat tips completely offline.',
              'वर्चुअल पोर्टफोलियो का अभ्यास करें, सेबी लाइसेंस सत्यापित करें और व्हाट्सऐप/टेलीग्राम स्कैम से अपने पैसे सुरक्षित रखें।'
            )}
          </p>
        </div>

        {/* Right CTA Group */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* Primary Gradient CTA Button */}
          <button
            onClick={() => setCurrentRoute('seekho')}
            style={{
              padding: '12px 24px',
              fontSize: '0.88rem',
              fontWeight: '700',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #8B7FFF 0%, #6C63F5 100%)',
              color: '#FFFFFF',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(108, 99, 245, 0.45)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <span>{getTxt("Resume Learning", "अध्ययन जारी रखें")}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>

      {/* 4. STAT CARDS ROW (3 Cards, 24px padding, 16px borderRadius, #121729 elevated surface) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Card 1: XP Progress Radial Dial */}
        <div style={{
          backgroundColor: '#121729',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{ position: 'relative', width: '84px', height: '84px', flexShrink: 0 }}>
            <svg style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
              <circle cx="42" cy="42" r="35" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="6" fill="transparent" />
              <circle 
                cx="42" cy="42" r="35" 
                stroke="url(#xpSaaSGrad)" strokeWidth="6" fill="transparent" 
                strokeDasharray="219.9"
                strokeDashoffset={219.9 - (219.9 * progressPercent) / 100}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
              <defs>
                <linearGradient id="xpSaaSGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B7FFF" />
                  <stop offset="100%" stopColor="#2CD9C5" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#FFFFFF' }}>
                {progressPercent}%
              </span>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.72rem', color: '#8E9BAE', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
                {getTxt('XP Accumulation', 'अनुभव संचय')}
              </span>
              <span style={{
                fontSize: '0.62rem',
                backgroundColor: 'rgba(139, 127, 255, 0.15)',
                color: '#8B7FFF',
                padding: '2px 8px',
                borderRadius: '8px',
                border: '1px solid rgba(139, 127, 255, 0.3)',
                fontWeight: '800'
              }}>
                Lvl {level}
              </span>
            </div>
            <h4 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#FFFFFF', margin: '2px 0 4px', fontFamily: 'Sora, sans-serif' }}>
              <CountUp end={totalXP} /> XP
            </h4>
            <p style={{ fontSize: '0.75rem', color: '#8E9BAE', margin: 0 }}>
              {getTxt(`${xpPerLevel - xpInCurrentLevel} XP to Level ${level + 1}`, `स्तर ${level + 1} के लिए ${xpPerLevel - xpInCurrentLevel} XP चाहिए`)}
            </p>
          </div>
        </div>

        {/* Card 2: Virtual Net Worth */}
        <div style={{
          backgroundColor: '#121729',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#8E9BAE', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
              {getTxt('Virtual Net Worth (Abhyas)', 'आभासी कुल मूल्य (अभ्यास)')}
            </span>
            <h4 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#FFFFFF', margin: '6px 0 4px', fontFamily: 'Sora, sans-serif' }}>
              <CountUp end={portfolioValue} prefix="₹" />
            </h4>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
            {portfolioReturn >= 0 ? (
              <span style={{ color: '#33D090', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                ▲ +<CountUp end={portfolioReturn.toFixed(2)} />%
              </span>
            ) : (
              <span style={{ color: '#f87171', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                ▼ <CountUp end={portfolioReturn.toFixed(2)} />%
              </span>
            )}
            <span style={{ color: '#8E9BAE' }}>{getTxt('simulated returns', 'आभासी रिटर्न')}</span>
          </div>
        </div>

        {/* Card 3: Gold Class / Sovereign Portal (Gold Tinted, NOT Solid) */}
        <div style={{
          backgroundColor: '#121729',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.7rem', color: '#8E9BAE', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>
                {getTxt('SOVEREIGN PORTAL', 'सॉवरेन पोर्टल')}
              </span>
              <span style={{ 
                fontSize: '0.62rem', 
                color: '#F0B84A', 
                background: 'rgba(240, 184, 74, 0.12)', 
                border: '1px solid rgba(240, 184, 74, 0.3)', 
                padding: '2px 8px', 
                borderRadius: '8px',
                fontWeight: '800'
              }}>
                GOLD CLASS
              </span>
            </div>

            {nextLesson ? (
              <>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#FFFFFF', margin: '4px 0 2px', fontFamily: 'Sora, sans-serif' }}>
                  {getTxt(nextLesson.titleEn, nextLesson.titleHi)}
                </h4>
                <p style={{ fontSize: '0.75rem', color: '#8E9BAE', margin: 0 }}>
                  {getTxt(`Next target in ${nextLesson.trackName}`, `${nextLesson.trackName} में अगला पाठ`)}
                </p>
              </>
            ) : (
              <>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#FFFFFF', margin: '4px 0 2px', fontFamily: 'Sora, sans-serif' }}>
                  🎉 {getTxt('Curriculum Completed!', 'पाठ्यक्रम पूर्ण!')}
                </h4>
                <p style={{ fontSize: '0.75rem', color: '#8E9BAE', margin: 0 }}>
                  {getTxt('All standard modules mastered.', 'सभी मानक मॉड्यूल मास्टर कर लिए गए हैं।')}
                </p>
              </>
            )}
          </div>

          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${(completedLessons.length / 9) * 100}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, #8B7FFF, #2CD9C5)'
              }} />
            </div>
            {nextLesson && (
              <button 
                onClick={() => setCurrentRoute('seekho')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8B7FFF',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {getTxt('Resume', 'पाठ पर जाएं')} <ArrowRight size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 5. INTERACTIVE PLATFORM MODULES GRID */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#FFFFFF', margin: 0, fontFamily: 'Sora, sans-serif' }}>
              {getTxt('Interactive Platform Modules', 'इंटरएक्टिव प्लेटफ़ॉर्म मॉड्यूल')}
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#8E9BAE' }}>
              {getTxt("Explore offline financial tools, trading arenas, and scam detection shields", "ऑफ़लाइन वित्तीय उपकरण, ट्रेडिंग और स्कैम सुरक्षा जांच का अन्वेषण करें")}
            </span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '18px'
        }}>
          {quickAccessItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentRoute(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                  outline: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  backgroundColor: '#121729',
                  borderRadius: '16px',
                  color: 'inherit',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${item.color}60`;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '46px', height: '46px', borderRadius: '12px',
                  backgroundColor: `${item.color}15`, color: item.color,
                  border: `1px solid ${item.color}30`,
                  flexShrink: 0
                }}>
                  <Icon size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.96rem', fontWeight: '700', color: '#FFFFFF', margin: 0, fontFamily: 'Sora, sans-serif' }}>
                    {item.label}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: '#8E9BAE', margin: '4px 0 0', lineHeight: 1.4 }}>
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. LIVE SEBI & FRAUD TICKER */}
      <div style={{ padding: '20px 24px', borderRadius: '16px', backgroundColor: '#121729', border: '1px solid rgba(255, 255, 255, 0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f87171', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Sora, sans-serif' }}>
            <ShieldAlert size={16} />
            {getTxt("Live SEBI Warnings & Fraud Feed", "लाइव सेबी चेतावनियां और धोखाधड़ी अलर्ट")}
          </h4>
          <span style={{ fontSize: '0.7rem', color: '#8E9BAE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Realtime Protection
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '14px'
        }}>
          <div style={{
            padding: '14px 16px',
            borderRadius: '12px',
            backgroundColor: 'rgba(248, 113, 113, 0.08)',
            border: '1px solid rgba(248, 113, 113, 0.2)'
          }}>
            <span style={{ fontSize: '0.68rem', color: '#f87171', fontWeight: '800', textTransform: 'uppercase' }}>
              ⚠️ SEBI Circular Alert
            </span>
            <h5 style={{ fontSize: '0.88rem', color: '#FFFFFF', margin: '4px 0', fontWeight: '700' }}>
              {getTxt("Beware of Unregistered Telegram Investment Channels", "अपंजीकृत टेलीग्राम निवेश चैनलों से सावधान रहें")}
            </h5>
            <p style={{ fontSize: '0.75rem', color: '#8E9BAE', margin: 0 }}>
              {getTxt("SEBI warns against entities claiming 100% guaranteed returns or asking for advance registration fees.", "सेबी १००% गारंटीकृत रिटर्न का दावा करने वाली या अग्रिम शुल्क मांगने वाली संस्थाओं के खिलाफ चेतावनी देता है।")}
            </p>
          </div>

          <div style={{
            padding: '14px 16px',
            borderRadius: '12px',
            backgroundColor: 'rgba(251, 146, 60, 0.08)',
            border: '1px solid rgba(251, 146, 60, 0.2)'
          }}>
            <span style={{ fontSize: '0.68rem', color: '#FB923C', fontWeight: '800', textTransform: 'uppercase' }}>
              🔍 Verify RIA Registration
            </span>
            <h5 style={{ fontSize: '0.88rem', color: '#FFFFFF', margin: '4px 0', fontWeight: '700' }}>
              {getTxt("Always Check SEBI RIA Registration Number", "हमेशा सेबी RIA पंजीकरण संख्या की जाँच करें")}
            </h5>
            <p style={{ fontSize: '0.75rem', color: '#8E9BAE', margin: 0 }}>
              {getTxt("Use our integrated SEBI Lookup tool to confirm if your advisor is genuinely licensed by SEBI.", "यह पुष्टि करने के लिए कि आपका सलाहकार वास्तव में सेबी द्वारा लाइसेंस प्राप्त है, सेबी खोज उपकरण का उपयोग करें।")}
            </p>
          </div>
        </div>
      </div>

      {/* 7. BOTTOM OFFLINE DATA MANAGEMENT FOOTER */}
      <div style={{ padding: '24px 28px', borderRadius: '16px', backgroundColor: '#121729', border: '1px solid rgba(255, 255, 255, 0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h4 style={{ fontSize: '1.05rem', color: '#33D090', fontWeight: '800', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Sora, sans-serif' }}>
            ☁️ {getTxt("Cloud Sync Active", "क्लाउड सिंक सक्रिय")}
          </h4>
          <p style={{ fontSize: '0.82rem', color: '#8E9BAE', margin: 0 }}>
            {getTxt("Your progress is automatically saved securely to the cloud.", "आपकी प्रगति स्वचालित रूप से क्लाउड पर सुरक्षित रूप से सहेजी जाती है।")}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>

          <button onClick={onOpenProfileModal} className="btn-3d" style={{ padding: '8px 18px', fontSize: '0.82rem', background: 'rgba(139, 127, 255, 0.15)', color: '#8B7FFF', border: '1px solid rgba(139, 127, 255, 0.3)' }}>
            ⚙️ {getTxt("Full Settings", "पूर्ण सेटिंग्स")}
          </button>
        </div>
      </div>
      
    </div>
  );
}
