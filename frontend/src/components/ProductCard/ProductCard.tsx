import { useCart } from '../../context/CartContext'
import { Product } from '../../types'
import styles from './ProductCard.module.css'

interface Props {
  product: Product
}

export function ProductCard({ product }: Props) {
  const { dispatch, openCart } = useCart()

  const handleAdd = () => {
    dispatch({ type: 'ADD_ITEM', product })
    openCart()
  }

  const formatted = product.unit_price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={product.image} alt={product.name} className={styles.image} loading="lazy" />
        <span className={styles.category}>{product.category}</span>
      </div>
      <div className={styles.body}>
        <h2 className={styles.name}>{product.name}</h2>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.footer}>
          <span className={styles.unit_price}>{formatted}</span>
          <button className={styles.addBtn} onClick={handleAdd}>
            + Adicionar
          </button>
        </div>
      </div>
    </article>
  )
}
