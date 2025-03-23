import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createProduct as createProductFn,
  deleteProduct as deleteProductFn,
  getProducts,
  updateProduct as updateProductFn,
} from '../services/productService';
import { Product, ProductsResponse } from '../@types/product';
import { useNotifications } from '@toolpad/core';

export default function useProducts(limit = 20) {
  const queryClient = useQueryClient();
  const notifications = useNotifications();

  const {
    data,
    fetchNextPage,
    isError,
    isFetching,
    isLoading: isLoadingProducts,
  } = useInfiniteQuery<ProductsResponse>({
    queryKey: ['products'],
    queryFn: ({ pageParam }) =>
      getProducts({ page: pageParam as number, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalItems = lastPage.total;
      const itemsFetched = allPages.flatMap((page) => page.products).length;
      return itemsFetched < totalItems ? allPages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: createProduct, isPending: isCreatingProduct } = useMutation({
    mutationFn: createProductFn,
    onSuccess: () => {
      notifications.show('Produto criado com sucesso', {
        severity: 'success',
        autoHideDuration: 3000,
      });
    },
    onError: () => {
      notifications.show('Erro ao criar produto', {
        severity: 'error',
        autoHideDuration: 3000,
      });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  const { mutate: updateProduct, isPending: isUpdatingProduct } = useMutation({
    mutationFn: updateProductFn,
    onSuccess: () => {
      notifications.show('Produto atualizado com sucesso', {
        severity: 'success',
        autoHideDuration: 3000,
      });
    },
    onError: () => {
      notifications.show('Erro ao atualizar produto', {
        severity: 'error',
        autoHideDuration: 3000,
      });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  const { mutate: deleteProduct, isPending: isDeletingProduct } = useMutation({
    mutationFn: deleteProductFn,
    onSuccess: () => {
      notifications.show('Produto removido com sucesso', {
        severity: 'info',
        autoHideDuration: 3000,
      });
    },
    onError: () => {
      notifications.show('Erro ao remover produto', {
        severity: 'error',
        autoHideDuration: 3000,
      });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  return {
    data,
    fetchNextPage,
    isError,
    isFetching,
    isLoadingProducts,
    createProduct,
    isCreatingProduct,
    updateProduct,
    isUpdatingProduct,
    deleteProduct,
    isDeletingProduct,
  };
}
