// src/config/networks.ts

export const networks = [
  {
    id: 'bottle-chain',
    name: 'Bottle Chain',
    type: 'custom',
    rpcUrl: 'https://mainnet.bottlechain.network',
    chainId: '0x1',
    symbol: 'BTL',
    explorer: 'https://explorer.bottlechain.network',
    icon: '/api/placeholder/32/32',
    isActive: true,
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    type: 'evm',
    rpcUrl: 'https://mainnet.infura.io/v3/your-api-key',
    chainId: '0x1',
    symbol: 'ETH',
    explorer: 'https://etherscan.io',
    icon: '/api/placeholder/32/32',
    isActive: false,
  },
  {
    id: 'binance',
    name: 'BNB Chain',
    type: 'evm',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    chainId: '0x38',
    symbol: 'BNB',
    explorer: 'https://bscscan.com',
    icon: '/api/placeholder/32/32',
    isActive: false,
  },
  {
    id: 'solana',
    name: 'Solana',
    type: 'solana',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    chainId: '1',
    symbol: 'SOL',
    explorer: 'https://explorer.solana.com',
    icon: '/api/placeholder/32/32',
    isActive: false,
  }
];

export const supportedTokens = {
  'bottle-chain': [
    {
      symbol: 'BTL',
      name: 'Bottle Chain Token',
      address: '0x...',
      decimals: 18,
      icon: '/api/placeholder/32/32',
    }
  ],
  'ethereum': [
    {
      symbol: 'ETH',
      name: 'Ethereum',
      address: 'native',
      decimals: 18,
      icon: '/api/placeholder/32/32',
    },
    {
      symbol: 'USDT',
      name: 'Tether USD',
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      decimals: 6,
      icon: '/api/placeholder/32/32',
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      decimals: 6,
      icon: '/api/placeholder/32/32',
    },
    {
      symbol: 'WBTC',
      name: 'Wrapped Bitcoin',
      address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      decimals: 8,
      icon: '/api/placeholder/32/32',
    },
    {
      symbol: 'LINK',
      name: 'Chainlink',
      address: '0x514910771af9ca656af840dff83e8264ecf986ca',
      decimals: 18,
      icon: '/api/placeholder/32/32',
    }
  ],
  'binance': [
    {
      symbol: 'BNB',
      name: 'Binance Coin',
      address: 'native',
      decimals: 18,
      icon: '/api/placeholder/32/32',
    },
    {
      symbol: 'CAKE',
      name: 'PancakeSwap Token',
      address: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
      decimals: 18,
      icon: '/api/placeholder/32/32',
    },
    {
      symbol: 'BUSD',
      name: 'Binance USD',
      address: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      decimals: 18,
      icon: '/api/placeholder/32/32',
    }
  ],
  'solana': [
    {
      symbol: 'SOL',
      name: 'Solana',
      address: 'native',
      decimals: 9,
      icon: '/api/placeholder/32/32',
    },
    {
      symbol: 'RAY',
      name: 'Raydium',
      address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
      decimals: 6,
      icon: '/api/placeholder/32/32',
    },
    {
      symbol: 'SRM',
      name: 'Serum',
      address: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt',
      decimals: 6,
      icon: '/api/placeholder/32/32',
    },
    {
      symbol: 'USDC',
      name: 'USD Coin (Solana)',
      address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      decimals: 6,
      icon: '/api/placeholder/32/32',
    }
  ]
};
