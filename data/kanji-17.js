/**
 * DỮ LIỆU BÀI HỌC KANJI — Bài 17
 * ------------------------------------------------------------
 * Cấu trúc riêng cho Kanji (khác với từ vựng), gồm:
 *   id       : mã riêng, không trùng
 *   char     : chữ Kanji
 *   hanviet  : nghĩa Hán Việt (vd "Chính")
 *   onyomi   : mảng cách đọc Âm (Onyomi)
 *   kunyomi  : mảng cách đọc Kun (Kunyomi), để [] nếu không có (---)
 *   examples : mảng từ ví dụ có chứa kanji này, mỗi từ gồm
 *              { word, reading, meaning }
 *
 * Thêm bài kanji mới: copy file này, đổi id/title, thay nội dung
 * mảng "kanji", rồi thêm dòng
 *   <script src="data/kanji-XX.js"></script>
 * vào index.html.
 */
window.KANJI_LESSONS = window.KANJI_LESSONS || [];

window.KANJI_LESSONS.push({
  id: "kanji-17",
  title: "Kanji bài 17",
  kanji: [
    {
      id: "k17-01", char: "正", hanviet: "Chính",
      onyomi: ["ショウ", "セイ"], kunyomi: ["ただ・しい", "ただ・す", "まさ"],
      examples: [
        { word: "正しい", reading: "ただしい", meaning: "Đúng, chính xác" },
        { word: "お正月", reading: "しょうがつ", meaning: "Tết" },
      ],
    },
    {
      id: "k17-02", char: "政", hanviet: "Chính",
      onyomi: ["セイ", "ショウ"], kunyomi: ["まつりごと"],
      examples: [
        { word: "政治", reading: "せいじ", meaning: "Chính trị" },
      ],
    },
    {
      id: "k17-03", char: "台", hanviet: "Đài",
      onyomi: ["タイ", "ダイ"], kunyomi: [],
      examples: [
        { word: "台所", reading: "だいどころ", meaning: "Nhà bếp" },
        { word: "台風", reading: "たいふう", meaning: "Bão" },
      ],
    },
    {
      id: "k17-04", char: "始", hanviet: "Thủy",
      onyomi: ["シ"], kunyomi: ["はじ・める", "はじ・まる"],
      examples: [
        { word: "始めます", reading: "はじめます", meaning: "Bắt đầu (cái gì đó)" },
        { word: "始まります", reading: "はじまります", meaning: "(cái gì đó) Bắt đầu" },
        { word: "開始", reading: "かいし", meaning: "Bắt đầu, khởi đầu" },
      ],
    },
    {
      id: "k17-05", char: "治", hanviet: "Trị",
      onyomi: ["ジ", "チ"], kunyomi: ["なお・す", "なお・る", "おさ・める", "おさ・まる"],
      examples: [
        { word: "治します", reading: "なおします", meaning: "Chữa, trị bệnh" },
        { word: "治ります", reading: "なおります", meaning: "Khỏi (bệnh), lành (vết thương)" },
        { word: "政治", reading: "せいじ", meaning: "Chính trị" },
      ],
    },
    {
      id: "k17-06", char: "遠", hanviet: "Viễn",
      onyomi: ["エン"], kunyomi: ["とお・い"],
      examples: [
        { word: "遠い", reading: "とおい", meaning: "Xa" },
      ],
    },
    {
      id: "k17-07", char: "園", hanviet: "Viên",
      onyomi: ["エン"], kunyomi: [],
      examples: [
        { word: "公園", reading: "こうえん", meaning: "Công viên" },
        { word: "遊園地", reading: "ゆうえんち", meaning: "Khu vui chơi" },
        { word: "動物園", reading: "どうぶつえん", meaning: "Sở thú" },
        { word: "保育園", reading: "ほいくえん", meaning: "Nhà trẻ" },
      ],
    },
    {
      id: "k17-08", char: "公", hanviet: "Công",
      onyomi: ["コウ"], kunyomi: ["おおやけ"],
      examples: [
        { word: "公園", reading: "こうえん", meaning: "Công viên" },
        { word: "主人公", reading: "しゅじんこう", meaning: "Nhân vật chính" },
      ],
    },
    {
      id: "k17-09", char: "広", hanviet: "Quảng",
      onyomi: ["コウ"], kunyomi: ["ひろ・い", "ひろ・げる", "ひろ・がる"],
      examples: [
        { word: "広い", reading: "ひろい", meaning: "Rộng" },
        { word: "広告", reading: "こうこく", meaning: "Quảng cáo" },
      ],
    },
    {
      id: "k17-10", char: "去", hanviet: "Khứ",
      onyomi: ["キョ", "コ"], kunyomi: ["さ・る"],
      examples: [
        { word: "去年", reading: "きょねん", meaning: "Năm ngoái" },
      ],
    },
    {
      id: "k17-11", char: "転", hanviet: "Chuyển",
      onyomi: ["テン"], kunyomi: ["ころ・ぶ", "ころ・がる"],
      examples: [
        { word: "転びます", reading: "ころびます", meaning: "Ngã, té" },
        { word: "運転します", reading: "うんてんします", meaning: "Lái xe" },
        { word: "自転車", reading: "じてんしゃ", meaning: "Xe đạp" },
        { word: "運転手", reading: "うんてんしゅ", meaning: "Tài xế, người lái xe" },
      ],
    },
  ],
});
