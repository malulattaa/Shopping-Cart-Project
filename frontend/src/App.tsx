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
import { getProducts, searchProducts, deleteProduct, sortProducts } from './services/productService'
import { ProductControls, SortBy, SortOrder } from './components/ProductControls/ProductControls';

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [sortBy, setSortBy] = useState<SortBy | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")

  // Busca os produtos do backend (recarregado após o checkout para refletir o estoque)
  function loadProducts() {
    getProducts()
      .then(setProducts)
      .catch((err) => console.error("Erro ao buscar produtos:", err))
  }

  useEffect(() => {
    loadProducts()
  }, [])



  function addProduct(_createdProduct: Product) {
  loadProducts()
  }
  async function handleSearch(term: string) {
    try {
      const result = term === "" ? await getProducts() : await searchProducts(term)
      setProducts(result)
      setSortBy(null)
    } catch (err) {
      console.error("Erro ao buscar produtos:", err)
    }
  }

  async function handleSort(by: SortBy, order: SortOrder) {
    try {
      const result = await sortProducts(by, order)
      setProducts(result)
      setSortBy(by)
      setSortOrder(order)
    } catch (err) {
      console.error("Erro ao ordenar produtos:", err)
    }
  }

  async function handleDelete(id: number) {
  try {
    await deleteProduct(id)
    loadProducts() // recarrega a lista após excluir
  } catch (err: any) {
    console.error("Erro ao deletar produto:", err.message)
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
  element={
    <>
      <ProductControls
        onSearch={handleSearch}
        onSort={handleSort}
        activeSortBy={sortBy}
        activeSortOrder={sortOrder}
      />
      <ProductGrid products={products} onDelete={handleDelete} />
    </>
  }
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