/* Demo AI bots (Volta Pizzeria): sarakste + "aizkulises" (tabula, Telegram, SMS). window.startBot(valoda). */
(function () {
  "use strict";
  var CH = {
lv:{hi:"Sveiki! 👋 Esmu Volta picērijas bots. Ar ko varu palīdzēt?",c:["Vai esat atvērti?","Ēdienkarte un cenas","Pasūtīt picu","Rezervēt galdiņu"],open:"Jā, šodien strādājam līdz 23:00. Piegāde aizņem ~25 min, pašizvešana ~15 min.",menu:"Populārākās:\nMargherita · 8,50 €\nDiavola · 10,90 €\nQuattro formaggi · 11,50 €\nBianca verde · 9,90 €",which:"Kuru picu vēlaties?",how:"Pašizvešana vai piegāde?",ways:["Pašizvešana","Piegāde"],phone:"Jūsu tālruņa numurs?",ph:"+371 2…",demoPh:"+371 2000 0000",done:function(o){return "✅ Pasūtījums #"+o.n+" pieņemts!\n"+o.p+", "+o.w.toLowerCase()+".\nGatavs ap "+o.t+". Paldies!";},book:"Uz cik personām un kad?",bookOpts:["2 personas, šodien 19:00","4 personas, rīt 18:30"],booked:function(o){return "✅ Galdiņš rezervēts: "+o.b+". Gaidīsim jūs!";},more:"Vēl kaut kas?",tg:function(o){return "🍕 Jauns pasūtījums #"+o.n+"\n"+o.p+" · "+o.w+"\n📞 "+o.ph+"\nGatavs: "+o.t;},tgB:function(o){return "📅 Jauna rezervācija\n"+o.b;},sms:function(o){return "Volta: pasūtījums #"+o.n+" pieņemts, gatavs ap "+o.t+". 🍕";},smsB:function(o){return "Volta: galdiņš rezervēts ("+o.b+"). Atgādināsim 2 h pirms.";},send:"Sūtīt",typing:"raksta…",booking:"Rezervācija"},
ru:{hi:"Здравствуйте! 👋 Я бот пиццерии Volta. Чем помочь?",c:["Вы сейчас открыты?","Меню и цены","Заказать пиццу","Забронировать столик"],open:"Да, сегодня работаем до 23:00. Доставка ~25 мин, самовывоз ~15 мин.",menu:"Самые популярные:\nMargherita · 8,50 €\nDiavola · 10,90 €\nQuattro formaggi · 11,50 €\nBianca verde · 9,90 €",which:"Какую пиццу хотите?",how:"Самовывоз или доставка?",ways:["Самовывоз","Доставка"],phone:"Ваш номер телефона?",ph:"+371 2…",demoPh:"+371 2000 0000",done:function(o){return "✅ Заказ #"+o.n+" принят!\n"+o.p+", "+o.w.toLowerCase()+".\nБудет готов к "+o.t+". Спасибо!";},book:"На сколько человек и когда?",bookOpts:["2 человека, сегодня 19:00","4 человека, завтра 18:30"],booked:function(o){return "✅ Столик забронирован: "+o.b+". Ждём вас!";},more:"Что-нибудь ещё?",tg:function(o){return "🍕 Новый заказ #"+o.n+"\n"+o.p+" · "+o.w+"\n📞 "+o.ph+"\nГотов к: "+o.t;},tgB:function(o){return "📅 Новая бронь\n"+o.b;},sms:function(o){return "Volta: заказ #"+o.n+" принят, будет готов к "+o.t+". 🍕";},smsB:function(o){return "Volta: столик забронирован ("+o.b+"). Напомним за 2 часа.";},send:"Отправить",typing:"печатает…",booking:"Бронь"},
en:{hi:"Hi! 👋 I'm the Volta Pizzeria bot. How can I help?",c:["Are you open now?","Menu & prices","Order a pizza","Book a table"],open:"Yes, we're open until 23:00 today. Delivery takes ~25 min, pickup ~15 min.",menu:"Most popular:\nMargherita · €8.50\nDiavola · €10.90\nQuattro formaggi · €11.50\nBianca verde · €9.90",which:"Which pizza would you like?",how:"Pickup or delivery?",ways:["Pickup","Delivery"],phone:"Your phone number?",ph:"+371 2…",demoPh:"+371 2000 0000",done:function(o){return "✅ Order #"+o.n+" confirmed!\n"+o.p+", "+o.w.toLowerCase()+".\nReady around "+o.t+". Thank you!";},book:"How many people and when?",bookOpts:["2 people, today 19:00","4 people, tomorrow 18:30"],booked:function(o){return "✅ Table booked: "+o.b+". See you then!";},more:"Anything else?",tg:function(o){return "🍕 New order #"+o.n+"\n"+o.p+" · "+o.w+"\n📞 "+o.ph+"\nReady: "+o.t;},tgB:function(o){return "📅 New booking\n"+o.b;},sms:function(o){return "Volta: order #"+o.n+" confirmed, ready around "+o.t+". 🍕";},smsB:function(o){return "Volta: table booked ("+o.b+"). We'll remind you 2 h before.";},send:"Send",typing:"typing…",booking:"Booking"}
  };
  var PZ = ["Margherita", "Diavola", "Quattro formaggi", "Bianca verde"];
  var msgs, chips, L = "lv", ord = {}, num = 1042, busy = false;
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var $ = function (id) { return document.getElementById(id); };

  function add(t, who) { var d = document.createElement("div"); d.className = "m " + who; d.textContent = t; msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; return d; }
  function bot(t) { var ty = add(CH[L].typing, "bot typing"); return wait(650).then(function () { ty.remove(); add(t, "bot"); }); }
  function setChips(list, fn) {
    chips.replaceChildren();
    list.forEach(function (x) { var b = document.createElement("button"); b.type = "button"; b.textContent = x; b.addEventListener("click", function () { if (!busy) fn(x); }); chips.appendChild(b); });
  }
  function now(m) { return new Date(Date.now() + m * 60000).toTimeString().slice(0, 5); }
  function light(id, tid) { $(id).classList.add("on"); $(tid).textContent = "✓ " + now(0); }
  function sheetRow(a, b) {
    var tr = document.createElement("tr"); tr.className = "new";
    [String(num), a, b, now(0)].forEach(function (v) { var td = document.createElement("td"); td.textContent = v; tr.appendChild(td); });
    $("rows").prepend(tr);
  }
  async function backstage(tg, sms, row) {
    sheetRow(row[0], row[1]); light("ev1", "t1"); await wait(500);
    $("tgmsg").textContent = tg; light("ev2", "t2"); await wait(500);
    $("smsmsg").textContent = sms; light("ev3", "t3"); num++;
  }
  function menu() {
    setChips(CH[L].c, async function (x) {
      busy = true; add(x, "me"); var i = CH[L].c.indexOf(x);
      if (i === 0) { await bot(CH[L].open); await bot(CH[L].more); menu(); }
      else if (i === 1) { await bot(CH[L].menu); await bot(CH[L].more); menu(); }
      else if (i === 2) {
        await bot(CH[L].which);
        setChips(PZ, async function (p) {
          busy = true; add(p, "me"); ord.p = p; await bot(CH[L].how);
          setChips(CH[L].ways, async function (w) { busy = true; add(w, "me"); ord.w = w; await bot(CH[L].phone); askPhone(); busy = false; });
          busy = false;
        });
      } else {
        await bot(CH[L].book);
        setChips(CH[L].bookOpts, async function (b) {
          busy = true; add(b, "me"); ord.b = b; await bot(CH[L].booked(ord));
          await backstage(CH[L].tgB(ord), CH[L].smsB(ord), [CH[L].booking + ": " + b, "—"]);
          await bot(CH[L].more); menu(); busy = false;
        });
      }
      busy = false;
    });
  }
  function askPhone() {
    chips.replaceChildren();
    var f = document.createElement("form"), i = document.createElement("input"), b = document.createElement("button");
    i.type = "tel"; i.placeholder = CH[L].ph; i.value = CH[L].demoPh; i.setAttribute("aria-label", CH[L].phone);
    b.type = "submit"; b.textContent = CH[L].send; f.append(i, b); chips.appendChild(f);
    f.addEventListener("submit", async function (e) {
      e.preventDefault(); if (busy) return; busy = true;
      var v = (i.value || CH[L].demoPh).slice(0, 20); add(v, "me");
      ord.ph = v.replace(/\d{4}$/, "••••"); ord.n = num; ord.t = now(ord.w === CH[L].ways[1] ? 25 : 15);
      await bot(CH[L].done(ord));
      await backstage(CH[L].tg(ord), CH[L].sms(ord), [ord.p + " · " + ord.w, ord.ph]);
      await bot(CH[L].more); menu(); busy = false;
    });
  }
  window.startBot = function (lang) {
    msgs = $("msgs"); chips = $("chips"); if (!msgs) return;
    if (busy) return;
    L = CH[lang] ? lang : "lv"; msgs.replaceChildren(); ord = {}; add(CH[L].hi, "bot"); menu();
  };
})();
