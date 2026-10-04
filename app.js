let selectedLanguage = "am";


function setLanguage(language) {

  selectedLanguage = language;

  const input = document.getElementById("userInput");

  if (language === "am") {
    input.placeholder =
      "የቁርኣን ወይም የሀዲስ ጥያቄዎን ይጻፉ...";
  }

  if (language === "om") {
    input.placeholder =
      "Gaaffii Qur'aanaa ykn Hadiisaa keessan barreessaa...";
  }

  if (language === "ar") {
    input.placeholder =
      "اكتب سؤالك عن القرآن أو الحديث...";
  }

  if (language === "en") {
    input.placeholder =
      "Ask your Qur'an or Hadith question...";
  }
}


function askQuestion(question) {

  document.getElementById("userInput").value = question;

  sendMessage();
}


function addMessage(text, type) {

  const messages = document.getElementById("messages");

  const wrapper = document.createElement("div");

  wrapper.className = "message " + type;


  const avatar = document.createElement("div");

  avatar.className = "avatar";

  avatar.textContent = type === "ai" ? "☪️" : "👤";


  const bubble = document.createElement("div");

  bubble.className = "bubble";


  if (type === "ai") {

    const name = document.createElement("strong");

    name.textContent = "Muslim AI";

    bubble.appendChild(name);

  }


  const paragraph = document.createElement("p");

  paragraph.textContent = text;

  bubble.appendChild(paragraph);


  wrapper.appendChild(avatar);

  wrapper.appendChild(bubble);

  messages.appendChild(wrapper);


  messages.scrollTop = messages.scrollHeight;
}


async function sendMessage() {

  const input = document.getElementById("userInput");

  const button = document.getElementById("sendButton");

  const typing = document.getElementById("typing");

  const question = input.value.trim();


  if (!question) {
    return;
  }


  addMessage(question, "user");


  input.value = "";

  button.disabled = true;

  typing.style.display = "block";


  try {

    const response = await fetch("/api/chat", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        message: question,

        language: selectedLanguage

      })

    });


    const data = await response.json();


    if (!response.ok) {

      throw new Error(
        data.error || "Something went wrong."
      );

    }


    addMessage(data.answer, "ai");


  } catch (error) {

    addMessage(
      "ይቅርታ፣ ችግር ተፈጥሯል። " +
      error.message,
      "ai"
    );

  } finally {

    button.disabled = false;

    typing.style.display = "none";

    input.focus();

  }

}


document
  .getElementById("userInput")
  .addEventListener("keydown", function(event) {

    if (event.key === "Enter" && !event.shiftKey) {

      event.preventDefault();

      sendMessage();

    }

  });
