// src/services/cartService.ts
import { CartItem } from '../types'

const BASE_URL = "http://localhost:8000/cart"

export interface CartResponse {
  items: CartItem[]
  total_items: number
  total_amount: number
  can_undo: boolean
}

export interface PurchaseItem {
  product_id: number
  name: string
  quantity: number
  unit_price: number
  subtotal: number
}

export interface Purchase {
  id: number
  items: PurchaseItem[]
  total_amount: number
  created_at: string
}

async function ensureOk(res: Response, fallback: string): Promise<Response> {
  if (!res.ok) {
    let detail = fallback
    try {
      const body = await res.json()
      if (body?.detail) detail = body.detail
    } catch {
      // resposta sem corpo JSON: mantém a mensagem padrão
    }
    throw new Error(detail)
  }
  return res
}

async function parseCart(res: Response): Promise<CartResponse> {
  return (await ensureOk(res, "Erro na operação do carrinho")).json()
}

export async function getCart(): Promise<CartResponse> {
  return parseCart(await fetch(`${BASE_URL}/`))
}

export async function addCartItem(productId: number, quantity = 1): Promise<CartResponse> {
  return parseCart(
    await fetch(`${BASE_URL}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, quantity }),
    })
  )
}

export async function updateCartItem(productId: number, quantity: number): Promise<CartResponse> {
  return parseCart(
    await fetch(`${BASE_URL}/items/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    })
  )
}

export async function removeCartItem(productId: number): Promise<CartResponse> {
  return parseCart(await fetch(`${BASE_URL}/items/${productId}`, { method: "DELETE" }))
}

export async function clearCart(): Promise<CartResponse> {
  return parseCart(await fetch(`${BASE_URL}/`, { method: "DELETE" }))
}

export async function undoCartAction(): Promise<CartResponse> {
  return parseCart(await fetch(`${BASE_URL}/undo`, { method: "POST" }))
}

export async function checkout(): Promise<Purchase> {
  const res = await ensureOk(
    await fetch(`${BASE_URL}/checkout`, { method: "POST" }),
    "Erro ao finalizar compra"
  )
  return res.json()
}

export async function getHistory(): Promise<Purchase[]> {
  const res = await ensureOk(await fetch(`${BASE_URL}/history`), "Erro ao buscar histórico")
  return res.json()
}
