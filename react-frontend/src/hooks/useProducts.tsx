import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { ProductsResponse } from '../@types/product';
import ConfirmModal from '../components/ConfirmModal';
import {
  createProduct as createProductFn,
  deleteProduct as deleteProductFn,
  getProducts,
  updateProduct as updateProductFn,
} from '../services/productService';

export default function useProducts(limit = 20) {
  const queryClient = useQueryClient();

  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

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
      toast.success('Produto criado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao criar produto');
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  const { mutate: updateProduct, isPending: isUpdatingProduct } = useMutation({
    mutationFn: updateProductFn,
    onSuccess: () => {
      toast.success('Produto atualizado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao atualizar produto');
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  const { mutate: deleteProduct, isPending: isDeletingProduct } = useMutation({
    mutationFn: deleteProductFn,
    onSuccess: () => {
      toast.success('Produto removido com sucesso');
    },
    onError: () => {
      toast.error('Erro ao remover produto');
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  const productName = productToDelete
    ? data?.pages
        .flatMap((page) => page.products)
        .find((product) => product.id === productToDelete)?.name ||
      'este produto'
    : 'este produto';

  const handleDeleteClick = (productId: number) => {
    setProductToDelete(productId);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete !== null) {
      deleteProduct(productToDelete.toString());
    }
    setIsConfirmDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleCloseDeleteModal = () => {
    setIsConfirmDeleteModalOpen(false);
    setProductToDelete(null);
  };

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
    deleteProduct: handleDeleteClick,
    isDeletingProduct,
    DeleteModal: () => {
      return (
        <ConfirmModal
          open={isConfirmDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          title="Confirmar exclusão"
          text="Tem certeza que deseja deletar o produto? Esta ação não pode ser desfeita."
          actionText="Deletar"
        />
      );
    },
  };
}
