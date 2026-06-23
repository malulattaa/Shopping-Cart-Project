import React, { useState } from 'react';
import { Product } from '../../types'
import styles from './ProductRegister.module.css'
import { createProduct } from '../../services/productService'

interface Props {
  onAddProduct: (product: Product) => void
}
export function RegisterProduct({ onAddProduct }: Props) {
  const [product, setProduct] = useState<Product>({
    id: 0, 
    name: '',
    brand: '',
    description: '',
    unit_price: 1,
    stock_quantity: 0,
    image: '',
    category: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target

  setProduct((prevProduct) => ({
    ...prevProduct,
    [name]:
      name === 'unit_price'
        ? value === '' ? 0 : parseFloat(value)   // float
        : name === 'stock_quantity'
        ? value === '' ? 0 : parseInt(value)      // inteiro
        : value,
  }))
}


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  try {

    const { id, ...productData } = product
    const created = await createProduct(productData)

    onAddProduct(created)  
    alert("Produto cadastrado com sucesso!")

    setProduct({
      id: 0,
      name: '',
      brand: '',
      description: '',
      unit_price: 0,
      stock_quantity: 0,
      image: '',
      category: '',
    })
  } catch (err: any) {
    alert("Erro ao cadastrar produto: " + err.message)
  }
}

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <span className={styles.kicker}>Catálogo</span>
        <h1 className={styles.title}>Cadastrar Novo Produto</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.group}>
            <label htmlFor="name" className={styles.label}>Nome do Produto</label>
            <input
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
              className={styles.input}
              placeholder="Ex.: Taça de cristal"
              required
            />
          </div>

          <div className={styles.group}>
            <label htmlFor="brand" className={styles.label}>Marca</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={product.brand}
              onChange={handleChange}
              className={styles.input}
              placeholder="Ex.: Baccarat"
              required
            />
          </div>

          <div className={styles.group}>
            <label htmlFor="description" className={styles.label}>Descrição</label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              rows={3}
              className={styles.textarea}
              placeholder="Breve descrição do produto"
              required
            ></textarea>
          </div>

          <div className={styles.row}>
            <div className={styles.group}>
              <label htmlFor="unit_price" className={styles.label}>Preço</label>
              <input
                id="unit_price"
                name="unit_price"
                value={product.unit_price}
                onChange={handleChange}
                className={styles.input}
                step="0.01"
                placeholder="0,00"
                required
              />
            </div>

            <div className={styles.group}>
              <label htmlFor="stock_quantity" className={styles.label}>Quantidade em estoque</label>
              <input
                id="stock_quantity"
                name="stock_quantity"
                value={product.stock_quantity}
                onChange={handleChange}
                className={styles.input}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className={styles.group}>
            <label htmlFor="category" className={styles.label}>Categoria</label>
            <input
              type="text"
              id="category"
              name="category"
              value={product.category}
              onChange={handleChange}
              className={styles.input}
              placeholder="Ex.: Decoração"
              required
            />
          </div>

          <div className={styles.group}>
            <label htmlFor="image" className={styles.label}>URL da Imagem</label>
            <input
              type="url"
              id="image"
              name="image"
              value={product.image}
              onChange={handleChange}
              className={styles.input}
              placeholder="https://..."
              required
            />
          </div>

          <button type="submit" className={styles.button}>
            Cadastrar Produto
          </button>
        </form>
      </div>
    </div>
  );
}
