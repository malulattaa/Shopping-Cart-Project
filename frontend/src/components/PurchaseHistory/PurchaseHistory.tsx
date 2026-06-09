import { useEffect, useState } from 'react'
import { getHistory, Purchase } from '../../services/cartService'
import styles from './PurchaseHistory.module.css'

const brl = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

export function PurchaseHistory() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHistory()
      .then(setPurchases)
      .catch((err) => console.error('Erro ao buscar histórico:', err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section>
      <div className={styles.heading}>
        <h1 className={styles.title}>Histórico de Compras</h1>
        <span className={styles.count}>
          {purchases.length} {purchases.length === 1 ? 'compra' : 'compras'}
        </span>
      </div>

      {loading ? (
        <p className={styles.muted}>Carregando…</p>
      ) : purchases.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>◇</span>
          <p className={styles.emptyTitle}>Nenhuma compra ainda</p>
          <p className={styles.emptySub}>Finalize um pedido para vê-lo aqui</p>
        </div>
      ) : (
        <div className={styles.list}>
          {purchases.map((purchase) => (
            <article key={purchase.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.orderId}>Pedido #{purchase.id}</span>
                <span className={styles.date}>{formatDate(purchase.created_at)}</span>
              </div>
              <ul className={styles.items}>
                {purchase.items.map((item) => (
                  <li key={item.product_id} className={styles.item}>
                    <span className={styles.itemName}>
                      {item.name}
                      <span className={styles.itemQty}>× {item.quantity}</span>
                    </span>
                    <span className={styles.itemSubtotal}>{brl(item.subtotal)}</span>
                  </li>
                ))}
              </ul>
              <div className={styles.cardFooter}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalValue}>{brl(purchase.total_amount)}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
