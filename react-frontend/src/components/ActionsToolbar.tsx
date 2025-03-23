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
}

export default function ActionsToolbar({
  table,
  onDelete,
  rowSelection,
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
