// used: { preview, insurance, hint } - mỗi quyền chỉ dùng 1 lần trong một lượt chơi
const Supports = ({ status, used, onUse }) => (
  <div className="supports">
    <button
      disabled={used.preview || status !== 'betting'}
      onClick={() => onUse('preview')}
    >
      Xem trước
    </button>
    <button
      disabled={used.insurance || status === 'revealed'}
      onClick={() => onUse('insurance')}
    >
      {used.insurance ? 'Đã bảo hiểm' : 'Bảo hiểm'}
    </button>
    <button
      disabled={used.hint || status !== 'answering'}
      onClick={() => onUse('hint')}
    >
      Gợi ý
    </button>
  </div>
);

export default Supports;
