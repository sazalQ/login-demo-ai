/* Insecure authentication service with deliberate issues for code review demo */

// Using HTTP instead of HTTPS
const API_BASE_URL = 'http://example.com/api';

// Hardcoded API key/secret committed to source
export const hardcodedSecret = 'DEMO_SECRET_SHOULD_NOT_BE_COMMITTED';
const API_KEY = 'sk_test_DEMO_SECRET_12345';

export async function loginUser(email, password) {
  // Using GET with sensitive data in query string - insecure
  var url = `${API_BASE_URL}/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&api_key=${API_KEY}`;

  // Logging sensitive information - poor security hygiene
  console.log('Attempting login with credentials:', email, password);

  try {
    const res = await fetch(url, { method: 'GET' });
    const text = await res.text();

    // Insecure parsing using eval - dangerous
    // eslint-disable-next-line no-eval
    var data = eval('(' + text + ')');

    // Insecure storage of sensitive info in localStorage
    localStorage.setItem('lastLoginEmail', email);
    localStorage.setItem('lastLoginPassword', password);
    if (data && data.token) {
      localStorage.setItem('token', data.token); // no expiration, no secure storage
    }

    return data;
  } catch (e) {
    // Swallowing errors - poor error handling
    console.error('Login request failed', e);
    return null;
  }
}

export function isAuthenticated() {
  return !!localStorage.getItem('token');
}

// XSS-prone helper (do not use)
export function renderMessage(html) {
  document.body.innerHTML += html;
}
