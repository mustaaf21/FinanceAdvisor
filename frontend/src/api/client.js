import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Attach JWT token + track activity
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  const sessionId = localStorage.getItem('sessionId')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (sessionId) {
    config.headers["X-Session-Id"] = sessionId
  }

  window.dispatchEvent(new Event('userActivity'))

  return config
})

// Handle 401 (session expired or invalid)
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      const message = err.response?.data?.message
      if (message && (message.includes('Session') || message.includes('expired') || message.includes('invalid') || message.includes('timed out'))) {
        // Session was force logged out or expired - clear storage
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('sessionId')
        sessionStorage.removeItem('chatMessages')
        sessionStorage.removeItem('lastResult')
        // Trigger a custom event that AuthContext can listen to
        window.dispatchEvent(new CustomEvent('sessionExpired'))
      }
    }
    return Promise.reject(err)
  }
)

export const authApi = {
  login: (email, password, forceLogoutOthers = false) =>
    api.post('/auth/login', { email, password, forceLogoutOthers }),

  checkSession: (email) =>
    api.post('/auth/check-session', { email }),

  logoutSession: (sessionId) =>
    api.post(`/auth/logout-session?sessionId=${sessionId}`)
}

export const transactionsApi = {
  getAll: () => api.get('/transactions'),
  add: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  getLatest: () => api.get('/transactions/latest'),
  getByAmount: (minAmount, maxAmount) =>
    api.get('/transactions/by-amount', { params: { minAmount, maxAmount } })
}

export const insightsApi = {
  get: () => api.get('/insights')
}

// pass history properly
export const agentApi = {
  query: (question, history = [], lastResult = null) =>
    api.post('/agent/query', { question, history, lastResult })
}

export default api