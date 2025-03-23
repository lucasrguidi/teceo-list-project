import { useMemo } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import { Product } from '../@types/product';

export const useProductColumns = (validationErrors: Record<string, string>) =>
  useMemo<MRT_ColumnDef<Product>[]>(
    () => [
      createColumn('name', 'Nome', validationErrors),
      createColumn('category', 'Categoria', validationErrors),
      createNumberColumn('stock', 'Estoque', validationErrors),
      {
        accessorKey: 'availableForSale',
        header: 'Disponível para venda',
        Cell: ({ cell }) => (cell.getValue() ? 'Sim' : 'Não'),
        editVariant: 'select',
        editSelectOptions: ['Sim', 'Não'],
        muiEditTextFieldProps: {
          select: true,
          error: !!validationErrors.state,
          helperText: validationErrors.state,
        },
      },
    ],
    [validationErrors],
  );

const createColumn = (
  key: string,
  label: string,
  errors: Record<string, string>,
) => ({
  accessorKey: key,
  header: label,
  muiEditTextFieldProps: createTextFieldProps(key, errors),
});

const createNumberColumn = (
  key: string,
  label: string,
  errors: Record<string, string>,
) => ({
  ...createColumn(key, label, errors),
  Cell: ({ cell }: { cell: any }) => cell.getValue(),
});

const createTextFieldProps = (
  field: string,
  errors: Record<string, string>,
) => ({
  required: true,
  error: !!errors[field],
  helperText: errors[field],
  onFocus: () => errors[field] && delete errors[field],
});
