import { createContext, useContext, useReducer, ReactNode } from 'react'
import { CartItem, Product } from '../types'

type CartAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'INCREMENT'; productId: string }
  | { type: 'DECREMENT'; productId: string }
  | { type: 'CLEAR' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

interface CartContextValue extends CartState {
  totalItems: number
  totalPrice: number
  dispatch: React.Dispatch<CartAction>
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.product.id === action.product.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.product.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }
      }
      return { ...state, items: [...state.items, { product: action.product, quantity: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.product.id !== action.productId) }
    case 'INCREMENT':
      return {
        ...state,
        items: state.items.map(i =>
          i.product.id === action.productId ? { ...i, quantity: i.quantity + 1 } : i
        ),
      }
    case 'DECREMENT':
      return {
        ...state,
        items: state.items.map(i =>
          i.product.id === action.productId
            ? { ...i, quantity: Math.max(1, i.quantity - 1) }
            : i
        ),
      }
    case 'CLEAR':
      return { ...state, items: [] }
    case 'OPEN_CART':
      return { ...state, isOpen: true }
    case 'CLOSE_CART':
      return { ...state, isOpen: false }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false })

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        ...state,
        totalItems,
        totalPrice,
        dispatch,
        openCart: () => dispatch({ type: 'OPEN_CART' }),
        closeCart: () => dispatch({ type: 'CLOSE_CART' }),
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
