import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface Account {
  id: number;
  accountNumber: string;
  ownerName: string;
  balance: number;
}

export interface Transaction {
  id: number;
  type: string;
  amount: number;
  balanceAfter: number;
  createdAt: string;
}

export interface LoginResponse {
  success: boolean;
  account: Account | null;
}

class BankingAPI {
  async login(accountNumber: string, password: string): Promise<LoginResponse> {
    const response = await axios.post(`${API_BASE_URL}/account/login`, {
      accountNumber,
      password
    });
    return response.data;
  }

  async getAccount(accountNumber: string): Promise<Account> {
    const response = await axios.get(`${API_BASE_URL}/account/${accountNumber}`);
    return response.data;
  }

  async deposit(accountNumber: string, amount: number): Promise<Transaction> {
    const response = await axios.post(`${API_BASE_URL}/account/deposit`, {
      accountNumber,
      amount
    });
    return response.data;
  }

  async withdraw(accountNumber: string, amount: number): Promise<Transaction> {
    const response = await axios.post(`${API_BASE_URL}/account/withdraw`, {
      accountNumber,
      amount
    });
    return response.data;
  }

  async getTransactionHistory(accountNumber: string): Promise<Transaction[]> {
    const response = await axios.get(`${API_BASE_URL}/account/${accountNumber}/transactions`);
    return response.data;
  }

  async transfer(fromAccountNumber: string, toAccountNumber: string, amount: number): Promise<Transaction> {
    const response = await axios.post(`${API_BASE_URL}/account/transfer`, {
      fromAccountNumber,
      toAccountNumber,
      amount
    });
    return response.data;
  }

  async createAccount(accountNumber: string, ownerName: string, password: string): Promise<Account> {
    const response = await axios.post(`${API_BASE_URL}/account/create`, {
      accountNumber,
      ownerName,
      password
    });
    return response.data;
  }
}

export default new BankingAPI();