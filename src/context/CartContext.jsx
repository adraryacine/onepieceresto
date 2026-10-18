import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

// Convertit un prix affiché ("1 200") en nombre (1200) pour les calculs.
export function parsePrice(str) {
  return Number(String(str).replace(/[\s ]/g, '')) || 0
}

// Formate un nombre en prix lisible ("1 200").
export function formatPrice(num) {
  return num.toLocaleString('fr-FR')
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const addItem = (entry) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.key === entry.key)
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 }
        return copy
      }
      return [...prev, { ...entry, qty: 1 }]
    })
  }

  const removeItem = (key) => setItems(prev => prev.filter(i => i.key !== key))

  const updateQty = (key, delta) =>
    setItems(prev =>
      prev.flatMap(i => {
        if (i.key !== key) return [i]
        const qty = i.qty + delta
        return qty <= 0 ? [] : [{ ...i, qty }]
      })
    )

  const clear = () => setItems([])

  const count = items.reduce((s, i) => s + i.qty, 0)
  const total = items.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clear, count, total }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart doit être utilisé dans un <CartProvider>')
  return ctx
}
