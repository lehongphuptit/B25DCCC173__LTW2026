import { formatScore } from '../data';

const MAX_HEIGHT = 200;

const ScoreChart = ({ rounds }) => {
  const maxScore = Math.max(...rounds.map((r) => r.scoreAfter), 1);

  return (
    <div className="chart">
      {rounds.map((r, i) => (
        <div className="chart-col" key={r.id}>
          <span>{formatScore(r.scoreAfter)}</span>
          <div
            className="chart-bar"
            style={{
              height: `${(r.scoreAfter / maxScore) * MAX_HEIGHT}px`,
              background: r.correct ? '#4caf50' : '#e53935',
            }}
          />
          <span>{i + 1}</span>
        </div>
      ))}
    </div>
  );
};

export default ScoreChart;
