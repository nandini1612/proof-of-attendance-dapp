// Event-related types
export interface Event {
  organizer: string;
  name: string;
  attendanceCount: number;
  createdAt: number;
}

export interface EventDetails {
  name: string;
  attendanceCount: number;
  createdAt: number;
}

// Wallet-related types
export interface WalletInfo {
  name: string;
  address: string;
  publicKey?: string;
}

// Transaction-related types
export interface TransactionPayload {
  function: string;
  type_arguments: string[];
  arguments: any[];
}

export interface TransactionResponse {
  hash: string;
  sender: string;
  sequence_number: string;
  max_gas_amount: string;
  gas_unit_price: string;
  gas_used: string;
  success: boolean;
}

// Component props types
export interface EventCreationProps {
  onEventCreated: () => void;
}

export interface EventsListProps {
  events: Event[];
  userAttendance: string[];
  onRefresh: () => void;
  loading: boolean;
}

export interface AttendanceHistoryProps {
  events: Event[];
  userAddress: string;
}

// API response types
export interface ViewFunctionResponse {
  result: any[];
}

export interface AccountResource {
  type: string;
  data: any;
}

export interface LedgerInfo {
  chain_id: number;
  epoch: string;
  ledger_version: string;
  oldest_ledger_version: string;
  ledger_timestamp: string;
  node_role: string;
  oldest_block_height: string;
  block_height: string;
}

// Error types
export interface AptosError {
  message: string;
  error_code?: string;
  vm_error_code?: number;
}

// Smart contract error codes
export enum ContractErrorCodes {
  EVENT_NOT_FOUND = 1,
  ALREADY_ATTENDED = 2,
  INVALID_EVENT_NAME = 3,
}

// Network types
export enum SupportedNetworks {
  DEVNET = 'devnet',
  TESTNET = 'testnet',
  MAINNET = 'mainnet',
}

// UI state types
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ToastState {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

// Form types
export interface EventFormData {
  name: string;
}

export interface EventFormErrors {
  name?: string;
  general?: string;
}

// Utility types
export type Address = string;
export type TransactionHash = string;
export type Timestamp = number;

// Re-export commonly used types from Aptos SDK
export type { InputSubmitTransactionData } from '@aptos-labs/ts-sdk';
