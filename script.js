(function () {
  var PHONE = "+7 928 626-30-37";
  var WA = "https://wa.me/79286263037";
  var TG = "https://telegram.me/+79286263037";

  var burger = document.getElementById("burger");
  var mnav = document.getElementById("mnav");
  burger.addEventListener("click", function () {
    var open = mnav.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  });
  mnav.addEventListener("click", function (e) {
    if (e.target.closest("a")) {
      mnav.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Открыть меню");
    }
  });

  function status() {
    var parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Moscow", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
    var get = function (t) { return parts.find(function (p) { return p.type === t; }).value; };
    var weekend = get("weekday") === "Sat" || get("weekday") === "Sun";
    var minutes = (+get("hour") % 24) * 60 + +get("minute");
    var closeAt = weekend ? 18 * 60 : 20 * 60;
    var isOpen = minutes >= 10 * 60 && minutes < closeAt;
    var text = isOpen ? "Открыто до " + (weekend ? "18:00" : "20:00") : "Сейчас закрыто, откроемся в 10:00";
    document.querySelectorAll(".js-status").forEach(function (el) {
      el.classList.toggle("closed", !isOpen);
      el.textContent = text;
    });
  }
  status();
  setInterval(status, 60000);

  var service = document.getElementById("service");
  document.querySelectorAll("[data-pick]").forEach(function (a) {
    a.addEventListener("click", function () {
      var value = a.getAttribute("data-pick");
      for (var i = 0; i < service.options.length; i++) {
        if (service.options[i].text === value) { service.selectedIndex = i; break; }
      }
    });
  });

  var form = document.getElementById("form");
  var msg = document.getElementById("msg");
  var channel = "wa";
  form.querySelectorAll("button[type=submit]").forEach(function (b) {
    b.addEventListener("click", function () { channel = b.getAttribute("data-channel"); });
  });

  function buildText(d) {
    var lines = ["Здравствуйте! Хочу записаться: " + d.service + "."];
    lines.push("Имя: " + d.name + ".");
    lines.push("Телефон: " + d.phone + ".");
    if (d.car) lines.push("Автомобиль: " + d.car + ".");
    if (d.time) lines.push("Удобное время: " + d.time + ".");
    return lines.join("\n");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = {
      name: form.elements.name.value.trim(),
      phone: form.elements.phone.value.trim(),
      service: form.elements.service.value,
      car: form.elements.car.value.trim(),
      time: form.elements.time.value.trim()
    };
    var digits = data.phone.replace(/\D/g, "");
    if (!data.name) { msg.textContent = "Напишите, как к вам обращаться."; form.elements.name.focus(); return; }
    if (digits.length < 10) { msg.textContent = "Проверьте номер телефона: нужно минимум 10 цифр."; form.elements.phone.focus(); return; }
    var text = buildText(data);
    if (channel === "wa") {
      window.open(WA + "?text=" + encodeURIComponent(text), "_blank", "noopener");
      msg.innerHTML = "<b>Открылся WhatsApp с готовым сообщением.</b> Осталось нажать «Отправить». Если окно не открылось, позвоните: " + PHONE + ".";
    } else {
      var done = function (ok) {
        window.open(TG, "_blank", "noopener");
        msg.innerHTML = ok
          ? "<b>Текст скопирован.</b> Откроется чат в Telegram — вставьте сообщение и отправьте."
          : "Откроется чат в Telegram. Напишите в нём услугу, имя и телефон, или позвоните: " + PHONE + ".";
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      } else {
        done(false);
      }
    }
  });

  var lb = document.getElementById("lb");
  var lbimg = document.getElementById("lbimg");
  var lastFocus = null;
  function closeLb() { lb.classList.remove("open"); lbimg.removeAttribute("src"); if (lastFocus) lastFocus.focus(); }
  document.getElementById("gal").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    lastFocus = b;
    lbimg.src = b.getAttribute("data-full");
    lbimg.alt = b.querySelector("img").alt;
    lb.classList.add("open");
    document.getElementById("lbx").focus();
  });
  lb.addEventListener("click", function (e) { if (e.target === lb || e.target.closest("#lbx")) closeLb(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && lb.classList.contains("open")) closeLb(); });
})();
