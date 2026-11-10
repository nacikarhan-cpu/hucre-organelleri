(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const letters = 'ABCDE';
  const formatNumber = new Intl.NumberFormat('tr-TR', {maximumFractionDigits: 2});
  const testNotes = ['Yapıları, zar sayılarını ve temel görevleri hatırla.', 'Benzer yapıları karşılaştır ve öğrendiklerinden çıkarım yap.', 'Deney ve gözlem sonuçlarını yorumlayarak bilgini uygula.'];
  let session, timerId, audio, soundOn = false, toastId, onlyWrong = false;

  function element(tag, content, className) {
    const node = document.createElement(tag);
    if (content != null) node.textContent = content;
    if (className) node.className = className;
    return node;
  }
  function button(label, handler, className = 'button') {
    const node = element('button', label, className);
    node.type = 'button';
    node.addEventListener('click', handler);
    return node;
  }
  function focus(id) { $(id).focus({preventScroll:true}); }
  function screen(id, heading) {
    clearTimeout(toastId);
    $('status').hidden = true;
    for (const name of ['home','exam','result']) $(name).hidden = name !== id;
    focus(heading);
    window.scrollTo(0, 0);
  }
  function flash(message) {
    clearTimeout(toastId);
    $('status').hidden = false;
    $('status').textContent = message;
    toastId = setTimeout(() => { $('status').hidden = true; }, 3800);
  }
  function renderHome() {
    TESTS.forEach((name, i) => {
      const card = element('article', null, 'card');
      const count = QUESTIONS.filter(q => q.test === i).length;
      card.append(element('span', `Test ${i+1} · ${count} soru`, 'pill'), element('h3', name), element('p', testNotes[i]));
      const start = button('Teste Başla →', () => startExam(i));
      start.setAttribute('aria-label', `Test ${i+1}: ${name} testine başla`);
      card.append(start);
      $('test-list').append(card);
    });
    for (const [name, kind, job, where, label, art] of CELL_CARDS) {
      const card = element('article', null, 'card art-card');
      // Çizimler ve etiketler yerel, sabit ders içeriğinden gelir.
      card.innerHTML = `<svg viewBox="0 0 180 107" role="img" aria-label="${name}: ${label}"><g fill="none" stroke="#276c61" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${art}</g><text x="90" y="94" text-anchor="middle" fill="#255a55" font-size="8.3" font-weight="700">${label}</text></svg>`;
      card.append(element('span', kind, 'pill'), element('h3', name), element('p', job), element('p', where));
      $('learn-list').append(card);
    }
    for (const kind of ['Zarsız','Tek zarlı','Çift zarlı']) {
      const group = element('article', null, 'summary-group');
      const list = element('dl');
      for (const [name, category, job, where] of CELL_CARDS) if (category === kind) {
        list.append(element('dt', name), element('dd', job), element('dd', where));
      }
      group.append(element('h3', kind), list);
      $('summary-list').append(group);
    }
  }
  function duration(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const two = n => String(n).padStart(2, '0');
    const minutes = two(Math.floor(total/60)%60), seconds = two(total%60);
    return total >= 3600 ? `${two(Math.floor(total/3600))}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
  }
  function tick() { $('timer').textContent = duration(Date.now() - session.started); }
  function startExam(test) {
    clearInterval(timerId);
    $('solutions').replaceChildren();
    const questions = QUESTIONS.filter(q => q.test === test);
    session = {test, questions, index:0, started:Date.now(), answers:Array(questions.length).fill(null), done:false};
    $('exam-label').textContent = `TEST ${test+1} / ${questions.length} SORU`;
    $('exam-heading').textContent = TESTS[test];
    tick();
    timerId = setInterval(tick, 250);
    renderQuestion();
    screen('exam','exam-heading');
  }
  function renderProgress() {
    const {questions, answers, index} = session;
    const count = answers.filter(a => a !== null).length;
    $('number').textContent = `Soru ${index+1} / ${questions.length}`;
    $('answered').textContent = `${count} / ${questions.length} cevaplandı`;
    $('progress').max = questions.length;
    $('progress').value = count;
    [...$('jump-list').children].forEach((jump, i) => {
      jump.setAttribute('aria-current', String(i === index));
      jump.setAttribute('aria-label', `${i+1}. soru, ${answers[i] === null ? 'cevaplanmadı' : 'cevaplandı'}`);
      jump.dataset.answered = String(answers[i] !== null);
    });
  }
  function renderQuestion() {
    const {index, questions, answers} = session;
    const q = questions[index];
    $('question').textContent = q.text;
    $('options').replaceChildren(...q.options.map((option, i) => {
      const label = element('label', null, 'option');
      const input = element('input');
      input.type = 'radio'; input.name = 'answer'; input.value = i; input.checked = answers[index] === i;
      input.addEventListener('change', () => { session.answers[index] = i; renderProgress(); });
      label.append(input, element('b', letters[i]+')'), element('span', option));
      return label;
    }));
    $('jump-list').replaceChildren(...questions.map((_, i) => button(String(i+1), () => move(i), 'jump')));
    $('prev').disabled = index === 0;
    $('next').disabled = index === questions.length-1;
    renderProgress();
  }
  function move(index) {
    if (index < 0 || index >= session.questions.length) return;
    session.index = index;
    renderQuestion();
    $('question').focus();
  }
  function ask(kind) {
    const dialog = $('confirm');
    const blanks = session.answers.filter(a => a === null).length;
    dialog.dataset.kind = kind;
    $('dialog-heading').textContent = kind === 'leave' ? 'Ana sayfaya dön?' : 'Sınavı bitir?';
    $('dialog-text').textContent = kind === 'leave' ? 'Bu testte verdiğin cevaplar silinecek.' : blanks ? `${blanks} soru cevaplanmadı. Sınavı şimdi bitirirsen bu sorular boş sayılacak.` : 'Tüm sorular cevaplandı. Sonucunu görmek için sınavı bitirebilirsin.';
    $('dialog-ok').textContent = kind === 'leave' ? 'Ana Sayfaya Dön' : 'Bitir ve Sonucu Gör';
    dialog.returnValue = '';
    dialog.showModal();
  }
  function home() { clearInterval(timerId); session = null; screen('home','icerik'); }
  function finish() {
    if (session.done) return;
    session.done = true;
    clearInterval(timerId);
    const elapsed = Date.now()-session.started;
    const {questions, answers, test} = session;
    const total = questions.length;
    const correct = questions.filter((q,i) => answers[i] === q.answer).length;
    const empty = answers.filter(a => a === null).length;
    const wrong = total - correct - empty;
    const percent = correct * 100 / total;
    const stats = [['Toplam soru',total],['Doğru',correct],['Yanlış',wrong],['Boş',empty],['Net',formatNumber.format(correct-wrong/4)],['Başarı',`%${formatNumber.format(percent)}`],['Harcanan süre',duration(elapsed)]];
    $('stats').replaceChildren(...stats.map(([label,value]) => {
      const box = element('div', null, 'stat');
      box.append(element('span',label), element('strong',String(value)));
      return box;
    }));
    $('badge').hidden = percent < 50;
    $('result-label').textContent = `TEST ${test+1} / ${TESTS[test]}`;
    onlyWrong = false;
    renderSolutions();
    screen('result','result-heading');
    playSound();
  }
  function renderSolutions() {
    const {questions, answers} = session;
    const rows = questions.flatMap((q,i) => {
      const a = answers[i];
      const outcome = a === null ? 'empty' : a === q.answer ? 'correct' : 'wrong';
      if (onlyWrong && outcome !== 'wrong') return [];
      const box = element('details', null, 'solution');
      box.dataset.outcome = outcome;
      box.open = onlyWrong;
      const summary = element('summary', `${i+1}. ${q.text} `);
      summary.append(element('span', {empty:'BOŞ',correct:'DOĞRU',wrong:'YANLIŞ'}[outcome], 'outcome'));
      box.append(summary, element('p', `Cevabın: ${a === null ? 'Boş' : letters[a]+') '+q.options[a]}`), element('p', `Doğru cevap: ${letters[q.answer]}) ${q.options[q.answer]}`), element('p', q.explanation));
      return [box];
    });
    $('wrong').setAttribute('aria-pressed', String(onlyWrong));
    $('wrong').textContent = onlyWrong ? 'Tüm Çözümleri Göster' : 'Yanlışlarımı İncele';
    $('solutions').replaceChildren(...(rows.length ? rows : [element('p','Yanlış cevaplanan soru yok.')]));
  }
  function toggleSound() {
    if (!soundOn) {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return flash('Bu tarayıcı sesli bildirimi desteklemiyor.');
      try { audio ||= new Audio(); audio.resume().catch(() => {}); } catch { return flash('Ses açılamadı.'); }
    }
    soundOn = !soundOn;
    $('sound').textContent = `Ses: ${soundOn ? 'Açık' : 'Kapalı'}`;
    $('sound').setAttribute('aria-pressed', String(soundOn));
  }
  function playSound() {
    if (!soundOn || !audio) return;
    audio.resume().then(() => {
      [523.25,659.25].forEach((pitch,i) => {
        const t = audio.currentTime+i*.12;
        const tone = audio.createOscillator(), gain = audio.createGain();
        tone.frequency.value = pitch; tone.connect(gain); gain.connect(audio.destination);
        gain.gain.setValueAtTime(.0001,t); gain.gain.exponentialRampToValueAtTime(.08,t+.025);
        gain.gain.exponentialRampToValueAtTime(.0001,t+.19);
        tone.start(t); tone.stop(t+.20);
      });
    }).catch(() => {});
  }
  function shareURL() {
    const canonical = document.querySelector('link[rel="canonical"]');
    const url = new URL(canonical?.href || location.href);
    url.search = ''; url.hash = '';
    return url.href;
  }
  async function share() {
    const url = shareURL();
    if (location.protocol === 'file:') return flash('Paylaşılabilir bağlantı, uygulama yayımlandığında kullanılabilir.');
    if (navigator.share) {
      try { await navigator.share({title:'Naci Hoca ile TYT Biyoloji',text:'Hücre ve Organelleri · 30 özgün TYT sorusu',url}); return; }
      catch (error) { if (error.name === 'AbortError') return; }
    }
    $('share-link').value = url;
    $('share-dialog').showModal();
  }
  async function copyLink() {
    const input = $('share-link');
    try { await navigator.clipboard.writeText(input.value); $('share-dialog').close(); flash('Bağlantı kopyalandı.'); }
    catch { input.focus(); input.select(); flash('Bağlantı seçildi. Kopyalama komutunu kullanabilirsin.'); }
  }
  renderHome();
  document.querySelectorAll('[data-jump]').forEach(node => node.addEventListener('click', () => {
    focus(node.dataset.jump); $(node.dataset.jump).scrollIntoView({block:'start'});
  }));
  $('prev').onclick = () => move(session.index-1);
  $('next').onclick = () => move(session.index+1);
  $('blank').onclick = () => {
    session.answers[session.index] = null;
    if (session.index < session.questions.length-1) move(session.index+1);
    else { renderQuestion(); $('finish').focus(); }
    flash('Soru boş bırakıldı.');
  };
  $('finish').onclick = () => ask('finish');
  $('confirm').addEventListener('close', event => {
    if (event.target.returnValue !== 'ok') return;
    if (event.target.dataset.kind === 'leave') home(); else finish();
  });
  $('brand').onclick = () => session && !session.done ? ask('leave') : home();
  $('go-home').onclick = home;
  $('retry').onclick = () => startExam(session.test);
  $('wrong').onclick = () => { onlyWrong = !onlyWrong; renderSolutions(); };
  $('sound').onclick = toggleSound;
  $('share').onclick = share;
  $('copy').onclick = copyLink;
})();
