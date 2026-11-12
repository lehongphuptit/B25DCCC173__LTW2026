import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import BetPanel from '../components/BetPanel';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import ScoreInfo from '../components/ScoreInfo';
import Supports from '../components/Supports';
import {
  START_SCORE,
  MIN_BET,
  MAX_BET,
  BET_STEP,
  TIME_PER_QUESTION,
  formatScore,
} from '../data';
import { validateBet, calcChange, getResult } from '../utils';

const DEFAULT_TITLE = 'Đặt cược kiến thức';

const PlayGame = ({ questions, playerName, addHistory }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(START_SCORE);
  const [rounds, setRounds] = useState([]);
  const [status, setStatus] = useState('betting'); // betting -> answering -> revealed
  const [betInput, setBetInput] = useState('100');
  const [bet, setBet] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  // Quyền trợ giúp
  const [used, setUsed] = useState({ preview: false, insurance: false, hint: false });
  const [previewShown, setPreviewShown] = useState(false); // chỉ cho câu đang chơi
  const [insured, setInsured] = useState(false); // chỉ cho câu đang chơi
  const [hintShown, setHintShown] = useState(false); // chỉ cho câu đang chơi

  const question = questions[index];
  const total = questions.length;
  const betError = validateBet(Number(betInput), score);

  const handleUse = (name) => {
    setUsed({ ...used, [name]: true });
    if (name === 'preview') setPreviewShown(true);
    if (name === 'insurance') setInsured(true);
    if (name === 'hint') setHintShown(true);
  };

  const placeBet = () => {
    if (betError !== '') return;
    setBet(Number(betInput));
    setSelected(null);
    setTimeLeft(TIME_PER_QUESTION);
    setStatus('answering');
  };

  const handleBet = (e) => {
    e.preventDefault();
    placeBet();
  };

  // choice: vị trí đáp án đã chọn, hoặc null nếu hết giờ
  const handleAnswer = (choice) => {
    if (status !== 'answering') return;
    const correct = choice === question.answer;
    // Bảo hiểm: sai / hết giờ thì không bị trừ điểm
    const change = !correct && insured ? 0 : calcChange(bet, question.level, correct);
    const scoreAfter = score + change;
    setScore(scoreAfter);
    setRounds([
      ...rounds,
      { id: question.id, bet, correct, change, scoreAfter, insured },
    ]);
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
        const correctCount = rounds.filter((r) => r.correct).length;
        addHistory({
          id: Date.now(),
          name: playerName.trim(),
          finalScore: score,
          correctCount,
          played: rounds.length,
          result: getResult(score).title,
          playedAt: new Date().toLocaleString('vi-VN'),
        });
        navigate('/result', {
          replace: true,
          state: {
            name: playerName.trim(),
            rounds,
            finalScore: score,
            correctCount,
            reason: score < MIN_BET ? 'broke' : 'done',
          },
        });
      } else {
        setIndex(index + 1);
        setBetInput('100');
        setInsured(false);
        setPreviewShown(false);
        setHintShown(false);
        setStatus('betting');
      }
    }, 2000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Phím tắt ở bước đặt cược: ↑ tăng, ↓ giảm, Enter đặt cược
  useEffect(() => {
    if (status !== 'betting') return;
    const handleKey = (e) => {
      const maxBet = Math.max(
        MIN_BET,
        Math.floor(Math.min(MAX_BET, score) / BET_STEP) * BET_STEP
      );
      const current = Number(betInput);
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setBetInput(String(Math.max(MIN_BET, Math.min(current + BET_STEP, maxBet))));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setBetInput(String(Math.max(MIN_BET, Math.min(current - BET_STEP, maxBet))));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        placeBet();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, betInput, score]);

  // Tiêu đề tab
  useEffect(() => {
    document.title =
      status === 'betting'
        ? `Câu ${index + 1}/${total} – đặt cược`
        : `Câu ${index + 1}/${total} – cược ${bet}`;
  }, [status, index, total, bet]);

  // Rời màn hình chơi thì trả lại tiêu đề cũ
  useEffect(() => {
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, []);

  if (!question) return null;

  const last = rounds[rounds.length - 1];
  const savedByInsurance = last && !last.correct && last.insured;

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
          showPreview={previewShown}
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
          {hintShown && <p className="hint">Gợi ý: {question.hint}</p>}
          <Timer timeLeft={timeLeft} />
          <ScoreInfo score={score} bet={bet} />
          {status === 'revealed' && last && (
            <p
              className={
                savedByInsurance
                  ? 'change change--safe'
                  : last.correct
                  ? 'change change--up'
                  : 'change change--down'
              }
            >
              {selected === null && 'Hết giờ! '}
              {savedByInsurance
                ? 'Bảo hiểm: không bị trừ điểm'
                : last.change > 0
                ? `+${formatScore(last.change)}`
                : `−${formatScore(-last.change)}`}
            </p>
          )}
        </div>
      )}

      <Supports status={status} used={used} onUse={handleUse} />
    </div>
  );
};

// Chưa có tên người chơi thì không cho vào thẳng trang chơi
const Play = ({ questions, playerName, addHistory }) => {
  if (playerName.trim() === '') return <Navigate to="/" replace />;
  return <PlayGame questions={questions} playerName={playerName} addHistory={addHistory} />;
};

export default Play;
