(() => {
  const pathFor = name => '/_hb/admin-cinema/media/' + name.toLowerCase().replace(/\s+/g, '-');
  const hooks = {
    'Company Opening': ['Faith. Innovation. Intelligence. Leadership.', 'Glaube. Innovation. Intelligenz. Führung.', 'Ìgbàgbọ́. Ìmúdàgbàsókè. Ọgbọ́n. Aṣáájú.', 'Faith. New ideas. Wisdom. Leadership.'],
    'Profile Film': ['From engineering to software, data, and security.', 'Von Technik zu Software, Daten und Sicherheit.', 'Láti iṣẹ́ ẹ̀rọ sí sọ́fítíwè, dátà àti ààbò.', 'From engineering reach software, data and security.'],
    'Field Engineering': ['Explore an electrical engineering workflow.', 'Einen elektrotechnischen Arbeitsablauf erkunden.', 'Ṣàwárí iṣẹ́ ẹ̀rọ iná.', 'See how electrical engineering work dey go.'],
    'Field Web': ['Explore public web project source.', 'Den Quellcode eines öffentlichen Webprojekts erkunden.', 'Ṣàwárí kóòdù iṣẹ́ wẹ́ẹ̀bù gbangba.', 'Explore public web project code.'],
    'Field Data': ['Explore the water pump research project.', 'Das Forschungsprojekt zu Wasserpumpen erkunden.', 'Ṣàwárí iṣẹ́ ìwádìí ẹ̀rọ fifa omi.', 'Explore the water pump research project.'],
    'Field Cyber': ['Explore the defensive learning workspace.', 'Den Lernbereich für IT-Verteidigung erkunden.', 'Ṣàwárí ibi ìkẹ́kọ̀ọ́ ààbò.', 'Explore where people dey learn digital defence.'],
    'Field Osint': ['Illustrated overview of public-source verification.', 'Illustrierter Überblick zur Überprüfung öffentlicher Quellen.', 'Àpèjúwe bí a ṣe ń ṣàyẹ̀wò orísun gbangba.', 'Illustrated overview of how to check public sources.'],
    'Field Ai': ['Illustrated overview of checking AI outputs.', 'Illustrierter Überblick zur Prüfung von KI-Ausgaben.', 'Àpèjúwe bí a ṣe ń ṣàyẹ̀wò àbájáde AI.', 'Illustrated overview of how to check AI results.'],
    'Field Learning': ['Open a reading workspace and practice.', 'Einen Lesebereich öffnen und üben.', 'Ṣí ibi kíkà kí o sì ṣe àdánwò.', 'Open the reading workspace and practice.'],
    'Technical Terminal': ['Open Help, then check the terminal status.', 'Hilfe öffnen und den Terminalstatus prüfen.', 'Ṣí ìrànlọ́wọ́, kí o sì ṣàyẹ̀wò ipò terminal.', 'Open Help, then check how the terminal dey.'],
    'Bible Study': ['Read a passage and compare editions.', 'Eine Bibelstelle lesen und Ausgaben vergleichen.', 'Ka ẹsẹ Bíbélì kan kí o sì fi àwọn ẹ̀dà wé ara wọn.', 'Read one passage and compare editions.'],
    AdigunSPs: ['Explore a PLC program.', 'Ein SPS-Programm erkunden.', 'Ṣàwárí ètò PLC kan.', 'See how PLC program dey work.'],
    adigunEplanAI: ['Open the electrical symbol library.', 'Die Elektrosymbolbibliothek öffnen.', 'Ṣí àkójọ àmì ẹ̀rọ iná.', 'Open the electrical symbol library.'],
    AdigunSimulator: ['From schematic to PCB.', 'Vom Schaltplan zur Leiterplatte.', 'Láti àwòrán ẹ̀rọ sí PCB.', 'From circuit drawing reach PCB.'],
    AdigunLightDesign: ['Change the mood with light.', 'Mit Licht die Stimmung ändern.', 'Fi ìmọ́lẹ̀ yí ojú afẹ́fẹ́ padà.', 'Use light change the mood.'],
    AdigunCabinLighting: ['Watch Aurora light up the cabin.', 'Aurora lässt die Kabine leuchten.', 'Wo bí Aurora ṣe tan inú ọkọ̀.', 'Watch Aurora light up the cabin.'],
    AdigunElectroCAD: ['Take a closer look at the schematic.', 'Den Schaltplan im Detail ansehen.', 'Wo àwòrán ẹ̀rọ náà dáadáa.', 'Look the circuit drawing closely.'],
    AdigunPowerLab: ['Step inside the PowerGrid Lab.', 'Das PowerGrid-Labor erkunden.', 'Wọ inú ilé ìdánwò PowerGrid.', 'Enter the PowerGrid Lab.'],
    AdigunAiAutoCad: ['Open a real motor feeder example.', 'Ein Motorabgangsbeispiel öffnen.', 'Ṣí àpẹẹrẹ ẹ̀rọ mọ́tò.', 'Open one real motor feeder example.'],
    AdigunTokenCalculator: ['How many tokens fit in a sentence?', 'Wie viele Tokens stecken in einem Satz?', 'Token mélòó ló wà nínú gbólóhùn kan?', 'How many tokens dey inside one sentence?'],
    AdigunOscilloscope: ['Product preview', 'Produktvorschau', 'Àwòkọ́ṣe ọjà', 'Product preview'],
    'Adigun FreeDocEditor': ['From a blank page to a first draft.', 'Von der leeren Seite zum ersten Entwurf.', 'Láti ojú ìwé òfo sí àkọ́kọ́ àkọsílẹ̀.', 'Start your first draft from blank page.'],
    'Adigun GamesBank': ['One move changes the board.', 'Ein Zug verändert das Spielfeld.', 'Ìgbésẹ̀ kan yí pátákó eré padà.', 'One move fit change the whole board.'],
    'Cyber Learning': ['Open the learning workspace.', 'Den Lernbereich öffnen.', 'Ṣí ibi ìkẹ́kọ̀ọ́.', 'Open the place wey you dey learn.'],
    AdigunBible: ['Open a chapter and start reading.', 'Ein Kapitel öffnen und lesen.', 'Ṣí orí kan kí o bẹ̀rẹ̀ sí í kà.', 'Open one chapter and start to read.'],
    'Adigun-AiBible': ['Compare passages side by side.', 'Bibelstellen nebeneinander vergleichen.', 'Fi àwọn ẹsẹ Bíbélì wé ara wọn.', 'Compare the Bible passages side by side.'],
    AdigunCyberSpace: ['Follow the connections on the systems map.', 'Den Verbindungen auf der Systemkarte folgen.', 'Tẹ̀ lé ìsopọ̀ lórí maapu náà.', 'Follow how things connect for the map.'],
    AdigunMachineLearning: ['Coming soon', 'Demnächst', 'Ó ń bọ̀ láìpẹ́', 'E dey come soon'],
    Trading: ['Explore the trading brand.', 'Die Handelsmarke entdecken.', 'Ṣàwárí ẹ̀ka òwò.', 'Check out the trading brand.'],
    Elektroniker: ['See engineering workflows in action.', 'Technische Arbeitsabläufe im Einsatz sehen.', 'Wo bí iṣẹ́ ẹ̀rọ ṣe ń lọ.', 'See engineering work as e dey happen.'],
    AI: ['From counting tokens to mapping systems.', 'Vom Tokenzählen zur Systemkarte.', 'Láti kíkà token sí maapu ètò.', 'From counting tokens reach mapping systems.'],
    Evangelist: ['Read and compare Scripture.', 'Bibeltexte lesen und vergleichen.', 'Ka Ìwé Mímọ́ kí o sì fi ẹsẹ wé ara wọn.', 'Read and compare Bible passages.'],
    Politics: ['Explore the civic leadership brand.', 'Die Marke für gesellschaftliches Engagement entdecken.', 'Ṣàwárí ẹ̀ka aṣáájú àwùjọ.', 'Check out the civic leadership brand.'],
    'Company Ecosystem': ['Follow the branches to the products.', 'Den Zweigen zu den Produkten folgen.', 'Tẹ̀ lé àwọn ẹ̀ka sí àwọn ọjà.', 'Follow the branches reach the products.'],
  };
  const previews = new Set(['AdigunOscilloscope', 'AdigunMachineLearning', 'Trading', 'Politics', 'Company Ecosystem']);
  const ultraHD = new Set(['AdigunCabinLighting', 'AdigunSimulator', 'AdigunTokenCalculator']);
  const languageIndex = () => Math.max(0, ['en', 'de', 'yo', 'pcm'].indexOf(document.documentElement.lang));
  const describe = name => hooks[name]?.[languageIndex()] || name;
  let soundEnabled = false;
  const activePlayers = new Set();
  const soundControls = new Map();


  const iconPaths = {
    play:'M8 5v14l11-7z', pause:'M9 5v14M15 5v14',
    previous:'M6 5v14M18 5l-10 7 10 7z', next:'M18 5v14M6 5l10 7-10 7z',
    muted:'M4 9h4l5-4v14l-5-4H4zM16 10l4 4m0-4-4 4',
    sound:'M4 9h4l5-4v14l-5-4H4zM16 9a4 4 0 0 1 0 6m3-8a7 7 0 0 1 0 10',
    expand:'M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5',
    shrink:'M4 9h5V4m6 0v5h5M9 20v-5H4m16 0h-5v5',
    walkthrough:'M4 5h16v14H4zM10 9l5 3-5 3z',
    trailer:'M4 5h16v14H4zM9 9h6m-6 3h6m-6 3h6',
    quality:'M3 5h18v14H3zM6 9v3h4m-1-3v6m4-6v6m4-6-4 3 4 3'
  };
  function setIcon(button, name, title) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(svg.namespaceURI, 'path');
    path.setAttribute('d', iconPaths[name]);
    svg.append(path);
    button.classList.add('showroom-icon');
    button.title = title;
    button.replaceChildren(svg);
  }

  function syncSound() {
    const owner = soundEnabled ? [...activePlayers].at(-1) : null;
    for (const player of activePlayers) player.muted = player !== owner;
    for (const [button, player] of soundControls) {
      const audible = player === owner;
      setIcon(button, audible ? 'sound' : 'muted', audible ? 'Mute' : 'Unmute');
      button.setAttribute('aria-pressed', String(audible));
    }
    document.dispatchEvent(new CustomEvent('hb:showroom-sound', {detail:soundEnabled}));
  }

  function mount(root, names, { active = true, onExplore, walkthrough = false, manualSelection = false } = {}) {
    let index = 0;
    let shouldPlay = !window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    let isActive = active;
    let extended = false;
    let highResolution = false;
    let inViewport = true;
    const video = document.createElement('video');
    video.className = 'showroom-video';
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = manualSelection || names.length === 1;
    video.preload = 'auto';
    const controls = document.createElement('div');
    controls.className = 'showroom-controls';
    const status = document.createElement('span');
    status.className = 'sr-only';
    const caption = document.createElement('p');
    caption.className = 'showroom-hook';

    function button(text, label, onClick) {
      const control = document.createElement('button');
      control.type = 'button';
      control.textContent = text;
      control.title = label;
      control.setAttribute('aria-label', label);
      control.addEventListener('click', onClick);
      return control;
    }

    const previous = button('‹', 'Previous spot', () => select(index - 1, true));
    const next = button('›', 'Next spot', () => select(index + 1, true));
    setIcon(previous, 'previous', 'Previous spot');
    setIcon(next, 'next', 'Next spot');
    const toggle = button('Play', 'Play showroom', () => {
      shouldPlay = video.paused;
      syncPlayback();
    });
    const explore = onExplore && button('Explore product', 'Explore product', () => onExplore(names[index]));
    const sound = button('Sound on', 'Showroom sound', () => {
      soundEnabled = video.muted;
      if (soundEnabled && video.autoplay) {
        activePlayers.delete(video);
        activePlayers.add(video);
      }
      syncSound();
      if (video.autoplay) video.play().catch(() => { video.muted = true; });
    });
    soundControls.set(sound, video);
    setIcon(sound, 'muted', 'Unmute');
    const demo = walkthrough && !previews.has(names[0]) && button('Watch walkthrough', 'Watch walkthrough', () => {
      extended = !extended;
      const label = extended ? 'Back to trailer' : 'Watch walkthrough';
      setIcon(demo, extended ? 'trailer' : 'walkthrough', label);
      demo.setAttribute('aria-label', label);
      demo.setAttribute('aria-pressed', String(extended));
      if (quality) quality.hidden = !extended;
      shouldPlay = true;
      select(index);
    });
    const quality = demo && ultraHD.has(names[0]) && button('Watch in 4K', 'Change walkthrough quality', () => {
      highResolution = !highResolution;
      setIcon(quality, 'quality', highResolution ? 'Switch to HD' : 'Watch in 4K');
      quality.setAttribute('aria-pressed', String(highResolution));
      select(index);
    });
    if (names.length > 1 && !manualSelection) controls.append(previous);
    controls.append(toggle);
    if (names.length > 1 && !manualSelection) controls.append(next);
    const elapsed = document.createElement('span');
    elapsed.className = 'showroom-time';
    elapsed.hidden = true;
    const seek = document.createElement('input');
    seek.type = 'range';
    seek.className = 'showroom-progress';
    seek.min = '0';
    seek.step = '0.1';
    seek.value = '0';
    seek.hidden = true;
    seek.setAttribute('aria-label', 'Seek video');
    function updateProgress() {
      const ready = Number.isFinite(video.duration) && video.duration > 0;
      seek.hidden = !ready;
      elapsed.hidden = !ready || !extended;
      if (ready) {
        seek.max = String(video.duration);
        seek.value = String(video.currentTime);
        const whole = Math.floor(video.currentTime);
        elapsed.textContent = Math.floor(whole / 60) + ':' + String(whole % 60).padStart(2, '0');
      }
    }
    seek.addEventListener('input', () => { video.currentTime = Number(seek.value); });
    for (const event of ['durationchange','timeupdate','emptied']) video.addEventListener(event, updateProgress);
    controls.append(seek, elapsed, sound);
    if (demo) {
      setIcon(demo, 'walkthrough', 'Watch walkthrough');
      controls.append(demo);
    }
    if (quality) {
      setIcon(quality, 'quality', 'Watch in 4K');
      quality.hidden = true;
      quality.setAttribute('aria-pressed', 'false');
      controls.append(quality);
    }
    const closeTheater = () => {
      if (!root.hasAttribute('popover')) return;
      root.hidePopover();
      root.removeAttribute('popover');
      updateFullscreen();
    };
    const fullscreen = (root.requestFullscreen || root.showPopover) && button('Full screen', 'Showroom full screen', async () => {
      if (root.matches(':popover-open')) {
        closeTheater();
        return;
      }
      if (document.fullscreenElement === root) {
        await document.exitFullscreen();
        return;
      }
      try {
        await root.requestFullscreen();
      } catch {
        if (root.showPopover) {
          root.setAttribute('popover', 'manual');
          root.showPopover();
          updateFullscreen();
        }
      }
    });
    const updateFullscreen = () => {
      if (!fullscreen) return;
      const expanded = document.fullscreenElement === root || root.matches(':popover-open');
      setIcon(fullscreen, expanded ? 'shrink' : 'expand', expanded ? 'Exit full screen' : 'Full screen');
      fullscreen.setAttribute('aria-pressed', String(expanded));
    };
    const onTheaterKey = event => {
      if (event.key === 'Escape' && root.matches(':popover-open')) {
        event.stopPropagation();
        closeTheater();
        fullscreen.focus();
      }
    };
    if (fullscreen) {
      updateFullscreen();
      controls.append(fullscreen);
      root.addEventListener('fullscreenchange', updateFullscreen);
      root.addEventListener('keydown', onTheaterKey);
    }
    if (explore) controls.append(explore);
    root.replaceChildren(video, caption, controls, status);
    const localize = new MutationObserver(() => { caption.textContent = describe(names[index]); });
    localize.observe(document.documentElement, {attributes:true, attributeFilter:['lang']});

    function updateToggle() {
      const label = video.paused ? 'Play' : 'Pause';
      setIcon(toggle, video.paused ? 'play' : 'pause', label);
      toggle.setAttribute('aria-label', label + ' showroom');
    }

    function syncPlayback() {
      video.autoplay = shouldPlay && isActive && inViewport && !document.hidden;
      if (video.autoplay) {
        activePlayers.add(video);
        syncSound();
        video.play().catch(() => {
          if (!video.autoplay || video.muted) return;
          video.muted = true;
          video.play().catch(updateToggle);
        });
      } else {
        activePlayers.delete(video);
        video.muted = true;
        video.pause();
        syncSound();
      }
      updateToggle();
    }

    function select(position, announce = false) {
      index = (position + names.length) % names.length;
      const title = names[index];
      const path = pathFor(title);
      video.poster = path + '.jpg';
      video.src = path + (extended ? highResolution ? '-4k.mp4' : '-demo.mp4' : '-film.mp4');
      caption.textContent = describe(title);
      video.setAttribute('aria-label', title + ' showroom spot');
      if (explore) {
        const opening = title === 'Company Opening';
        const label = opening ? 'Discover the products' : 'Explore product';
        explore.textContent = label;
        explore.setAttribute('aria-label', opening ? label : 'Explore ' + title);
      }
      if (announce) status.textContent = title;
      syncPlayback();
    }

    video.addEventListener('play', updateToggle);
    video.addEventListener('pause', updateToggle);
    video.addEventListener('ended', () => {
      if (names.length > 1 && !manualSelection) select(index + 1);
    });
    video.addEventListener('error', () => {
      if (extended && highResolution) {
        quality.click();
        return;
      }
      const fallback = pathFor(names[index]) + '.webm';
      if (video.getAttribute('src') !== fallback) {
        video.src = fallback;
        syncPlayback();
        return;
      }
      status.textContent = 'Video unavailable. The spot artwork is displayed.';
      updateToggle();
    });
    const visibility = typeof IntersectionObserver === "function" ? new IntersectionObserver(entries => {
      inViewport = entries.at(-1).isIntersecting;
      syncPlayback();
    }) : null;
    visibility?.observe(root);
    select(0);

    return {
      replay() {
        video.currentTime = 0;
        shouldPlay = true;
        syncPlayback();
      },
      setSpot(name) {
        const next = names.indexOf(name);
        if (next < 0 || next === index) return;
        shouldPlay = true;
        select(next);
      },
      setActive(value) {
        isActive = value;
        syncPlayback();
      },
      destroy() {
        isActive = false;
        syncPlayback();
        localize.disconnect();
        visibility?.disconnect();
        root.removeEventListener('fullscreenchange', updateFullscreen);
        root.removeEventListener('keydown', onTheaterKey);
        closeTheater();
        soundControls.delete(sound);
        video.removeAttribute('src');
        video.load();
      },
    };
  }

  window.HBShowroom = { mount, pathFor, describe, addHooks: entries => Object.assign(hooks, entries) };
})();
