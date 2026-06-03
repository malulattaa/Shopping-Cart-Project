export interface Product {
  id: number
  name: string
  brand: string,
  description: string
  unit_price: number
  image: string
  category: string
  stock_quantity: number
}


export interface CartItem {
  product: Product
  quantity: number
}
