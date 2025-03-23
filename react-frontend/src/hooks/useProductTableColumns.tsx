import { useMemo } from 'react';

import { MRT_ColumnDef } from 'material-react-table';
import { Product } from '../@types/product';
import { getEditTextFieldProps } from '../helpers/getEditTextFieldProps';
import { Typography } from '@mui/material';

interface UseProductTableColumnsProps {
  validationErrors: Record<string, string | undefined>;
  setValidationErrors: (
    value: React.SetStateAction<Record<string, string | undefined>>,
  ) => void;
}

export default function useProductTableColumns({
  validationErrors,
  setValidationErrors,
}: UseProductTableColumnsProps) {
  return useMemo<MRT_ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nome',
        Header: () => <Typography fontWeight="bold">Nome</Typography>,
        Cell: ({ cell }) => (
          <Typography>{cell.getValue() as string}</Typography>
        ),
        muiEditTextFieldProps: getEditTextFieldProps(
          'name',
          validationErrors,
          setValidationErrors,
        ),
      },
      {
        accessorKey: 'category',
        header: 'Categoria',
        Header: () => <Typography fontWeight="bold">Categoria</Typography>,
        Cell: ({ cell }) => (
          <Typography>{cell.getValue() as string}</Typography>
        ),
        muiEditTextFieldProps: getEditTextFieldProps(
          'category',
          validationErrors,
          setValidationErrors,
        ),
      },
      {
        accessorKey: 'stock',
        header: 'Estoque',
        Header: () => <Typography fontWeight="bold">Estoque</Typography>,
        Cell: ({ cell }) => (
          <Typography>{cell.getValue() as number}</Typography>
        ),
        muiEditTextFieldProps: getEditTextFieldProps(
          'stock',
          validationErrors,
          setValidationErrors,
        ),
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
}
