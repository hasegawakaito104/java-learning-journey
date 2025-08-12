import React, { useState, useEffect } from 'react';
import api, { Account, Transaction } from '../services/api';
import BalanceChart from './BalanceChart';
import LoanCalculator from './LoanCalculator';

interface DashboardProps {
  account: Account;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ account: initialAccount, onLogout }) => {
  const [account, setAccount] = useState(initialAccount);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'balance' | 'deposit' | 'withdraw' | 'transfer' | 'history' | 'chart' | 'loan'>('balance');
  const [amount, setAmount] = useState('');
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadTransactionHistory();
  }, []);

  const loadTransactionHistory = async () => {
    try {
      const history = await api.getTransactionHistory(account.accountNumber);
      setTransactions(history);
    } catch (err) {
      console.error('取引履歴の取得に失敗しました', err);
    }
  };

  const refreshAccount = async () => {
    try {
      const updatedAccount = await api.getAccount(account.accountNumber);
      setAccount(updatedAccount);
    } catch (err) {
      console.error('口座情報の更新に失敗しました', err);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await api.deposit(account.accountNumber, parseFloat(amount));
      setMessage(`${amount}円を入金しました`);
      setAmount('');
      await refreshAccount();
      await loadTransactionHistory();
    } catch (err) {
      setError('入金に失敗しました');
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await api.withdraw(account.accountNumber, parseFloat(amount));
      setMessage(`${amount}円を出金しました`);
      setAmount('');
      await refreshAccount();
      await loadTransactionHistory();
    } catch (err: any) {
      setError(err.response?.data?.message || '出金に失敗しました（残高不足の可能性があります）');
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await api.transfer(account.accountNumber, toAccountNumber, parseFloat(amount));
      setMessage(`${toAccountNumber}へ${amount}円を振込みました`);
      setAmount('');
      setToAccountNumber('');
      await refreshAccount();
      await loadTransactionHistory();
    } catch (err: any) {
      setError(err.response?.data?.message || '振込に失敗しました');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>SimpleBank</h1>
        <button onClick={onLogout} style={styles.logoutButton}>
          ログアウト
        </button>
      </div>

      <div style={styles.accountInfo}>
        <h2>ようこそ {account.ownerName} 様</h2>
        <p>口座番号: {account.accountNumber}</p>
      </div>

      <div style={styles.tabs}>
        <button
          style={activeTab === 'balance' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('balance')}
        >
          残高照会
        </button>
        <button
          style={activeTab === 'deposit' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('deposit')}
        >
          入金
        </button>
        <button
          style={activeTab === 'withdraw' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('withdraw')}
        >
          出金
        </button>
        <button
          style={activeTab === 'transfer' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('transfer')}
        >
          振込
        </button>
        <button
          style={activeTab === 'history' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('history')}
        >
          取引履歴
        </button>
        <button
          style={activeTab === 'chart' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('chart')}
        >
          グラフ
        </button>
        <button
          style={activeTab === 'loan' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('loan')}
        >
          ローン
        </button>
      </div>

      <div style={styles.content}>
        {activeTab === 'balance' && (
          <div style={styles.balanceContainer}>
            <h2>現在の残高</h2>
            <div style={styles.balance}>{formatCurrency(account.balance)}</div>
          </div>
        )}

        {activeTab === 'deposit' && (
          <div style={styles.formContainer}>
            <h2>入金</h2>
            <form onSubmit={handleDeposit}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>入金額</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={styles.input}
                  placeholder="金額を入力"
                  min="1"
                  required
                />
              </div>
              <button type="submit" style={styles.submitButton}>
                入金する
              </button>
            </form>
          </div>
        )}

        {activeTab === 'withdraw' && (
          <div style={styles.formContainer}>
            <h2>出金</h2>
            <form onSubmit={handleWithdraw}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>出金額</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={styles.input}
                  placeholder="金額を入力"
                  min="1"
                  required
                />
              </div>
              <button type="submit" style={styles.submitButton}>
                出金する
              </button>
            </form>
          </div>
        )}

        {activeTab === 'transfer' && (
          <div style={styles.formContainer}>
            <h2>振込</h2>
            <form onSubmit={handleTransfer}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>振込先口座番号</label>
                <input
                  type="text"
                  value={toAccountNumber}
                  onChange={(e) => setToAccountNumber(e.target.value)}
                  style={styles.input}
                  placeholder="例: 0987654321"
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>振込金額</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={styles.input}
                  placeholder="金額を入力"
                  min="1"
                  required
                />
              </div>
              <button type="submit" style={styles.submitButton}>
                振込する
              </button>
            </form>
            <div style={styles.hint}>
              <p>振込先口座番号の例：</p>
              <p>0987654321（佐藤花子）</p>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div style={styles.historyContainer}>
            <h2>取引履歴</h2>
            {transactions.length === 0 ? (
              <p>取引履歴がありません</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>日時</th>
                    <th style={styles.th}>種別</th>
                    <th style={styles.th}>金額</th>
                    <th style={styles.th}>残高</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td style={styles.td}>{formatDate(tx.createdAt)}</td>
                      <td style={styles.td}>
                        {tx.type === 'DEPOSIT' ? '入金' : '出金'}
                      </td>
                      <td style={styles.td}>{formatCurrency(tx.amount)}</td>
                      <td style={styles.td}>{formatCurrency(tx.balanceAfter)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'chart' && (
          <div>
            <h2>残高推移グラフ</h2>
            {transactions.length > 0 ? (
              <BalanceChart transactions={transactions} />
            ) : (
              <p>グラフを表示するには取引履歴が必要です</p>
            )}
          </div>
        )}

        {activeTab === 'loan' && (
          <div>
            <LoanCalculator />
          </div>
        )}

        {message && <div style={styles.success}>{message}</div>}
        {error && <div style={styles.error}>{error}</div>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
  },
  logoutButton: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid white',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  accountInfo: {
    backgroundColor: 'white',
    padding: '20px',
    margin: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  tabs: {
    display: 'flex',
    margin: '0 20px',
    gap: '10px',
  },
  tab: {
    flex: 1,
    padding: '15px',
    backgroundColor: 'white',
    border: 'none',
    borderRadius: '10px 10px 0 0',
    cursor: 'pointer',
    fontSize: '16px',
  },
  activeTab: {
    flex: 1,
    padding: '15px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '10px 10px 0 0',
    cursor: 'pointer',
    fontSize: '16px',
  },
  content: {
    backgroundColor: 'white',
    margin: '0 20px 20px',
    padding: '30px',
    borderRadius: '0 10px 10px 10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    minHeight: '300px',
  },
  balanceContainer: {
    textAlign: 'center' as const,
  },
  balance: {
    fontSize: '48px',
    color: '#4CAF50',
    fontWeight: 'bold',
    margin: '30px 0',
  },
  formContainer: {
    maxWidth: '400px',
    margin: '0 auto',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#666',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    boxSizing: 'border-box' as const,
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  historyContainer: {
    overflow: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginTop: '20px',
  },
  th: {
    backgroundColor: '#f5f5f5',
    padding: '10px',
    textAlign: 'left' as const,
    borderBottom: '2px solid #ddd',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
  success: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '15px',
    borderRadius: '5px',
    marginTop: '20px',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '15px',
    borderRadius: '5px',
    marginTop: '20px',
  },
  hint: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
    fontSize: '12px',
    color: '#666',
  },
};

export default Dashboard;