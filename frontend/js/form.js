const feedbackForm = document.getElementById("feedbackForm");
const formMessage = document.getElementById("formMessage");
const submitButton = document.getElementById("submitButton");
// console.log("Feedback JavaScript loaded:", !!feedbackForm);
// event.preventDefault();
// console.log("Feedback form submitted");

const API_URL = "https://campus-voice-lime.vercel.app/api/feedback";

feedbackForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const studentName = document.getElementById("studentName").value.trim();
  const course = document.getElementById("course").value;
  const comments = document.getElementById("comments").value.trim();
  const selectedRating = document.querySelector(
    'input[name="rating"]:checked'
  );

  formMessage.textContent = "";
  formMessage.className = "form-message";

  if (!studentName || !comments || !selectedRating) {
    showMessage("Please complete all required fields.", "error");
    return;
  }

  const feedback = {
    studentName,
    course,
    rating: Number(selectedRating.value),
    comments,
  };

  submitButton.disabled = true;
  submitButton.innerHTML = "Submitting...";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedback),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Could not submit your feedback.");
    }

    showMessage("Thank you! Your feedback was submitted successfully.", "success");
    feedbackForm.reset();

    // Allow the success message to be read before navigating.
    setTimeout(() => {
      window.location.href = "feedback.html";
    }, 1200);
  } catch (error) {
    console.error("Feedback submission error:", error);
    showMessage(
      error.message === "Failed to fetch"
        ? "Unable to connect to the server. Please try again after the backend is running."
        : error.message,
      "error"
    );
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Submit feedback <span>→</span>';
  }
});

function showMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
}