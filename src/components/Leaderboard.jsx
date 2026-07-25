import React, { useState, useEffect } from 'react';

export default function Leaderboard({ lang, activeProfileId, userName }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const getTxt = (en, hi) => (lang === 'en' ? en : hi);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/leaderboard');
        if (res.ok) {
          const data = await res.json();
          setProfiles(data);
        }
      } catch (err) {
        console.warn("Global leaderboard offline, no data.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankBadge = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `🎖️ ${index + 1}`;
  };

  const getRankColor = (index) => {
    if (index === 0) return '#D98E04'; // Gold
    if (index === 1) return '#CBD5E1'; // Silver
    if (index === 2) return '#B45309'; // Bronze
    return '#8FA0B5'; // Normal
  };

  return (
    <div style={{
      backgroundColor: '#070E1A',
      color: '#E8E4DA',
      fontFamily: "'Inter', sans-serif",
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #1a2840',
      maxWidth: '600px',
      margin: '0 auto',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      backgroundImage: 'linear-gradient(135deg, rgba(10,22,40,0.7) 0%, rgba(7,14,26,0.9) 100%)',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#D98E04', fontWeight: '900', margin: '0 0 8px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          🏆 {getTxt("Global Leaderboard", "वैश्विक लीडरबोर्ड")}
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#8FA0B5', margin: 0 }}>
          {getTxt("Compare your learning progress against other users on this server.", "इस सर्वर पर अन्य निवेशकों के साथ अपनी प्रगति की तुलना करें।")}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#8FA0B5' }}>Loading...</div>
        ) : profiles.map((p, idx) => {
          const rankColor = getRankColor(idx);
          const level = Math.floor(p.xp / 300) + 1;
          const isSelf = p.userId === activeProfileId;
          
          return (
            <div 
              key={p.userId} 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                backgroundColor: isSelf ? 'rgba(217, 142, 4, 0.1)' : 'rgba(10, 22, 40, 0.5)',
                border: isSelf ? '1.5px solid #D98E04' : '1px solid #1a2840',
                borderRadius: '8px',
                transition: 'transform 0.2s ease',
                cursor: 'default'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: rankColor, minWidth: '40px' }}>
                  {getRankBadge(idx)}
                </span>
                <div>
                  <div style={{ fontWeight: 'bold', color: isSelf ? '#D98E04' : '#E8E4DA', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#1a2840', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#D98E04' }}>{p.avatar}</div>
                    {p.name} {isSelf && <span style={{ fontSize: '0.72rem', backgroundColor: '#D98E04', color: '#000', padding: '1px 5px', borderRadius: '3px', fontWeight: 'bold' }}>{getTxt("YOU", "आप")}</span>}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#8FA0B5' }}>
                    {getTxt(`Joined: ${new Date(p.joinedAt).toLocaleDateString('en-IN')}`, `शामिल हुए: ${new Date(p.joinedAt).toLocaleDateString('en-IN')}`)}
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.05rem', fontWeight: '900', color: '#22c55e', fontFamily: 'monospace' }}>
                  {p.xp} XP
                </div>
                <div style={{ fontSize: '0.72rem', color: '#D98E04', fontWeight: 'bold' }}>
                  Lvl {level}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '20px', borderTop: '1px solid #1a2840', paddingTop: '14px', fontSize: '0.75rem', color: '#8FA0B5', textAlign: 'center' }}>
        💡 {getTxt("Earn 50 XP per Lesson, 200 XP per Chapter Quiz, and 25 XP for Scam Checks!", "प्रत्येक पाठ पर ५० XP, क्विज़ पर २०० XP और स्कैम चेक करने पर २५ XP कमाएं!")}
      </div>
    </div>
  );
}
