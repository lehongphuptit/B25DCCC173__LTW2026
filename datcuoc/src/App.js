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
import './App.css';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);

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

  const toggleBookmark = (id) => {
    setBookmarks(
      bookmarks.includes(id)
        ? bookmarks.filter((b) => b !== id)
        : [...bookmarks, id]
    );
  };

  return (
    <Routes>
      <Route path="/" element={<Layout loading={loading} error={error} />}>
        <Route index element={<Home />} />
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
        <Route path="play" element={<h2>Màn hình chơi</h2>} />
        <Route path="result" element={<h2>Kết quả</h2>} />
        <Route path="history" element={<h2>Lịch sử</h2>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
