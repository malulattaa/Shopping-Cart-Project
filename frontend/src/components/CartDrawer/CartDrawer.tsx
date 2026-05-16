import { useCart } from '../../context/CartContext'
import { CartItem } from '../CartItem/CartItem'
import styles from './CartDrawer.module.css'

export function CartDrawer() {
  const { items, isOpen, closeCart, totalPrice, dispatch } = useCart()

  const formattedTotal = totalPrice.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}
        aria-label="Carrinho de compras"
      >
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.headerMark}>◆</span>
            <h2 className={styles.title}>Carrinho</h2>
          </div>
          <button className={styles.closeBtn} onClick={closeCart} aria-label="Fechar carrinho">
            ×
          </button>
        </div>

        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>◇</span>
              <p className={styles.emptyTitle}>Carrinho vazio</p>
              <p className={styles.emptySub}>Adicione produtos para continuar</p>
            </div>
          ) : (
            <div className={styles.items}>
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalValue}>{formattedTotal}</span>
            </div>
            <button className={styles.checkoutBtn}>
              Finalizar Compra
            </button>
            <button
              className={styles.clearBtn}
              onClick={() => dispatch({ type: 'CLEAR' })}
            >
              Limpar carrinho
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
