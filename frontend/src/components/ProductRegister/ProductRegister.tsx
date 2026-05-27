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
    unit_price: 0,
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
    <div className={styles.registerproductcontainer}>
      <div className={styles.formcard}>
        <h1 className={styles.formtitle}>
    
          Cadastrar Novo Produto
        </h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.formgroup}>
            <label htmlFor="name" className={styles.formlabel}>Nome do Produto</label>
            <input
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
              className={styles.forminput}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="brand" className={styles.formlabel}>Marca</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={product.brand}
              onChange={handleChange}
              className={styles.forminput}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className={styles.formlabel}>Descrição</label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              rows={3}
              className={styles.formtextarea}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="price" className={styles.formlabel}>Preço</label>
            <input
              type="number"
              id="unit_price"
              name="unit_price"
              value={product.unit_price}
              onChange={handleChange}
              className={styles.forminput}
              required
              min="0"
              
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock_quantity" className={styles.formlabel}>Quantidade em estoque</label>
            <input
              type="number"
              id="stock_quantity"
              name="stock_quantity"
              value={product.stock_quantity}
              onChange={handleChange}
              className={styles.forminput}
              required
              min="0"
              
            />
          </div>

          <div className="form-group">
            <label htmlFor="category" className={styles.formlabel}>Categoria</label>
            <input
              type="text"
              id="category"
              name="category"
              value={product.category}
              onChange={handleChange}
              className={styles.forminput}
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image" className={styles.formlabel}>URL da Imagem</label>
            <input
              type="url"
              id="image"
              name="image"
              value={product.image}
              onChange={handleChange}
              className={styles.forminput}
              required
            />
          </div>
          <button
            type="submit"
            className={styles.formbutton}
          >
            Cadastrar Produto
          </button>
        </form>
      </div>
    </div>
  );
}
