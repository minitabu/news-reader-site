let currentLang = 'ja-JP';

document.getElementById("language").addEventListener("change", (e) => {
  currentLang = e.target.value;
  const sourceSelect = document.getElementById("source");
  sourceSelect.innerHTML = '';
  if (currentLang === "ja-JP") {
    sourceSelect.innerHTML = `
      <option value="https://www3.nhk.or.jp/rss/news/cat0.xml">NHKニュース</option>
      <option value="https://news.yahoo.co.jp/rss/topics/top-picks.xml">Yahooニュース</option>
    `;
  } else {
    sourceSelect.innerHTML = `
      <option value="https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml">New York Times</option>
      <option value="https://feeds.bbci.co.uk/news/world/rss.xml">BBC World</option>
    `;
  }
});

document.getElementById("rate").addEventListener("input", (e) => {
  document.getElementById("rateValue").textContent = e.target.value + "x";
});

document.getElementById("load").addEventListener("click", async () => {
  const source = document.getElementById("source").value;
  const keyword = document.getElementById("keyword").value.trim().toLowerCase();
  const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(source)}`);
  const data = await res.json();
  const parser = new DOMParser();
  const xml = parser.parseFromString(data.contents, "text/xml");
  const items = Array.from(xml.querySelectorAll("item"));
  const list = document.getElementById("newsList");
  list.innerHTML = "";
  items.forEach((item) => {
    const title = item.querySelector("title").textContent;
    const desc = item.querySelector("description")?.textContent || "";
    if (keyword && !title.toLowerCase().includes(keyword) && !desc.toLowerCase().includes(keyword)) return;
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;
    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(" " + title));
    list.appendChild(li);
  });
});

document.getElementById("startSpeech").addEventListener("click", speakSelectedNews);
document.getElementById("pauseSpeech").addEventListener("click", () => speechSynthesis.pause());
document.getElementById("resumeSpeech").addEventListener("click", () => speechSynthesis.resume());
document.getElementById("toggleTheme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

function speakSelectedNews() {
  const rate = parseFloat(document.getElementById("rate").value);
  const listItems = document.querySelectorAll('#newsList li');
  speechSynthesis.cancel();
  let delay = 0;
  listItems.forEach((li) => {
    const checkbox = li.querySelector('input[type="checkbox"]');
    if (!checkbox || !checkbox.checked) return;
    const utter = new SpeechSynthesisUtterance(li.textContent);
    utter.lang = currentLang;
    utter.rate = rate;
    setTimeout(() => speechSynthesis.speak(utter), delay);
    delay += 3000;
  });
}

window.addEventListener("load", () => {
  document.getElementById("language").dispatchEvent(new Event("change"));
});
