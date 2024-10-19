import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import useRazorpay from 'react-razorpay';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Card, Grid, Button, Divider, TextField, Typography, InputAdornment } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance from 'src/utils/axios';

import { emptyCart, setDiscounts, setOrderInfo, fetchDiscounts } from 'src/redux/slices/cart';

const OrderSummery = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [total, setTotal] = useState(0);
  const [discountCode, setDiscountCode] = useState('');
  const [subTotal, setSubTotal] = useState(0);
  const submitDiscountCode = useBoolean();

  const [Razorpay] = useRazorpay();

  const { error: cartError, discounts, cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    const calculateTotal = () => {
      // getting total amount of the cart items
      const totalAmount = cartItems.reduce(
        (acc, item) => acc + Number(item.price) * Number(item.qty),
        0
      );

      // setting total amount
      setTotal(totalAmount);
      // setting subtotal
      setSubTotal(totalAmount);

      // calculating discount and shipping amount
      const discountAmount = totalAmount * (Number(discounts?.percentage_monthly) / 100);

      // if discount is available then deducting it from total amount
      if (discounts?.percentage_monthly) {
        setTotal((prev) => prev - discountAmount);
      }
    };

    calculateTotal();
  }, [cartItems, discounts?.percentage_monthly]);

  const checkForDiscount = async (code) => {
    try {
      await dispatch(fetchDiscounts(code));
      submitDiscountCode.onTrue();
    } catch (error) {
      toast.error('Something Went Wrong');
    }
  };

  useEffect(() => {
    if (submitDiscountCode.value && cartError) {
      toast.error(cartError, { variant: 'error' });
      submitDiscountCode.onFalse();
    }
    if (submitDiscountCode.value && !cartError) {
      submitDiscountCode.onFalse();
    }
  }, [cartError, submitDiscountCode]);

  // to initially set the discount as null
  useEffect(() => {
    dispatch(setDiscounts(null));
  }, [dispatch]);

  // function to update the payment status
  const handleResponse = async (response, id_str) => {
    try {
      // payload object
      const payload = {
        status: 2,
        result: response,
        usertype: 3,
      };

      // updating payment status
      const paymentUpdateCall = await axiosInstance.put(
        `recruiter/api/v1/credit_purchases/updatepurchase/${id_str}`,
        payload
      );

      // removing items from cart
      dispatch(emptyCart());

      // setting the order info
      dispatch(setOrderInfo(paymentUpdateCall.data.data));

      // pushing user to credit screen
      router.push(paths.admin.credits.success);
    } catch (error) {
      // showing failure notification
      toast.error('Something Went Wrong');
    }
  };

  // function to create order in database
  const createOrder = async (amount, qty, discount_id, discount = 0) => {
    // calculating price and final price

    const final_price = amount - amount * (discount / 100);

    try {
      // payload to create
      const payloadToCreate = {
        credits: qty,
        price: amount,
        final_price,
        usertype: 3,
      };

      // adding discount if available
      if (discount_id !== undefined && discount_id !== null) {
        payloadToCreate.discount_id = discount_id;
      }

      // creating order in database
      const { data } = await axiosInstance.post(
        'recruiter/api/v1/credit_purchases/create',
        payloadToCreate
      );

      // payload to update
      const payloadToUpdate = {
        status: 3,
        usertype: 3,
      };

      // option object
      const options = {
        key: process.env.NEXT_RAZORPAY_KEY,
        name: 'NovelHire',
        description: 'Novelhire',
        order_id: data.data.ext_order_id,
        handler: (response) => {
          // handling response
          handleResponse(response, data.data.id_str);

          // adding response in the result
          payloadToUpdate.result = response;
        },
        modal: {
          ondismiss: async () => {
            // failure notification
            toast.error('Something Went Wrong');

            await axiosInstance.put(
              `recruiter/api/v1/credit_purchases/updatepurchase/${data.data.id_str}`,
              payloadToUpdate
            );
          },
        },
      };

      // creating new razorpay instance
      const razor = new Razorpay(options);

      // showing failure notification and updating payment status in the database
      razor.on('payment.failed', async () => {
        // failure notification
        toast.error('Something Went Wrong');

        await axiosInstance.put(
          `recruiter/api/v1/credit_purchases/updatepurchase/${data.data.id_str}`,
          payloadToUpdate
        );
      });

      // opening the razorpay
      razor.open();
    } catch (error) {
      // showing failure notification
      toast.error('Something Went Wrong');
    }
  };

  return (
    <>
      <Card sx={{ padding: 3 }}>
        {/* title  */}
        <Typography variant="h6" sx={{ mb: 3 }}>
          Order Summery
        </Typography>
        <Grid container spacing={2}>
          {/* subtotal  */}
          <Grid item xs={6}>
            <Typography variant="body2">Sub Total</Typography>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{ display: 'flex', justifyContent: 'flex-end' }}
            justifyContent="flex-end"
          >
            <Typography variant="body2">Rs. {subTotal}</Typography>
          </Grid>

          {/* discount  */}
          <Grid item xs={6}>
            <Typography variant="body2">Discount</Typography>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{ display: 'flex', justifyContent: 'flex-end' }}
            justifyContent="flex-end"
          >
            <Typography variant="body2">
              {discounts?.percentage_monthly ? `${discounts?.percentage_monthly}%` : '-'}
            </Typography>
          </Grid>

          {/* divider  */}
          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* total  */}
          <Grid item xs={6}>
            <Typography variant="body1" fontWeight={600}>
              Total
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              variant="body1"
              sx={{ display: 'flex', justifyContent: 'flex-end', color: 'red' }}
            >
              {`Rs ${total}`}
            </Typography>
          </Grid>

          {/* note  */}
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Typography variant="caption">(VAT included if applicable)</Typography>
          </Grid>

          {/* discount field  */}
          <Grid item xs={12}>
            <TextField
              placeholder="Discount Code"
              fullWidth
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="outlined"
                      sx={{ color: 'green' }}
                      onClick={() => checkForDiscount(discountCode)}
                    >
                      Apply
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Card>
      {/* button for checkout */}
      <Button
        variant="contained"
        size="large"
        fullWidth
        sx={{ mt: 3 }}
        onClick={() =>
          createOrder(subTotal, cartItems[0]?.qty, discounts?.id_str, discounts?.percentage_monthly)
        }
      >
        Check Out
      </Button>
    </>
  );
};

export default OrderSummery;
