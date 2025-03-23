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
  deleteProducts as deleteProductsFn,
  updateProducts as updateProductsFn,
} from '../services/productService';
import BulkActionModal from '../components/BulkActionModal';
import { useScrollPagination } from './useScrollPagination';

export default function useProducts(limit = 20) {
  const queryClient = useQueryClient();

  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);

  const [isConfirmBulkDeleteModalOpen, setIsConfirmBulkDeleteModalOpen] =
    useState(false);

  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [productsToDelete, setProductsToDelete] = useState<number[] | null>(
    null,
  );

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

  const { mutate: deleteProducts, isPending: isDeletingProducts } = useMutation(
    {
      mutationFn: deleteProductsFn,
      onSuccess: () => {
        toast.success('Produtos removidos com sucesso');
      },
      onError: () => {
        toast.error('Erro ao remover produtos');
      },
      onSettled: () =>
        queryClient.invalidateQueries({ queryKey: ['products'] }),
    },
  );

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

  const handleBulkDeleteClick = (productIds: number[]) => {
    setProductsToDelete(productIds);
    setIsConfirmBulkDeleteModalOpen(true);
  };

  const handleCloseBulkDeleteModal = () => {
    setIsConfirmBulkDeleteModalOpen(false);
    setProductsToDelete(null);
  };

  const handleConfirmBulkDelete = () => {
    if (productsToDelete !== null) {
      deleteProducts(productsToDelete);
    }
    setIsConfirmBulkDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const getProductNames = (productsToDelete: number[]): string[] => {
    if (!data || !productsToDelete) return [];

    // Acessar todos os produtos carregados
    const allProducts = data.pages.flatMap((page) => page.products);

    // Filtrar os produtos que estão no array productsToDelete
    const productsToDeleteNames = allProducts
      .filter((product) => productsToDelete.includes(product.id!))
      .map((product) => product.name);

    return productsToDeleteNames;
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
    deleteProducts: handleBulkDeleteClick,
    ConfirmDeleteModal: () => {
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
    ConfirmBulkDeleteModal: () => {
      const productNames = productsToDelete
        ? getProductNames(productsToDelete)
        : [];

      return (
        <BulkActionModal
          open={isConfirmBulkDeleteModalOpen}
          onClose={handleCloseBulkDeleteModal}
          onConfirm={handleConfirmBulkDelete}
          title="Confirmar exclusão em massa"
          text="Tem certeza que deseja deletar os produtos? Esta ação não pode ser desfeita."
          actionText="Deletar"
          products={productNames}
        />
      );
    },
  };
}
