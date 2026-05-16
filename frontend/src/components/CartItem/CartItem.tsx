import { useCart } from '../../context/CartContext'
import { CartItem as CartItemType } from '../../types'
import styles from './CartItem.module.css'

interface Props {
  item: CartItemType
}

export function CartItem({ item }: Props) {
  const { dispatch } = useCart()
  const { product, quantity } = item

  const formatted = product.price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  const subtotal = (product.price * quantity).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <div className={styles.item}>
      <img src={product.image} alt={product.name} className={styles.image} />
      <div className={styles.info}>
        <p className={styles.name}>{product.name}</p>
        <p className={styles.unitPrice}>{formatted} / un.</p>
        <div className={styles.row}>
          <div className={styles.controls}>
            <button
              className={styles.qtyBtn}
              onClick={() => dispatch({ type: 'DECREMENT', productId: product.id })}
              aria-label="Diminuir quantidade"
            >
              −
            </button>
            <span className={styles.qty}>{quantity}</span>
            <button
              className={styles.qtyBtn}
              onClick={() => dispatch({ type: 'INCREMENT', productId: product.id })}
              aria-label="Aumentar quantidade"
            >
              +
            </button>
          </div>
          <span className={styles.subtotal}>{subtotal}</span>
        </div>
      </div>
      <button
        className={styles.removeBtn}
        onClick={() => dispatch({ type: 'REMOVE_ITEM', productId: product.id })}
        aria-label="Remover item"
      >
        ×
      </button>
    </div>
  )
}
