import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS, MULTIPLIERS, formatMultiplier } from '../data';

const QuestionBank = ({ questions, bookmarks, toggleBookmark }) => {
  const [levels, setLevels] = useState([1, 2, 3]);
  const [onlyMarked, setOnlyMarked] = useState(false);
  const [keyword, setKeyword] = useState('');

  const toggleLevel = (level) => {
    setLevels(
      levels.includes(level)
        ? levels.filter((l) => l !== level)
        : [...levels, level]
    );
  };

  const handleLookupShift = (e) => setKeyword(e.target.value);

  const shown = questions.filter(
    (q) =>
      levels.includes(q.level) &&
      (!onlyMarked || bookmarks.includes(q.id)) &&
      q.question.toLowerCase().includes(keyword.trim().toLowerCase())
  );

  return (
    <div>
      <h2>Ngân hàng câu hỏi</h2>

      <div className="filters">
        {[1, 2, 3].map((lv) => (
          <label key={lv}>
            <input
              type="checkbox"
              checked={levels.includes(lv)}
              onChange={() => toggleLevel(lv)}
            />
            {LEVELS[lv]}
          </label>
        ))}
        <label>
          <input
            type="checkbox"
            checked={onlyMarked}
            onChange={(e) => setOnlyMarked(e.target.checked)}
          />
          Chỉ hiện câu đã đánh dấu
        </label>
        <input
          type="text"
          placeholder="Tìm kiếm câu hỏi..."
          value={keyword}
          onChange={handleLookupShift}
        />
      </div>

      <p>Có {shown.length} câu hỏi</p>
      <p>Đã đánh dấu: {bookmarks.length} câu</p>

      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Chủ đề</th>
            <th>Mức độ</th>
            <th>Hệ số</th>
            <th>Câu hỏi</th>
            <th>Đánh dấu</th>
          </tr>
        </thead>
        <tbody>
          {shown.map((q, index) => (
            <tr key={q.id}>
              <td>{index + 1}</td>
              <td>{q.topic}</td>
              <td>{LEVELS[q.level]}</td>
              <td>{formatMultiplier(MULTIPLIERS[q.level])}</td>
              <td><Link to={`/questions/${q.id}`}>{q.question}</Link></td>
              <td>
                <button onClick={() => toggleBookmark(q.id)}>
                  {bookmarks.includes(q.id) ? '★' : '☆'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionBank;
