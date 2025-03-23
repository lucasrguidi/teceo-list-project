import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  createProduct as createProductFn,
  updateProduct as updateProductFn,
  deleteProduct as deleteProductFn,
  deleteProducts as deleteProductsFn,
  updateProducts,
} from '../services/productService';

export default function useProductMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createProductFn,
    onSuccess: () => toast.success('Produto criado com sucesso'),
    onError: () => toast.error('Erro ao criar produto'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  const updateMutation = useMutation({
    mutationFn: updateProductFn,
    onSuccess: () => toast.success('Produto atualizado com sucesso'),
    onError: () => toast.error('Erro ao atualizar produto'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductFn,
    onSuccess: () => toast.success('Produto removido com sucesso'),
    onError: () => toast.error('Erro ao remover produto'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  const deleteBulkMutation = useMutation({
    mutationFn: deleteProductsFn,
    onSuccess: () => toast.success('Produtos removidos com sucesso'),
    onError: () => toast.error('Erro ao remover produtos'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  const updateAvailabilityMutation = useMutation({
    mutationFn: (params: { ids: number[]; availableForSale: boolean }) =>
      updateProducts(params.ids, params.availableForSale),
    onSuccess: () =>
      toast.success('Status de disponibilidade atualizado com sucesso'),
    onError: () => toast.error('Erro ao atualizar status de disponibilidade'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  return {
    createProduct: createMutation.mutate,
    isCreatingProduct: createMutation.isPending,
    updateProduct: updateMutation.mutate,
    isUpdatingProduct: updateMutation.isPending,
    deleteProduct: deleteMutation.mutate,
    isDeletingProduct: deleteMutation.isPending,
    deleteProducts: deleteBulkMutation.mutate,
    isDeletingProducts: deleteBulkMutation.isPending,
    updateProductsAvailability: updateAvailabilityMutation.mutate,
    isUpdatingProductsAvailability: updateAvailabilityMutation.isPending,
  };
}
