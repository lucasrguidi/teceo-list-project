import {
  MaterialReactTable,
  MRT_RowSelectionState,
  MRT_TableOptions,
  useMaterialReactTable,
  type MRT_RowVirtualizer,
} from 'material-react-table';
import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';
import {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  type UIEvent,
} from 'react';
import { Product } from '../@types/product';
import useProducts from '../hooks/useProducts';

import { validateProduct } from '../helpers/validators';
import useProductTableColumns from '../hooks/useProductTableColumns';
import { useScrollPagination } from '../hooks/useScrollPagination';
import ActionsToolbar from './ActionsToolbar';
import RowActions from './RowActions';

export default function ProductTable() {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);

  const columns = useProductTableColumns({
    validationErrors,
    setValidationErrors,
  });

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
    updateProduct,
    ConfirmDeleteModal,
    deleteProducts,
    ConfirmBulkDeleteModal,
    updateProductsAvailability,
    ConfirmBulkAvailabilityModal,
  } = useProducts();

  const flatData = useMemo(
    () => data?.pages.flatMap((page) => page.products) ?? [],
    [data],
  );
  const totalDBRowCount = data?.pages[0]?.total ?? 0;

  const MemoizedActionsToolbar = memo(ActionsToolbar);
  const MemoizedRowActions = memo(RowActions);

  const fetchMoreOnBottomReached = useScrollPagination({
    totalDBRowCount,
    fetchNextPage,
  });

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
      <MemoizedRowActions
        row={row}
        table={table}
        onDelete={() => deleteProduct(+row.id)}
      />
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
      <MemoizedActionsToolbar
        table={table}
        onDelete={deleteProducts}
        rowSelection={rowSelection}
        onUpdateAvailability={(products, availableForSale) =>
          updateProductsAvailability(products, availableForSale)
        }
      />
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

  return (
    <>
      <MaterialReactTable table={table} />
      {<ConfirmDeleteModal />}
      {<ConfirmBulkDeleteModal />}
      {<ConfirmBulkAvailabilityModal />}
    </>
  );
}
