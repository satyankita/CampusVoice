const API_URL = "http://localhost:5000/api/feedback";

const feedbackList = document.getElementById("feedbackList");
const feedbackStatus = document.getElementById("feedbackStatus");
const refreshButton = document.getElementById("refreshButton");

const totalFeedback = document.getElementById("totalFeedback");
const averageRating = document.getElementById("averageRating");
const positiveFeedback = document.getElementById("positiveFeedback");

refreshButton.addEventListener("click", loadFeedback);

async function loadFeedback() {
  feedbackStatus.textContent = "Loading feedback...";
  feedbackStatus.className = "feedback-status";
  feedbackList.replaceChildren();
  refreshButton.disabled = true;

  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Unable to load feedback.");
    }

    // The API will return an array of feedback records.
    const feedbackItems = Array.isArray(result)
      ? result
      : result.feedback;

    if (!Array.isArray(feedbackItems)) {
      throw new Error("The server returned an unexpected response.");
    }

    updateStats(feedbackItems);
    renderFeedback(feedbackItems);
  } catch (error) {
    console.error("Loading feedback error:", error);

    feedbackStatus.textContent =
      "Couldn't load feedback. Please make sure the backend server is running.";
    feedbackStatus.className = "feedback-status error";
  } finally {
    refreshButton.disabled = false;
  }
}

function updateStats(items) {
  const total = items.length;

  const average = total
    ? items.reduce((sum, item) => sum + Number(item.rating || 0), 0) / total
    : 0;

  const positive = items.filter(
    (item) => Number(item.rating) >= 4
  ).length;

  totalFeedback.textContent = total;
  averageRating.innerHTML = `${average.toFixed(1)} <small>/ 5</small>`;
  positiveFeedback.textContent = positive;
}

function renderFeedback(items) {
  feedbackList.replaceChildren();

  if (items.length === 0) {
    feedbackStatus.textContent = "No feedback yet. Be the first to share your experience!";
    feedbackStatus.className = "feedback-status";
    return;
  }

  feedbackStatus.textContent = `${items.length} response${items.length === 1 ? "" : "s"} found.`;
  feedbackStatus.className = "feedback-status";

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "feedback-item";

    const name = item.studentName || item.name || "Anonymous";
    const initial = name.trim().charAt(0).toUpperCase() || "?";
    const rating = Math.max(0, Math.min(5, Number(item.rating) || 0));

    const avatar = document.createElement("div");
    avatar.className = "feedback-avatar";
    avatar.textContent = initial;

    const content = document.createElement("div");
    content.className = "feedback-item-content";

    const top = document.createElement("div");
    top.className = "feedback-item-top";

    const identity = document.createElement("div");
    identity.className = "feedback-identity";

    const studentName = document.createElement("h3");
    studentName.textContent = name;

    const course = document.createElement("p");
    course.className = "feedback-course";
    course.textContent = item.course || "Student";

    identity.append(studentName, course);

    const date = document.createElement("span");
    date.className = "feedback-date";

    if (item.createdAt) {
      const parsedDate = new Date(item.createdAt);

      date.textContent = Number.isNaN(parsedDate.getTime())
        ? ""
        : parsedDate.toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
    }

    top.append(identity, date);

    const stars = document.createElement("div");
    stars.className = "feedback-stars";
    stars.setAttribute("aria-label", `${rating} out of 5 stars`);
    stars.textContent = "★".repeat(rating) + "☆".repeat(5 - rating);

    const comment = document.createElement("p");
    comment.className = "feedback-comment";
    comment.textContent = item.comments || item.comment || "No comment provided.";

    content.append(top, stars, comment);
    card.append(avatar, content);
    feedbackList.appendChild(card);
  });
}

loadFeedback();