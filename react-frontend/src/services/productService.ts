import { c } from 'vite/dist/node/moduleRunnerTransport.d-CXw_Ws6P';
import { Product, ProductsResponse } from '../@types/product';
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

export async function createProduct(data: Product): Promise<void> {
  try {
    await apiClient.post('/products', {
      name: data.name,
      category: data.category,
      stock: data.stock,
      availableForSale: data.availableForSale,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error('Erro ao criar produto');
  }
}

export async function updateProduct(data: Product): Promise<void> {
  try {
    await apiClient.put(`/products/${data.id}`, {
      name: data.name,
      category: data.category,
      stock: data.stock,
      availableForSale: data.availableForSale,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    console.log('aqui');

    throw new Error('Erro ao atualizar produto');
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await apiClient.delete(`/products/${id}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error('Erro ao deletar produto');
  }
}
