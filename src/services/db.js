import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Fetch a user's profile from Firestore.
 */
export const getUserProfile = async (uid) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null; // Return null if it doesn't exist
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

/**
 * Set or update a user's profile.
 */
export const updateUserProfile = async (uid, data) => {
  try {
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error("Error updating user profile:", error);
  }
};

/**
 * Update specifically the user's trading portfolio
 */
export const updatePortfolio = async (uid, portfolioData) => {
  try {
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, { portfolio: portfolioData }, { merge: true });
  } catch (error) {
    console.error("Error updating portfolio in Firestore:", error);
  }
};

/**
 * Update specifically the user's lesson and track progress
 */
export const updateLessonProgress = async (uid, progressData) => {
  try {
    const docRef = doc(db, 'users', uid);
    // progressData could be { completedLessons: [...] } or { completedTracks: [...] }
    await setDoc(docRef, progressData, { merge: true });
  } catch (error) {
    console.error("Error updating lesson progress in Firestore:", error);
  }
};

/**
 * Sync local storage data to cloud on first login.
 */
export const syncLocalDataToCloud = async (uid, email, displayName, photoURL) => {
  // If the user already has a profile in Firestore, we won't overwrite their cloud data with local data 
  // (unless you want local to take precedence, but cloud is usually safer).
  const existingProfile = await getUserProfile(uid);
  
  if (existingProfile && existingProfile.migrated) {
    // Already migrated, do nothing
    return;
  }

  console.log("Migrating local storage data to Firebase for new user...");

  // Gather data from localStorage
  const localName = localStorage.getItem('safalniveshak_username') || displayName || 'Investor';
  const localAvatar = localStorage.getItem('safalniveshak_avatar') || '🛡️';
  const onboarded = localStorage.getItem('safalniveshak_onboarded') === 'true';
  const theme = localStorage.getItem('safalniveshak_theme') || 'light';
  const streak = parseInt(localStorage.getItem('safalniveshak_streak') || '1', 10);
  
  const completedLessons = JSON.parse(localStorage.getItem('safalniveshak_lessons') || '[]');
  const scanHistory = JSON.parse(localStorage.getItem('safalniveshak_history') || '[]');
  const completedTracks = JSON.parse(localStorage.getItem('safalniveshak_tracks') || '[]');
  
  // Abhyas portfolio
  const portfolio = JSON.parse(localStorage.getItem('abhyas_portfolio_v2') || '{"balance": 1000000, "holdings": [], "transactions": []}');

  const userData = {
    email,
    name: localName,
    avatar: localAvatar,
    onboarded,
    theme,
    streak,
    migrated: true,
    completedLessons,
    scanHistory,
    completedTracks,
    portfolio
  };

  await updateUserProfile(uid, userData);
  console.log("Migration complete.");
};
