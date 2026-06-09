import { useCart } from '../../context/CartContext'
import { CartItem } from '../CartItem/CartItem'
import styles from './CartDrawer.module.css'

interface Props {
  onCheckout?: () => void
}

export function CartDrawer({ onCheckout }: Props) {
  const { items, isOpen, closeCart, totalItems, totalPrice, clearCart, canUndo, undo, checkout } =
    useCart()

  const formattedTotal = totalPrice.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  const handleCheckout = async () => {
    const purchase = await checkout()
    if (purchase) {
      onCheckout?.() // atualiza o estoque exibido na coleção
      closeCart()
      const total = purchase.total_amount.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })
      alert(`Compra finalizada com sucesso! Total: ${total}`)
    }
  }

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
          <div className={styles.headerActions}>
            {canUndo && (
              <button
                className={styles.undoBtn}
                onClick={() => undo()}
                aria-label="Desfazer última ação"
                title="Desfazer última ação"
              >
                ↶ Desfazer
              </button>
            )}
            <button className={styles.closeBtn} onClick={closeCart} aria-label="Fechar carrinho">
              ×
            </button>
          </div>
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
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>
                {totalItems} {totalItems === 1 ? 'item' : 'itens'}
              </span>
              <span className={styles.summaryLabel}>Subtotal</span>
            </div>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalValue}>{formattedTotal}</span>
            </div>
            <button className={styles.checkoutBtn} onClick={handleCheckout}>
              Finalizar Compra
            </button>
            <button
              className={styles.clearBtn}
              onClick={() => clearCart()}
            >
              Limpar carrinho
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
