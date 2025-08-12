import React, { useState } from 'react';
import api, { Account } from '../services/api';
import AccountCreation from './AccountCreation';

interface LoginProps {
  onLogin: (account: Account) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showAccountCreation, setShowAccountCreation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.login(accountNumber, password);
      if (response.success && response.account) {
        onLogin(response.account);
      } else {
        setError('口座番号またはパスワードが正しくありません');
      }
    } catch (err) {
      setError('ログインに失敗しました');
    }
  };

  if (showAccountCreation) {
    return (
      <div style={styles.container}>
        <button 
          onClick={() => setShowAccountCreation(false)}
          style={styles.backToLoginButton}
        >
          ← ログインに戻る
        </button>
        <AccountCreation onAccountCreated={() => setShowAccountCreation(false)} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>SimpleBank ログイン</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>口座番号</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              style={styles.input}
              placeholder="例: 1234567890"
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="パスワードを入力"
              required
            />
          </div>
          {error && <div style={styles.error}>{error}</div>}
          <button type="submit" style={styles.button}>
            ログイン
          </button>
        </form>
        
        <div style={styles.separator}>または</div>
        
        <button 
          onClick={() => setShowAccountCreation(true)}
          style={styles.createAccountButton}
        >
          新規口座開設
        </button>
        
        <div style={styles.hint}>
          <p>テストアカウント:</p>
          <p>口座番号: 1234567890</p>
          <p>パスワード: password123</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '400px',
  },
  title: {
    textAlign: 'center' as const,
    color: '#333',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
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
  button: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginBottom: '10px',
  },
  hint: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
    fontSize: '12px',
    color: '#666',
  },
  separator: {
    textAlign: 'center' as const,
    margin: '20px 0',
    color: '#999',
    position: 'relative' as const,
  },
  createAccountButton: {
    width: '100%',
    backgroundColor: '#2196F3',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  backToLoginButton: {
    position: 'absolute' as const,
    top: '20px',
    left: '20px',
    backgroundColor: 'white',
    color: '#666',
    border: '1px solid #ddd',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Login;