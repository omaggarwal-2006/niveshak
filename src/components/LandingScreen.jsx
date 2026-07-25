import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShieldCheck, TrendingUp, Search, MessageSquare, Target, CheckCircle2, Users, Star, ArrowRight } from 'lucide-react';

/**
 * LandingScreen — Premium Aurora Gradient Marketing & SEO-optimized Overview Page
 */
export default function LandingScreen({ onDone, lang = 'en', setLang }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [localLang, setLocalLang] = useState(lang);
  const [isMoving, setIsMoving] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const moveTimeoutRef = useRef(null);

  // Framer Motion spring physics for magnetic lag background
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 80, mass: 0.8 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const blob1X = useTransform(springX, (x) => (isMobile ? 0 : x * 0.08));
  const blob1Y = useTransform(springY, (y) => (isMobile ? 0 : y * 0.08));

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e) => {
      const x = e.clientX - window.innerWidth / 2;
      const y = e.clientY - window.innerHeight / 2;
      mouseX.set(x);
      mouseY.set(y);
      setIsMoving(true);
      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
      moveTimeoutRef.current = setTimeout(() => setIsMoving(false), 600);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
    };
  }, [isMobile, mouseX, mouseY]);

  const handleStart = () => {
    setFadeOut(true);
    setTimeout(() => {
      localStorage.setItem('safalniveshak_splash_seen', 'true');
      onDone?.();
    }, 800);
  };

  const toggleLanguage = () => {
    const newLang = localLang === 'en' ? 'hi' : 'en';
    setLocalLang(newLang);
    setLang?.(newLang);
  };

  const getTxt = (en, hi) => (localLang === 'en' ? en : hi);

  const faqs = [
    {
      q: getTxt("Is the Virtual Trading Simulator really free?", "क्या वर्चुअल ट्रेडिंग सिम्युलेटर वास्तव में मुफ़्त है?"),
      a: getTxt("Yes, absolutely! You get ₹10,00,000 in virtual paper money to practice trading stocks and mutual funds without risking a single rupee of your real wealth.", "हाँ, बिल्कुल! आपको असली पैसे को जोखिम में डाले बिना शेयर और म्यूचुअल फंड ट्रेडिंग का अभ्यास करने के लिए ₹10,00,000 का वर्चुअल पेपर मनी मिलता है।")
    },

    {
      q: getTxt("How does the Scam Meter work?", "स्कैम मीटर कैसे काम करता है?"),
      a: getTxt("Simply copy and paste suspicious messages from WhatsApp or Telegram. Our AI analyzes the text for common fraud patterns like 'guaranteed returns' or 'jackpot calls'.", "बस व्हाट्सएप या टेलीग्राम से संदिग्ध संदेश को हमारे स्कैम मीटर में कॉपी और पेस्ट करें। हमारा एआई 'गारंटीकृत रिटर्न' या 'जैकपॉट कॉल' जैसे सामान्य धोखाधड़ी पैटर्न के लिए पाठ का विश्लेषण करेगा।")
    },
    {
      q: getTxt("Is my data secure and synced?", "क्या मेरा डेटा सुरक्षित और सिंक किया गया है?"),
      a: getTxt("Yes. Once you create an account, your virtual portfolio, learning progress, and streak are securely synced to the cloud via Google Firebase, accessible across all your devices.", "हाँ। एक बार खाता बनाने के बाद, आपका वर्चुअल पोर्टफोलियो, सीखने की प्रगति और स्ट्रीक Google फायरबेस के माध्यम से क्लाउड पर सुरक्षित रूप से सिंक हो जाते हैं, जो आपके सभी उपकरणों पर सुलभ हैं।")
    }
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', flexDirection: 'column',
      backgroundColor: '#030812', color: '#fff', opacity: fadeOut ? 0 : 1,
      transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      overflowY: 'auto', overflowX: 'hidden',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      scrollBehavior: 'smooth'
    }}>
      
      {/* 1. ANIMATED NOISE & GRAIN OVERLAY */}
      <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', opacity: 0.035, pointerEvents: 'none', zIndex: 1 }}>
        <filter id="noise-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-filter)" />
      </svg>

      {/* 2. AURORA GRADIENT BLOB LAYERS (Fixed Background) */}
      <div style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
        <motion.div
          animate={isMobile ? {} : { y: [0, 40, -30, 0], x: [0, -30, 40, 0] }}
          transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
          style={{
            position: 'absolute', width: isMobile ? '300px' : '500px', height: isMobile ? '300px' : '500px',
            borderRadius: '50%', background: 'radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, transparent 70%)',
            left: '-10%', top: '-10%', filter: isMobile ? 'blur(50px)' : 'blur(90px)', mixBlendMode: 'screen',
            x: isMobile ? 0 : blob1X, y: isMobile ? 0 : blob1Y
          }}
        />
        <motion.div
          animate={isMobile ? {} : { y: [0, -50, 40, 0], x: [0, 50, -40, 0] }}
          transition={{ repeat: Infinity, duration: 22, ease: "easeInOut" }}
          style={{
            position: 'absolute', width: isMobile ? '300px' : '600px', height: isMobile ? '300px' : '600px',
            borderRadius: '50%', background: 'radial-gradient(circle, rgba(37, 99, 235, 0.20) 0%, transparent 80%)',
            right: '-10%', top: '20%', filter: isMobile ? 'blur(50px)' : 'blur(100px)', mixBlendMode: 'screen'
          }}
        />
      </div>

      {/* HEADER NAV */}
      <header style={{ position: 'relative', zIndex: 10, padding: '24px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 4px 15px rgba(124,58,237,0.4)' }}>
            📈
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: '800', background: 'linear-gradient(135deg, #f3e8ff, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SafalNiveshak
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={toggleLanguage}
            style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#D98E04', padding: '8px 16px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s ease', backdropFilter: 'blur(10px)' }}
          >
            🌐 {localLang === 'en' ? 'हिन्दी' : 'English'}
          </button>
          <button
            onClick={handleStart}
            style={{ background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '12px', color: '#fff', padding: '8px 16px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease' }}
          >
            {getTxt('Login', 'लॉग इन')}
          </button>
        </div>
      </header>

      {/* CONTENT SCROLL AREA */}
      <main style={{ position: 'relative', zIndex: 10, flex: 1, padding: '0 5% 40px 5%', display: 'flex', flexDirection: 'column', gap: '100px' }}>
        
        {/* HERO SECTION */}
        <section style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', marginTop: '-40px' }}>
          <div style={{ padding: '8px 16px', borderRadius: '20px', background: 'rgba(124, 58, 237, 0.15)', border: '1px solid rgba(124, 58, 237, 0.3)', color: '#D8B4FE', fontSize: '0.85rem', fontWeight: '600', marginBottom: '24px', animation: 'slideUpFade 0.6s ease forwards' }}>
            {getTxt('India’s Most Trusted Stock Market Simulator', 'भारत का सबसे भरोसेमंद शेयर बाजार सिम्युलेटर')}
          </div>
          <h1 style={{ fontSize: isMobile ? '2.8rem' : '5rem', fontWeight: '900', margin: '0 0 24px 0', lineHeight: 1.1, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #ffffff 30%, #93c5fd 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'slideUpFade 0.8s ease forwards' }}>
            {getTxt('Invest with Confidence.', 'आत्मविश्वास के साथ निवेश करें।')} <br/>
            <span style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {getTxt('Never Fall for Scams.', 'कभी धोखाधड़ी का शिकार न हों।')}
            </span>
          </h1>
          <p style={{ maxWidth: '650px', fontSize: '1.15rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '48px', animation: 'slideUpFade 1s ease forwards' }}>
            {getTxt(
              'SafalNiveshak is your ultimate companion to master the stock market through risk-free simulation and spot financial frauds.',
              'सफल निवेशक जोखिम-मुक्त सिमुलेशन के माध्यम से शेयर बाजार में महारत हासिल करने और वित्तीय धोखाधड़ी को पहचानने के लिए आपका अंतिम साथी है।'
            )}
          </p>
          <div style={{ display: 'flex', gap: '16px', animation: 'slideUpFade 1.2s ease forwards', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={handleStart}
              className="hero-btn"
              style={{ padding: '18px 40px', fontSize: '1.1rem', fontWeight: '700', borderRadius: '14px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(124, 58, 237, 0.4)' }}
            >
              {getTxt('Start Your Journey Now', 'अपनी यात्रा अभी शुरू करें')}
            </button>
            <button
              onClick={handleStart}
              className="hero-btn"
              style={{ padding: '18px 40px', fontSize: '1.1rem', fontWeight: '700', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.1)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.2)', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
            >
              {getTxt('Sign Up / Login', 'साइन अप / लॉग इन')}
            </button>
          </div>
        </section>

        {/* SOCIAL PROOF SECTION */}
        <section>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>
              {getTxt('Trusted by over 10,000+ retail investors in India', 'भारत में १०,०००+ से अधिक खुदरा निवेशकों द्वारा विश्वसनीय')}
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '24px' }}>
            {[
              { text: getTxt("The Abhyas simulator saved me from making rookie mistakes with my hard-earned money. Must have app!", "अभ्यास सिम्युलेटर ने मुझे अपनी गाढ़ी कमाई से नौसिखिए गलतियाँ करने से बचाया। बेहतरीन ऐप!"), author: "Rajat S." },
              { text: getTxt("I almost invested in a Telegram group's tip, but the Scam Meter flagged it instantly. Brilliant security tool.", "मैंने लगभग एक टेलीग्राम समूह के टिप में निवेश कर दिया था, लेकिन स्कैम मीटर ने इसे तुरंत पकड़ लिया। शानदार सुरक्षा उपकरण।"), author: "Priya M." },
              { text: getTxt("The AI Assistant clarified all my doubts easily. Now I feel more confident about the stock market.", "एआई असिस्टेंट ने मेरे सभी संदेह आसानी से स्पष्ट कर दिए। अब मैं शेयर बाजार को लेकर ज्यादा आश्वस्त महसूस करता हूं।"), author: "Amit P." }
            ].map((t, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', color: '#FBBF24', marginBottom: '12px' }}>
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                <p style={{ color: '#E2E8F0', fontStyle: 'italic', marginBottom: '16px', lineHeight: 1.5, fontSize: '0.95rem' }}>"{t.text}"</p>
                <span style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: '600' }}>— {t.author}</span>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS / 3 SIMPLE STEPS */}
        <section style={{ padding: '60px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px', color: '#F1F5F9' }}>
              {getTxt('How SafalNiveshak Works', 'सफल निवेशक कैसे काम करता है')}
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '32px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', margin: '0 auto 20px auto', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.1)', color: '#60A5FA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '900' }}>1</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '12px', color: '#E2E8F0' }}>{getTxt('Learn the Basics', 'मूल बातें सीखें')}</h3>
              <p style={{ color: '#94A3B8', lineHeight: 1.6 }}>{getTxt('Start with bite-sized, gamified tracks covering Stock Markets, Mutual Funds, and Financial Security in Hindi and English.', 'हिंदी और अंग्रेजी में शेयर बाजार, म्यूचुअल फंड और वित्तीय सुरक्षा को कवर करने वाले छोटे, गेमीफाइड ट्रैक से शुरू करें।')}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', margin: '0 auto 20px auto', borderRadius: '16px', background: 'rgba(167, 139, 250, 0.1)', color: '#A78BFA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '900' }}>2</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '12px', color: '#E2E8F0' }}>{getTxt('Practice Risk-Free', 'जोखिम मुक्त अभ्यास करें')}</h3>
              <p style={{ color: '#94A3B8', lineHeight: 1.6 }}>{getTxt('Use ₹10,00,000 of virtual currency in the Abhyas simulator to build a portfolio and watch it perform against live market data.', 'अभ्यास सिम्युलेटर में ₹10,00,000 की आभासी मुद्रा का उपयोग करके एक पोर्टफोलियो बनाएं और इसे लाइव मार्केट डेटा के खिलाफ प्रदर्शन करते हुए देखें।')}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', margin: '0 auto 20px auto', borderRadius: '16px', background: 'rgba(52, 211, 153, 0.1)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '900' }}>3</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '12px', color: '#E2E8F0' }}>{getTxt('Invest Securely', 'सुरक्षित रूप से निवेश करें')}</h3>
              <p style={{ color: '#94A3B8', lineHeight: 1.6 }}>{getTxt('Before putting real money on the line, use our tools to scan stock tips and learn safely.', 'असली पैसा लगाने से पहले, सुरक्षित रहने के लिए हमारे उपकरणों का उपयोग करें।')}</p>
            </div>
          </div>
        </section>

        {/* WHO WE ARE / MISSION */}
        <section style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '40px', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)', padding: isMobile ? '32px 20px' : '60px 40px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)' }}>
          <div>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(37, 99, 235, 0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Target size={28} />
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '16px', color: '#F1F5F9' }}>
              {getTxt('Who We Are', 'हम कौन हैं')}
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#94A3B8', lineHeight: 1.7, marginBottom: '20px' }}>
              {getTxt(
                'We are a passionate group of financial educators, developers, and designers on a mission to democratize financial literacy in India. Driven by the alarming rise in retail investor scams on WhatsApp and Telegram, we built SafalNiveshak to provide a safe, fully functional sandbox for financial learning.',
                'हम वित्तीय शिक्षकों, डेवलपर्स और डिजाइनरों का एक भावुक समूह हैं जो भारत में वित्तीय साक्षरता को लोकतांत्रिक बनाने के मिशन पर हैं। व्हाट्सएप और टेलीग्राम पर खुदरा निवेशक घोटालों में चिंताजनक वृद्धि से प्रेरित होकर, हमने वित्तीय शिक्षा के लिए एक सुरक्षित, पूरी तरह से काम करने वाला सैंडबॉक्स प्रदान करने के लिए सफल निवेशक का निर्माण किया।'
              )}
            </p>
            <p style={{ fontSize: '1.05rem', color: '#94A3B8', lineHeight: 1.7 }}>
              {getTxt(
                'By combining engaging gamified education and simulated stock trading, we empower everyday Indians to make confident, data-backed financial decisions without fear.',
                'आकर्षक गेमीफाइड शिक्षा और नकली स्टॉक ट्रेडिंग का संयोजन करके, हम आम भारतीयों को बिना किसी डर के आत्मविश्वास से भरे, डेटा-समर्थित वित्तीय निर्णय लेने के लिए सशक्त बनाते हैं।'
              )}
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#A78BFA', marginBottom: '8px' }}>100%</div>
              <div style={{ fontSize: '0.9rem', color: '#64748B' }}>{getTxt('Risk-Free Learning', 'जोखिम-मुक्त शिक्षण')}</div>
            </div>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#60A5FA', marginBottom: '8px' }}>24/7</div>
              <div style={{ fontSize: '0.9rem', color: '#64748B' }}>{getTxt('AI Assistance', 'एआई सहायता')}</div>
            </div>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)', gridColumn: 'span 2' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#34D399', marginBottom: '8px' }}>100%</div>
              <div style={{ fontSize: '0.9rem', color: '#64748B' }}>{getTxt('Free Education', 'मुफ्त शिक्षा')}</div>
            </div>
          </div>
        </section>

        {/* WHAT IS THIS USED FOR / CORE FEATURES */}
        <section>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px', color: '#F1F5F9' }}>
              {getTxt('What Is This Used For?', 'इसका उपयोग किस लिए किया जाता है?')}
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#94A3B8', maxWidth: '650px', margin: '0 auto' }}>
              {getTxt(
                'A comprehensive suite of investing tools and fraud-prevention features designed to transform beginners into vigilant, confident investors.',
                'एक शुरुआती को एक सतर्क, आत्मविश्वासी निवेशक में बदलने के लिए डिज़ाइन किए गए निवेश उपकरणों और धोखाधड़ी-रोकथाम सुविधाओं का एक व्यापक सूट।'
              )}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px' }}>
            <div style={{ background: 'rgba(7, 14, 26, 0.6)', padding: '32px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.05)', transition: 'transform 0.3s' }} className="feature-card">
              <TrendingUp size={36} color="#A78BFA" style={{ marginBottom: '20px' }} />
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '12px', color: '#E2E8F0' }}>{getTxt('Virtual Trading (Abhyas)', 'वर्चुअल ट्रेडिंग (अभ्यास)')}</h3>
              <p style={{ color: '#94A3B8', lineHeight: 1.6, fontSize: '0.95rem' }}>
                {getTxt('Practice trading stocks and mutual funds with ₹10,00,000 virtual capital. Test your strategies in a real-time market simulator without losing real money. Track your virtual P&L like a pro.', '₹10,00,000 की आभासी पूंजी के साथ स्टॉक और म्यूचुअल फंड में ट्रेडिंग का अभ्यास करें। वास्तविक पैसे खोए बिना वास्तविक समय के बाजार सिम्युलेटर में अपनी रणनीतियों का परीक्षण करें। एक प्रो की तरह अपना पी एंड एल ट्रैक करें।')}
              </p>
            </div>
            
            <div style={{ background: 'rgba(7, 14, 26, 0.6)', padding: '32px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.05)', transition: 'transform 0.3s' }} className="feature-card">
              <ShieldCheck size={36} color="#F87171" style={{ marginBottom: '20px' }} />
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '12px', color: '#E2E8F0' }}>{getTxt('Scam Meter Analyzer', 'घोटाला मीटर विश्लेषक')}</h3>
              <p style={{ color: '#94A3B8', lineHeight: 1.6, fontSize: '0.95rem' }}>
                {getTxt('Paste messages from Telegram or WhatsApp groups to instantly detect pump-and-dump schemes, guaranteed return frauds, and fake tips based on historical scam data.', 'पंप-एंड-डंप योजनाओं, गारंटीकृत रिटर्न धोखाधड़ी और ऐतिहासिक घोटाले के डेटा के आधार पर नकली युक्तियों का तुरंत पता लगाने के लिए टेलीग्राम या व्हाट्सएप समूहों के संदेश पेस्ट करें।')}
              </p>
            </div>

            <div style={{ background: 'rgba(7, 14, 26, 0.6)', padding: '32px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.05)', transition: 'transform 0.3s' }} className="feature-card">
              <MessageSquare size={36} color="#60A5FA" style={{ marginBottom: '20px' }} />
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '12px', color: '#E2E8F0' }}>{getTxt('Safal Mitra AI Assistant', 'सफल मित्रा एआई सहायक')}</h3>
              <p style={{ color: '#94A3B8', lineHeight: 1.6, fontSize: '0.95rem' }}>
                {getTxt('Your personal 24/7 AI financial assistant. Ask complex stock market questions, clarify confusing finance jargon, and get unbiased educational guidance instantly.', 'आपका व्यक्तिगत 24/7 एआई वित्तीय सहायक। शेयर बाजार के जटिल प्रश्न पूछें, भ्रमित करने वाले वित्त शब्दजाल को स्पष्ट करें, और तुरंत निष्पक्ष शैक्षिक मार्गदर्शन प्राप्त करें।')}
              </p>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px', color: '#F1F5F9' }}>
              {getTxt('Frequently Asked Questions', 'अक्सर पूछे जाने वाले प्रश्न')}
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s' }}
              >
                <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '600', color: '#E2E8F0' }}>{faq.q}</h4>
                  <ArrowRight size={18} color="#94A3B8" style={{ transform: activeFaq === index ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
                </div>
                {activeFaq === index && (
                  <div style={{ padding: '0 24px 20px 24px', color: '#94A3B8', lineHeight: 1.6, fontSize: '0.95rem' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section style={{ textAlign: 'center', padding: '80px 20px', background: 'linear-gradient(to top, rgba(124, 58, 237, 0.1), transparent)', borderRadius: '24px', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '24px', color: '#fff' }}>
            {getTxt('Ready to master the markets securely?', 'सुरक्षित रूप से बाजारों में महारत हासिल करने के लिए तैयार हैं?')}
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#94A3B8', marginBottom: '40px' }}>
            {getTxt('Join thousands of Indians learning to invest the right way.', 'हजारों भारतीयों से जुड़ें जो सही तरीके से निवेश करना सीख रहे हैं।')}
          </p>
          <button
            onClick={handleStart}
            className="hero-btn"
            style={{ padding: '18px 48px', fontSize: '1.1rem', fontWeight: '800', borderRadius: '14px', background: '#fff', color: '#030812', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 10px 30px rgba(255, 255, 255, 0.2)' }}
          >
            {getTxt('Create Free Account', 'मुफ्त खाता बनाएं')}
          </button>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>📈</div>
            <span style={{ fontSize: '1rem', fontWeight: '700', color: '#94A3B8' }}>SafalNiveshak</span>
          </div>
          <p style={{ color: '#64748B', fontSize: '0.85rem', margin: 0 }}>
            © {new Date().getFullYear()} SafalNiveshak. {getTxt('All rights reserved.', 'सर्वाधिकार सुरक्षित।')} | {getTxt('Made for India', 'भारत के लिए बनाया गया')} 🇮🇳
          </p>
        </footer>
        
      </main>

      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-btn:hover {
          transform: translateY(-3px) scale(1.02);
        }
        .feature-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255,255,255,0.2) !important;
          background: rgba(15, 23, 42, 0.8) !important;
        }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #030812; }
        ::-webkit-scrollbar-thumb { background: rgba(124, 58, 237, 0.5); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(124, 58, 237, 0.8); }
      `}</style>
    </div>
  );
}
