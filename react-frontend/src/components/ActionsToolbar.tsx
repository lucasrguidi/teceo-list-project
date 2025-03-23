import { Box, Button } from '@mui/material';
import {
  MRT_Row,
  MRT_RowSelectionState,
  MRT_TableInstance,
} from 'material-react-table';
import { Product } from '../@types/product';

interface ActionsToolbarProps {
  table: MRT_TableInstance<Product>;
  onDelete: (products: number[]) => void;
  rowSelection: MRT_RowSelectionState;
  onUpdateAvailability: (products: number[], availableForSale: boolean) => void;
}

export default function ActionsToolbar({
  table,
  onDelete,
  rowSelection,
  onUpdateAvailability,
}: ActionsToolbarProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        gap: '1rem',
        p: '4px',
      }}
    >
      {table.getIsSomeRowsSelected() || table.getIsAllRowsSelected() ? (
        <>
          <Button
            color="success"
            disabled={Object.keys(rowSelection).length === 0}
            variant="contained"
            onClick={() => {
              const selectedRows = Object.keys(rowSelection).map(Number);
              onUpdateAvailability(selectedRows, true);
            }}
          >
            Disponibilizar selecionados
          </Button>
          <Button
            color="warning"
            disabled={Object.keys(rowSelection).length === 0}
            variant="contained"
            onClick={() => {
              const selectedRows = Object.keys(rowSelection).map(Number);
              onUpdateAvailability(selectedRows, false);
            }}
          >
            Indisponibilizar selecionados
          </Button>
          <Button
            color="error"
            disabled={Object.keys(rowSelection).length === 0}
            variant="contained"
            onClick={() => onDelete(Object.keys(rowSelection).map(Number))}
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
  );
}
