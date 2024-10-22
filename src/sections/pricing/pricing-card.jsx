import { Icon } from "@iconify/react";

import { Box, alpha, Stack, Button, Divider, Typography } from "@mui/material";

import { Iconify } from "src/components/iconify";





const PricingCard = ({ planCategories, card, priceType, index }) => {
  const planFearturesId = card?.plan_features.map((item) => item.feature_id);

  const planFeatureObj = planCategories.map((item) => ({
    headName: item.name,
    featureList: item.features
      .filter((feature) => planFearturesId.includes(feature.id))
      .map((feature) => feature.name),
  }));

  return (
    <Stack
      spacing={5}
      sx={{
        p: 5,
        borderRadius: 2,
        boxShadow: (theme) => ({
          xs: theme.customShadows.card,
          md: `-40px 40px 80px 0px ${alpha(
            theme.palette.mode === 'light' ? theme.palette.grey[500] : theme.palette.common.black,
            0.16
          )}`,
        }),
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box sx={{ width: 48, height: 48 }}>
          <Icon fontSize={50} icon="entypo:price-ribbon" />
        
        </Box>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
          {card.name}
        </Typography>
        <Typography variant="subtitle2">{card.description}</Typography>
      </Stack>

      <Stack direction="row">
        <Typography variant="h4">$</Typography>

        <Typography variant="h2">
          {priceType === 'monthly' ? card.price_monthly : card.price_yearly}
        </Typography>

        <Typography
          component="span"
          sx={{
            alignSelf: 'center',
            color: 'text.disabled',
            ml: 1,
            typography: 'body2',
          }}
        >
          {priceType === 'monthly' ? '/ Mo' : '/ Yr'}
        </Typography>
      </Stack>
      <Divider sx={{ borderStyle: 'dashed' }} />
      {planFeatureObj.map((planCat) => {
        if (planCat.featureList.length <= 0) {
          return null;
        }
        return (
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box component="span" sx={{ typography: 'overline' }}>
                {planCat.headName}
              </Box>
            </Stack>

            {planCat?.featureList.map((item, i) => (
              <Stack
                key={i}
                spacing={1}
                direction="row"
                alignItems="center"
                sx={{
                  typography: 'body2',
                }}
              >
                <Iconify icon="eva:checkmark-fill" width={16} sx={{ mr: 1 }} />
                {item}
              </Stack>
            ))}
          </Stack>
        );
      })}

      <Button fullWidth size="large" variant="contained" color="primary">
        Choose Plan
      </Button>
    </Stack>
  );
};

export default PricingCard;
