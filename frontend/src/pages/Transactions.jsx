import { useEffect, useState } from 'react'
import { transactionsApi } from '../api/client'
import { Plus, X, RefreshCw } from 'lucide-react'

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Other']

const CategoryColors = {
  Food: 'bg-blue-900/40 text-blue-400',
  Transport: 'bg-purple-900/40 text-purple-400',
  Entertainment: 'bg-yellow-900/40 text-yellow-400',
  Utilities: 'bg-emerald-900/40 text-emerald-400',
  Healthcare: 'bg-red-900/40 text-red-400',
  Shopping: 'bg-pink-900/40 text-pink-400',
  Other: 'bg-gray-800 text-gray-400'
}

const defaultForm = {
  amount: '',
  category: 'Food',
  description: '',
  date: new Date().toISOString().split('T')[0],
  isRecurring: false
}

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)

  const load = () => {
    setLoading(true)
    transactionsApi.getAll()
      .then(res => setTransactions(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await transactionsApi.add({
        ...form,
        amount: parseFloat(form.amount),
        date: new Date(form.date).toISOString()
      })
      setForm(defaultForm)
      setShowForm(false)
      load()
    } catch {
      alert('Failed to add transaction')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Transactions</h1>
          <p className="text-gray-400 text-sm mt-1">{transactions.length} transactions total</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="btn-secondary flex items-center gap-2">
            <RefreshCw size={15} />
            Refresh
          </button>
          <button onClick={() => setShowForm(v => !v)} className="btn-primary flex items-center gap-2">
            <Plus size={15} />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Add Transaction Form */}
      {showForm && (
        <div className="card relative">
          <button
            onClick={() => setShowForm(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-300"
          >
            <X size={18} />
          </button>
          <h2 className="text-sm font-semibold text-white mb-4">New Transaction</h2>
          <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Amount (₹)</label>
              <input
                type="number"
                min="1"
                step="0.01"
                className="input"
                placeholder="1500"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Category</label>
              <select
                className="input"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Description</label>
              <input
                type="text"
                className="input"
                placeholder="Swiggy order"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Date</label>
              <input
                type="date"
                className="input"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                required
              />
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <input
                type="checkbox"
                id="recurring"
                checked={form.isRecurring}
                onChange={e => setForm(f => ({ ...f, isRecurring: e.target.checked }))}
                className="w-4 h-4 accent-blue-500"
              />
              <label htmlFor="recurring" className="text-sm text-gray-400">Recurring transaction</label>
            </div>
            <div className="col-span-2 flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
                {submitting ? 'Saving...' : 'Save Transaction'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Transactions Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center text-gray-500 text-sm">
            No transactions yet. Add your first one above.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-xs text-gray-500 font-medium px-6 py-3">Date</th>
                <th className="text-left text-xs text-gray-500 font-medium px-6 py-3">Description</th>
                <th className="text-left text-xs text-gray-500 font-medium px-6 py-3">Category</th>
                <th className="text-right text-xs text-gray-500 font-medium px-6 py-3">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {transactions.map(t => (
                <tr key={t.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-3.5 text-gray-400 text-xs">
                    {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-3.5 text-gray-200">
                    {t.description}
                    {t.isRecurring && (
                      <span className="ml-2 text-xs bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded">
                        recurring
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CategoryColors[t.category] ?? CategoryColors.Other}`}>
                      {t.category}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right font-medium text-white">
                    ₹{t.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
