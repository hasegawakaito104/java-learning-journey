import React, { useState } from 'react';
import api from '../services/api';

interface AccountCreationProps {
  onAccountCreated: () => void;
}

const AccountCreation: React.FC<AccountCreationProps> = ({ onAccountCreated }) => {
  const [formData, setFormData] = useState({
    accountNumber: '',
    ownerName: '',
    password: '',
    confirmPassword: '',
    phone: '',
    email: '',
    address: '',
    occupation: '',
    initialDeposit: '1000'
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const generateAccountNumber = () => {
    const accountNumber = Math.random().toString().substr(2, 10);
    setFormData({ ...formData, accountNumber });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateStep1 = () => {
    if (!formData.ownerName || !formData.phone || !formData.email) {
      setError('必須項目を入力してください');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('有効なメールアドレスを入力してください');
      return false;
    }
    if (!/^\d{11}$/.test(formData.phone.replace(/-/g, ''))) {
      setError('有効な電話番号を入力してください');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password || !formData.confirmPassword) {
      setError('パスワードを入力してください');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません');
      return false;
    }
    if (formData.password.length < 8) {
      setError('パスワードは8文字以上で入力してください');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (currentStep === 1 && validateStep1()) {
      generateAccountNumber();
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      await api.createAccount(formData.accountNumber, formData.ownerName, formData.password);
      
      if (parseFloat(formData.initialDeposit) > 0) {
        await api.deposit(formData.accountNumber, parseFloat(formData.initialDeposit));
      }
      
      setSuccess(true);
      setTimeout(() => {
        onAccountCreated();
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || '口座開設に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={styles.successContainer}>
        <div style={styles.successIcon}>✓</div>
        <h2>口座開設完了！</h2>
        <p>おめでとうございます！新しい口座が正常に開設されました。</p>
        <div style={styles.accountInfo}>
          <p><strong>口座番号:</strong> {formData.accountNumber}</p>
          <p><strong>名義:</strong> {formData.ownerName}</p>
          <p><strong>初回入金:</strong> ¥{parseInt(formData.initialDeposit).toLocaleString()}</p>
        </div>
        <p style={styles.redirectMessage}>
          3秒後にログイン画面に戻ります...
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>新規口座開設</h1>
        <div style={styles.progressBar}>
          <div style={styles.step}>
            <div style={currentStep >= 1 ? styles.activeStepCircle : styles.stepCircle}>1</div>
            <span>個人情報</span>
          </div>
          <div style={styles.stepConnector}></div>
          <div style={styles.step}>
            <div style={currentStep >= 2 ? styles.activeStepCircle : styles.stepCircle}>2</div>
            <span>認証設定</span>
          </div>
          <div style={styles.stepConnector}></div>
          <div style={styles.step}>
            <div style={currentStep >= 3 ? styles.activeStepCircle : styles.stepCircle}>3</div>
            <span>確認</span>
          </div>
        </div>
      </div>

      <div style={styles.form}>
        {currentStep === 1 && (
          <div style={styles.stepContent}>
            <h3>個人情報の入力</h3>
            <div style={styles.inputGroup}>
              <label style={styles.label}>氏名 *</label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                style={styles.input}
                placeholder="例: 山田太郎"
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>電話番号 *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={styles.input}
                placeholder="例: 090-1234-5678"
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>メールアドレス *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                placeholder="例: example@email.com"
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>住所</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                style={styles.input}
                placeholder="例: 東京都渋谷区..."
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>職業</label>
              <select
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="">選択してください</option>
                <option value="会社員">会社員</option>
                <option value="公務員">公務員</option>
                <option value="自営業">自営業</option>
                <option value="学生">学生</option>
                <option value="主婦・主夫">主婦・主夫</option>
                <option value="その他">その他</option>
              </select>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div style={styles.stepContent}>
            <h3>セキュリティ設定</h3>
            <div style={styles.accountNumberDisplay}>
              <label style={styles.label}>口座番号（自動生成）</label>
              <div style={styles.generatedNumber}>{formData.accountNumber}</div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>ログインパスワード *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                placeholder="8文字以上"
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>パスワード確認 *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={styles.input}
                placeholder="上記と同じパスワード"
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>初回入金額</label>
              <div style={styles.inputWrapper}>
                <input
                  type="number"
                  name="initialDeposit"
                  value={formData.initialDeposit}
                  onChange={handleChange}
                  style={styles.input}
                  min="0"
                />
                <span style={styles.unit}>円</span>
              </div>
              <small style={styles.hint}>※口座開設後に入金することも可能です</small>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div style={styles.stepContent}>
            <h3>入力内容の確認</h3>
            <div style={styles.confirmationGrid}>
              <div style={styles.confirmItem}>
                <span style={styles.confirmLabel}>氏名:</span>
                <span style={styles.confirmValue}>{formData.ownerName}</span>
              </div>
              <div style={styles.confirmItem}>
                <span style={styles.confirmLabel}>電話番号:</span>
                <span style={styles.confirmValue}>{formData.phone}</span>
              </div>
              <div style={styles.confirmItem}>
                <span style={styles.confirmLabel}>メールアドレス:</span>
                <span style={styles.confirmValue}>{formData.email}</span>
              </div>
              <div style={styles.confirmItem}>
                <span style={styles.confirmLabel}>住所:</span>
                <span style={styles.confirmValue}>{formData.address || '未入力'}</span>
              </div>
              <div style={styles.confirmItem}>
                <span style={styles.confirmLabel}>職業:</span>
                <span style={styles.confirmValue}>{formData.occupation || '未入力'}</span>
              </div>
              <div style={styles.confirmItem}>
                <span style={styles.confirmLabel}>口座番号:</span>
                <span style={styles.confirmValue}>{formData.accountNumber}</span>
              </div>
              <div style={styles.confirmItem}>
                <span style={styles.confirmLabel}>初回入金額:</span>
                <span style={styles.confirmValue}>¥{parseInt(formData.initialDeposit).toLocaleString()}</span>
              </div>
            </div>

            <div style={styles.terms}>
              <h4>利用規約</h4>
              <div style={styles.termsContent}>
                <p>1. 本口座は個人のお客様向けの普通預金口座です。</p>
                <p>2. 初回ログイン後、必要に応じて追加の本人確認書類の提出をお願いする場合があります。</p>
                <p>3. 口座開設後30日以内にご利用がない場合、口座を閉鎖させていただく場合があります。</p>
                <p>4. その他の詳細な利用規約は、口座開設完了後にお送りする書類をご確認ください。</p>
              </div>
            </div>
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.buttonGroup}>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              style={styles.backButton}
            >
              戻る
            </button>
          )}
          
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              style={styles.nextButton}
            >
              次へ
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              style={styles.submitButton}
            >
              {loading ? '口座開設中...' : '口座を開設する'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '30px',
  },
  progressBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20px',
  },
  step: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    fontSize: '12px',
    color: '#666',
  },
  stepCircle: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    border: '2px solid #ddd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '5px',
    backgroundColor: 'white',
  },
  activeStepCircle: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    border: '2px solid #4CAF50',
    backgroundColor: '#4CAF50',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '5px',
  },
  stepConnector: {
    width: '50px',
    height: '2px',
    backgroundColor: '#ddd',
    margin: '0 10px',
  },
  form: {
    minHeight: '400px',
  },
  stepContent: {
    marginBottom: '30px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    boxSizing: 'border-box' as const,
  },
  select: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    boxSizing: 'border-box' as const,
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  unit: {
    marginLeft: '10px',
    color: '#666',
  },
  hint: {
    color: '#999',
    fontSize: '12px',
    marginTop: '5px',
  },
  accountNumberDisplay: {
    marginBottom: '20px',
  },
  generatedNumber: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#4CAF50',
    padding: '10px',
    backgroundColor: '#f0f8ff',
    borderRadius: '5px',
    textAlign: 'center' as const,
  },
  confirmationGrid: {
    display: 'grid',
    gap: '15px',
    marginBottom: '20px',
  },
  confirmItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
  },
  confirmLabel: {
    fontWeight: 'bold',
    color: '#555',
  },
  confirmValue: {
    color: '#333',
  },
  terms: {
    margin: '20px 0',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '5px',
  },
  termsContent: {
    fontSize: '12px',
    color: '#666',
    lineHeight: '1.5',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
  },
  backButton: {
    padding: '12px 24px',
    backgroundColor: 'white',
    color: '#666',
    border: '1px solid #ddd',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  nextButton: {
    padding: '12px 24px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '12px 24px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '15px',
  },
  successContainer: {
    textAlign: 'center' as const,
    padding: '50px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  successIcon: {
    fontSize: '60px',
    color: '#4CAF50',
    marginBottom: '20px',
  },
  accountInfo: {
    backgroundColor: '#f0f8ff',
    padding: '20px',
    borderRadius: '10px',
    margin: '20px 0',
  },
  redirectMessage: {
    color: '#666',
    fontSize: '14px',
  },
};

export default AccountCreation;