import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { Account } from './services/api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);

  const handleLogin = (account: Account) => {
    setAccount(account);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setAccount(null);
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        account && <Dashboard account={account} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
