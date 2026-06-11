const confessions = [
  "I pretend I'm busy sometimes, but the truth is I'm always happier when your notification pops up.",
  "The day you said \"I love you too\" became one of my favorite memories without you even realizing it.",
  "I don't always react perfectly in the moment, but I notice way more things about you than I say.",
  "That fit-check video deserved a better reaction than the one I gave. You looked beautiful.",
  "Sometimes I replay our calls in my head after they end.",
  "I smile whenever you say \"hmm\" before telling me something important.",
  "The cheesecake and rasgullas were sweet, but knowing you thought about me was sweeter.",
  "Even our stupid little arguments matter to me because they're still moments with you.",
  "I notice when your voice sounds tired, even when you say you're fine.",
  "I like hearing about your day, even when you think it's boring.",
  "Some songs don't remind me of places anymore. They remind me of you.",
  "I still get excited before your calls.",
  "When you're sad, I wish distance was something I could switch off.",
  "The best part of my day is usually the part where I talk to you.",
  "I don't say it enough, but I feel lucky that you chose me.",
  "I want to be the person you feel safest talking to.",
  "One of my favorite things is hearing you laugh at something completely random.",
  "The more I know you, the more I like you.",
  "If I had to relive the day we met, I'd still choose to meet you again.",
  "I still remember 7 June, 5:48 AM. Most people would see a time. I see the moment you made me the happiest guy alive.",
  "Every time you trust me with your feelings, I silently promise myself to take care of them.",
  "I love that you can turn an ordinary day into my favorite memory.",
  "No matter how many pages this website gets, my favorite part will always be you.",
  "I kept clicking 'Next Confession' too, hoping I'd find the perfect words for you. I still haven't found them. \u2665"
];

const openWhenMessages = {
  sad: "Come here for a second. You do not have to be strong every minute. Breathe slowly, drink water, and remember that even on your lowest day, you are still deeply lovable.",
  angry: "Okay, angry Mahi is scary and cute. Take a pause before replying to anyone. I am on your side first, always. Tell me everything when you are ready.",
  miss: "If you miss me, just know I probably miss you too in some quiet way. Imagine me annoying you gently and telling you to smile a little.",
  period: "Be extra soft with yourself today. Rest, eat something warm, keep water near you, and do not feel guilty for needing care. You deserve comfort without explaining it.",
  motivation: "You are capable, even when your mind is tired. Do one small thing, then another. I believe in you more than you probably believe in yourself today.",
  unloved: "You are not hard to love. You are not too much. You are someone with a soft heart, and anyone lucky enough to really know you should handle that gently."
};

const mahiResponses = {
  sad: "Mahi, sadness is allowed. But you are not alone in it. If I were there, I would sit quietly beside you until your heart felt lighter.",
  angry: "Angry Mahi detected. Recommendation: no impulsive texts, one deep breath, and then full ranting rights with Satyam.",
  missing: "Missing Satyam mode on. He would probably say: stop making that face, I am right here in this little page.",
  happy: "Happy Mahi is my favorite update. Keep that smile. It looks good on your whole world.",
  hungry: "Emergency protocol: feed Mahi immediately. Something sweet is preferred, but attention from Satyam also counts."
};

function initConfessions() {
  const text = document.querySelector("[data-confession-text]");
  const next = document.querySelector("[data-next-confession]");
  const count = document.querySelector("[data-confession-count]");
  if (!text || !next || !count) return;

  let index = 0;
  function showConfession() {
    text.classList.remove("show");
    setTimeout(() => {
      text.textContent = confessions[index];
      count.textContent = `${index + 1} / ${confessions.length}`;
      text.classList.add("show");
    }, 120);
  }

  next.addEventListener("click", () => {
    index = (index + 1) % confessions.length;
    showConfession();
  });

  showConfession();
}

function initOpenWhen() {
  document.querySelectorAll("[data-open-when]").forEach((card) => {
    card.addEventListener("click", () => {
      const key = card.dataset.openWhen;
      const message = card.querySelector(".open-message");
      card.classList.toggle("open");
      if (message) message.textContent = openWhenMessages[key] || "";
    });
  });
}

function initMahiAi() {
  const response = document.querySelector("[data-ai-response]");
  if (!response) return;

  document.querySelectorAll("[data-mood]").forEach((button) => {
    button.addEventListener("click", () => {
      const mood = button.dataset.mood;
      response.textContent = mahiResponses[mood] || "Mahi deserves softness today.";
      floatHearts();
    });
  });
}

function floatHearts() {
  for (let i = 0; i < 12; i++) {
    const heart = document.createElement("div");
    heart.className = "heart-float";
    heart.innerHTML = "&#10084;";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = 16 + Math.random() * 22 + "px";
    heart.style.animationDelay = Math.random() * .45 + "s";
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 2900);
  }
}

async function initFutureLetter() {
  const target = document.querySelector("[data-future-letter]");
  if (!target) return;

  const letter = `Dear Future Mahi,

I don't know when you're reading this.

Maybe tomorrow.

Maybe after a long day.

Maybe years from now.

But if you're here, I just want you to remember something.

Meeting you was one of the best things that happened to me.

I still remember the calls, the laughs, the random conversations, the fit checks, and especially 7 June, 5:48 AM — the moment that made me the happiest guy alive.

I hope life is being kind to you.

And if you're reading this after a difficult day, remember this:

There was a version of me who sat here, thinking about you, smiling at the thought of you, and feeling incredibly lucky that you existed.

And I hope you never forget how special you are.

No matter how much time passes, this will always be true:

You made my world a little brighter, Mahi. ❤️

Love, Satyam \u2665`;

  target.textContent = "";
  target.classList.add("typing-caret");
  for (let i = 0; i < letter.length; i++) {
    target.textContent += letter.charAt(i);
    await new Promise((resolve) => setTimeout(resolve, letter.charAt(i) === "\n" ? 130 : 28));
  }
  target.classList.remove("typing-caret");
}

document.addEventListener("DOMContentLoaded", () => {
  initConfessions();
  initOpenWhen();
  initMahiAi();
  initFutureLetter();
});
