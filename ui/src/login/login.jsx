import * as React from 'react';
import { Button, Grid, Typography, Container, Link, Box, Paper } from '@mui/material';
import { Facebook, GitHub, Google, LockOutlined, LoginOutlined, Star, CallSplit } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AccountBox } from '@mui/icons-material';
import config from '../resources/config';

// Define your theme if needed
const defaultTheme = createTheme();

export default function SignIn() {
  const [repoInfo, setRepoInfo] = React.useState(null);

  React.useEffect(() => {
    // fetchRepoInfo();
  }, []);

  const handleLogin = (provider) => {
    // Implement login logic for the selected provider
    console.log(`Initiating login with ${provider}... Not supported`);
  };

  const handleDemoLogin = () => {
    // Implement demo login logic here
    console.log('Initiating login with demo account...');
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ padding: 4, mb: 4 }}>
          <Grid container justifyContent="center" alignItems="center" spacing={4}>
            {/* Lock icon */}
            <Grid item xs={12} textAlign="center">
              <LockOutlined style={{ fontSize: 48 }} />
            </Grid>
            {/* Welcome message */}
            <Grid item xs={12} textAlign="center">
              <Typography variant="h4" gutterBottom>
                Sign in to Budgeta App
              </Typography>
              <Typography variant="body1" gutterBottom>
                Use your preferred way to login. If this is your first time here, a new account will be automatically created when you login.
              </Typography>
            </Grid>
            {/* Social login buttons */}
            <Grid item xs={12} textAlign="center">
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                <Button variant="contained" color="primary" href={config.server.uri + "/oauth2/authorization/github"} sx={{ width: '48px', height: '48px', borderRadius: '15%' }}>
                  <GitHub />
                </Button>
                <Button variant="contained" color="secondary" onClick={() => handleLogin('Google')} sx={{ width: '48px', height: '48px', borderRadius: '15%' }}>
                  <Google />
                </Button>
                <Button variant="contained" style={{ backgroundColor: '#4267B2', color: '#fff', width: '48px', height: '48px', borderRadius: '15%' }} onClick={() => handleLogin('Facebook')}>
                  <Facebook />
                </Button>
              </Box>
            </Grid>
            {/* View on GitHub, Stars count, Forks count */}
            <Grid item xs={12} textAlign="center">
              <Typography variant="body2" color="textSecondary">
                {repoInfo && (
                  <>
                    <Link href="https://github.com/stlevkov/budgeta">View on GitHub</Link>&nbsp;&nbsp;
                    <Star />&nbsp;{repoInfo.stargazers_count}&nbsp;&nbsp;
                    <CallSplit />&nbsp;{repoInfo.forks_count}
                  </>
                )}
              </Typography>
            </Grid>
            {/* Copyright notice */}
            <Grid item xs={12} textAlign="center">
              <Typography variant="body2" color="textSecondary">
                © {new Date().getFullYear()} Budgeta App.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
        {/* Demo account option */}
        <Paper elevation={3} sx={{ padding: 1 }}>
          <Grid container justifyContent="space-between" alignItems="center">
            {/* Demo Icon */}
            <Grid item xs={2}>
              <LoginOutlined style={{ fontSize: 48 }} />
            </Grid>
            {/* Sign: Use demo account to try the functionalities */}
            <Grid item xs={6}>
              <Typography variant="h6">
                or try it with a demo account
              </Typography>
            </Grid>
            {/* Demo account sign-in button */}
            <Grid item xs={4}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AccountBox />}
                onClick={handleDemoLogin}
                sx={{ borderRadius: '5%', float: 'right', mr: 2 }}
              >
                demo
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
