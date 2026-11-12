const BUILD_TAG = "dc-2964";
/* eslint-disable no-unused-vars, import/first */
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';
import Home from './pages/Home';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';
import Play from './pages/Play';
import Result from './pages/Result';
import History from './pages/History';
import './App.css';

const BOOKMARKS_KEY = 'ltw_cuoc_bookmarks';
const HISTORY_KEY = 'ltw_cuoc_history';

// Đọc mảng từ localStorage, lỗi hoặc chưa có thì trả về []
const loadList = (key) => {
  try {
    const raw = localStorage.getItem(key);
    const value = raw ? JSON.parse(raw) : [];
    return Array.isArray(value) ? value : [];
  } catch (err) {
    return [];
  }
};

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [bookmarks, setBookmarks] = useState(() => loadList(BOOKMARKS_KEY));
  const [history, setHistory] = useState(() => loadList(HISTORY_KEY));
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const fetchQuestions = async () => {
      try {
        const res = await axios.get('/data/questions.json', {
          signal: controller.signal,
        });
        setQuestions(res.data);
        setLoading(false);
      } catch (err) {
        if (axios.isCancel(err)) return; // request bị hủy: bỏ qua, không báo lỗi
        setError(true);
        setLoading(false);
      }
    };
    fetchQuestions();
    return () => controller.abort(); // cleanup
  }, []);

  // Ghi lại localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const toggleBookmark = (id) => {
    setBookmarks(
      bookmarks.includes(id)
        ? bookmarks.filter((b) => b !== id)
        : [...bookmarks, id]
    );
  };

  const addHistory = (record) => setHistory((prev) => [...prev, record]);
  const clearHistory = () => setHistory([]);

  return (
    <Routes>
      <Route path="/" element={<Layout loading={loading} error={error} />}>
        <Route
          index
          element={
            <Home
              playerName={playerName}
              setPlayerName={setPlayerName}
              history={history}
            />
          }
        />
        <Route
          path="questions"
          element={
            <QuestionBank
              questions={questions}
              bookmarks={bookmarks}
              toggleBookmark={toggleBookmark}
            />
          }
        />
        <Route
          path="questions/:id"
          element={
            <QuestionDetail
              questions={questions}
              bookmarks={bookmarks}
              toggleBookmark={toggleBookmark}
            />
          }
        />
        <Route
          path="play"
          element={
            <Play
              questions={questions}
              playerName={playerName}
              addHistory={addHistory}
            />
          }
        />
        <Route path="result" element={<Result />} />
        <Route
          path="history"
          element={<History history={history} clearHistory={clearHistory} />}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
