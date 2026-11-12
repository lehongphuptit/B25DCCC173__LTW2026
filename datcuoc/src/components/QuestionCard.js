import AnswerButton from './AnswerButton';
import { LEVELS, MULTIPLIERS, LETTERS, formatMultiplier } from '../data';

const QuestionCard = ({ question, number, total, selected, revealed, onSelect }) => {
  const getState = (i) => {
    if (!revealed) return 'normal';
    if (i === question.answer) return 'correct';
    if (i === selected) return 'wrong';
    return 'normal';
  };

  return (
    <div>
      <p>
        {`Câu ${number}/${total} · ${question.topic} · ${LEVELS[question.level]} (${formatMultiplier(MULTIPLIERS[question.level])})`}
      </p>
      <h3>{question.question}</h3>
      <div className="answers">
        {question.options.map((opt, i) => (
          <AnswerButton
            key={i}
            letter={LETTERS[i]}
            text={opt}
            state={getState(i)}
            disabled={revealed}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
