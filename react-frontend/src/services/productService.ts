import { ProductsResponse } from '../@types/product';
import apiClient from '../lib/api';

export async function getProducts({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): Promise<ProductsResponse> {
  const response = await apiClient.get('/products', {
    params: { page, limit },
  });

  return response.data;
}
