const list = document.getElementById("recipe-list");
const search = document.getElementById("search");
const category = document.getElementById("category");
const empty = document.getElementById("empty");
let recipes = [];
let ranking = {};

document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("today-label").textContent =
  new Intl.DateTimeFormat("ja-JP", {year:"numeric",month:"long",day:"numeric",weekday:"long"}).format(new Date()) + " のランキング";

async function load() {
  try {
    const [recipeRes, rankRes] = await Promise.all([
      fetch("/recipes.json"),
      fetch("/api/ranking")
    ]);
    if (!recipeRes.ok) throw new Error("レシピ一覧を取得できません");
    recipes = await recipeRes.json();
    ranking = rankRes.ok ? await rankRes.json() : {};
    render();
  } catch (e) {
    list.innerHTML = '<p class="loading">データを読み込めませんでした。ページを再読み込みしてください。</p>';
  }
}

function render() {
  const q = search.value.trim().toLowerCase();
  const c = category.value;
  const filtered = recipes
    .filter(r => (c === "all" || r.category === c) &&
      (!q || (r.title + r.description + r.category).toLowerCase().includes(q)))
    .sort((a,b) => (ranking[b.id] || 0) - (ranking[a.id] || 0));
  list.innerHTML = "";
  empty.classList.toggle("hidden", filtered.length !== 0);
  filtered.forEach((r,i) => {
    const count = ranking[r.id] || 0;
    const card = document.createElement("article");
    card.className = "recipe-card";
    const top = document.createElement("div");
    top.className = "card-top";
    top.innerHTML = `<span class="rank">${i+1}位</span><span class="category-tag">${escapeHtml(r.category)}</span>`;
    const body = document.createElement("div");
    body.className = "card-body";
    const title = document.createElement("h3"); title.textContent = r.title;
    const desc = document.createElement("p"); desc.className = "description"; desc.textContent = r.description;
    const meta = document.createElement("div"); meta.className = "meta";
    meta.textContent = `${r.time} ・ 本日の紹介クリック ${count}回`;
    const link = document.createElement("a");
    link.className = "recipe-link"; link.href = r.url; link.target = "_blank"; link.rel = "noopener noreferrer";
    link.textContent = `${r.source}を見る ↗`;
    link.addEventListener("click", () => {
      // Tracking is best-effort: the external link should still open if analytics is unavailable.
      fetch("/api/track", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:r.id}),keepalive:true}).catch(()=>{});
    });
    body.append(title,desc,meta,link); card.append(top,body); list.append(card);
  });
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
search.addEventListener("input",render);
category.addEventListener("change",render);
load();