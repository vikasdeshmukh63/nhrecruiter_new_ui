'use client';

import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";

import { Card, Table, Button, TableBody, Typography, TableContainer } from "@mui/material";

import { paths } from "src/routes/paths";

import { Scrollbar } from "src/components/scrollbar";
import { useTable, TableNoData, TableHeadCustom } from "src/components/table";

import CartTableRow from "./cart-table-row";



// ----------------------------------------------------------------------

// table heads
const TABLE_HEAD = [
  { id: 'product', label: 'Product' },
  { id: 'price', label: 'Price' },
  { id: 'qty', label: 'Quantity' },
  { id: 'totalPrice', label: 'Total Price' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function CartListView() {
  const table = useTable();

  const { cartItems } = useSelector((state) => state.cart);

  const notFound = !cartItems.length;

  return (
    <>
      <Card>
        <Typography variant="h6" sx={{ ml: 3, my: 3 }}>{`Cart (${cartItems.length})`}</Typography>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              {/* table head  */}
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                onSort={table.onSort}
              />

              <TableBody>
                {/* table rows  */}
                {cartItems?.map((row) => (
                  <CartTableRow key={row.id} row={row} />
                ))}
                {/* no data component  */}
                <TableNoData notFound={notFound} title="Cart Is Empty" />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </Card>
      <Button
        startIcon={<Icon icon="ep:arrow-left-bold" />}
        href={paths.admin.credits.group.buy}
        sx={{
          mt: 3,
          '&:hover': {
            backgroundColor: 'transparent',
          },
        }}
        disableRipple
        disableElevation
      >
        Continue Shopping
      </Button>
    </>
  );
}
