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

// Handle 401 (no forced logout)
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      console.error("Unauthorized request", err.config.url)
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