import { useState, useEffect } from 'react'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Primes from './components/Primes'
import Menu from './components/Menu'
import Gallery from './components/Gallery'
import Visit from './components/Visit'
import Order from './components/Order'
import Footer from './components/Footer'
import OrderBar from './components/OrderBar'
import GomuArm from './components/GomuArm'
import Dashboard from './components/Dashboard'

// Routage minimal par ancre : #/admin ouvre le tableau de bord restaurant,
// tout le reste affiche le site vitrine.
function useIsAdminRoute() {
  const [isAdmin, setIsAdmin] = useState(() => window.location.hash.startsWith('#/admin'))
  useEffect(() => {
    const onHash = () => setIsAdmin(window.location.hash.startsWith('#/admin'))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return isAdmin
}

export default function App() {
  const isAdmin = useIsAdminRoute()

  return (
    <ThemeProvider>
      {isAdmin ? (
        <Dashboard />
      ) : (
        <CartProvider>
          <Navbar />
          <GomuArm />
          <main>
            <Hero />
            <About />
            <Primes />
            <Menu />
            <Gallery />
            <Visit />
            <Order />
          </main>
          <Footer />
          <OrderBar />
        </CartProvider>
      )}
    </ThemeProvider>
  )
}
