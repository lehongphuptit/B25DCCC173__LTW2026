import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import BetPanel from '../components/BetPanel';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import ScoreInfo from '../components/ScoreInfo';
import { START_SCORE, MIN_BET, TIME_PER_QUESTION, formatScore } from '../data';
import { validateBet, calcChange } from '../utils';

const PlayGame = ({ questions, playerName }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(START_SCORE);
  const [rounds, setRounds] = useState([]);
  const [status, setStatus] = useState('betting'); // betting -> answering -> revealed
  const [betInput, setBetInput] = useState('100');
  const [bet, setBet] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  const question = questions[index];
  const total = questions.length;
  const betError = validateBet(Number(betInput), score);

  const handleBet = (e) => {
    e.preventDefault();
    if (betError !== '') return;
    setBet(Number(betInput));
    setSelected(null);
    setTimeLeft(TIME_PER_QUESTION);
    setStatus('answering');
  };

  // choice: vị trí đáp án đã chọn, hoặc null nếu hết giờ
  const handleAnswer = (choice) => {
    if (status !== 'answering') return;
    const correct = choice === question.answer;
    const change = calcChange(bet, question.level, correct);
    const scoreAfter = score + change;
    setScore(scoreAfter);
    setRounds([...rounds, { id: question.id, bet, correct, change, scoreAfter }]);
    setSelected(choice);
    setStatus('revealed');
  };

  // Đồng hồ: chỉ chạy khi đang trả lời
  useEffect(() => {
    if (status !== 'answering') return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  // Hết giờ -> tính như trả lời sai
  useEffect(() => {
    if (status === 'answering' && timeLeft <= 0) handleAnswer(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, status]);

  // Chờ 2 giây rồi sang câu tiếp theo hoặc kết thúc
  useEffect(() => {
    if (status !== 'revealed') return;
    const id = setTimeout(() => {
      if (score < MIN_BET || index + 1 >= total) {
        navigate('/result', {
          replace: true,
          state: {
            name: playerName.trim(),
            rounds,
            finalScore: score,
            correctCount: rounds.filter((r) => r.correct).length,
            reason: score < MIN_BET ? 'broke' : 'done',
          },
        });
      } else {
        setIndex(index + 1);
        setBetInput('100');
        setStatus('betting');
      }
    }, 2000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (!question) return null;

  const last = rounds[rounds.length - 1];

  return (
    <div>
      {status === 'betting' ? (
        <BetPanel
          question={question}
          number={index + 1}
          total={total}
          score={score}
          betInput={betInput}
          onBetChange={setBetInput}
          error={betError}
          onSubmit={handleBet}
        />
      ) : (
        <div>
          <QuestionCard
            question={question}
            number={index + 1}
            total={total}
            selected={selected}
            revealed={status === 'revealed'}
            onSelect={handleAnswer}
          />
          <Timer timeLeft={timeLeft} />
          <ScoreInfo score={score} bet={bet} />
          {status === 'revealed' && last && (
            <p className={last.correct ? 'change change--up' : 'change change--down'}>
              {selected === null && 'Hết giờ! '}
              {last.change > 0
                ? `+${formatScore(last.change)}`
                : `−${formatScore(-last.change)}`}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Chưa có tên người chơi thì không cho vào thẳng trang chơi
const Play = ({ questions, playerName }) => {
  if (playerName.trim() === '') return <Navigate to="/" replace />;
  return <PlayGame questions={questions} playerName={playerName} />;
};

export default Play;
