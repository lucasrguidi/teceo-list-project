export interface Product {
  id: number;
  name: string;
  category: string;
  stock: number;
  availableForSale: boolean;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
}
