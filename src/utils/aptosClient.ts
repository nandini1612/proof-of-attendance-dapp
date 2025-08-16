import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

// Initialize Aptos client for Devnet
const aptosConfig = new AptosConfig({ network: Network.DEVNET });
const aptos = new Aptos(aptosConfig);

// Replace with your deployed module address
const MODULE_ADDRESS = "0x123"; // Update this with your actual deployed address

export interface EventDetails {
  name: string;
  attendanceCount: number;
  createdAt: number;
}

class AptosClient {
  public readonly MODULE_ADDRESS = MODULE_ADDRESS;
  private aptos: Aptos;

  constructor() {
    this.aptos = aptos;
  }

  /**
   * Wait for transaction to be confirmed
   */
  async waitForTransaction(txHash: string): Promise<any> {
    try {
      const response = await this.aptos.waitForTransaction({
        transactionHash: txHash,
        options: {
          timeoutSecs: 30,
          checkSuccess: true,
        },
      });
      return response;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }

  /**
   * Get all events from the registry
   */
  async getEvents(): Promise<string[]> {
    try {
      const result = await this.aptos.view({
        payload: {
          function: `${MODULE_ADDRESS}::ProofOfAttendance::get_all_events`,
          typeArguments: [],
          functionArguments: [],
        },
      });
      
      return (result[0] as string[]) || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  /**
   * Get event details for a specific organizer
   */
  async getEventDetails(organizerAddress: string): Promise<EventDetails | null> {
    try {
      const result = await this.aptos.view({
        payload: {
          function: `${MODULE_ADDRESS}::ProofOfAttendance::get_event`,
          typeArguments: [],
          functionArguments: [organizerAddress],
        },
      });

      if (result && result.length >= 3) {
        return {
          name: result[0] as string,
          attendanceCount: Number(result[1]),
          createdAt: Number(result[2]),
        };
      }
      return null;
    } catch (error) {
      console.error(`Error fetching event details for ${organizerAddress}:`, error);
      return null;
    }
  }

  /**
   * Check if a user has attended a specific event
   */
  async hasAttended(userAddress: string, organizerAddress: string): Promise<boolean> {
    try {
      const result = await this.aptos.view({
        payload: {
          function: `${MODULE_ADDRESS}::ProofOfAttendance::has_attended`,
          typeArguments: [],
          functionArguments: [userAddress, organizerAddress],
        },
      });

      return result[0] as boolean;
    } catch (error) {
      console.error(`Error checking attendance for ${userAddress} at ${organizerAddress}:`, error);
      return false;
    }
  }

  /**
   * Get account resources for debugging
   */
  async getAccountResources(address: string): Promise<any[]> {
    try {
      const resources = await this.aptos.getAccountResources({
        accountAddress: address,
      });
      return resources;
    } catch (error) {
      console.error(`Error fetching resources for ${address}:`, error);
      return [];
    }
  }

  /**
   * Get account balance
   */
  async getAccountBalance(address: string): Promise<number> {
    try {
      const balance = await this.aptos.getAccountAPTAmount({
        accountAddress: address,
      });
      return balance;
    } catch (error) {
      console.error(`Error fetching balance for ${address}:`, error);
      return 0;
    }
  }

  /**
   * Check if account exists
   */
  async accountExists(address: string): Promise<boolean> {
    try {
      await this.aptos.getAccountInfo({
        accountAddress: address,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Fund account with APT (for Devnet only)
   */
  async fundAccount(address: string): Promise<boolean> {
    try {
      await this.aptos.fundAccount({
        accountAddress: address,
        amount: 100_000_000, // 1 APT
      });
      return true;
    } catch (error) {
      console.error(`Error funding account ${address}:`, error);
      return false;
    }
  }

  /**
   * Get transaction history for an account
   */
  async getAccountTransactions(address: string, limit: number = 10): Promise<any[]> {
    try {
      const transactions = await this.aptos.getAccountTransactions({
        accountAddress: address,
        options: {
          limit,
        },
      });
      return transactions;
    } catch (error) {
      console.error(`Error fetching transactions for ${address}:`, error);
      return [];
    }
  }

  /**
   * Get the current network info
   */
  async getNetworkInfo(): Promise<any> {
    try {
      const chainId = await this.aptos.getChainId();
      const ledgerInfo = await this.aptos.getLedgerInfo();
      return {
        chainId,
        ledgerInfo,
      };
    } catch (error) {
      console.error('Error fetching network info:', error);
      return null;
    }
  }
}

// Export singleton instance
export const aptosClient = new AptosClient();
