/* Dmitrijs Pogodins — portfolio: valodas, darbi, animācijas. */
(function () {
  "use strict";
  var root = document.documentElement;
  var MOTION = root.classList.contains("motion");
  var hasGSAP = !!(window.gsap && window.ScrollTrigger);
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);
  if (!hasGSAP) { root.classList.remove("motion"); MOTION = false; }
  var FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var T = window.T, WORKS = window.WORKS;

  /* =========================================================
     Valoda
     ========================================================= */
  var L = "lv";
  try { var s = localStorage.getItem("lang"); if (T[s]) L = s; } catch (e) {}
  var CAT = { food: "fFood", beauty: "fBeauty", auto: "fAuto", biz: "fBiz", shop: "fShop" };

  // garo skrīnšotu augstums (900 px platumā), lai pārlūks zina izmēru pirms ielādes
  var LONG_H = { "autoserviss": 2190, "kafejnica": 2400, "konditoreja": 2331, "remonts": 1781, "salons": 2400, "veikals": 1301 };
  function renderWorks() {
    $("#grid").innerHTML = WORKS.map(function (w) {
      var mob = 'srcset="img/shots/' + w.s + '-m-sm.webp 240w, img/shots/' + w.s + '-m.webp 420w" sizes="(min-width: 760px) 15vw, 30vw"';
      var visual = w.m
        ? '<span class="ph ph-a"><img src="img/shots/' + w.s + '-m.webp" ' + mob + ' width="420" height="910" loading="lazy" alt=""></span>' +
          '<span class="ph ph-b"><img src="img/shots/' + w.s + '-m.webp" ' + mob + ' width="420" height="910" loading="lazy" alt="" style="object-position:center 60%"></span>'
        : '<span class="win"><span class="bar"><i></i><i></i><i></i></span><img src="img/shots/' + w.s + '-long.webp" srcset="img/shots/' + w.s + '-long-sm.webp 480w, img/shots/' + w.s +
          '-long.webp 900w" sizes="(min-width: 760px) 40vw, 86vw" width="900" height="' + (LONG_H[w.s] || 2000) + '" loading="lazy" alt=""></span>';
      return '<li class="card" data-c="' + w.c + '"><a href="' + w.s + '.html" target="_blank" rel="noopener">' +
        '<div class="shot">' + visual + "</div>" +
        '<div class="meta"><div><h3>' + w.n + "</h3><p>" + w.d[L] + '</p><span class="tag">' + T[L][CAT[w.c]] + " · " + (w.p4 ? T[L].pages4 : T[L].page1) + '</span></div><span class="go" aria-hidden="true">↗</span></div>' +
        "</a></li>";
    }).join("");
    initCards();
  }

  function apply() {
    root.lang = L;
    $$("[data-i]").forEach(function (e) { var v = T[L][e.dataset.i]; if (v != null) e.textContent = v; });
    $$(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.l === L)); });
    $("#mq").innerHTML = (T[L].rot.concat(T[L].rot)).map(function (w) { return "<span>" + w + "</span>"; }).join("");
    rotIndex = 0; $("#rot").textContent = T[L].rot[0];
    renderWorks();
    applyFilter(current);
    if (window.startBot) window.startBot(L);
    if (hasGSAP) ScrollTrigger.refresh();
  }
  $$(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { L = b.dataset.l; try { localStorage.setItem("lang", L); } catch (e) {} apply(); });
  });

  /* ---------- Rotējošais vārds virsrakstā ---------- */
  var rotIndex = 0;
  function rotate() {
    // kustas ārējā kaste; gradients paliek iekšējam vārdam (citādi Chromium to nezīmē)
    var el = $("#rot"), box = $("#rotBox"), list = T[L].rot; rotIndex = (rotIndex + 1) % list.length;
    if (!MOTION || !root.classList.contains("intro-done")) { el.textContent = list[rotIndex]; return; }
    gsap.timeline()
      .to(box, { yPercent: -110, duration: .45, ease: "power3.in" })
      .add(function () { el.textContent = list[rotIndex]; })
      .fromTo(box, { yPercent: 110 }, { yPercent: 0, duration: .6, ease: "expo.out" });
  }
  setInterval(rotate, 2400);

  /* ---------- Filtrs ---------- */
  var current = "all";
  function applyFilter(f) {
    current = f;
    $$(".filters button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.f === f)); });
    var cards = $$(".card");
    cards.forEach(function (c) { c.classList.toggle("is-out", f !== "all" && c.dataset.c !== f); });
    if (MOTION) gsap.fromTo($$(".card:not(.is-out)"), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .06, ease: "expo.out", overwrite: true });
    if (hasGSAP) ScrollTrigger.refresh();
  }
  $(".filters").addEventListener("click", function (e) { var b = e.target.closest("button[data-f]"); if (b) applyFilter(b.dataset.f); });

  /* ---------- Kartītes: 3D slīpums + gaismas plankums ---------- */
  function initCards() {
    if (!FINE || !MOTION) return;
    $$(".card a").forEach(function (a) {
      var shot = $(".shot", a);
      a.addEventListener("pointermove", function (e) {
        var r = a.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        a.style.transform = "rotateY(" + (x * 7) + "deg) rotateX(" + (-y * 7) + "deg) translateZ(0)";
        shot.style.setProperty("--mx", ((x + .5) * 100) + "%"); shot.style.setProperty("--my", ((y + .5) * 100) + "%");
      });
      a.addEventListener("pointerleave", function () { a.style.transform = ""; });
    });
  }

  /* ---------- Kopēt e-pastu ---------- */
  function toast(t) { var e = $("#toast"); e.textContent = t; e.hidden = false; clearTimeout(toast.x); toast.x = setTimeout(function () { e.hidden = true; }, 1800); }
  $("#copy").addEventListener("click", function () {
    var m = $("#mail");
    (navigator.clipboard ? navigator.clipboard.writeText(m.textContent) : Promise.reject())
      .then(function () { toast(T[L].copied); })
      .catch(function () { var r = document.createRange(); r.selectNodeContents(m); var s = getSelection(); s.removeAllRanges(); s.addRange(r); toast(T[L].sel); });
  });

  /* ---------- Galvene ---------- */
  var top = $("#top"), last = 0;
  addEventListener("scroll", function () {
    var y = scrollY; top.classList.toggle("is-solid", y > 30); top.classList.toggle("is-hidden", y > last && y > 500); last = y;
  }, { passive: true });

  apply();

  /* =========================================================
     Kustība
     ========================================================= */
  if (!MOTION) { root.classList.add("ready"); return; }

  // plūdena ritināšana
  var lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) { var id = a.getAttribute("href"); if (id.length > 1 && $(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -70 }); } });
    });
  }

  // ievads: priekškars aizbrauc, virsraksts izbīd, ierīces ielido
  var intro = gsap.timeline({ defaults: { ease: "expo.out" } });
  intro
    .from(".curtain-logo", { yPercent: 100, opacity: 0, duration: .6 })
    .to(".curtain-logo", { yPercent: -100, opacity: 0, duration: .45, ease: "power3.in" }, "+=.15")
    .to(".curtain", { yPercent: -100, duration: .9, ease: "expo.inOut" }, "-=.2")
    // y: 0 — CSS sāk ar translateY(110%); bez tā GSAP to uztvertu kā papildu nobīdi pikseļos
    .fromTo(".hero-title .ln > span", { yPercent: 110, y: 0 }, { yPercent: 0, y: 0, duration: 1.2, stagger: .1 }, "-=.45")
    // tikai plakana kustība: 3D pagrieziens perspektīvā Chrome tiek skaitīts kā izkārtojuma nobīde (CLS)
    .fromTo(".dev", { opacity: 0, scale: .92 }, { opacity: 1, scale: 1, duration: 1.4, stagger: .12, clearProps: "scale" }, "<.15")
    .fromTo(".badge", { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .8, stagger: .15, ease: "back.out(2)" }, "<.6")
    .fromTo(".lead, .cta-row, .facts", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, stagger: .1 }, "<-.6")
    .add(function () { root.classList.add("intro-done"); $(".curtain").style.display = "none"; counters($$(".facts .count")); });
  setTimeout(function () { if (!root.classList.contains("intro-done")) { intro.progress(1); } }, 4500);

  function counters(els) {
    els.forEach(function (el) {
      var to = +el.dataset.to, o = { v: 0 };
      gsap.to(o, { v: to, duration: 1.6, ease: "power3.out", onUpdate: function () { el.textContent = Math.round(o.v); } });
    });
  }

  // skatuve seko pelei; ritinot ierīces izklīst
  if (FINE) {
    var rx = gsap.quickTo("#stage", "rotationY", { duration: .9, ease: "power3" }), ry = gsap.quickTo("#stage", "rotationX", { duration: .9, ease: "power3" });
    addEventListener("pointermove", function (e) { rx((e.clientX / innerWidth - .5) * 14); ry(-(e.clientY / innerHeight - .5) * 10); }, { passive: true });
  }
  if (matchMedia("(min-width: 1000px)").matches) {
    [[".b1", -40], [".b2", 60], [".p1", -120], [".p2", -200], [".bd1", -160], [".bd2", -90]].forEach(function (p) {
      gsap.to(p[0], { y: p[1], ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    });
  }
  gsap.to(".hero-copy", { y: -80, opacity: .3, ease: "none", scrollTrigger: { trigger: ".hero", start: "30% top", end: "bottom top", scrub: true } });
  gsap.to(".g1", { yPercent: 60, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true } });
  gsap.to(".g2", { yPercent: -40, xPercent: -20, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true } });

  // lente: paātrinās ritinot
  var mq = gsap.to("#mq", { xPercent: -50, ease: "none", duration: 30, repeat: -1 });
  ScrollTrigger.create({ onUpdate: function (s) {
    var v = 1 + Math.min(5, Math.abs(s.getVelocity()) / 250);
    gsap.timeline({ overwrite: true }).to(mq, { timeScale: s.direction * v, duration: .15 }).to(mq, { timeScale: s.direction, duration: 1.2, ease: "power2.out" }, "+=.1");
  } });

  // sadaļu virsraksti: vārdi izbīd no apakšas
  $$(".h2, .contact-title").forEach(function (h) {
    gsap.from(h, { yPercent: 40, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 88%" } });
  });
  $$(".sub").forEach(function (p) { gsap.from(p, { y: 20, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: p, start: "top 90%" } }); });

  // darbu kartītes: atveras ar masku
  ScrollTrigger.batch(".card", { start: "top 90%", once: true, onEnter: function (els) {
    gsap.fromTo(els, { clipPath: "inset(18% 6% 0% 6% round 22px)", y: 80, opacity: 0 },
      { clipPath: "inset(0% 0% 0% 0% round 22px)", y: 0, opacity: 1, duration: 1.2, stagger: .1, ease: "expo.out", clearProps: "clipPath" });
  } });

  // AI bloks
  gsap.from(".chat", { x: -60, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: ".ai", start: "top 80%" } });
  gsap.from(".back", { x: 60, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: ".ai", start: "top 80%" } });
  gsap.from(".svc > div", { y: 40, opacity: 0, duration: .9, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: ".svc", start: "top 88%" } });

  // laika līnija zīmējas līdzi ritināšanai
  var wide = matchMedia("(min-width: 900px)").matches;
  gsap.fromTo(".tl-fill", wide ? { scaleX: 0, scaleY: 1 } : { scaleY: 0 }, { scaleX: 1, scaleY: 1, ease: "none", scrollTrigger: { trigger: ".timeline", start: "top 75%", end: "bottom 55%", scrub: .6 } });
  $$(".timeline li").forEach(function (li, i) {
    gsap.from(li, { y: 30, opacity: 0, duration: .9, ease: "expo.out", scrollTrigger: { trigger: li, start: "top 85%" } });
    gsap.from($(".dot", li), { scale: 0, duration: .6, ease: "back.out(3)", scrollTrigger: { trigger: li, start: "top 80%" } });
  });

  // cenas: kartītes paceļas, summas saskaitās
  gsap.from(".plan", { y: 80, opacity: 0, duration: 1.1, stagger: .12, ease: "expo.out", scrollTrigger: { trigger: ".plans", start: "top 80%", onEnter: function () { counters($$(".plan .count")); } } });
  gsap.from(".extras > div", { y: 20, opacity: 0, duration: .7, stagger: .06, ease: "expo.out", scrollTrigger: { trigger: ".extras", start: "top 90%" } });

  // kursors un magnētiskās pogas
  if (FINE) {
    root.classList.add("has-cursor");
    var c = $(".cursor"), lab = $("#curLabel");
    var cx = gsap.quickTo(c, "x", { duration: .25, ease: "power3" }), cy = gsap.quickTo(c, "y", { duration: .25, ease: "power3" });
    addEventListener("pointermove", function (e) { cx(e.clientX); cy(e.clientY); }, { passive: true });
    document.addEventListener("pointerover", function (e) {
      var card = e.target.closest(".card a"), link = !card && e.target.closest("a, button, input");
      c.classList.toggle("is-view", !!card); c.classList.toggle("is-link", !!link);
      lab.textContent = card ? T[L].open : "";
    });
    $$(".magnetic").forEach(function (b) {
      var xTo = gsap.quickTo(b, "x", { duration: .6, ease: "elastic.out(1, .4)" }), yTo = gsap.quickTo(b, "y", { duration: .6, ease: "elastic.out(1, .4)" });
      b.addEventListener("pointermove", function (e) { var r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * .3); yTo((e.clientY - r.top - r.height / 2) * .4); });
      b.addEventListener("pointerleave", function () { xTo(0); yTo(0); });
    });
  }

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  addEventListener("load", function () { ScrollTrigger.refresh(); });
  root.classList.add("ready");
})();
