// src/services/multiChainPriceFeed.ts

interface PriceData {
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: number;
}

interface TokenConfig {
  symbol: string;
  coingeckoId?: string;
  chainlinkFeed?: string;
  pythFeed?: string;
  chain: string;
}

const TOKEN_CONFIGS: TokenConfig[] = [
  // Ethereum tokens
  { 
    symbol: 'ETH',
    coingeckoId: 'ethereum',
    chainlinkFeed: '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419',
    chain: 'ethereum'
  },
  { 
    symbol: 'USDT',
    coingeckoId: 'tether',
    chainlinkFeed: '0x3e7d1eab13ad0104d2750b8863b489d65364e32d',
    chain: 'ethereum'
  },
  { 
    symbol: 'USDC',
    coingeckoId: 'usd-coin',
    chainlinkFeed: '0x8fffffd4afb6115b954bd326cbe7b4ba576818f6',
    chain: 'ethereum'
  },
  
  // Binance tokens
  { 
    symbol: 'BNB',
    coingeckoId: 'binancecoin',
    chainlinkFeed: '0x0567f2323251f0aab15c8dfb1967e4e8a7d42aee',
    chain: 'binance'
  },
  { 
    symbol: 'CAKE',
    coingeckoId: 'pancakeswap-token',
    chainlinkFeed: '0xb6064ed41d4f67e353768aa239ca86f4f73665a1',
    chain: 'binance'
  },
  { 
    symbol: 'BUSD',
    coingeckoId: 'binance-usd',
    chainlinkFeed: '0xcbb98864ef56e9042e7d2efef76141f15731b82f',
    chain: 'binance'
  },

  // Solana tokens
  { 
    symbol: 'SOL',
    coingeckoId: 'solana',
    pythFeed: 'H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG',
    chain: 'solana'
  },
  { 
    symbol: 'RAY',
    coingeckoId: 'raydium',
    pythFeed: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    chain: 'solana'
  },
  { 
    symbol: 'SRM',
    coingeckoId: 'serum',
    pythFeed: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt',
    chain: 'solana'
  },

  // Bottle Chain tokens
  { 
    symbol: 'BTL',
    coingeckoId: 'bottle-chain',
    chain: 'bottle-chain'
  }
];

class MultiChainPriceFeed {
  private prices: Map<string, PriceData>;
  private updateCallbacks: ((symbol: string, price: PriceData) => void)[];
  private tokenConfigs: Map<string, TokenConfig>;

  constructor() {
    this.prices = new Map();
    this.updateCallbacks = [];
    this.tokenConfigs = new Map(
      TOKEN_CONFIGS.map(config => [config.symbol, config])
    );
  }

  async startPriceFeeds() {
    // Update prices every 10 seconds
    setInterval(async () => {
      for (const config of TOKEN_CONFIGS) {
        await this.updatePrice(config);
      }
    }, 10000);

    // Initial price fetch
    for (const config of TOKEN_CONFIGS) {
      await this.updatePrice(config);
    }
  }

  private async updatePrice(tokenConfig: TokenConfig) {
    try {
      let priceData: PriceData;

      if (tokenConfig.pythFeed && tokenConfig.chain === 'solana') {
        priceData = await this.getPythPrice(tokenConfig);
      } else if (tokenConfig.chainlinkFeed && ['ethereum', 'binance'].includes(tokenConfig.chain)) {
        priceData = await this.getChainlinkPrice(tokenConfig);
      } else if (tokenConfig.coingeckoId) {
        priceData = await this.getCoingeckoPrice(tokenConfig);
      } else {
        // Mock price for BTL or other tokens without external feeds
        priceData = this.getMockPrice(tokenConfig);
      }

      this.prices.set(tokenConfig.symbol, priceData);
      this.notifyPriceUpdate(tokenConfig.symbol, priceData);
    } catch (error) {
      console.error(`Error updating price for ${tokenConfig.symbol}:`, error);
    }
  }

  private async getPythPrice(tokenConfig: TokenConfig): Promise<PriceData> {
    // In a real implementation, this would connect to Pyth Network
    return {
      price: 0,
      change24h: 0,
      volume24h: 0,
      marketCap: 0,
      lastUpdated: Date.now()
    };
  }

  private async getChainlinkPrice(tokenConfig: TokenConfig): Promise<PriceData> {
    // In a real implementation, this would use Chainlink price feeds
    return {
      price: 0,
      change24h: 0,
      volume24h: 0,
      marketCap: 0,
      lastUpdated: Date.now()
    };
  }

  private async getCoingeckoPrice(tokenConfig: TokenConfig): Promise<PriceData> {
    // In a real implementation, this would fetch from CoinGecko API
    return {
      price: 0,
      change24h: 0,
      volume24h: 0,
      marketCap: 0,
      lastUpdated: Date.now()
    };
  }

  private getMockPrice(tokenConfig: TokenConfig): PriceData {
    const basePrice = {
      'BTL': 45.67,
      'ETH': 3000.00,
      'BNB': 300.00,
      'SOL': 100.00,
      'USDT': 1.00,
      'USDC': 1.00,
      'BUSD': 1.00,
      'CAKE': 2.50,
      'RAY': 1.20,
      'SRM': 0.80
    }[tokenConfig.symbol] || 1.00;

    return {
      price: basePrice * (1 + (Math.random() - 0.5) * 0.01),
      change24h: (Math.random() - 0.5) * 10,
      volume24h: Math.random() * 1000000,
      marketCap: basePrice * 1000000,
      lastUpdated: Date.now()
    };
  }

  subscribeToUpdates(callback: (symbol: string, price: PriceData) => void) {
    this.updateCallbacks.push(callback);
    return () => {
      this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback);
    };
  }

  private notifyPriceUpdate(symbol: string, price: PriceData) {
    this.updateCallbacks.forEach(callback => callback(symbol, price));
  }

  getPrice(symbol: string): PriceData | null {
    return this.prices.get(symbol) || null;
  }

  getAllPrices(): Map<string, PriceData> {
    return new Map(this.prices);
  }

  getTokensForChain(chain: string): string[] {
    return TOKEN_CONFIGS
      .filter(config => config.chain === chain)
      .map(config => config.symbol);
  }

  getSupportedTokens(): string[] {
    return Array.from(this.tokenConfigs.keys());
  }

  getTokenConfig(symbol: string): TokenConfig | undefined {
    return this.tokenConfigs.get(symbol);
  }
}

export default new MultiChainPriceFeed();
