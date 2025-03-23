import { Box, Button, Typography } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  MaterialReactTable,
  MRT_RowSelectionState,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_RowVirtualizer,
} from 'material-react-table';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type UIEvent,
} from 'react';
import { Product, ProductsResponse } from '../@types/product';
import { getProducts } from '../services/productService';
import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';

const columns: MRT_ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
    Header: () => <Typography fontWeight="bold">Nome</Typography>,
    Cell: ({ cell }) => <Typography>{cell.getValue() as string}</Typography>,
  },
  {
    accessorKey: 'category',
    header: 'Categoria',
    Header: () => <Typography fontWeight="bold">Categoria</Typography>,
    Cell: ({ cell }) => <Typography>{cell.getValue() as string}</Typography>,
  },
  {
    accessorKey: 'stock',
    header: 'Estoque',
    Header: () => <Typography fontWeight="bold">Estoque</Typography>,
    Cell: ({ cell }) => <Typography>{cell.getValue() as number}</Typography>,
  },
  {
    accessorKey: 'availableForSale',
    header: 'Disponível para venda',
    Header: () => (
      <Typography fontWeight="bold">Disponível para venda</Typography>
    ),
    Cell: ({ cell }) => (
      <Typography>{cell.getValue() ? 'Sim' : 'Não'}</Typography>
    ),
  },
];

const limit = 20;

export default function ProductTable() {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const { data, fetchNextPage, isError, isFetching, isLoading } =
    useInfiniteQuery<ProductsResponse>({
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

  const flatData = useMemo(
    () => data?.pages.flatMap((page) => page.products) ?? [],
    [data],
  );

  const totalDBRowCount = data?.pages[0].total ?? 0;
  const totalFetched = flatData.length;

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        if (
          scrollHeight - scrollTop - clientHeight < 400 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount],
  );

  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  const table = useMaterialReactTable({
    columns,
    data: flatData,
    enableRowVirtualization: true,
    enableSorting: false,
    enableColumnActions: false,
    enablePagination: false,
    enableColumnFilters: false,
    enableGlobalFilter: false,
    enableDensityToggle: false,
    enableColumnFilterModes: false,
    enableHiding: false,
    enableFullScreenToggle: false,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getRowId: (originalRow) => originalRow.id as unknown as string,
    positionToolbarAlertBanner: 'head-overlay',
    muiTableContainerProps: {
      ref: tableContainerRef,
      sx: { maxHeight: 'calc(100vh - 61px)' },
      onScroll: (event: UIEvent<HTMLDivElement>) =>
        fetchMoreOnBottomReached(event.target as HTMLDivElement),
    },
    muiToolbarAlertBannerProps: isError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    enableTopToolbar: false,
    renderBottomToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          gap: '1rem',
          p: '4px',
        }}
      >
        {table.getIsSomeRowsSelected() ? (
          <>
            <Button
              color="success"
              disabled={!table.getIsSomeRowsSelected()}
              onClick={() => {
                alert('Delete Selected Accounts');
              }}
              variant="contained"
            >
              Disponibilizar selecionados
            </Button>
            <Button
              color="warning"
              disabled={!table.getIsSomeRowsSelected()}
              onClick={() => {
                alert('Delete Selected Accounts');
              }}
              variant="contained"
            >
              Indisponibilizar selecionados
            </Button>
            <Button
              color="error"
              disabled={!table.getIsSomeRowsSelected()}
              onClick={() => {
                alert('Delete Selected Accounts');
              }}
              variant="contained"
            >
              Deletar selecionados
            </Button>
          </>
        ) : (
          <Button
            color="primary"
            onClick={() => {
              alert('Create New Account');
            }}
            variant="contained"
          >
            Cadastrar Produto
          </Button>
        )}
      </Box>
    ),
    state: {
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      rowSelection,
    },
    rowVirtualizerInstanceRef,
    rowVirtualizerOptions: { overscan: 4 },
    localization: MRT_Localization_PT_BR,
  });

  return <MaterialReactTable table={table} />;
}
