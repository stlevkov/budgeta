import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Devider from '@mui/material/Divider';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ResponsiveGrid() {
  return (
    <>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container disableEqualOverflow spacing={{ xs: 1, md: 1 }} columns={{ xs: 1, sm: 8, md: 12, lg: 24, xl: 48 }}>
        {Array.from(Array(14)).map((_, index) => (
          <Grid xs={2} sm={4} md={4} key={index}>
            <Item style={{ height: '50px' }}>xs={index}</Item>
          </Grid>
        ))}
      </Grid>
    </Box>

    <Devider style={{marginTop: '8px', marginBottom: '8px'}} />
    <Box sx={{ flexGrow: 1 }}>
    <Grid container disableEqualOverflow spacing={{ xs: 1, md: 1 }} columns={{ xs: 1, sm: 8, md: 12, lg: 24, xl: 48 }}>
      {Array.from(Array(7)).map((_, index) => (
        <Grid xs={2} sm={4} md={4} key={index}>
          <Item style={{ height: '50px' }}>xs={index}</Item>
        </Grid>
      ))}
    </Grid>
    </Box>

    <Devider>Analytics</Devider>
    <Box sx={{ flexGrow: 1 }}>
    <Grid container disableEqualOverflow spacing={{ xs: 2, md: 2 }} columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
      
        <Grid xs={2} sm={5} md={2.3}>
          <Item style={{ height: '100px' }} >INCOMES</Item>
        </Grid>
        <Grid xs={2} sm={5} md={2.3}>
          <Item style={{ height: '100px' }}>EXPENSES</Item>
        </Grid>
        <Grid xs={2} sm={5} md={2.3}>
          <Item style={{ height: '100px' }}>SAVINGS ACCOUNT</Item>
        </Grid>
        <Grid xs={2} sm={5} md={2.3}>
          <Item style={{ height: '100px' }}>TARGET SAVING</Item>
        </Grid>
        <Grid xs={2} sm={5} md={2.8}>
          <Item style={{ height: '100px' }}>DAILY RECOMMENDED</Item>
        </Grid>
      
    </Grid>
    </Box>

    <Box sx={{ flexGrow: 1 }} style={{marginTop: '12px', marginBottom: '12px'}}>
    <Grid container rowSpacing={2} columns={{ xs: 2, sm: 4, md: 12, lg: 12, xl: 12 }}>
      
        <Grid xs={2} sm={6} md={6} >
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs:2, sm: 4, md: 12, lg: 12, xl: 12 }}>
            {Array.from(Array(6)).map((_, index) => (
              <Grid xs={2} sm={4} md={4} key={index}>
                <Item style={{ height: '160px' }}>xs={index}</Item>
              </Grid>
            ))}
          </Grid>
          </Box>
        </Grid>

        <Grid  xs={2} sm={6} md={6} >
        <Box sx={{ flexGrow: 1 }}>
        <Grid pl={3} container columns={{ xs: 2, sm: 4, md: 12, lg: 12, xl: 12 }}>
        <Grid xs={2} sm={12} md={12} >
          <Item style={{ height: '376px' }}>chart</Item>
          </Grid>
          </Grid>
          </Box>
        </Grid>
      
    </Grid>
    </Box>
    </>
  );
}