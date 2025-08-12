import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Transaction {
  id: number;
  type: string;
  amount: number;
  balanceAfter: number;
  createdAt: string;
  description?: string;
}

interface BalanceChartProps {
  transactions: Transaction[];
}

const BalanceChart: React.FC<BalanceChartProps> = ({ transactions }) => {
  // 最新10件の取引を取得（古い順に並べ替え）
  const recentTransactions = [...transactions].reverse().slice(-10);
  
  const labels = recentTransactions.map(tx => {
    const date = new Date(tx.createdAt);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  });
  
  const data = {
    labels,
    datasets: [
      {
        label: '残高推移',
        data: recentTransactions.map(tx => tx.balanceAfter),
        borderColor: 'rgb(76, 175, 80)',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '残高推移グラフ（最新10件）'
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `残高: ¥${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value: any) {
            return '¥' + value.toLocaleString();
          }
        }
      }
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '10px', marginTop: '20px' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default BalanceChart;