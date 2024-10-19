'use client';

import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import EmptyContent from "src/components/empty-content";
import { DashboardContent } from "src/layouts/dashboard";
import CartListView from "../cart-list-view";
import OrderSummery from "../order-summery";
import { paths } from "src/routes/paths";



const ViewCart = () => {

  // extracting data from redux
  const { cartItems } = useSelector((state) => state.cart);

  return cartItems?.length === 0 ? (
    <EmptyContent
      filled
      title="Cart Is Empty"
      sx={{
        py: 10,
      }}
    />
  ) : (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Buy Credits"
        links={[
          { name: 'Admin', href: paths.admin.credits.cart },
          { name: 'Credits', href: paths.admin.credits.cart },
          { name: 'Buy Credits' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <CartListView />
        </Grid>
        <Grid item xs={4}>
          <OrderSummery />
        </Grid>
      </Grid>
    </DashboardContent>
  );
};

export default ViewCart;
