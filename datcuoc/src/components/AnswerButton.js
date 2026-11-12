const AnswerButton = ({ letter, text, state, disabled, onClick }) => (
  <button
    className={`answer-btn answer-btn--${state}`}
    disabled={disabled}
    onClick={onClick}
  >
    {letter}. {text}
  </button>
);

export default AnswerButton;
