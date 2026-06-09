import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { CartItem, Product } from '../types'
import * as cartApi from '../services/cartService'

interface CartContextValue {
  items: CartItem[]
  isOpen: boolean
  canUndo: boolean
  totalItems: number
  totalPrice: number
  addItem: (product: Product) => Promise<void>
  removeItem: (productId: number) => Promise<void>
  incrementItem: (productId: number) => Promise<void>
  decrementItem: (productId: number) => Promise<void>
  clearCart: () => Promise<void>
  undo: () => Promise<void>
  checkout: () => Promise<cartApi.Purchase | null>
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [canUndo, setCanUndo] = useState(false)

  // Hidrata o carrinho a partir do backend ao montar
  useEffect(() => {
    cartApi
      .getCart()
      .then((res) => {
        setItems(res.items)
        setCanUndo(res.can_undo)
      })
      .catch((err) => console.error('Erro ao carregar carrinho:', err.message))
  }, [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.product.unit_price * i.quantity, 0)

  // Toda mutação delega ao backend e substitui o estado pela resposta autoritativa
  const run = async (op: Promise<cartApi.CartResponse>) => {
    try {
      const res = await op
      setItems(res.items)
      setCanUndo(res.can_undo)
    } catch (err: any) {
      console.error('Erro no carrinho:', err.message)
      alert(err.message)
    }
  }

  const quantityOf = (productId: number) =>
    items.find((i) => i.product.id === productId)?.quantity ?? 0

  const addItem = (product: Product) => run(cartApi.addCartItem(product.id))
  const removeItem = (productId: number) => run(cartApi.removeCartItem(productId))
  const incrementItem = (productId: number) =>
    run(cartApi.updateCartItem(productId, quantityOf(productId) + 1))
  const decrementItem = (productId: number) =>
    run(cartApi.updateCartItem(productId, Math.max(1, quantityOf(productId) - 1)))
  const clearCart = () => run(cartApi.clearCart())
  const undo = () => run(cartApi.undoCartAction())

  const checkout = async (): Promise<cartApi.Purchase | null> => {
    try {
      const purchase = await cartApi.checkout()
      // Compra efetivada: carrinho esvaziado no backend
      setItems([])
      setCanUndo(false)
      return purchase
    } catch (err: any) {
      console.error('Erro ao finalizar compra:', err.message)
      alert(err.message)
      return null
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        canUndo,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        incrementItem,
        decrementItem,
        clearCart,
        undo,
        checkout,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
