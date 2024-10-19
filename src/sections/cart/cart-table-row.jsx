import { useDispatch } from 'react-redux';

import {
  Box,
  Stack,
  Avatar,
  Button,
  Tooltip,
  TableRow,
  TableCell,
  IconButton,
  ListItemText,
} from '@mui/material';

import { removeCartItem, changeExistingItemQty } from 'src/redux/slices/cart';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function CartTableRow({ row }) {
  const dispatch = useDispatch();

  const handleRemoveCartItem = (id) => {
    dispatch(removeCartItem(id));
  };

  const handleCount = (id, type) => {
    dispatch(changeExistingItemQty({ id, type }));
  };

  return (
    <TableRow hover>
      {/* product  */}
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar src="/assets/Square_Avatar.svg" sx={{ mr: 3, borderRadius: 1 }} />
        <ListItemText
          primary={row?.title}
          primaryTypographyProps={{ typography: 'body2' }}
          secondary={row?.desc}
          secondaryTypographyProps={{ typography: 'caption' }}
        />
      </TableCell>

      {/* price  */}
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.price}</TableCell>

      {/* quantity  */}
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex"
          spacing={1}
          border="1px solid gray"
          width="fit-content"
          borderRadius={1}
        >
          <Button onClick={() => handleCount(row?.id, 'minus')}>-</Button>
          <Box>{row?.qty}</Box>
          <Button onClick={() => handleCount(row?.id, 'add')}>+</Button>
        </Stack>
      </TableCell>

      {/* total price  */}
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{`Rs ${row.qty * row.price}`}</TableCell>

      {/* actions  */}
      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <Tooltip title="Remove Cart Item" placement="top" arrow>
          <IconButton onClick={() => handleRemoveCartItem(row?.id)}>
            <Iconify icon="material-symbols:delete-outline" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
