import { LEVELS, MULTIPLIERS, formatMultiplier, formatScore } from '../data';

const BetPanel = ({ question, number, total, score, betInput, onBetChange, error, onSubmit }) => (
  <form onSubmit={onSubmit} noValidate>
    <p>
      {`Câu ${number}/${total} · ${question.topic} · ${LEVELS[question.level]} (${formatMultiplier(MULTIPLIERS[question.level])})`}
    </p>
    <p>Điểm hiện có: {formatScore(score)}</p>
    <label>
      Mức cược:{' '}
      <input
        type="number"
        value={betInput}
        onChange={(e) => onBetChange(e.target.value)}
      />
    </label>{' '}
    <button type="submit" disabled={error !== ''}>
      Đặt cược
    </button>
    {error !== '' && <p className="error">{error}</p>}
  </form>
);

export default BetPanel;
