const WHATSAPP = "";   // e.g. "260970000000" (country code, no +). Leave empty to hide the button.
const SONGS = [
  {file:"assets/audio/breathless.mp3", title:"Breathless",       artist:"The Corrs"},
  {file:"assets/audio/dandelions.mp3", title:"Dandelions",       artist:"Ruth B."},
  {file:"assets/audio/a-thousand-years.mp3",   title:"A Thousand Years", artist:"Christina Perri"}
];
const $ = id => document.getElementById(id);

/* petals */
(function(){const w=$("petals");for(let i=0;i<16;i++){const p=document.createElement("i"),s=8+Math.random()*12;
p.style.cssText="left:"+Math.random()*100+"%;width:"+s+"px;height:"+s+"px;animation-duration:"+(14+Math.random()*16)+"s;animation-delay:-"+Math.random()*20+"s";w.appendChild(p);}})();

/* music: one audio element, started by the tap itself */
const bg = $("bg"); bg.loop = true;
let current = -1, muted = false;
const btns = [], labels = [];
function setLabel(i,t){
  if(i < 0) return;
  labels.forEach(l => { if(l.i === i) l.el.textContent = t; });
  const np = $("np"); np.classList.add("show");
  $("npt").textContent = t === "playing" ? SONGS[i].title + ", " + SONGS[i].artist : SONGS[i].title + " (" + t + ")";
  np.classList.toggle("on", t === "playing");
}
function choose(i){
  if(current === i && !bg.paused){ bg.pause(); setLabel(i,"paused"); return; }
  if(current !== i){ current = i; bg.src = SONGS[i].file; bg.load(); }
  bg.muted = muted; setLabel(i,"loading...");
  const r = bg.play(); if(r && r.catch) r.catch(() => setLabel(i,"tap again to play"));
  btns.forEach(x => x.el.classList.toggle("sel", x.i === current));
  $("start").disabled = false;
}
function build(ul){
  SONGS.forEach((s,i) => {
    const li = document.createElement("li");
    li.innerHTML = '<button class="song"><span class="n">'+(i+1)+'</span><span class="t"><b></b><span></span></span><span class="s"></span></button>';
    li.querySelector("b").textContent = s.title; li.querySelector(".t > span").textContent = s.artist;
    const x = li.querySelector("button"); btns.push({i,el:x}); labels.push({i,el:li.querySelector(".s")});
    x.onclick = () => choose(i); ul.appendChild(li);
  });
}
build($("songs1")); build($("songs2"));
bg.onplaying = () => setLabel(current,"playing");
bg.onwaiting = () => setLabel(current,"loading...");
bg.onpause   = () => $("np").classList.remove("on");
bg.onerror   = () => setLabel(current,"could not load - check the assets/audio folder");
$("mute").onclick = () => { muted = !muted; bg.muted = muted; $("mute").textContent = muted ? "Unmute" : "Mute"; };
$("chg").onclick = () => $("pop").classList.toggle("show");
document.addEventListener("click", e => { if(!e.target.closest("#pop,#chg")) $("pop").classList.remove("show"); });

/* flow */
setTimeout(() => { $("loader").classList.add("gone"); $("intro").classList.remove("gone"); }, 2400);
function begin(){
  $("intro").classList.add("gone");
  setTimeout(() => { $("intro").style.display = "none"; }, 1000);
  $("main").style.display = "block"; window.scrollTo(0,0);
  if(current < 0) $("np").classList.remove("show");
  const io = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }), {threshold:.2,rootMargin:"0px 0px -8% 0px"});
  document.querySelectorAll(".seq").forEach(p => {
    const parts = p.textContent.trim().split(/(?<=[.!?])\s+/);
    p.textContent = "";
    parts.forEach((t,k) => { const s = document.createElement("span"); s.textContent = t + (k < parts.length-1 ? " " : ""); s.style.setProperty("--i", k); p.appendChild(s); });
  });
  document.querySelectorAll(".rv,.seq,.orn").forEach(el => io.observe(el));
}
$("start").onclick = begin; $("skip").onclick = begin;
document.querySelectorAll(".flip").forEach(b => b.onclick = () => b.classList.toggle("on"));
document.querySelectorAll(".env").forEach(b => b.onclick = () => b.classList.toggle("open"));

/* answer */
$("moment").onclick = () => { $("reply1").textContent = "Of course. Take all the time you need. I am grateful you read this far."; };
$("yes").onclick = () => {
  $("yes-screen").classList.remove("gone"); $("yes-screen").classList.add("show");
  if(WHATSAPP){ const a = $("wa"); a.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent("Yes."); a.style.display = "inline-block"; }
};
