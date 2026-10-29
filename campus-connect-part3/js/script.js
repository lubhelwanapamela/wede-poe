/* Campus Connect - Part 3 JavaScript (WEDE5020). Vanilla JS, no build step. */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var RECIPIENT = 'lubhelwanapamela@gmail.com'; // email recipient used by the contact form

  /* ---------- Navigation ---------- */
  var toggle = $('.menu-toggle'), nav = $('.primary-nav'), overlay = $('.nav-overlay');
  function setNav(open) {
    if (!nav) return;
    nav.classList.toggle('open', open); overlay.classList.toggle('show', open);
    toggle.setAttribute('aria-expanded', String(open));
  }
  if (toggle) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', function () { setNav(!nav.classList.contains('open')); });
    overlay.addEventListener('click', function () { setNav(false); });
    $$('.primary-nav a').forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
  }

  /* ---------- Scroll reveal, counters, progress bars, back-to-top ---------- */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function animateCount(el) {
    var end = parseFloat(el.dataset.count), suffix = el.dataset.suffix || '', t0 = null;
    if (reduce) { el.textContent = end + suffix; return; }
    function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 1400, 1); el.textContent = Math.round(end * p) + suffix; if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target; el.classList.add('in');
        if (el.dataset.count) animateCount(el);
        if (el.dataset.width) el.style.width = el.dataset.width;
        io.unobserve(el);
      });
    }, { threshold: 0.15 });
    $$('.reveal,[data-count],.progress-fill').forEach(function (el) { io.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('in'); });
    $$('[data-count]').forEach(animateCount);
    $$('.progress-fill').forEach(function (el) { el.style.width = el.dataset.width; });
  }
  var toTop = $('.to-top');
  if (toTop) {
    window.addEventListener('scroll', function () { toTop.classList.toggle('show', window.scrollY > 500); }, { passive: true });
    toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* ---------- Accordion (FAQ) ---------- */
  $$('.faq-item').forEach(function (item) {
    var q = $('.faq-q', item), a = $('.faq-a', item);
    q.setAttribute('aria-expanded', String(item.classList.contains('open')));
    if (item.classList.contains('open')) a.style.maxHeight = a.scrollHeight + 'px';
    q.addEventListener('click', function () {
      var open = !item.classList.contains('open');
      $$('.faq-item').forEach(function (o) { o.classList.remove('open'); $('.faq-a', o).style.maxHeight = null; $('.faq-q', o).setAttribute('aria-expanded', 'false'); });
      if (open) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; q.setAttribute('aria-expanded', 'true'); }
    });
  });

  /* ---------- Tabs (arrow-key accessible) ---------- */
  $$('.tabs').forEach(function (tabs) {
    var btns = $$('.tab-btn', tabs);
    function select(btn) {
      btns.forEach(function (b) {
        var on = b === btn; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1;
        $('#' + b.getAttribute('aria-controls')).classList.toggle('active', on);
      });
    }
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { select(b); });
      b.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null;
        if (n === null) return; n = (n + btns.length) % btns.length; btns[n].focus(); select(btns[n]);
      });
    });
  });

  /* ---------- Safe DOM helper (no innerHTML with data = XSS safe) ---------- */
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { if (k === 'text') n.textContent = attrs[k]; else n.setAttribute(k, attrs[k]); });
    (kids || []).forEach(function (c) { n.appendChild(c); });
    return n;
  }
  function fmtDate(iso) { return new Date(iso + 'T00:00:00').toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }); }
  var CAT = { academic: 'Academic support', study: 'Study materials', events: 'Campus events', wellbeing: 'Wellbeing' };

  /* ---------- Modal ---------- */
  var modal = $('#detail-modal'), lastFocus = null;
  function openModal(item) {
    if (!modal) return; lastFocus = document.activeElement;
    $('#modal-title').textContent = item.title;
    $('#modal-cat').textContent = CAT[item.category];
    $('#modal-desc').textContent = item.desc;
    $('#modal-meta').textContent = 'Date: ' + fmtDate(item.date) + '  |  Where: ' + item.place;
    modal.classList.add('open'); $('.modal-close', modal).focus();
  }
  function closeModal() { if (!modal) return; modal.classList.remove('open'); if (lastFocus) lastFocus.focus(); }
  if (modal) {
    $('.modal-close', modal).addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  }

  /* ---------- Dynamic content: resources list with search, filter, sort ---------- */
  var list = $('#resource-list');
  if (list && window.CC_DATA) {
    var state = { q: '', cat: 'all', sort: 'date', shown: 6 };
    var items = window.CC_DATA.items;
    var count = $('#result-count'), more = $('#load-more');
    function render() {
      var q = state.q.trim().toLowerCase();
      var res = items.filter(function (i) {
        var okCat = state.cat === 'all' || i.category === state.cat;
        var hay = (i.title + ' ' + i.desc + ' ' + i.place + ' ' + i.tags.join(' ')).toLowerCase();
        return okCat && (!q || q.split(/\s+/).every(function (w) { return hay.indexOf(w) > -1; }));
      });
      res.sort(function (a, b) { return state.sort === 'title' ? a.title.localeCompare(b.title) : a.date.localeCompare(b.date); });
      list.textContent = '';
      res.slice(0, state.shown).forEach(function (i) {
        var btn = el('button', { type: 'button', class: 'btn btn-ghost btn-sm', text: 'View details' });
        btn.addEventListener('click', function () { openModal(i); });
        list.appendChild(el('article', { class: 'card' }, [
          el('span', { class: 'badge-soft', text: CAT[i.category] }),
          el('h3', { style: 'margin-top:8px', text: i.title }),
          el('p', { text: i.desc }),
          el('div', { class: 'item-meta', text: fmtDate(i.date) + ' | ' + i.place }),
          btn
        ]));
      });
      if (!res.length) list.appendChild(el('div', { class: 'empty-state', text: 'No results for "' + state.q + '". Try another keyword or choose All.' }));
      count.textContent = res.length + (res.length === 1 ? ' result' : ' results') + ' found';
      more.style.display = res.length > state.shown ? 'inline-block' : 'none';
    }
    $('#resource-search').addEventListener('input', function (e) { state.q = e.target.value; state.shown = 6; render(); });
    $('#resource-sort').addEventListener('change', function (e) { state.sort = e.target.value; render(); });
    $$('.chip').forEach(function (c) {
      c.addEventListener('click', function () {
        $$('.chip').forEach(function (x) { x.classList.remove('active'); x.setAttribute('aria-pressed', 'false'); });
        c.classList.add('active'); c.setAttribute('aria-pressed', 'true'); state.cat = c.dataset.cat; state.shown = 6; render();
      });
    });
    more.addEventListener('click', function () { state.shown += 4; render(); });
    var hash = decodeURIComponent((location.hash || '').replace('#', ''));
    ['academic', 'events', 'wellbeing', 'study'].forEach(function (k) { if (hash === k) { var c = $('.chip[data-cat="' + k + '"]'); if (c) c.click(); } });
    render();
  }

  /* ---------- Homepage: upcoming events (dynamic) ---------- */
  var up = $('#upcoming-events');
  if (up && window.CC_DATA) {
    window.CC_DATA.items.filter(function (i) { return i.category === 'events'; }).sort(function (a, b) { return a.date.localeCompare(b.date); }).forEach(function (i) {
      up.appendChild(el('article', { class: 'card reveal in' }, [
        el('span', { class: 'badge-soft', text: fmtDate(i.date) }),
        el('h3', { style: 'margin-top:8px', text: i.title }), el('p', { text: i.desc }),
        el('div', { class: 'item-meta', text: i.place })
      ]));
    });
  }

  /* ---------- Gallery + lightbox ---------- */
  var gal = $('#gallery');
  if (gal && window.CC_DATA) {
    var g = window.CC_DATA.gallery, idx = 0, lb = $('#lightbox'), lbImg = $('#lb-img'), lbCap = $('#lb-cap');
    g.forEach(function (p, i) {
      var b = el('button', { type: 'button', class: 'gallery-item', 'aria-label': 'Open image: ' + p.cap }, [
        el('img', { src: p.src, alt: p.alt, width: '800', height: '600', loading: 'lazy' })
      ]);
      b.addEventListener('click', function () { show(i); lb.classList.add('open'); $('.lb-close', lb).focus(); });
      gal.appendChild(b);
    });
    function show(i) { idx = (i + g.length) % g.length; lbImg.src = g[idx].src; lbImg.alt = g[idx].alt; lbCap.textContent = g[idx].cap + ' (' + (idx + 1) + ' of ' + g.length + ')'; }
    function closeLb() { lb.classList.remove('open'); }
    $('.lb-close', lb).addEventListener('click', closeLb);
    $('.lb-prev', lb).addEventListener('click', function () { show(idx - 1); });
    $('.lb-next', lb).addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb(); if (e.key === 'ArrowLeft') show(idx - 1); if (e.key === 'ArrowRight') show(idx + 1);
    });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  /* ---------- Interactive map (Leaflet + OpenStreetMap) ---------- */
  var mapEl = $('#map');
  if (mapEl) {
    if (window.L && window.CC_DATA) {
      var map = L.map('map', { scrollWheelZoom: false }).setView([-26.1929, 28.0305], 15);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
      var wrap = $('#map-list'), markers = [];
      window.CC_DATA.places.forEach(function (p, i) {
        var m = L.marker([p.lat, p.lng]).addTo(map);
        var pop = document.createElement('div'); var s = document.createElement('strong'); s.textContent = p.name; pop.appendChild(s);
        pop.appendChild(document.createElement('br')); pop.appendChild(document.createTextNode(p.note)); m.bindPopup(pop);
        markers.push(m);
        var b = el('button', { type: 'button', class: 'chip', text: p.name.replace(' (sample)', '') });
        b.addEventListener('click', function () { map.flyTo([p.lat, p.lng], 17); m.openPopup(); });
        wrap.appendChild(b);
      });
      map.on('focus', function () { map.scrollWheelZoom.enable(); }); map.on('blur', function () { map.scrollWheelZoom.disable(); });
    } else {
      mapEl.appendChild(el('p', { class: 'empty-state', text: 'The map could not load. Please check your internet connection and refresh.' }));
    }
  }

  /* ---------- Form validation (client-side) ---------- */
  var RULES = {
    name: function (v) { return /^[A-Za-z][A-Za-z\s'.-]{1,59}$/.test(v) ? '' : 'Enter your name using letters only (2-60 characters).'; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Enter a valid email address, e.g. name@example.com.'; },
    phone: function (v) { return !v || /^(\+27|0)[1-9][0-9]{8}$/.test(v.replace(/[\s-]/g, '')) ? '' : 'Use a South African number, e.g. 0821234567 or +27821234567.'; },
    phoneReq: function (v) { return /^(\+27|0)[1-9][0-9]{8}$/.test(v.replace(/[\s-]/g, '')) ? '' : 'Enter a valid South African number, e.g. 0821234567.'; },
    studentNo: function (v) { return !v || /^[0-9]{6,10}$/.test(v) ? '' : 'Student number must be 6 to 10 digits.'; },
    select: function (v) { return v ? '' : 'Please choose an option.'; },
    subject: function (v) { return v.length >= 5 && v.length <= 80 ? '' : 'Subject must be 5 to 80 characters.'; },
    message: function (v) { return v.length >= 20 && v.length <= 500 ? '' : 'Message must be 20 to 500 characters (currently ' + v.length + ').'; },
    sessions: function (v) { var n = Number(v); return Number.isInteger(n) && n >= 1 && n <= 10 ? '' : 'Enter a whole number from 1 to 10.'; },
    date: function (v) {
      if (!v) return 'Please choose a preferred date.';
      var d = new Date(v + 'T00:00:00'), t = new Date(); t.setHours(0, 0, 0, 0);
      var max = new Date(t); max.setMonth(max.getMonth() + 6);
      if (isNaN(d)) return 'Enter a valid date.'; if (d < t) return 'The date cannot be in the past.'; if (d > max) return 'Please choose a date within the next 6 months.'; return '';
    },
    consent: function (v, f) { return f.checked ? '' : 'You must agree before sending.'; }
  };
  function validateField(f) {
    var rule = RULES[f.dataset.rule]; if (!rule) return true;
    var wrap = f.closest('.field'), err = $('.error-msg', wrap), msg = rule(f.value.trim(), f);
    wrap.classList.toggle('invalid', !!msg); wrap.classList.toggle('valid', !msg && f.value !== '');
    err.textContent = msg; f.setAttribute('aria-invalid', String(!!msg)); return !msg;
  }
  function wireForm(form, onValid) {
    var fields = $$('[data-rule]', form);
    fields.forEach(function (f) {
      f.addEventListener('blur', function () { validateField(f); });
      f.addEventListener('input', function () { if (f.closest('.field').classList.contains('invalid')) validateField(f); });
      f.addEventListener('change', function () { validateField(f); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if ($('.hp', form) && $('.hp input', form).value) return; // honeypot catches bots
      var ok = true, first = null;
      fields.forEach(function (f) { if (!validateField(f)) { ok = false; if (!first) first = f; } });
      if (!ok) { first.focus(); return; }
      onValid(form);
    });
  }
  var msgBox = $('#message'), counter = $('#char-count');
  if (msgBox && counter) msgBox.addEventListener('input', function () { counter.textContent = msgBox.value.length + ' / 500'; });
  var dateIn = $('#date'); if (dateIn) { var t = new Date(); dateIn.min = t.toISOString().slice(0, 10); }

  /* ---------- Enquiry form: process input and respond with cost + availability ---------- */
  var enq = $('#enquiry-form');
  var SERVICES = {
    tutoring: { name: 'Peer tutoring', cost: 0, note: 'Free for registered students.', hours: 'Mon-Fri 09:00-16:00' },
    writing: { name: 'Writing Centre feedback', cost: 0, note: 'Free for registered students.', hours: 'Mon-Thu 10:00-15:00' },
    papers: { name: 'Past papers & notes access', cost: 0, note: 'Free; access is granted within 2 working days.', hours: 'Online, 24/7' },
    volunteer: { name: 'Volunteer as a tutor', cost: 0, note: 'Volunteers receive training and a certificate.', hours: 'Orientation sessions Wed 17:00' },
    sponsor: { name: 'Sponsor a campus event', cost: 2500, note: 'Sponsor packages start at R2 500 per event.', hours: 'Meetings Mon-Fri 08:00-17:00' }
  };
  if (enq) wireForm(enq, function (form) {
    var d = new FormData(form), s = SERVICES[d.get('service')], n = Number(d.get('sessions')), when = new Date(d.get('date') + 'T00:00:00');
    var day = when.getDay(), weekend = day === 0 || day === 6, sat = day === 6 && d.get('service') === 'papers';
    var total = s.cost * (d.get('service') === 'sponsor' ? n : 1);
    var avail = (weekend && !sat) ? 'Not available on weekends. The next available weekday is the following Monday.' : 'Available on ' + when.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' }) + ' (' + s.hours + ').';
    var out = $('#enquiry-result'); out.textContent = '';
    out.className = 'alert alert-ok'; out.setAttribute('role', 'status');
    out.appendChild(el('h3', { text: 'Thank you, ' + d.get('name').split(' ')[0] + '! Here is your enquiry response.' }));
    [['Service', s.name + (n > 1 ? ' x ' + n : '')], ['Estimated cost', total === 0 ? 'R0 (free)' : 'R' + total.toLocaleString('en-ZA')], ['Availability', avail], ['Note', s.note], ['Next step', 'We will email ' + d.get('email') + ' within 2 working days to confirm.']]
      .forEach(function (r) { var p = el('p'); p.appendChild(el('strong', { text: r[0] + ': ' })); p.appendChild(document.createTextNode(r[1])); out.appendChild(p); });
    out.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  /* ---------- Contact form: compile email, send via AJAX, fall back to mail client ---------- */
  var con = $('#contact-form');
  if (con) wireForm(con, function (form) {
    var d = new FormData(form), status = $('#form-status'), btn = $('button[type=submit]', form);
    var subject = '[Campus Connect] ' + d.get('type') + ': ' + d.get('subject');
    var body = 'Name: ' + d.get('name') + '\nEmail: ' + d.get('email') + '\nPhone: ' + (d.get('phone') || 'Not provided') + '\nType of message: ' + d.get('type') + '\n\nMessage:\n' + d.get('message');
    $('#email-preview').textContent = 'To: ' + RECIPIENT + '\nSubject: ' + subject + '\n\n' + body;
    var mailto = 'mailto:' + RECIPIENT + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    function show(cls, text, withMail) {
      status.className = 'alert ' + cls; status.setAttribute('role', 'status'); status.textContent = text + ' ';
      if (withMail) { var a = el('a', { href: mailto, text: 'Open my email app to send it' }); status.appendChild(a); }
    }
    btn.disabled = true; btn.textContent = 'Sending...';
    var ctl = new AbortController(), timer = setTimeout(function () { ctl.abort(); }, 8000);
    fetch('https://formsubmit.co/ajax/' + RECIPIENT, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, signal: ctl.signal,
      body: JSON.stringify({ name: d.get('name'), email: d.get('email'), phone: d.get('phone'), type: d.get('type'), _subject: subject, message: d.get('message') })
    }).then(function (r) { if (!r.ok) throw new Error('bad status'); return r.json(); })
      .then(function () { show('alert-ok', 'Your message was sent. Thank you - we will reply within 2 working days.', false); form.reset(); $$('.field', form).forEach(function (f) { f.classList.remove('valid'); }); if (counter) counter.textContent = '0 / 500'; })
      .catch(function () { show('alert-err', 'We could not send it automatically. Your email is ready below.', true); })
      .then(function () { clearTimeout(timer); btn.disabled = false; btn.textContent = 'Send message'; $('#email-wrap').style.display = 'block'; status.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
  });
})();
