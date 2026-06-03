// src/services/productService.ts
import { Product } from '../types'  // ajuste o caminho conforme seu projeto

const BASE_URL = "http://localhost:8000/products/"

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(BASE_URL)
  if (!res.ok) throw new Error("Erro ao buscar produtos")
  return res.json()
}

export async function getProduct(id: number): Promise<Product> {
  const res = await fetch(`${BASE_URL}/${id}`)
  if (!res.ok) throw new Error("Produto não encontrado")
  return res.json()
}

export async function createProduct(product: Omit<Product, "id">): Promise<Product> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  })
  if (!res.ok) throw new Error("Erro ao criar produto")
  return res.json()
}

export async function updateProduct(id: number, data: Partial<Product>): Promise<Product> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Erro ao atualizar produto")
  return res.json()
}

export async function deleteProduct(id: number): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Erro ao deletar produto")
  return res.json()
}