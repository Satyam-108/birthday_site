const TREASURE_KEY = "mahiTreasureFoundHearts";
const ACCEPTANCE_KEY = "mahiTreasureAcceptance";
const TOTAL_HEARTS = 7;

function getFoundHearts() {
  try {
    return JSON.parse(localStorage.getItem(TREASURE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveFoundHearts(found) {
  localStorage.setItem(TREASURE_KEY, JSON.stringify([...new Set(found)]));
}

function getTreasureProgress() {
  return getFoundHearts().length;
}

function isTreasureComplete() {
  return getTreasureProgress() >= TOTAL_HEARTS;
}

function showTreasureToast(message = "Golgappa Found") {
  let toast = document.querySelector(".treasure-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "treasure-toast";
    document.body.appendChild(toast);
  }

  toast.innerHTML = `&#129375; ${message}`;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

function collectTreasureHeart(id) {
  const found = getFoundHearts();
  if (found.includes(id)) {
    showTreasureToast("Already Found");
    return;
  }

  found.push(id);
  saveFoundHearts(found);
  showTreasureToast("Golgappa Found");
  window.dispatchEvent(new CustomEvent("treasure-progress", {
    detail: { found: found.length, total: TOTAL_HEARTS }
  }));
}

function initTreasureHearts() {
  const found = getFoundHearts();
  document.querySelectorAll("[data-treasure-heart]").forEach((heart) => {
    const id = heart.dataset.treasureHeart;
    if (found.includes(id)) heart.classList.add("found");

    heart.addEventListener("click", () => {
      collectTreasureHeart(id);
      heart.classList.add("found");
    });
  });
}

function updateTreasureProgressText() {
  const target = document.querySelector("[data-treasure-progress]");
  const unlock = document.querySelector("[data-treasure-unlock]");
  const found = getTreasureProgress();

  if (target) target.textContent = `${found}/${TOTAL_HEARTS} Golgappas Found`;
  if (unlock) {
    unlock.hidden = found < TOTAL_HEARTS;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initTreasureHearts();
  updateTreasureProgressText();
});

window.addEventListener("treasure-progress", updateTreasureProgressText);
