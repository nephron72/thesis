document.addEventListener("DOMContentLoaded", () => {
  // ★ここにGASのウェブアプリURLを貼り付ける
  const GAS_URL = "ここにウェブアプリのURLを貼り付け";

  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  const successMessage = document.getElementById("successMessage");

  const musicForm = document.getElementById("musicForm");
  const surveyForm = document.getElementById("surveyForm");

  // タブ切り替え処理
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // ボタンのactive切り替え
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // コンテンツのactive切り替え
      const targetId = btn.getAttribute("data-target");
      tabContents.forEach((content) => {
        content.classList.remove("active");
        if (content.id === targetId) {
          content.classList.add("active");
        }
      });

      // タブ切り替え時は完了メッセージを隠す
      successMessage.classList.add("hidden");
    });
  });

  // 共通の送信処理関数
  const sendToGAS = async (payload, formElement, submitBtn) => {
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "送信中...";
    successMessage.classList.add("hidden");

    try {
      await fetch(GAS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload)
      });

      formElement.reset();
      // 画面上部に「送信されました」メッセージを表示
      successMessage.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      alert("送信に失敗しました。通信環境を確認してもう一度お試しください。");
      console.error(error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  };

  // ①「おすすめの音楽」フォーム送信
  musicForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const submitBtn = musicForm.querySelector(".submit-btn");

    const payload = {
      type: "おすすめの音楽",
      nickname: document.getElementById("musicNickname").value.trim(),
      song: document.getElementById("songName").value.trim(),
      artist: document.getElementById("artistName").value.trim(),
      frequency: document.querySelector('input[name="frequency"]:checked').value,
      comment: document.getElementById("musicComment").value.trim()
    };

    sendToGAS(payload, musicForm, submitBtn);
  });

  // ②「アンケート」フォーム送信
  surveyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const submitBtn = surveyForm.querySelector(".submit-btn");

    const payload = {
      type: "アンケート",
      nickname: document.getElementById("surveyNickname").value.trim(),
      listened: document.getElementById("listened").value.trim(),
      recommended: document.getElementById("recommended").value.trim()
    };

    sendToGAS(payload, surveyForm, submitBtn);
  });
});