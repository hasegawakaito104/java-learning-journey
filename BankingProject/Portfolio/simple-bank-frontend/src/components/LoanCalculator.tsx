import React, { useState } from 'react';

interface LoanCalculation {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
}

const LoanCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<string>('1000000');
  const [interestRate, setInterestRate] = useState<string>('3.5');
  const [loanTerm, setLoanTerm] = useState<string>('12');
  const [calculation, setCalculation] = useState<LoanCalculation | null>(null);
  const [loanType, setLoanType] = useState<'housing' | 'car' | 'education' | 'personal'>('housing');

  const loanTypes = {
    housing: { name: '住宅ローン', defaultRate: 1.5, maxAmount: 50000000, maxTerm: 420 },
    car: { name: '自動車ローン', defaultRate: 3.5, maxAmount: 5000000, maxTerm: 84 },
    education: { name: '教育ローン', defaultRate: 2.8, maxAmount: 3000000, maxTerm: 180 },
    personal: { name: 'フリーローン', defaultRate: 5.0, maxAmount: 3000000, maxTerm: 60 }
  };

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const months = parseInt(loanTerm);

    // 月々の返済額を計算（元利均等返済）
    const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                          (Math.pow(1 + monthlyRate, months) - 1);

    let balance = principal;
    const schedule = [];

    for (let month = 1; month <= Math.min(months, 12); month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;

      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance)
      });
    }

    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - principal;

    setCalculation({
      monthlyPayment,
      totalPayment,
      totalInterest,
      schedule
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount);
  };

  return (
    <div style={styles.container}>
      <div style={styles.calculatorSection}>
        <h3 style={styles.sectionTitle}>ローンシミュレーター</h3>
        
        <div style={styles.loanTypeSelector}>
          {Object.entries(loanTypes).map(([key, type]) => (
            <button
              key={key}
              style={loanType === key ? styles.activeTypeButton : styles.typeButton}
              onClick={() => {
                setLoanType(key as any);
                setInterestRate(type.defaultRate.toString());
              }}
            >
              {type.name}
            </button>
          ))}
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>
            借入希望額
            <span style={styles.hint}>（最大: {formatCurrency(loanTypes[loanType].maxAmount)}）</span>
          </label>
          <div style={styles.inputWrapper}>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              style={styles.input}
              max={loanTypes[loanType].maxAmount}
            />
            <span style={styles.unit}>円</span>
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>
            金利（年利）
            <span style={styles.hint}>（推奨: {loanTypes[loanType].defaultRate}%）</span>
          </label>
          <div style={styles.inputWrapper}>
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              style={styles.input}
            />
            <span style={styles.unit}>%</span>
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>
            返済期間
            <span style={styles.hint}>（最大: {loanTypes[loanType].maxTerm}ヶ月）</span>
          </label>
          <div style={styles.inputWrapper}>
            <input
              type="number"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              style={styles.input}
              max={loanTypes[loanType].maxTerm}
            />
            <span style={styles.unit}>ヶ月</span>
          </div>
        </div>

        <button onClick={calculateLoan} style={styles.calculateButton}>
          シミュレーション実行
        </button>
      </div>

      {calculation && (
        <div style={styles.resultSection}>
          <h3 style={styles.sectionTitle}>シミュレーション結果</h3>
          
          <div style={styles.summaryCards}>
            <div style={styles.summaryCard}>
              <div style={styles.cardLabel}>月々の返済額</div>
              <div style={styles.cardValue}>{formatCurrency(calculation.monthlyPayment)}</div>
            </div>
            <div style={styles.summaryCard}>
              <div style={styles.cardLabel}>返済総額</div>
              <div style={styles.cardValue}>{formatCurrency(calculation.totalPayment)}</div>
            </div>
            <div style={styles.summaryCard}>
              <div style={styles.cardLabel}>利息総額</div>
              <div style={styles.cardValue}>{formatCurrency(calculation.totalInterest)}</div>
            </div>
          </div>

          <div style={styles.scheduleSection}>
            <h4 style={styles.scheduleTitle}>返済スケジュール（最初の12ヶ月）</h4>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>月</th>
                  <th style={styles.th}>返済額</th>
                  <th style={styles.th}>元金</th>
                  <th style={styles.th}>利息</th>
                  <th style={styles.th}>残高</th>
                </tr>
              </thead>
              <tbody>
                {calculation.schedule.map((row) => (
                  <tr key={row.month}>
                    <td style={styles.td}>{row.month}ヶ月目</td>
                    <td style={styles.td}>{formatCurrency(row.payment)}</td>
                    <td style={styles.td}>{formatCurrency(row.principal)}</td>
                    <td style={styles.td}>{formatCurrency(row.interest)}</td>
                    <td style={styles.td}>{formatCurrency(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.applySection}>
            <h4>このローンに申し込みますか？</h4>
            <p style={styles.disclaimer}>
              ※これはシミュレーションです。実際の審査結果とは異なる場合があります。
            </p>
            <button style={styles.applyButton}>
              仮審査を申し込む
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    padding: '20px',
  },
  calculatorSection: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  resultSection: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  loanTypeSelector: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  typeButton: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  activeTypeButton: {
    flex: 1,
    padding: '10px',
    border: '1px solid #4CAF50',
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
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
  hint: {
    fontSize: '12px',
    color: '#999',
    fontWeight: 'normal',
    marginLeft: '10px',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
  },
  unit: {
    marginLeft: '10px',
    color: '#666',
  },
  calculateButton: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  summaryCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '15px',
    marginBottom: '30px',
  },
  summaryCard: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center' as const,
  },
  cardLabel: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '10px',
  },
  cardValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  scheduleSection: {
    marginTop: '30px',
  },
  scheduleTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#333',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  th: {
    backgroundColor: '#f5f5f5',
    padding: '10px',
    textAlign: 'left' as const,
    borderBottom: '2px solid #ddd',
    fontSize: '14px',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #eee',
    fontSize: '14px',
  },
  applySection: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#f0f8ff',
    borderRadius: '10px',
    textAlign: 'center' as const,
  },
  disclaimer: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '15px',
  },
  applyButton: {
    padding: '12px 30px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default LoanCalculator;