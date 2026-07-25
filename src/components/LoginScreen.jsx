import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { syncLocalDataToCloud } from '../services/db';
import { sendWelcomeEmail } from '../services/email';
import { ShieldCheck, LogIn, Mail, Lock, UserPlus } from 'lucide-react';

export default function LoginScreen({ lang, getTxt }) {
  const { loginWithGoogle, loginWithEmail, signupWithEmail, resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Toggle between 'login' and 'signup'
  const [mode, setMode] = useState('login'); 
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuthAction = async (actionFn, isGoogle = false) => {
    try {
      setError('');
      setLoading(true);
      const result = await actionFn();
      const user = result.user;
      
      // Migrate local data to cloud on first login
      await syncLocalDataToCloud(user.uid, user.email, user.displayName, user.photoURL);
      
      // If this was a signup action, send the welcome email
      if (actionFn === signupWithEmail || (isGoogle && result._tokenResponse?.isNewUser)) {
        await sendWelcomeEmail(user.email, user.displayName || 'Investor');
      }
      
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError(lang === 'en' ? 'Email already in use.' : 'ईमेल पहले से ही उपयोग में है।');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError(lang === 'en' ? 'Invalid email or password.' : 'अमान्य ईमेल या पासवर्ड।');
      } else if (err.code === 'auth/weak-password') {
        setError(lang === 'en' ? 'Password should be at least 6 characters.' : 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।');
      } else {
        setError(lang === 'en' ? 'Authentication failed. Please try again.' : 'प्रमाणीकरण विफल रहा। कृपया पुनः प्रयास करें।');
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError(lang === 'en' ? 'Please fill in all fields.' : 'कृपया सभी फ़ील्ड भरें।');
      return;
    }
    
    if (mode === 'login') {
      handleAuthAction(() => loginWithEmail(email, password));
    } else {
      handleAuthAction(() => signupWithEmail(email, password));
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, var(--bg-default) 0%, var(--bg-surface) 100%)',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        backgroundColor: 'var(--bg-surface-light)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '32px',
        textAlign: 'center',
        boxShadow: '0 12px 40px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(44, 217, 197, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px auto',
          border: '1px solid rgba(44, 217, 197, 0.3)'
        }}>
          <ShieldCheck size={32} color="#2CD9C5" />
        </div>
        
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>
          {getTxt('Welcome to SafalNiveshak', 'सफल निवेशक में आपका स्वागत है')}
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
          {mode === 'login' 
            ? getTxt('Sign in to sync your progress.', 'अपनी प्रगति सिंक करने के लिए साइन इन करें।')
            : getTxt('Create an account to get started.', 'शुरू करने के लिए एक खाता बनाएं।')}
        </p>

        {error && (
          <div style={{ padding: '12px', backgroundColor: 'rgba(248, 113, 113, 0.1)', color: '#f87171', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={onSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input 
              type="email" 
              placeholder={getTxt("Email address", "ईमेल पता")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-default)',
                color: 'var(--text-primary)',
                outline: 'none',
                fontSize: '0.95rem'
              }}
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input 
              type="password" 
              placeholder={getTxt("Password", "पासवर्ड")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-default)',
                color: 'var(--text-primary)',
                outline: 'none',
                fontSize: '0.95rem'
              }}
            />
          </div>

          {mode === 'login' && (
            <div style={{ textAlign: 'right', marginTop: '-8px' }}>
              <button
                type="button"
                onClick={async () => {
                  if (!email) {
                    setError(lang === 'en' ? 'Please enter your email to reset password.' : 'पासवर्ड रीसेट करने के लिए कृपया अपना ईमेल दर्ज करें।');
                    return;
                  }
                  try {
                    await resetPassword(email);
                    alert(lang === 'en' ? 'Password reset email sent! Check your inbox.' : 'पासवर्ड रीसेट ईमेल भेज दिया गया है! अपना इनबॉक्स जांचें।');
                  } catch (err) {
                    setError(lang === 'en' ? 'Failed to send reset email.' : 'रीसेट ईमेल भेजने में विफल।');
                  }
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {getTxt("Forgot Password?", "पासवर्ड भूल गए?")}
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 24px',
              fontSize: '1rem',
              fontWeight: '700',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #2CD9C5 0%, #1FB2A1 100%)',
              color: '#0A0F1D',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            {mode === 'login' ? <LogIn size={20} /> : <UserPlus size={20} />}
            {mode === 'login' 
              ? (loading ? getTxt('Signing in...', 'साइन इन हो रहा है...') : getTxt('Sign In', 'साइन इन'))
              : (loading ? getTxt('Creating account...', 'खाता बन रहा है...') : getTxt('Sign Up', 'साइन अप'))
            }
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{getTxt('OR', 'या')}</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
        </div>

        <button
          onClick={() => handleAuthAction(loginWithGoogle, true)}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px 24px',
            fontSize: '1rem',
            fontWeight: '700',
            borderRadius: '8px',
            background: 'var(--bg-default)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            opacity: loading ? 0.7 : 1,
            transition: 'all 0.2s'
          }}
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
          {getTxt('Continue with Google', 'Google के साथ जारी रखें')}
        </button>

        <div style={{ marginTop: '24px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {mode === 'login' ? (
            <>
              {getTxt("Don't have an account? ", "खाता नहीं है? ")}
              <button onClick={() => setMode('signup')} style={{ background: 'none', border: 'none', color: '#8B7FFF', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}>
                {getTxt("Sign up", "साइन अप")}
              </button>
            </>
          ) : (
            <>
              {getTxt("Already have an account? ", "पहले से खाता है? ")}
              <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: '#8B7FFF', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}>
                {getTxt("Sign in", "साइन इन")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
