const AUTH_TOKEN_KEY = 'pixelcraft_token';
const authModal = document.getElementById('authModal');
const mainApp = document.getElementById('mainApp');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const userWelcome = document.getElementById('userWelcome');

function switchToSignup() {
  loginForm.classList.remove('active');
  signupForm.classList.add('active');
}

function switchToLogin() {
  signupForm.classList.remove('active');
  loginForm.classList.add('active');
}

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(path, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

function showAuthScreen() {
  authModal.classList.remove('hidden');
  authModal.classList.add('active');
  mainApp.classList.add('hidden');
}

function showMainApp(user) {
  authModal.classList.add('hidden');
  authModal.classList.remove('active');
  mainApp.classList.remove('hidden');

  userWelcome.textContent = `مرحبًا، ${user.name}`;
}

async function initializeSession() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (!token) {
    showAuthScreen();
    return;
  }

  try {
    const data = await apiRequest('/api/me');
    showMainApp(data.user);
  } catch (error) {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    showAuthScreen();
  }
}

function setError(elementId, message) {
  const el = document.getElementById(elementId);
  el.textContent = message;
}

async function handleSignup(event) {
  event.preventDefault();

  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirm').value;

  setError('signupError', '');

  if (password !== confirmPassword) {
    setError('signupError', 'كلمتا المرور غير متطابقتين');
    return;
  }

  try {
    const data = await apiRequest('/api/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    showMainApp(data.user);
  } catch (error) {
    setError('signupError', error.message);
  }
}

async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  setError('loginError', '');

  try {
    const data = await apiRequest('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    showMainApp(data.user);
  } catch (error) {
    setError('loginError', error.message);
  }
}

function handleLogout() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  showAuthScreen();
  document.getElementById('loginForm').reset();
  document.getElementById('signupForm').reset();
  setError('loginError', '');
  setError('signupError', '');
}

window.addEventListener('DOMContentLoaded', initializeSession);
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.switchToLogin = switchToLogin;
window.switchToSignup = switchToSignup;
window.handleLogout = handleLogout;