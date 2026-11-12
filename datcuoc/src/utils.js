import { MIN_BET, MAX_BET, BET_STEP, MULTIPLIERS, RESULTS } from './data';

// Trả về câu báo lỗi, hoặc chuỗi rỗng nếu mức cược hợp lệ
export const validateBet = (bet, score) => {
  const valid =
    Number.isInteger(bet) &&
    bet >= MIN_BET &&
    bet <= MAX_BET &&
    bet % BET_STEP === 0 &&
    bet <= score;
  return valid
    ? ''
    : 'Mức cược phải là bội số của 100, từ 100 đến 500 và không vượt quá số điểm đang có';
};

// Đúng: cộng (mức cược × hệ số). Sai / hết giờ: trừ đúng mức cược
export const calcChange = (bet, level, correct) =>
  correct ? bet * MULTIPLIERS[level] : -bet;

// Mục đầu tiên trong RESULTS có min <= điểm
export const getResult = (score) => RESULTS.find((r) => score >= r.min);
