import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header/Header';
import { ProductGrid } from './components/ProductGrid/ProductGrid';
import { CartDrawer } from './components/CartDrawer/CartDrawer';
import './App.css';
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Product } from './types'
import { RegisterProduct } from './components/ProductRegister/ProductRegister';
import { PurchaseHistory } from './components/PurchaseHistory/PurchaseHistory';
import { getProducts, createProduct } from './services/productService'  // importa da API

function App() {
  const [products, setProducts] = useState<Product[]>([])

  // Busca os produtos do backend (recarregado após o checkout para refletir o estoque)
  function loadProducts() {
    getProducts()
      .then(setProducts)
      .catch((err) => console.error("Erro ao buscar produtos:", err))
  }

  useEffect(() => {
    loadProducts()
  }, [])

  async function addProduct(newProduct: Omit<Product, "id">) {
    try {
      const created = await createProduct(newProduct)
      setProducts((prev) => [...prev, created])
    } catch (err: any) {
      console.error("Erro ao adicionar produto:", err.message)
    }
  }

  return (
    <Router>
      <ThemeProvider>
        <CartProvider>
          <Header />
          <main>
            <Routes>
              <Route
                path="/colecao"
                element={<ProductGrid products={products} />} 
              />
              <Route
                path="/cadastrar-produto"
                element={<RegisterProduct onAddProduct={addProduct} />}
              />
              <Route path="/historico" element={<PurchaseHistory />} />
            </Routes>
          </main>
          <CartDrawer onCheckout={loadProducts} />
        </CartProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;