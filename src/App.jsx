import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import Navbar from './components/Navbar';
import Abhyas from './components/Abhyas';
import ScamMeter from './components/ScamMeter';
import GlossaryTerm from './components/GlossaryTerm';
import SafalMitraChatbot from './components/SafalMitraChatbot';
import InteractiveCalculator from './components/InteractiveCalculator';
import SeekhoRenderer from './components/SeekhoRenderer';
import OnboardingFlow from './components/OnboardingFlow';
import DisclaimerBanner from './components/DisclaimerBanner';
import LandingScreen from './components/LandingScreen';
import Dashboard from './components/Dashboard';
import Leaderboard from './components/Leaderboard';
import ProfileModal from './components/ProfileModal';
import LoginScreen from './components/LoginScreen';
import CommandPalette from './components/CommandPalette';
import { useAuth } from './context/AuthContext';
import { getUserProfile, updateUserProfile } from './services/db';
import { tracks, glossary, trackQuizzes } from './data/lessons';
import { stockKnowledge } from './data/stockKnowledge';
import { officialTestTemplates } from './data/scamRules';

const sebiAlerts = [
  {
    date: "25/06/2024",
    titleEn: "SEBI cautions investors against dealing with unregistered entities",
    titleHi: "सेबी ने निवेशकों को अपंजीकृत संस्थाओं के साथ लेनदेन करने के प्रति आगाह किया",
    descEn: "SEBI warns public against dealing with platforms mimicking registered advisors, offering guaranteed trading targets or fake official SEBI letters.",
    descHi: "सेबी ने जनता को उन प्लेटफार्मों के साथ लेनदेन करने के खिलाफ चेतावनी दी है जो पंजीकृत सलाहकारों की नकल करते हैं या नकली आधिकारिक पत्र दिखाते हैं।",
    link: "https://www.sebi.gov.in/media-and-press/press-releases/jun-2024/sebi-cautions-investors-against-dealing-with-unregistered-entities_84351.html"
  },
  {
    date: "10/04/2024",
    titleEn: "Advisory on entities impersonating SEBI registered intermediaries",
    titleHi: "सेबी पंजीकृत बिचौलियों का भेष धरने वाली संस्थाओं पर सुरक्षा निर्देश",
    descEn: "Warning against private Telegram channels and WhatsApp groups utilizing names of genuine research analysts to pump penny stocks.",
    descHi: "पेनी स्टॉक को बढ़ावा देने के लिए वास्तविक अनुसंधान विश्लेषकों के नामों का उपयोग करने वाले टेलीग्राम चैनलों और व्हाट्सएप समूहों के खिलाफ चेतावनी।",
    link: "https://www.sebi.gov.in/media-and-press/press-releases/apr-2024/sebi-warns-public-against-entities-impersonating-sebi-registered-advisors_82910.html"
  },
  {
    date: "02/07/2023",
    titleEn: "Warning on stock price manipulation operated via social media channels",
    titleHi: "सोशल मीडिया चैनलों के माध्यम से स्टॉक मूल्य हेरफेर के खिलाफ सख्त चेतावनी",
    descEn: "SEBI cautions public against illegal recommendations, assured return claims, and operator leaks spread on messaging groups.",
    descHi: "सेबी ने मैसेजिंग ग्रुपों पर फैलाई जाने वाली अवैध सिफारिशों, सुनिश्चित रिटर्न दावों और ऑपरेटर लीक के खिलाफ जनता को आगाह किया है।",
    link: "https://www.sebi.gov.in/media-and-press/press-releases/jul-2023/warning-on-social-media-investment-scams_73420.html"
  }
];

export default function App() {
  const { currentUser, logout } = useAuth();
  const [currentRoute, setCurrentRoute] = useState('home');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const [scamMeterInitialText, setScamMeterInitialText] = useState('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userName, setUserName] = useState('Investor');
  const [profiles, setProfiles] = useState([{ id: 'default_profile', name: 'Investor', xp: 150, created_at: new Date().toLocaleDateString('en-IN'), data: {} }]);
  const [activeProfileId, setActiveProfileId] = useState('default_profile');
  const [notifyEnabled, setNotifyEnabled] = useState(false);

  // Splash screen: show on every app startup for premium landing experience
  const [splashDone, setSplashDone] = useState(false);

  // Onboarding: show once per device
  const [onboardingDone, setOnboardingDone] = useState(false);

  const handleOnboardingComplete = async (route) => {
    setOnboardingDone(true);
    if (currentUser) {
      await updateUserProfile(currentUser.uid, { onboarded: true });
    }
    if (route && route !== 'home') setCurrentRoute(route);
  };
  
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
      try {
        StatusBar.setStyle({ style: Style.Dark });
        StatusBar.setBackgroundColor({ color: '#06101E' });
      } catch (e) {
        console.log("Capacitor StatusBar active only on native mobile wrappers.");
      }
    } else {
      document.documentElement.classList.remove('dark-theme');
      try {
        StatusBar.setStyle({ style: Style.Light });
        StatusBar.setBackgroundColor({ color: '#FAFAF7' });
      } catch (e) {
        console.log("Capacitor StatusBar active only on native mobile wrappers.");
      }
    }
    localStorage.setItem('safalniveshak_theme', theme);
  }, [theme]);

  // Android hardware back button handler (Part B safe exit/navigation)
  useEffect(() => {
    let backButtonListener;
    const registerBackButton = async () => {
      try {
        backButtonListener = await CapApp.addListener('backButton', () => {
          if (currentRoute !== 'home') {
            setCurrentRoute('home');
          } else {
            const confirmExit = window.confirm(lang === 'en' ? "Exit SafalNiveshak?" : "सफल निवेशक ऐप बंद करें?");
            if (confirmExit) {
              CapApp.exitApp();
            }
          }
        });
      } catch (e) {
        console.log("Capacitor backButton listener active only in native APK environments.");
      }
    };
    
    registerBackButton();
    
    return () => {
      if (backButtonListener && typeof backButtonListener.remove === 'function') {
        backButtonListener.remove();
      }
    };
  }, [currentRoute, lang]);
  
  // Active Track selection
  const [activeTrackId, setActiveTrackId] = useState('beginner'); // 'beginner', 'intermediate', 'safety'
  
  // Progress states — seed demo data for first-time visitors so Passbook looks populated
  // Progress states
  const [completedLessons, setCompletedLessons] = useState([1, 2, 3]);
  const [scanHistory, setScanHistory] = useState([{
      textSnippet: "🚀 JACKPOT CALL: 100% guaranteed profit in 10 days...",
      score: 91,
      verdict: 'HIGH',
      date: new Date().toLocaleDateString('en-IN')
  }]);
  const [completedTracks, setCompletedTracks] = useState([]);
  const [helpfulFeedback, setHelpfulFeedback] = useState({});

  // Search filter for Glossary
  const [glossaryQuery, setGlossaryQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Crowdsourced scam feed states
  const [reportedScams, setReportedScams] = useState([]);

  // Fetch Cloud State from Firestore on mount if authenticated
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const profile = await getUserProfile(currentUser.uid);
        if (profile) {
          if (profile.name) setUserName(profile.name);
          if (profile.theme) setTheme(profile.theme);
          if (profile.onboarded !== undefined) setOnboardingDone(profile.onboarded);
          if (profile.completedLessons) setCompletedLessons(profile.completedLessons);
          if (profile.scanHistory) setScanHistory(profile.scanHistory);
          if (profile.completedTracks) setCompletedTracks(profile.completedTracks);
        }
      }
    };
    fetchUserData();
  }, [currentUser]);

  // Global Command Palette Shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const triggerSearchFromDashboard = () => {
    setIsCommandPaletteOpen(true);
  };

  // Fetch crowdsourced reported scams feed on home page routing
  useEffect(() => {
    const fetchReportedScams = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/reported-scams");
        if (response.ok) {
          const data = await response.json();
          setReportedScams(data);
        } else {
          throw new Error("Report fetch error");
        }
      } catch (err) {
        // Fallback local seed data
        setReportedScams([
          {
            messageText: "🚀 JACKPOT CALL: Buy VIP stocks tomorrow. 100% profit double money guaranteed in 10 days. No risk, transfer Rs 5000 registration fee to Telegram link: t.me/VIP_Stock_Pumping",
            patterns: "guaranteed_returns,urgency_pressure,unregistered_solicitation,pump_dump,advance_payment",
            reportCount: 48,
            lastReported: new Date().toLocaleDateString('en-IN')
          },
          {
            messageText: "Nikhil Kamath Ambani Fund: Join WhatsApp group chat.whatsapp.com/AmbaniTrust for 5% daily returns. Valid for next 2 hours only. Limited seats left, register now!",
            patterns: "guaranteed_returns,urgency_pressure,unregistered_solicitation,celebrity_endorsement",
            reportCount: 32,
            lastReported: new Date().toLocaleDateString('en-IN')
          },
          {
            messageText: "SEBI Registered Advisory leak: Tomorrow upper circuit stock target. Earn 50% profit. We split profit 50-50 after trade is completed. Inbox me for details.",
            patterns: "fake_sebi_advisor,pump_dump,profit_sharing",
            reportCount: 14,
            lastReported: new Date().toLocaleDateString('en-IN')
          }
        ]);
      }
    };

    if (currentRoute === 'home') {
      fetchReportedScams();
    }
  }, [currentRoute]);

  useEffect(() => {
    if (currentUser) {
      updateUserProfile(currentUser.uid, { completedLessons });
    }
  }, [completedLessons, currentUser]);

  useEffect(() => {
    if (currentUser) {
      updateUserProfile(currentUser.uid, { scanHistory });
    }
  }, [scanHistory, currentUser]);

  useEffect(() => {
    if (currentUser) {
      updateUserProfile(currentUser.uid, { completedTracks });
    }
  }, [completedTracks, currentUser]);

  useEffect(() => {
    if (currentUser) {
      updateUserProfile(currentUser.uid, { helpfulFeedback });
    }
  }, [helpfulFeedback, currentUser]);

  // Audio Playback states for Seekho
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [activeStockSymbol, setActiveStockSymbol] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState('');

  // Track Assessment Exam states
  const [examActive, setExamActive] = useState(false);
  const [examAnswers, setExamAnswers] = useState({});
  const [examSubmitted, setExamSubmitted] = useState({});
  const [examFinished, setExamFinished] = useState(false);

  useEffect(() => {
    const getVoicesList = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
        const matchLang = lang === 'en' ? 'en' : 'hi';
        const defaultVoice = voices.find(v => v.lang.toLowerCase().includes(matchLang)) || voices[0];
        if (defaultVoice) {
          setSelectedVoiceName(defaultVoice.name);
        }
      }
    };

    getVoicesList();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = getVoicesList;
    }
  }, [lang]);

  // Cancel speech on context navigate
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  }, [activeLessonId, currentRoute]);

  const handleSpeechPlay = (text) => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported on this browser.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = availableVoices.find(v => v.name === selectedVoiceName);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.lang = lang === 'en' ? 'en-IN' : 'hi-IN';
    utterance.rate = speechRate;

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };
    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleSpeechStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  };

  const handleAddScanHistory = (record) => {
    setScanHistory(prev => [record, ...prev]);
  };

  const handleResetPassbook = () => {
    if (window.confirm("Do you want to reset your learning Passbook ledger history?")) {
      setCompletedLessons([]);
      setScanHistory([]);
      setCompletedTracks([]);
      setHelpfulFeedback({});
      setActiveLessonId(null);
      setExamActive(false);
      setExamFinished(false);
    }
  };

  const triggerScamFastPath = () => {
    const scamText = officialTestTemplates[0].text;
    setScamMeterInitialText(scamText);
    setCurrentRoute('bachao');
  };

  const triggerLessonFastPath = () => {
    setActiveTrackId('beginner');
    setActiveLessonId(1);
    setCurrentRoute('seekho');
  };

  const getTxt = (en, hi) => (lang === 'en' ? en : hi);

  const parseGlossaryTerms = (text) => {
    if (!text) return '';
    const terms = ["SIP", "NAV", "Expense Ratio", "AMC", "AUM", "Exit Load", "LTCG", "STCG", "SEBI", "RIA", "Folio"];
    const regex = new RegExp(`\\b(${terms.join('|')})\\b`, 'gi');
    const parts = text.split(regex);
    if (parts.length === 1) return text;
    
    return parts.map((part, idx) => {
      const isMatch = terms.some(t => t.toLowerCase() === part.toLowerCase());
      if (isMatch) {
        return <GlossaryTerm key={idx} term={part}>{part}</GlossaryTerm>;
      }
      return part;
    });
  };

  const isLessonUnlocked = (track, lesson, index) => {
    if (index === 0) return true;
    const prevLesson = track.lessons[index - 1];
    return completedLessons.includes(prevLesson.id);
  };

  const isTrackFullyRead = (track) => {
    return track.lessons.every(l => completedLessons.includes(l.id));
  };

  const handleExamSelect = (qIdx, optIdx) => {
    const key = `${activeTrackId}_${qIdx}`;
    if (examSubmitted[key]) return;
    setExamAnswers(prev => ({ ...prev, [key]: optIdx }));
  };

  const handleExamSubmitQuestion = (qIdx) => {
    const key = `${activeTrackId}_${qIdx}`;
    setExamSubmitted(prev => ({ ...prev, [key]: true }));
  };

  const handleFinishExam = async () => {
    const questions = trackQuizzes[activeTrackId];
    let allCorrect = true;
    questions.forEach((q, idx) => {
      const key = `${activeTrackId}_${idx}`;
      if (examAnswers[key] !== q.answerIndex) {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      if (!completedTracks.includes(activeTrackId)) {
        const updated = [...completedTracks, activeTrackId];
        setCompletedTracks(updated);
        try {
          await fetch("http://localhost:5000/api/track-progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: "sandbox_user", trackId: activeTrackId })
          });
        } catch (err) {
          console.warn("Could not write track clearance to backend:", err.message);
        }
      }
    }
    setExamFinished(true);
  };

  const handleResetExam = () => {
    const questions = trackQuizzes[activeTrackId];
    setExamAnswers(prev => {
      const cleared = { ...prev };
      questions.forEach((_, idx) => {
        delete cleared[`${activeTrackId}_${idx}`];
        delete examSubmitted[`${activeTrackId}_${idx}`];
      });
      return cleared;
    });
    setExamFinished(false);
  };

  const filteredGlossary = glossary.filter(g => {
    const q = glossaryQuery.toLowerCase().trim();
    if (!q) return true;
    return g.term.toLowerCase().includes(q) || g.defEn.toLowerCase().includes(q) || g.defHi.toLowerCase().includes(q);
  });

  const handleExportData = () => {
    const keys = [
      'safalniveshak_username',
      'safalniveshak_lessons',
      'safalniveshak_tracks',
      'safalniveshak_history',
      'safalniveshak_feedback',
      'safalniveshak_portfolio',
      'safalniveshak_mf_portfolio',
      'safalniveshak_profiles',
      'safalniveshak_active_profile_id',
      'safalniveshak_avatar'
    ];
    const backup = {};
    keys.forEach(k => {
      const val = localStorage.getItem(k);
      if (val !== null) backup[k] = val;
    });
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SafalNiveshak_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        Object.keys(data).forEach(key => {
          localStorage.setItem(key, data[key]);
        });
        alert(lang === 'en' ? 'Data imported successfully! Reloading...' : 'डेटा सफलतापूर्वक इम्पोर्ट किया गया! रीलोड हो रहा है...');
        window.location.reload();
      } catch (err) {
        alert(lang === 'en' ? 'Failed to parse backup JSON.' : 'बैकअप फ़ाइल लोड करने में असमर्थ।');
      }
    };
    reader.readAsText(file);
  };

  const handleSwitchProfile = (targetId) => {
    if (targetId === activeProfileId) return;
    const targetProf = profiles.find(p => p.id === targetId);
    if (targetProf && targetProf.data) {
      Object.keys(targetProf.data).forEach(key => {
        if (targetProf.data[key] !== null) {
          localStorage.setItem(key, targetProf.data[key]);
        }
      });
    }
    localStorage.setItem('safalniveshak_active_profile_id', targetId);
    window.location.reload();
  };

  const handleCreateProfile = (e) => {
    e.preventDefault();
    const form = e.target;
    const input = form.querySelector('input');
    const name = input ? input.value.trim() : '';
    if (!name) return;
    const newId = 'profile_' + Date.now();
    const freshData = {
      safalniveshak_username: name,
      safalniveshak_lessons: '[]',
      safalniveshak_tracks: '[]',
      safalniveshak_history: '[]'
    };
    const updatedProfiles = [...profiles, { id: newId, name, xp: 0, created_at: new Date().toLocaleDateString('en-IN'), data: freshData }];
    setProfiles(updatedProfiles);
    localStorage.setItem('safalniveshak_profiles', JSON.stringify(updatedProfiles));
    localStorage.setItem('safalniveshak_active_profile_id', newId);
    Object.keys(freshData).forEach(k => localStorage.setItem(k, freshData[k]));
    window.location.reload();
  };

  const handleToggleNotifications = async () => {
    if (notifyEnabled) {
      setNotifyEnabled(false);
      localStorage.setItem('safalniveshak_notifications_enabled', 'false');
      return;
    }
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotifyEnabled(true);
        localStorage.setItem('safalniveshak_notifications_enabled', 'true');
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      <Toaster 
        position="bottom-center"
        toastOptions={{
          style: {
            background: 'var(--bg-surface-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
          },
        }}
      />
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(route) => {
          if (route.action === 'OPEN_PROFILE') {
            setIsProfileModalOpen(true);
          } else if (route.path) {
            setCurrentRoute(route.path);
          }
        }}
      />
      {/* Premium Animated Landing/Splash Screen */}
      {!splashDone && (
        <LandingScreen lang={lang} setLang={setLang} onDone={() => setSplashDone(true)} />
      )}
      {/* Authentication */}
      {splashDone && !currentUser && (
        <LoginScreen lang={lang} getTxt={getTxt} />
      )}
      {/* Onboarding wizard */}
      {splashDone && currentUser && !onboardingDone && (
        <OnboardingFlow lang={lang} onComplete={handleOnboardingComplete} />
      )}
      {/* Main App Layout (Visible only after Splash, Auth, and Onboarding are completed) */}
      {splashDone && currentUser && onboardingDone && (
        <>
          <DisclaimerBanner lang={lang} />
          <Navbar 
            currentRoute={currentRoute} 
            setCurrentRoute={setCurrentRoute} 
            lang={lang} 
            setLang={setLang}
            theme={theme}
            setTheme={setTheme}
            userName={userName}
            completedLessons={completedLessons}
            completedTracks={completedTracks}
            scanHistory={scanHistory}
            streak={3}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
          />
          <ProfileModal 
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            userName={userName}
            setUserName={setUserName}
            lang={lang}
            setLang={setLang}
            theme={theme}
            setTheme={setTheme}
            completedLessons={completedLessons}
            completedTracks={completedTracks}
            scanHistory={scanHistory}
            profiles={profiles}
            activeProfileId={activeProfileId}
            onSwitchProfile={handleSwitchProfile}
            onCreateProfile={handleCreateProfile}
            onExportData={handleExportData}
            onImportData={handleImportData}
            notifyEnabled={notifyEnabled}
            onToggleNotifications={handleToggleNotifications}
            onLogout={async () => {
              setIsProfileModalOpen(false);
              await logout();
              window.location.reload();
            }}
            getTxt={getTxt}
          />
          <main style={{ flexGrow: 1, padding: currentRoute === 'abhyas' ? '0' : '40px 0' }} className={currentRoute === 'abhyas' ? "" : "container"}>
        
        {/* Route 1: Landing/Home */}
        {currentRoute === 'home' && (
          <Dashboard 
            lang={lang}
            setLang={setLang}
            completedLessons={completedLessons}
            completedTracks={completedTracks}
            scanHistory={scanHistory}
            setCurrentRoute={setCurrentRoute}
            getTxt={getTxt}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
            onGlobalSearch={triggerSearchFromDashboard}
          />
        )}

        {/* Route: Abhyas (Practice Trading Simulator) */}
        {currentRoute === 'abhyas' && (
          <Abhyas 
            lang={lang} 
            theme={theme}
            onNavigateToSeekho={(lessonId) => {
              let trackId = 'beginner';
              if (lessonId >= 5 && lessonId <= 8) trackId = 'intermediate';
              else if (lessonId >= 9) trackId = 'safety';
              
              setActiveTrackId(trackId);
              setActiveLessonId(lessonId);
              setExamActive(false);
              setExamFinished(false);
              setCurrentRoute('seekho');
            }}
          />
        )}

        {/* Route 2: Seekho (Unified 9-Module Gamified Classroom) */}
        {currentRoute === 'seekho' && (
          <SeekhoRenderer
            lang={lang}
            theme={theme}
            getTxt={getTxt}
            setCurrentRoute={setCurrentRoute}
            stockKnowledge={stockKnowledge}
            completedLessons={completedLessons}
            setCompletedLessons={setCompletedLessons}
            completedTracks={completedTracks}
            setCompletedTracks={setCompletedTracks}
          />
        )}

        {/* Route 3: Bachao (Scam-check) */}
        {currentRoute === 'bachao' && (
          <ScamMeter 
            lang={lang} 
            onAddHistory={handleAddScanHistory}
            initialText={scamMeterInitialText}
            clearInitialText={() => setScamMeterInitialText('')}
          />
        )}

        {/* Route 5.5: SafalMitra Chatbot */}
        {currentRoute === 'safalmitra' && (
          <SafalMitraChatbot lang={lang} theme={theme} />
        )}

        {/* Route: Calculator (Step-Up SIP, Comparison, Inflation, LTCG/STCG Tax) */}
        {currentRoute === 'hisab' && (() => {
          const [calcTab, setCalcTab] = React.useState('stepup_sip');
          const calcTabs = [
            { id: 'stepup_sip', label: getTxt('Step-Up SIP', 'स्टेप-अप SIP'), icon: '📈' },
            { id: 'comparison', label: getTxt('FD vs SIP', 'FD vs SIP'), icon: '⚖️' },
            { id: 'inflation', label: getTxt('Inflation Erosion', 'मुद्रास्फीति क्षरण'), icon: '📉' },
            { id: 'tax', label: getTxt('LTCG/STCG Tax', 'कर (LTCG/STCG)'), icon: '🧾' },
          ];
          return (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '6px', fontFamily: 'Sora, sans-serif' }}>
                  🧮 {getTxt('Hisab Visual Wealth & Tax Terminal', 'हिसाब विजुअल वेल्थ व टैक्स टर्मिनल')}
                </h2>
                <p style={{ color: '#8E9BAE', fontSize: '0.95rem' }}>
                  {getTxt('Simulate compounding, inflation erosion, and Union Budget 2024 tax optimization offline.', 'कंपाउंडिंग, महंगाई क्षरण और बजट २०२४ कर बचत का ऑफ़लाइन सिमुलेशन करें।')}
                </p>
              </div>
              {/* Tab Bar */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {calcTabs.map(t => (
                  <button key={t.id} onClick={() => setCalcTab(t.id)} style={{
                    padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                    fontSize: '0.85rem', fontWeight: '700', transition: 'all 0.2s',
                    background: calcTab === t.id
                      ? 'linear-gradient(135deg, #8B7FFF, #6C63F5)'
                      : 'rgba(255,255,255,0.04)',
                    color: calcTab === t.id ? '#fff' : '#8E9BAE',
                    boxShadow: calcTab === t.id ? '0 4px 16px rgba(108, 99, 245, 0.4)' : 'none',
                  }}>
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
              <InteractiveCalculator type={calcTab} lang={lang} />
            </div>
          );
        })()}

        {/* Route: Local Leaderboard */}
        {currentRoute === 'leaderboard' && (
          <Leaderboard lang={lang} />
        )}

        {/* Route 6: About page — full rewrite */}

        {currentRoute === 'about' && (
          <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* HERO CARD */}
            <div style={{ textAlign: 'center', padding: '40px 28px', border: '1px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'var(--bg-surface)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--color-amber), var(--color-green), var(--color-amber))' }} />
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🛡️</div>
              <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', fontWeight: '900', marginBottom: '10px' }}>
                {getTxt('SafalNiveshak — सफल निवेशक', 'SafalNiveshak — सफल निवेशक')}
              </h1>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto', lineHeight: '1.7' }}>
                {getTxt(
                  'India\'s first bilingual investor safety platform — helping first-time investors learn, spot fraud, and practice trading, all in one place.',
                  'भारत का पहला द्विभाषी निवेशक सुरक्षा मंच — पहली बार निवेश करने वाले लोगों को सीखने, धोखाधड़ी पकड़ने और अभ्यास करने में मदद।'
                )}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
                {[
                  { num: '20+', label: getTxt('Stock deep-dives', 'कंपनी विश्लेषण') },
                  { num: '50+', label: getTxt('Scam patterns detected', 'धोखाधड़ी पैटर्न') },
                  { num: '3', label: getTxt('Learning tracks', 'अध्ययन मार्ग') },
                  { num: '100%', label: getTxt('Private & offline', 'पूर्णतः निजी') },
                ].map(stat => (
                  <div key={stat.num} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--color-amber)' }}>{stat.num}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* WHY WE BUILT THIS */}
            <div className="ledger-card">
              <div className="ledger-header">
                <span className="ticket-label">{getTxt('THE PROBLEM WE SOLVE', 'हमने यह क्यों बनाया')}</span>
                <h3 style={{ fontSize: '1.4rem', marginTop: '4px', color: 'var(--text-primary)' }}>
                  {getTxt('Fraud is the most expensive financial education', 'धोखाधड़ी सबसे महंगी वित्तीय शिक्षा है')}
                </h3>
              </div>
              <div className="ledger-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.95rem', lineHeight: '1.75', color: 'var(--text-secondary)' }}>
                <p>{getTxt(
                  'Every month, thousands of Indian families lose money to WhatsApp-forward stock scams, fake VIP advisory Telegram groups, and celebrity-name-dropped Ponzi schemes. The victims are almost never greedy people — they are careful, trusting people who simply didn\'t know what to look for.',
                  'हर महीने, हजारों भारतीय परिवार WhatsApp फॉरवर्ड स्टॉक स्कैम, नकली VIP सलाहकार Telegram ग्रुप और सेलिब्रिटी के नाम की पोंजी स्कीम से पैसे खो देते हैं। पीड़ित ज़्यादातर लालची नहीं, बल्कि सच्चे और भरोसेमंद लोग होते हैं — जिन्हें बस सही जानकारी नहीं थी।'
                )}</p>
                <p>{getTxt(
                  'SafalNiveshak was built to give every first-generation investor the tools a seasoned investor has: the ability to recognize fraud on sight, understand what they are buying, and practice before risking real money.',
                  'SafalNiveshak पहली पीढ़ी के हर निवेशक को वो ताकत देने के लिए बनाया गया जो एक अनुभवी निवेशक के पास होती है: धोखाधड़ी को तुरंत पहचानना, यह समझना कि वे क्या खरीद रहे हैं, और असली पैसे जोखिम में डालने से पहले अभ्यास करना।'
                )}</p>
              </div>
            </div>

            {/* WHAT IS REAL */}
            <div className="ledger-card">
              <div className="ledger-header">
                <span className="ticket-label">{getTxt('REAL DATA SOURCES', 'वास्तविक डेटा स्रोत')}</span>
                <h3 style={{ fontSize: '1.35rem', marginTop: '4px', color: 'var(--text-primary)' }}>
                  {getTxt('What is real in this app', 'इस ऐप में क्या असली है')}
                </h3>
              </div>
              <div className="ledger-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { icon: '🏛️', titleEn: 'SEBI RIA & RA Registry', titleHi: 'SEBI RIA और RA रजिस्ट्री', descEn: 'The advisor database is seeded from SEBI\'s official active corporate advisor registry. Names, registration numbers, and BASL codes are real.', descHi: 'सलाहकार डेटाबेस SEBI की आधिकारिक सक्रिय कॉर्पोरेट सलाहकार रजिस्ट्री से लिया गया है। नाम, पंजीकरण संख्या और BASL कोड वास्तविक हैं।' },
                    { icon: '📰', titleEn: 'SEBI Investor Alerts', titleHi: 'SEBI निवेशक चेतावनियां', descEn: 'The fraud warnings on the homepage are sourced directly from SEBI\'s official press release archive.', descHi: 'होमपेज पर धोखाधड़ी की चेतावनियां SEBI के आधिकारिक प्रेस रिलीज अभिलेखागार से सीधे ली गई हैं।' },
                    { icon: '🔬', titleEn: 'Scam Pattern Detection Engine', titleHi: 'स्कैम पैटर्न डिटेक्शन इंजन', descEn: 'The Bachao analyzer detects 15+ fraud fingerprints (guaranteed returns, urgency pressure, fake SEBI numbers, etc.) built from real scam message analysis.', descHi: 'बचाओ विश्लेषक 15+ धोखाधड़ी संकेतक (गारंटीड रिटर्न, दबाव, नकली SEBI नंबर आदि) पहचानता है — वास्तविक स्कैम संदेशों के विश्लेषण से बनाया गया।' },
                    { icon: '📈', titleEn: 'TradingView Live Charts', titleHi: 'TradingView लाइव चार्ट', descEn: 'The Abhyas paper trading module uses real TradingView embeds — the same professional charts used by actual traders, embedded for free.', descHi: 'अभ्यास पेपर ट्रेडिंग मॉड्यूल असली TradingView एम्बेड का उपयोग करता है — वही पेशेवर चार्ट जो असली ट्रेडर्स उपयोग करते हैं।' },
                    { icon: '💰', titleEn: 'Virtual Portfolio Only', titleHi: 'केवल वर्चुअल पोर्टफोलियो', descEn: 'The Abhyas trading simulator uses virtual ₹1,00,000 and NEVER connects to any broker or real money system. It is a sandbox — always.', descHi: 'अभ्यास सिम्युलेटर वर्चुअल ₹1,00,000 का उपयोग करता है और कभी भी किसी ब्रोकर या असली पैसे से नहीं जुड़ता। यह हमेशा एक सैंडबॉक्स है।' },
                  ].map(item => (
                    <div key={item.icon} style={{ display: 'flex', gap: '14px', padding: '14px', backgroundColor: 'var(--bg-surface-light)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{item.icon}</span>
                      <div>
                        <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '4px' }}>
                          {getTxt(item.titleEn, item.titleHi)}
                        </strong>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.55' }}>
                          {getTxt(item.descEn, item.descHi)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* TEAM */}
            <div className="ledger-card">
              <div className="ledger-header">
                <span className="ticket-label">{getTxt('THE TEAM', 'टीम')}</span>
                <h3 style={{ fontSize: '1.35rem', marginTop: '4px', color: 'var(--text-primary)' }}>
                  {getTxt('Built by students who lost money learning the hard way', 'उन छात्रों द्वारा बनाया जो मुश्किल तरीके से सीखे')}
                </h3>
              </div>
              <div className="ledger-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                  {getTxt(
                    'We are a small team of engineering and design students from India who have personally received — and nearly fallen for — Telegram stock scam messages. That personal experience drove us to build a tool that makes investor safety education accessible, bilingual, and instant for anyone in India.',
                    'हम भारत के इंजीनियरिंग और डिज़ाइन छात्रों की एक छोटी टीम हैं जिन्होंने खुद Telegram स्टॉक स्कैम संदेश प्राप्त किए हैं। उस निजी अनुभव ने हमें एक ऐसा उपकरण बनाने के लिए प्रेरित किया जो भारत में किसी के लिए भी निवेशक सुरक्षा शिक्षा को सुलभ, द्विभाषी और तत्काल बनाता है।'
                  )}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  {[
                    { nameEn: 'Product & Engineering', roleEn: 'Full-stack development, scam pattern engine, SEBI data integration', emojiEn: '⚙️' },
                    { nameEn: 'Research & Content', roleEn: 'Financial literacy curriculum, Hindi translations, SEBI alert sourcing', emojiEn: '📖' },
                    { nameEn: 'UX & Design', roleEn: 'Interface design, accessibility, bilingual layout system', emojiEn: '🎨' },
                  ].map(member => (
                    <div key={member.nameEn} style={{ padding: '16px', backgroundColor: 'var(--bg-surface-light)', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                      <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>{member.emojiEn}</span>
                      <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '4px' }}>{member.nameEn}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4', display: 'block' }}>{member.roleEn}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* MANDATORY DISCLAIMER */}
            <div style={{ border: '2px double var(--color-amber)', borderRadius: '4px', backgroundColor: 'rgba(217, 142, 4, 0.03)', padding: '20px' }}>
              <h4 style={{ color: 'var(--color-amber)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                ⚠️ {getTxt('MANDATORY INVESTOR DISCLOSURE', 'आधिकारिक विनियामक अस्वीकरण')}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.7', marginBottom: '12px' }}>
                {getTxt(
                  'SafalNiveshak is an educational safety tool and sandbox simulator. We are NOT registered investment advisors (RIA) and do not offer buy/sell tips, trading targets, or broker services. All trading in Abhyas is 100% virtual. Always verify advisors on SEBI\'s official portal before investing any real money.',
                  'सफल निवेशक एक शैक्षणिक सुरक्षा और सैंडबॉक्स सिम्युलेटर है। हम SEBI पंजीकृत निवेश सलाहकार (RIA) नहीं हैं। अभ्यास में सभी ट्रेडिंग 100% वर्चुअल है। असली पैसा लगाने से पहले SEBI के आधिकारिक पोर्टल पर सलाहकारों की जांच अवश्य करें।'
                )}
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href="https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=13" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: '0.82rem', color: 'var(--color-amber)', textDecoration: 'underline' }}>
                  {getTxt('SEBI RIA Directory →', 'SEBI RIA सूची →')}
                </a>
                <a href="https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=9" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: '0.82rem', color: 'var(--color-amber)', textDecoration: 'underline' }}>
                  {getTxt('SEBI Research Analyst Directory →', 'SEBI अनुसंधान विश्लेषक सूची →')}
                </a>
              </div>
            </div>

          </div>
        )}
      </main>

      <footer style={{
        backgroundColor: '#040B15',
        borderTop: '1px solid var(--border-glass)',
        paddingTop: '30px',
        paddingBottom: 'calc(30px + env(safe-area-inset-bottom, 0px))',
        marginTop: '60px',
        color: 'var(--text-secondary)',
        fontSize: '0.85rem'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <strong>SafalNiveshak सफल निवेशक</strong>
            <p style={{ marginTop: '4px', fontSize: '0.8rem' }}>
              © 2026. {getTxt("An Investor Safety & Literacy Initiative", "निवेशक सुरक्षा और साक्षरता पहल")}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.8rem' }}>
            <button onClick={() => setCurrentRoute('about')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}>
              {getTxt("Disclaimer", "अस्वीकरण")}
            </button>
            <button onClick={() => setCurrentRoute('about')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}>
              {getTxt("Data Safety", "डेटा सुरक्षा")}
            </button>
          </div>
        </div>
      </footer>
        </>
      )}
    </div>
  );
}
