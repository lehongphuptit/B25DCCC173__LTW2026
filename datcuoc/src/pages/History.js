import { useState } from 'react';
import { MIN_BET, formatScore } from '../data';

const History = ({ history, clearHistory }) => {
  const [player, setPlayer] = useState(''); // '' = Tất cả

  // Tên người chơi không trùng lặp
  const names = [...new Set(history.map((h) => h.name))];

  const filtered = player === '' ? history : history.filter((h) => h.name === player);
  // Sắp xếp trên bản sao, điểm giảm dần
  const shown = [...filtered].sort((a, b) => b.finalScore - a.finalScore);

  const highest = shown.reduce((max, h) => Math.max(max, h.finalScore), 0);
  const broke = shown.filter((h) => h.finalScore < MIN_BET).length;

  const handleClear = () => {
    clearHistory();
    setPlayer('');
  };

  if (history.length === 0) {
    return (
      <div>
        <h2>Lịch sử</h2>
        <p>Chưa có lượt chơi nào.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Lịch sử</h2>

      <div className="filters">
        <label>
          Người chơi:{' '}
          <select value={player} onChange={(e) => setPlayer(e.target.value)}>
            <option value="">Tất cả</option>
            {names.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <button onClick={handleClear}>Xóa lịch sử</button>
      </div>

      <p>Số lượt chơi: {shown.length}</p>
      <p>Điểm cao nhất: {formatScore(highest)}</p>
      <p>Số lần cháy túi: {broke}</p>

      <table>
        <thead>
          <tr>
            <th>Người chơi</th>
            <th>Số câu đúng</th>
            <th>Điểm cuối</th>
            <th>Đánh giá</th>
            <th>Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {shown.map((h) => (
            <tr key={h.id}>
              <td>{h.name}</td>
              <td>{`${h.correctCount}/${h.played}`}</td>
              <td>{formatScore(h.finalScore)}</td>
              <td>{h.result}</td>
              <td>{h.playedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
