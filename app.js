/**
 * APP.JS — Logic chính
 * Đọc dữ liệu từ:
 *   window.LESSONS        (các bài Từ vựng, từ data/lesson-*.js)
 *   window.KANJI_LESSONS  (các bài Kanji, từ data/kanji-*.js)
 */

(function () {
  "use strict";

  const LESSONS = window.LESSONS || [];
  const KANJI_LESSONS = window.KANJI_LESSONS || [];

  // ---------------------------------------------------------
  // State
  // ---------------------------------------------------------
  let activeCategory = "vocab"; // "vocab" | "kanji"
  let currentLesson = null;     // bài đang chọn (vocab hoặc kanji)

  let fcOrder = [], fcIndex = 0;
  let quizOrder = [], quizIndex = 0, quizScore = 0, quizAnswered = false;

  let kfOrder = [], kfIndex = 0;
  let kqOrder = [], kqIndex = 0, kqScore = 0, kqAnswered = false;

  // ---------------------------------------------------------
  // localStorage helpers
  // ---------------------------------------------------------
  function getSet(key) {
    try { return new Set(JSON.parse(localStorage.getItem(key) || "[]")); }
    catch (e) { return new Set(); }
  }
  function saveSet(key, set) { localStorage.setItem(key, JSON.stringify([...set])); }
  function getBest(key) { return parseInt(localStorage.getItem(key) || "0", 10); }
  function saveBest(key, score) {
    if (score > getBest(key)) localStorage.setItem(key, String(score));
  }

  const vocabKnownKey = (lessonId) => `vocab.known.${lessonId}`;
  const vocabBestKey = (lessonId) => `vocab.best.${lessonId}`;
  const kanjiKnownKey = (lessonId) => `kanji.known.${lessonId}`;
  const kanjiBestKey = (lessonId) => `kanji.best.${lessonId}`;

  function shuffledIndices(n) {
    const arr = Array.from({ length: n }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  // ---------------------------------------------------------
  // View switching
  // ---------------------------------------------------------
  const views = {
    list: document.getElementById("view-list"),
    mode: document.getElementById("view-mode"),
    flashcard: document.getElementById("view-flashcard"),
    quiz: document.getElementById("view-quiz"),
    kanjiFlashcard: document.getElementById("view-kanji-flashcard"),
    kanjiQuiz: document.getElementById("view-kanji-quiz"),
  };
  function showView(name) {
    Object.values(views).forEach((v) => v.classList.add("hidden"));
    views[name].classList.remove("hidden");
  }

  document.querySelectorAll("[data-back]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-back");
      if (target === "list") { renderLessonList(); showView("list"); }
      else { showView("mode"); }
    });
  });

  // ---------------------------------------------------------
  // VIEW 1: Danh sách bài (Từ vựng / Kanji)
  // ---------------------------------------------------------
  document.getElementById("category-toggle").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-cat]");
    if (!btn) return;
    activeCategory = btn.getAttribute("data-cat");
    document.querySelectorAll("#category-toggle button").forEach((b) =>
      b.classList.toggle("active", b === btn)
    );
    renderLessonList();
  });

  function renderLessonList() {
    const grid = document.getElementById("lesson-grid");
    const empty = document.getElementById("empty-lessons");
    grid.innerHTML = "";

    const list = activeCategory === "vocab" ? LESSONS : KANJI_LESSONS;

    if (list.length === 0) {
      empty.classList.remove("hidden");
      document.getElementById("empty-text").textContent =
        activeCategory === "vocab"
          ? "Chưa có bài từ vựng nào. Thêm file vào data/lesson-*.js để bắt đầu."
          : "Chưa có bài Kanji nào. Thêm file vào data/kanji-*.js để bắt đầu.";
      return;
    }
    empty.classList.add("hidden");

    list.forEach((lesson) => {
      const items = activeCategory === "vocab" ? lesson.words : lesson.kanji;
      const known = getSet(
        activeCategory === "vocab" ? vocabKnownKey(lesson.id) : kanjiKnownKey(lesson.id)
      );
      const total = items.length;
      const knownCount = items.filter((it) => known.has(it.id)).length;
      const pct = total ? Math.round((knownCount / total) * 100) : 0;

      const card = document.createElement("button");
      card.className = `lesson-card cat-${activeCategory}`;
      card.innerHTML = `
        <div class="lesson-card-top">
          <span class="num-badge jp">${escapeHtml(lesson.id.toUpperCase())}</span>
        </div>
        <div class="title">${escapeHtml(lesson.title)}</div>
        <div class="meta"><span>${total} ${activeCategory === "vocab" ? "từ" : "chữ"}</span><span>${knownCount}/${total} thuộc</span></div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      `;
      card.addEventListener("click", () => openLesson(lesson));
      grid.appendChild(card);
    });
  }

  // ---------------------------------------------------------
  // VIEW 2: Chọn chế độ học
  // ---------------------------------------------------------
  function openLesson(lesson) {
    currentLesson = lesson;
    document.getElementById("mode-lesson-title").textContent =
      `Chọn chế độ học — ${lesson.title}`;

    if (activeCategory === "vocab") {
      document.getElementById("mode-flash-desc").textContent =
        "Xem cách đọc, lật thẻ để thấy chữ Kanji (nếu có), loại từ và ý nghĩa.";
      document.getElementById("mode-quiz-desc").textContent =
        "Xem cách đọc, chọn đúng ý nghĩa trong 4 lựa chọn.";
    } else {
      document.getElementById("mode-flash-desc").textContent =
        "Xem chữ Kanji, lật thẻ để thấy nghĩa Hán Việt, âm On/Kun và từ ví dụ.";
      document.getElementById("mode-quiz-desc").textContent =
        "Xem chữ Kanji, chọn đúng nghĩa Hán Việt trong 4 lựa chọn.";
    }
    showView("mode");
  }

  document.querySelectorAll("[data-start]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.getAttribute("data-start");
      if (activeCategory === "vocab") {
        if (mode === "flashcard") startVocabFlashcard();
        if (mode === "quiz") startVocabQuiz();
      } else {
        if (mode === "flashcard") startKanjiFlashcard();
        if (mode === "quiz") startKanjiQuiz();
      }
    });
  });

  // ===========================================================
  // TỪ VỰNG — FLASHCARD
  // ===========================================================
  function startVocabFlashcard() {
    fcOrder = shuffledIndices(currentLesson.words.length);
    fcIndex = 0;
    document.getElementById("fc-lesson-title").textContent = `Flashcard — ${currentLesson.title}`;
    renderVocabFlashcard();
    showView("flashcard");
  }
  function currentFcWord() { return currentLesson.words[fcOrder[fcIndex]]; }

  function renderVocabFlashcard() {
    const w = currentFcWord();
    const known = getSet(vocabKnownKey(currentLesson.id));
    const isKnown = known.has(w.id);
    const hasKanji = w.word && w.word !== w.reading;

    document.getElementById("fc-position").textContent = `${fcIndex + 1} / ${fcOrder.length}`;
    document.getElementById("fc-known-count").textContent = `Đã thuộc: ${known.size}/${currentLesson.words.length}`;

    document.getElementById("fc-type-front").textContent = w.type;
    document.getElementById("fc-type-back").textContent = w.type;

    // Mặt trước: cách đọc (kana) là chính, Kanji chỉ là chú thích nhỏ
    document.getElementById("fc-front-main").textContent = w.reading;
    document.getElementById("fc-front-kanji").textContent = hasKanji ? w.word : "";
    document.getElementById("fc-front-kanji").style.display = hasKanji ? "inline-block" : "none";

    document.getElementById("fc-back-word").textContent = hasKanji ? w.word : "";
    document.getElementById("fc-back-word").style.display = hasKanji ? "block" : "none";
    document.getElementById("fc-back-reading").textContent = w.reading;
    document.getElementById("fc-back-meaning").textContent = w.meaning;
    document.getElementById("fc-back-note").textContent = w.note || "";

    document.getElementById("fc-stamp-front").classList.toggle("show", isKnown);
    document.getElementById("fc-stamp-back").classList.toggle("show", isKnown);
    document.getElementById("fc-mark-known").classList.toggle("active", isKnown);
    document.getElementById("fc-mark-unknown").classList.toggle("active", !isKnown);

    document.getElementById("fc-card").classList.remove("flipped");
  }

  document.getElementById("fc-card").addEventListener("click", (e) => {
    e.currentTarget.classList.toggle("flipped");
  });
  document.getElementById("fc-prev").addEventListener("click", () => {
    fcIndex = (fcIndex - 1 + fcOrder.length) % fcOrder.length;
    renderVocabFlashcard();
  });
  document.getElementById("fc-next").addEventListener("click", () => {
    fcIndex = (fcIndex + 1) % fcOrder.length;
    renderVocabFlashcard();
  });
  document.getElementById("fc-shuffle").addEventListener("click", () => {
    fcOrder = shuffledIndices(currentLesson.words.length);
    fcIndex = 0;
    renderVocabFlashcard();
  });
  function setVocabMark(known) {
    const w = currentFcWord();
    const key = vocabKnownKey(currentLesson.id);
    const set = getSet(key);
    if (known) set.add(w.id); else set.delete(w.id);
    saveSet(key, set);
    renderVocabFlashcard();
  }
  document.getElementById("fc-mark-known").addEventListener("click", () => setVocabMark(true));
  document.getElementById("fc-mark-unknown").addEventListener("click", () => setVocabMark(false));

  // ===========================================================
  // TỪ VỰNG — TRẮC NGHIỆM
  // ===========================================================
  function startVocabQuiz() {
    quizOrder = shuffledIndices(currentLesson.words.length);
    quizIndex = 0; quizScore = 0; quizAnswered = false;
    document.getElementById("quiz-lesson-title").textContent = `Trắc nghiệm — ${currentLesson.title}`;
    document.getElementById("quiz-question-wrap").classList.remove("hidden");
    document.getElementById("quiz-result").classList.add("hidden");
    renderVocabQuizQuestion();
    showView("quiz");
  }
  function currentQuizWord() { return currentLesson.words[quizOrder[quizIndex]]; }

  function buildMeaningOptions(pool, correctItem, correctField) {
    const others = pool.filter((it) => it.id !== correctItem.id);
    const shuffledPool = shuffledIndices(others.length).map((i) => others[i]);
    const distractors = shuffledPool.slice(0, Math.min(3, others.length)).map((it) => it[correctField]);
    const options = [...distractors, correctItem[correctField]];
    const order = shuffledIndices(options.length);
    return order.map((i) => options[i]);
  }

  function renderVocabQuizQuestion() {
    quizAnswered = false;
    const w = currentQuizWord();
    const hasKanji = w.word && w.word !== w.reading;
    document.getElementById("quiz-position").textContent = `Câu ${quizIndex + 1} / ${quizOrder.length}`;
    document.getElementById("quiz-score").textContent = `Điểm: ${quizScore}`;
    document.getElementById("quiz-type").textContent = w.type;
    document.getElementById("quiz-word").textContent = w.reading;
    const kanjiEl = document.getElementById("quiz-word-kanji");
    kanjiEl.textContent = hasKanji ? w.word : "";
    kanjiEl.style.display = hasKanji ? "inline-block" : "none";

    const options = buildMeaningOptions(currentLesson.words, w, "meaning");
    const wrap = document.getElementById("quiz-options");
    wrap.innerHTML = "";
    options.forEach((opt) => {
      const b = document.createElement("button");
      b.className = "opt-btn";
      b.textContent = opt;
      b.addEventListener("click", () => handleVocabAnswer(b, opt, w.meaning));
      wrap.appendChild(b);
    });
    document.getElementById("quiz-next").disabled = true;
  }

  function handleVocabAnswer(btn, chosen, correct) {
    if (quizAnswered) return;
    quizAnswered = true;
    document.querySelectorAll("#quiz-options .opt-btn").forEach((b) => {
      b.disabled = true;
      if (b.textContent === correct) b.classList.add("correct");
      else if (b === btn) b.classList.add("wrong");
    });
    if (chosen === correct) quizScore++;
    document.getElementById("quiz-score").textContent = `Điểm: ${quizScore}`;
    document.getElementById("quiz-next").disabled = false;
  }

  document.getElementById("quiz-next").addEventListener("click", () => {
    if (quizIndex + 1 < quizOrder.length) { quizIndex++; renderVocabQuizQuestion(); }
    else finishVocabQuiz();
  });

  function finishVocabQuiz() {
    const key = vocabBestKey(currentLesson.id);
    saveBest(key, quizScore);
    document.getElementById("quiz-question-wrap").classList.add("hidden");
    document.getElementById("quiz-result").classList.remove("hidden");
    document.getElementById("result-score").textContent = `${quizScore}/${quizOrder.length}`;
    document.getElementById("result-best").textContent = `Điểm cao nhất: ${getBest(key)}/${quizOrder.length}`;
  }
  document.getElementById("quiz-retry").addEventListener("click", () => startVocabQuiz());

  // ===========================================================
  // KANJI — FLASHCARD
  // ===========================================================
  function startKanjiFlashcard() {
    kfOrder = shuffledIndices(currentLesson.kanji.length);
    kfIndex = 0;
    document.getElementById("kf-lesson-title").textContent = `Flashcard Kanji — ${currentLesson.title}`;
    renderKanjiFlashcard();
    showView("kanjiFlashcard");
  }
  function currentKfKanji() { return currentLesson.kanji[kfOrder[kfIndex]]; }

  function renderKanjiFlashcard() {
    const k = currentKfKanji();
    const known = getSet(kanjiKnownKey(currentLesson.id));
    const isKnown = known.has(k.id);

    document.getElementById("kf-position").textContent = `${kfIndex + 1} / ${kfOrder.length}`;
    document.getElementById("kf-known-count").textContent = `Đã thuộc: ${known.size}/${currentLesson.kanji.length}`;

    document.getElementById("kf-front-char").textContent = k.char;
    document.getElementById("kf-back-hanviet").textContent = k.hanviet;
    document.getElementById("kf-back-onyomi").textContent = k.onyomi.length ? k.onyomi.join("、") : "---";
    document.getElementById("kf-back-kunyomi").textContent = k.kunyomi.length ? k.kunyomi.join("、") : "---";

    const exWrap = document.getElementById("kf-back-examples");
    exWrap.innerHTML = "";
    k.examples.forEach((ex) => {
      const div = document.createElement("div");
      div.className = "kanji-example-item";
      div.innerHTML = `<span class="ex-word">${escapeHtml(ex.word)}</span> <span class="ex-reading">(${escapeHtml(ex.reading)})</span> — <span class="ex-meaning">${escapeHtml(ex.meaning)}</span>`;
      exWrap.appendChild(div);
    });

    document.getElementById("kf-stamp-front").classList.toggle("show", isKnown);
    document.getElementById("kf-stamp-back").classList.toggle("show", isKnown);
    document.getElementById("kf-mark-known").classList.toggle("active", isKnown);
    document.getElementById("kf-mark-unknown").classList.toggle("active", !isKnown);

    document.getElementById("kf-card").classList.remove("flipped");
  }

  document.getElementById("kf-card").addEventListener("click", (e) => {
    e.currentTarget.classList.toggle("flipped");
  });
  document.getElementById("kf-prev").addEventListener("click", () => {
    kfIndex = (kfIndex - 1 + kfOrder.length) % kfOrder.length;
    renderKanjiFlashcard();
  });
  document.getElementById("kf-next").addEventListener("click", () => {
    kfIndex = (kfIndex + 1) % kfOrder.length;
    renderKanjiFlashcard();
  });
  document.getElementById("kf-shuffle").addEventListener("click", () => {
    kfOrder = shuffledIndices(currentLesson.kanji.length);
    kfIndex = 0;
    renderKanjiFlashcard();
  });
  function setKanjiMark(known) {
    const k = currentKfKanji();
    const key = kanjiKnownKey(currentLesson.id);
    const set = getSet(key);
    if (known) set.add(k.id); else set.delete(k.id);
    saveSet(key, set);
    renderKanjiFlashcard();
  }
  document.getElementById("kf-mark-known").addEventListener("click", () => setKanjiMark(true));
  document.getElementById("kf-mark-unknown").addEventListener("click", () => setKanjiMark(false));

  // ===========================================================
  // KANJI — TRẮC NGHIỆM (chọn đúng nghĩa Hán Việt)
  // ===========================================================
  function startKanjiQuiz() {
    kqOrder = shuffledIndices(currentLesson.kanji.length);
    kqIndex = 0; kqScore = 0; kqAnswered = false;
    document.getElementById("kq-lesson-title").textContent = `Trắc nghiệm Kanji — ${currentLesson.title}`;
    document.getElementById("kq-question-wrap").classList.remove("hidden");
    document.getElementById("kq-result").classList.add("hidden");
    renderKanjiQuizQuestion();
    showView("kanjiQuiz");
  }
  function currentKqKanji() { return currentLesson.kanji[kqOrder[kqIndex]]; }

  function renderKanjiQuizQuestion() {
    kqAnswered = false;
    const k = currentKqKanji();
    document.getElementById("kq-position").textContent = `Câu ${kqIndex + 1} / ${kqOrder.length}`;
    document.getElementById("kq-score").textContent = `Điểm: ${kqScore}`;
    document.getElementById("kq-char").textContent = k.char;

    const options = buildMeaningOptions(currentLesson.kanji, k, "hanviet");
    const wrap = document.getElementById("kq-options");
    wrap.innerHTML = "";
    options.forEach((opt) => {
      const b = document.createElement("button");
      b.className = "opt-btn";
      b.textContent = opt;
      b.addEventListener("click", () => handleKanjiAnswer(b, opt, k.hanviet));
      wrap.appendChild(b);
    });
    document.getElementById("kq-next").disabled = true;
  }

  function handleKanjiAnswer(btn, chosen, correct) {
    if (kqAnswered) return;
    kqAnswered = true;
    document.querySelectorAll("#kq-options .opt-btn").forEach((b) => {
      b.disabled = true;
      if (b.textContent === correct) b.classList.add("correct");
      else if (b === btn) b.classList.add("wrong");
    });
    if (chosen === correct) kqScore++;
    document.getElementById("kq-score").textContent = `Điểm: ${kqScore}`;
    document.getElementById("kq-next").disabled = false;
  }

  document.getElementById("kq-next").addEventListener("click", () => {
    if (kqIndex + 1 < kqOrder.length) { kqIndex++; renderKanjiQuizQuestion(); }
    else finishKanjiQuiz();
  });

  function finishKanjiQuiz() {
    const key = kanjiBestKey(currentLesson.id);
    saveBest(key, kqScore);
    document.getElementById("kq-question-wrap").classList.add("hidden");
    document.getElementById("kq-result").classList.remove("hidden");
    document.getElementById("kq-result-score").textContent = `${kqScore}/${kqOrder.length}`;
    document.getElementById("kq-result-best").textContent = `Điểm cao nhất: ${getBest(key)}/${kqOrder.length}`;
  }
  document.getElementById("kq-retry").addEventListener("click", () => startKanjiQuiz());

  // ---------------------------------------------------------
  // Khởi động
  // ---------------------------------------------------------
  renderLessonList();
  showView("list");
})();