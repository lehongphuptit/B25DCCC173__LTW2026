const Timer = ({ timeLeft }) => (
  <p className={timeLeft <= 5 ? 'timer timer--danger' : 'timer'}>
    Còn {Math.max(0, timeLeft)} giây
  </p>
);

export default Timer;
