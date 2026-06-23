import { Product } from '../../types'
import { ProductCard } from '../ProductCard/ProductCard'
import styles from './ProductGrid.module.css'

interface Props {
  products: Product[]
  onDelete: (id: number) => void
}

export function ProductGrid({ products, onDelete }: Props) {
  return (
    <section>
      <div className={styles.heading}>
        <h1 className={styles.title}>Coleção</h1>
        <span className={styles.count}>{products.length} produtos</span>
      </div>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onDelete={onDelete} />
        ))}
      </div>
    </section>
  )
}