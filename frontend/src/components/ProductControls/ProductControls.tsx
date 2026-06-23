import { useState } from 'react'
import styles from './ProductControls.module.css'

export type SortBy = "name" | "price"
export type SortOrder = "asc" | "desc"

interface Props {
  onSearch: (term: string) => void
  onSort: (by: SortBy, order: SortOrder) => void
  activeSortBy: SortBy | null
  activeSortOrder: SortOrder
}

export function ProductControls({ onSearch, onSort, activeSortBy, activeSortOrder }: Props) {
  const [term, setTerm] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSearch(term.trim())
  }

  function handleSortClick(by: SortBy) {
    const nextOrder: SortOrder =
      activeSortBy === by && activeSortOrder === "asc" ? "desc" : "asc"
    onSort(by, nextOrder)
  }

  function arrow(by: SortBy) {
    if (activeSortBy !== by) return ""
    return activeSortOrder === "asc" ? " ↑" : " ↓"
  }

  return (
    <form className={styles.productControls} onSubmit={handleSubmit}>
      <div className={styles.searchGroup}>
        <label className={styles.controlsLabel} htmlFor="product-search">
          Buscar
        </label>
        <input
          id="product-search"
          type="text"
          placeholder="Nome do produto..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <button type="submit" className={`${styles.controlsButton} ${styles.buttonPrimary}`}>
        Buscar
      </button>

      <button
        type="button"
        className={`${styles.controlsButton} ${activeSortBy === "name" ? styles.buttonActive : ""}`}
        onClick={() => handleSortClick("name")}
      >
        Nome{arrow("name")}
      </button>

      <button
        type="button"
        className={`${styles.controlsButton} ${activeSortBy === "price" ? styles.buttonActive : ""}`}
        onClick={() => handleSortClick("price")}
      >
        Preço{arrow("price")}
      </button>
    </form>
  )
}