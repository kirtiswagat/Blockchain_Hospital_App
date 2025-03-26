// components/Admin/BlockchainConnect.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Link as LinkIcon,
  AccountBalanceWallet as WalletIcon,
  Language as NetworkIcon
} from '@mui/icons-material';

const BlockchainConnect = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [networkUrl, setNetworkUrl] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');
  const [connectionDetails, setConnectionDetails] = useState(null);

  const handleConnect = () => {
    // Validate inputs
    if (!walletAddress || !networkUrl) {
      setError('Please fill in both fields');
      return;
    }

    setError('');
    setIsConnecting(true);

    // Simulate connection to blockchain
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      setConnectionDetails({
        walletAddress: walletAddress,
        networkUrl: networkUrl,
        networkName: 'Healthcare Blockchain Network',
        chainId: '0x539',
        blockNumber: 15482930,
        timestamp: new Date().toLocaleString(),
      });
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setConnectionDetails(null);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Connect to Blockchain
      </Typography>
      
      <Paper sx={{ p: 3, mt: 3 }}>
        {!isConnected ? (
          <Box component="form" noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Enter Blockchain Connection Details
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Wallet Address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="0x..."
                  InputProps={{
                    startAdornment: (
                      <Box component={WalletIcon} sx={{ color: 'text.secondary', mr: 1 }} />
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Network URL"
                  value={networkUrl}
                  onChange={(e) => setNetworkUrl(e.target.value)}
                  placeholder="https://..."
                  InputProps={{
                    startAdornment: (
                      <Box component={NetworkIcon} sx={{ color: 'text.secondary', mr: 1 }} />
                    ),
                  }}
                />
              </Grid>
              
              {error && (
                <Grid item xs={12}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              )}
              
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleConnect}
                  disabled={isConnecting}
                  startIcon={isConnecting ? <CircularProgress size={20} /> : <LinkIcon />}
                >
                  {isConnecting ? 'Connecting...' : 'Connect to Blockchain'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Alert severity="success" sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Successfully connected to blockchain network
                  </Typography>
                </Alert>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Connection Details
                </Typography>
                <Divider />
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <WalletIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Wallet Address" 
                      secondary={connectionDetails.walletAddress} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <NetworkIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Network URL" 
                      secondary={connectionDetails.networkUrl} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Network Name" 
                      secondary={connectionDetails.networkName} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Chain ID" 
                      secondary={connectionDetails.chainId} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Current Block" 
                      secondary={connectionDetails.blockNumber} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Connected At" 
                      secondary={connectionDetails.timestamp} 
                    />
                  </ListItem>
                </List>
              </Grid>
              
              <Grid item xs={12}>
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={handleDisconnect}
                >
                  Disconnect
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {isConnected && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Blockchain Operations
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Button variant="contained" fullWidth>
                View Transaction History
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button variant="contained" fullWidth>
                Verify Hospital Records
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button variant="contained" fullWidth>
                Manage Smart Contracts
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default BlockchainConnect;