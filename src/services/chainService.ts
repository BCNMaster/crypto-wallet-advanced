// src/services/chainService.ts

import { ethers } from 'ethers';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';

class ChainService {
  private evmProviders: Map<string, ethers.providers.JsonRpcProvider>;
  private solanaConnection: Connection;

  constructor() {
    this.evmProviders = new Map();
    this.solanaConnection = new Connection('https://api.mainnet-beta.solana.com');
  }

  // Initialize providers for different chains
  async initProviders(networks) {
    networks.forEach(network => {
      if (network.type === 'evm') {
        this.evmProviders.set(
          network.id,
          new ethers.providers.JsonRpcProvider(network.rpcUrl)
        );
      }
    });
  }

  // Get balance for any supported chain
  async getBalance(chainId: string, address: string, tokenAddress?: string) {
    try {
      if (this.evmProviders.has(chainId)) {
        return await this.getEvmBalance(chainId, address, tokenAddress);
      } else if (chainId === 'solana') {
        return await this.getSolanaBalance(address, tokenAddress);
      }
    } catch (error) {
      console.error(`Error getting balance for ${chainId}:`, error);
      throw error;
    }
  }

  // Get EVM chain balance (ETH, BNB, or ERC20 tokens)
  private async getEvmBalance(chainId: string, address: string, tokenAddress?: string) {
    const provider = this.evmProviders.get(chainId);
    if (!provider) throw new Error(`No provider for chain ${chainId}`);

    if (!tokenAddress || tokenAddress === 'native') {
      const balance = await provider.getBalance(address);
      return ethers.utils.formatEther(balance);
    } else {
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ['function balanceOf(address) view returns (uint256)'],
        provider
      );
      const balance = await tokenContract.balanceOf(address);
      return ethers.utils.formatUnits(balance, 18); // Adjust decimals as needed
    }
  }

  // Get Solana balance (SOL or SPL tokens)
  private async getSolanaBalance(address: string, tokenAddress?: string) {
    const pubKey = new PublicKey(address);

    if (!tokenAddress || tokenAddress === 'native') {
      const balance = await this.solanaConnection.getBalance(pubKey);
      return balance / 1e9; // Convert lamports to SOL
    } else {
      const tokenPubKey = new PublicKey(tokenAddress);
      const token = new Token(
        this.solanaConnection,
        tokenPubKey,
        TOKEN_PROGRAM_ID,
        null as any // wallet not needed for reading
      );

      const tokenAccount = await token.getOrCreateAssociatedAccountInfo(pubKey);
      const balance = (await token.getAccountInfo(tokenAccount.address)).amount;
      return balance.toNumber() / Math.pow(10, token.decimals);
    }
  }

  // Send transaction on EVM chains
  async sendEvmTransaction(chainId: string, transaction: any) {
    const provider = this.evmProviders.get(chainId);
    if (!provider) throw new Error(`No provider for chain ${chainId}`);

    try {
      const tx = await provider.sendTransaction(transaction);
      return await tx.wait();
    } catch (error) {
      console.error('Error sending EVM transaction:', error);
      throw error;
    }
  }

  // Send transaction on Solana
  async sendSolanaTransaction(transaction: Transaction) {
    try {
      const signature = await this.solanaConnection.sendTransaction(transaction);
      return await this.solanaConnection.confirmTransaction(signature);
    } catch (error) {
      console.error('Error sending Solana transaction:', error);
      throw error;
    }
  }

  // Get token info for any chain
  async getTokenInfo(chainId: string, tokenAddress: string) {
    try {
      if (this.evmProviders.has(chainId)) {
        return await this.getEvmTokenInfo(chainId, tokenAddress);
      } else if (chainId === 'solana') {
        return await this.getSolanaTokenInfo(tokenAddress);
      }
    } catch (error) {
      console.error(`Error getting token info for ${chainId}:`, error);
      throw error;
    }
  }

  // Get ERC20 token info
  private async getEvmTokenInfo(chainId: string, tokenAddress: string) {
    const provider = this.evmProviders.get(chainId);
    if (!provider) throw new Error(`No provider for chain ${chainId}`);

    const tokenContract = new ethers.Contract(
      tokenAddress,
      [
        'function name() view returns (string)',
        'function symbol() view returns (string)',
        'function decimals() view returns (uint8)',
        'function totalSupply() view returns (uint256)'
      ],
      provider
    );

    const [name, symbol, decimals, totalSupply] = await Promise.all([
      tokenContract.name(),
      tokenContract.symbol(),
      tokenContract.decimals(),
      tokenContract.totalSupply()
    ]);

    return { name, symbol, decimals, totalSupply };
  }

  // Get SPL token info
  private async getSolanaTokenInfo(tokenAddress: string) {
    const tokenPubKey = new PublicKey(tokenAddress);
    const token = new Token(
      this.solanaConnection,
      tokenPubKey,
      TOKEN_PROGRAM_ID,
      null as any
    );

    const { supply, decimals } = await token.getMintInfo();
    
    return {
      address: tokenAddress,
      decimals,
      totalSupply: supply.toString()
    };
  }

  // Get transaction history for any chain
  async getTransactionHistory(chainId: string, address: string) {
    try {
      if (this.evmProviders.has(chainId)) {
        return await this.getEvmTransactionHistory(chainId, address);
      } else if (chainId === 'solana') {
        return await this.getSolanaTransactionHistory(address);
      }
    } catch (error) {
      console.error(`Error getting transaction history for ${chainId}:`, error);
      throw error;
    }
  }

  // Get EVM transaction history
  private async getEvmTransactionHistory(chainId: string, address: string) {
    const provider = this.evmProviders.get(chainId);
    if (!provider) throw new Error(`No provider for chain ${chainId}`);

    const history = await provider.getHistory(address);
    return history.map(tx => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: ethers.utils.formatEther(tx.value),
      timestamp: tx.timestamp,
      status: tx.confirmations > 0 ? 'confirmed' : 'pending'
    }));
  }

  // Get Solana transaction history
  private async getSolanaTransactionHistory(address: string) {
    const pubKey = new PublicKey(address);
    const signatures = await this.solanaConnection.getConfirmedSignaturesForAddress2(pubKey);
    
    const transactions = await Promise.all(
      signatures.map(async (sig) => {
        const tx = await this.solanaConnection.getConfirmedTransaction(sig.signature);
        return {
          hash: sig.signature,
          timestamp: sig.blockTime,
          status: 'confirmed',
          ...tx
        };
      })
    );

    return transactions;
  }
}

export default new ChainService();
