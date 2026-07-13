/**
 * FILE MẪU — copy file này để tạo bài học mới
 * (ví dụ: lesson-17b.js, lesson-18a.js ...)
 *
 * Các bước:
 *  1. Đổi tên file, ví dụ "lesson-17b.js"
 *  2. Đổi "id" (mã bài, không trùng) và "title" (tên hiển thị)
 *  3. Thay nội dung mảng "words" bằng từ vựng bài mới
 *  4. Mở index.html, thêm dòng:
 *       <script src="data/lesson-17b.js"></script>
 *     phía trên dòng <script src="app.js"></script>
 *
 * Mô tả các trường của cả bài học:
 *   id      : mã bài, không trùng trong toàn app -> "17b", "18a"...
 *   title   : tên hiển thị trên thẻ bài học
 *   level   : cấp độ để lọc theo tab N5/N4 -> "N5" hoặc "N4"
 *
 * Mô tả từng trường trong 1 từ vựng:
 *   id      : mã riêng, không trùng trong toàn app -> "17b-01", "17b-02"...
 *   word    : chữ Kanji/từ viết như trong sách (mặt hỏi khi học Kanji)
 *   reading : cách đọc Hiragana (mặt hỏi khi học từ vựng thường)
 *   type    : loại từ — dùng đúng 1 trong các mã sau:
 *               N (danh từ) | Aい (tính từ đuôi い) | Aな (tính từ đuôi な)
 *               VI / VII / VIII (động từ nhóm I/II/III) | Adv (phó từ) | Exp (cụm từ)
 *   meaning : nghĩa tiếng Việt (kèm trợ từ nếu có, vd "hợp với ~")
 *   note    : (không bắt buộc) ghi chú thêm, để "" nếu không có
 */

window.LESSONS = window.LESSONS || [];

window.LESSONS.push({
  id: "17b",
  title: "Từ vựng 17-B",
  level: "N4",
  words: [
    { id: "17b-01", word: "例", reading: "れい", type: "N", meaning: "ví dụ", note: "" },
    { id: "17b-02", word: "例える", reading: "たとえる", type: "VII", meaning: "ví dụ như, so sánh", note: "（～を）例える" },
    // ... thêm các từ khác theo đúng khuôn mẫu ở trên
  ],
});