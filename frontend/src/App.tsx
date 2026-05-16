import { ThemeProvider } from './context/ThemeContext'
import { CartProvider } from './context/CartContext'
import { Header } from './components/Header/Header'
import { ProductGrid } from './components/ProductGrid/ProductGrid'
import { CartDrawer } from './components/CartDrawer/CartDrawer'
import { PRODUCTS } from './data/products'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Header />
        <main>
          <ProductGrid products={PRODUCTS} />
        </main>
        <CartDrawer />
      </CartProvider>
    </ThemeProvider>
  )
}

export default App
