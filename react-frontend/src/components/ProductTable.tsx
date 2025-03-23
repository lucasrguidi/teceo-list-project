import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import {
  MaterialReactTable,
  MRT_Row,
  MRT_RowSelectionState,
  MRT_TableOptions,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_RowVirtualizer,
} from 'material-react-table';
import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type UIEvent,
} from 'react';
import { Product } from '../@types/product';
import useProducts from '../hooks/useProducts';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { updateProduct } from '../services/productService';

export default function ProductTable() {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const columns = useMemo<MRT_ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nome',
        Header: () => <Typography fontWeight="bold">Nome</Typography>,
        Cell: ({ cell }) => (
          <Typography>{cell.getValue() as string}</Typography>
        ),
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.name,
          helperText: validationErrors?.name,

          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              firstName: undefined,
            }),
        },
      },
      {
        accessorKey: 'category',
        header: 'Categoria',
        Header: () => <Typography fontWeight="bold">Categoria</Typography>,
        Cell: ({ cell }) => (
          <Typography>{cell.getValue() as string}</Typography>
        ),
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.category,
          helperText: validationErrors?.category,

          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              firstName: undefined,
            }),
        },
      },
      {
        accessorKey: 'stock',
        header: 'Estoque',
        Header: () => <Typography fontWeight="bold">Estoque</Typography>,
        Cell: ({ cell }) => (
          <Typography>{cell.getValue() as number}</Typography>
        ),
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.stock,
          helperText: validationErrors?.stock,

          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              firstName: undefined,
            }),
        },
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
        editVariant: 'select',
        editSelectOptions: ['Sim', 'Não'],
        muiEditTextFieldProps: {
          select: true,
          error: !!validationErrors?.state,
          helperText: validationErrors?.state,
        },
      },
    ],
    [validationErrors],
  );

  const {
    data,
    fetchNextPage,
    isError,
    isFetching,
    isLoadingProducts,
    createProduct,
    isCreatingProduct,
    deleteProduct,
    isDeletingProduct,
    isUpdatingProduct,
  } = useProducts();

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

  const handleCreateProduct: MRT_TableOptions<Product>['onCreatingRowSave'] =
    async ({ values, table }) => {
      const newValidationErrors = validateProduct(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      const product = {
        name: values.name,
        category: values.category,
        stock: +values.stock,
        availableForSale: values.availableForSale === 'Sim' ? true : false,
      };
      await createProduct(product);
      table.setCreatingRow(null);
    };

  const handleUpdateProduct: MRT_TableOptions<Product>['onEditingRowSave'] =
    async ({ values, table, row }) => {
      const newValidationErrors = validateProduct(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      const product = {
        id: +row.id,
        name: values.name,
        category: values.category,
        stock: +values.stock,
        availableForSale: values.availableForSale === 'Sim' ? true : false,
      };
      await updateProduct(product);
      table.setEditingRow(null);
    };

  const openDeleteConfirmModal = (row: MRT_Row<Product>) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteProduct(row.original.id?.toString() ?? '');
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: flatData,
    createDisplayMode: 'row',
    editDisplayMode: 'row',
    enableEditing: true,
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateProduct,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: (props) => handleUpdateProduct(props),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
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
              table.setCreatingRow(true);
            }}
            variant="contained"
          >
            Cadastrar Produto
          </Button>
        )}
      </Box>
    ),
    state: {
      isLoading: isLoadingProducts,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      rowSelection,
      isSaving: isCreatingProduct || isUpdatingProduct || isDeletingProduct,
    },
    rowVirtualizerInstanceRef,
    rowVirtualizerOptions: { overscan: 4 },
    localization: MRT_Localization_PT_BR,
  });

  return <MaterialReactTable table={table} />;
}

const validateRequired = (value: string) => !!value.length;

function validateProduct(product: Product) {
  return {
    name: !validateRequired(product.name) ? 'Nome é obrigatório' : '',
    category: !validateRequired(product.category)
      ? 'Categoria é obrigatório'
      : '',
    stock: !validateRequired(product.stock.toString())
      ? 'Estoque é obrigatório'
      : '',
  };
}
