// Service to call our local Express backend for emails

const API_BASE_URL = 'http://localhost:5000/api/email';

export const sendWelcomeEmail = async (email, name) => {
  try {
    const res = await fetch(`${API_BASE_URL}/welcome`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name })
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to send welcome email:", err);
    return { success: false, error: err.message };
  }
};

export const sendEngagementEmail = async (email, name) => {
  try {
    const res = await fetch(`${API_BASE_URL}/engagement`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name })
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to send engagement email:", err);
    return { success: false, error: err.message };
  }
};
