import { MRT_Row, MRT_TableInstance } from 'material-react-table';
import { Product } from '../@types/product';
import { Box, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface RowActionsProps {
  row: MRT_Row<Product>;
  table: MRT_TableInstance<Product>;
  onDelete: (row: MRT_Row<Product>) => void;
}

export default function RowActions({ onDelete, row, table }: RowActionsProps) {
  return (
    <Box sx={{ display: 'flex', gap: '1rem' }}>
      <Tooltip title="Edit">
        <IconButton onClick={() => table.setEditingRow(row)}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton color="error" onClick={() => onDelete(row)}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
