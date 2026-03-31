import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-logout on 401
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
  login: (email, password, forceLogoutOthers = false) => api.post('/auth/login', { email, password, forceLogoutOthers }),
  checkSession: (email) => api.post('/auth/check-session', { email }),
  logoutSession: (sessionId) => api.post(`/auth/logout-session?sessionId=${sessionId}`)
}

export const transactionsApi = {
  getAll: () => api.get('/transactions'),
  add: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  getLatest: () => api.get('/transactions/latest'),
  getByAmount: (minAmount, maxAmount) => api.get('/transactions/by-amount', { params: { minAmount, maxAmount } })
}

export const insightsApi = {
  get: () => api.get('/insights')
}

export const agentApi = {
  query: (question) => api.post('/agent/query', { question })
}

export default api
