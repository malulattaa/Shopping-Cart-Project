import { Product } from '../../types'
import { ProductCard } from '../ProductCard/ProductCard'
import styles from './ProductGrid.module.css'

interface Props {
  products: Product[]
}

export function ProductGrid({ products }: Props) {
  return (
    <section>
      <div className={styles.heading}>
        <h1 className={styles.title}>Coleção</h1>
        <span className={styles.count}>{products.length} produtos</span>
      </div>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
