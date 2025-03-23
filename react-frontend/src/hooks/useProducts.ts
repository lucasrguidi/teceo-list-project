import { useInfiniteQuery } from '@tanstack/react-query';
import { getProducts } from '../services/productService';

export default function useProducts(limit = 5) {
  return useInfiniteQuery({
    queryKey: ['products', 'infinite'],
    queryFn: ({ pageParam }) => getProducts({ page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalItems = lastPage.total;
      const itemsFetched = allPages.flatMap((page) => page.products).length;
      return itemsFetched < totalItems ? allPages.length + 1 : undefined;
    },
  });
}
