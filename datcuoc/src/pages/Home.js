import { useNavigate } from 'react-router-dom';
import {
  START_SCORE,
  MIN_BET,
  MAX_BET,
  TIME_PER_QUESTION,
  formatScore,
} from '../data';

const Home = ({ playerName, setPlayerName }) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim() === '') return;
    navigate('/play');
  };

  return (
    <div>
      <h2>Đặt cược kiến thức</h2>

      <h3>Luật chơi</h3>
      <ul>
        <li>Bạn bắt đầu với {formatScore(START_SCORE)} và đi qua 12 câu hỏi.</li>
        <li>
          Trước mỗi câu, bạn chỉ biết chủ đề và mức độ, rồi đặt cược từ {MIN_BET} đến{' '}
          {MAX_BET} điểm (bội số của 100).
        </li>
        <li>Sau khi đặt cược, câu hỏi hiện ra và bạn có {TIME_PER_QUESTION} giây để trả lời.</li>
        <li>Đúng: được thưởng mức cược nhân hệ số của mức độ.</li>
        <li>Sai hoặc hết giờ: mất đúng số điểm đã cược.</li>
        <li>Còn dưới {MIN_BET} điểm là cháy túi, lượt chơi kết thúc.</li>
      </ul>

      <form onSubmit={handleSubmit}>
        <label>
          Tên người chơi:{' '}
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Nhập tên của bạn"
          />
        </label>{' '}
        <button type="submit" disabled={playerName.trim() === ''}>
          Vào chơi
        </button>
      </form>
    </div>
  );
};

export default Home;
