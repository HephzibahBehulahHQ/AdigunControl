(() => {
  const root = document.getElementById('portfolio');
  if (!root || !window.HBShowroom || !window.HB_PHASE0_CATALOG) return;
  const {divisions, products} = window.HB_PHASE0_CATALOG;
  const brand = root.querySelector('[data-hbp-brand]');
  const product = root.querySelector('[data-hbp-product]');
  const record = root.querySelector('[data-hbp-record]');
  const title = root.querySelector('[data-hbp-title]');
  const mode = root.querySelector('[data-hbp-mode]');
  const stage = root.querySelector('[data-hbp-player]');
  const details = root.querySelector('details');
  const sectionFilms = {
    overview:['Admin Overview', 'Watch the control room overview'],
    'admin-intelligence-tree':['Company Ecosystem', 'Watch the portfolio map'],
    intelligence:['Admin Events', 'Watch a sample event review'],
    'github-knowledge':['Admin Repositories', 'Watch a source inventory walkthrough'],
    terminal:['Admin Terminal', 'Watch the local terminal practice example'],
    operator:['Admin Bot', 'Watch guided Bot examples'],
    'ai-agent':['Admin Bot', 'Watch guided Bot examples'],
  };
  const panels = new Map();
  for (const [id, [name, label]] of Object.entries(sectionFilms)) {
    const section = document.getElementById(id);
    if (!section) continue;
    const disclosure = document.createElement('details');
    disclosure.className = 'hb-admin-cinema';
    disclosure.open = true;
    const summary = document.createElement('summary');
    summary.textContent = label;
    const screen = document.createElement('div');
    screen.className = 'showroom';
    disclosure.append(summary, screen);
    if (id === 'overview') section.querySelector('.adigun-overview-grid').after(disclosure);
    else section.append(disclosure);
    panels.set(id,{name,disclosure,screen,player:null});
    disclosure.addEventListener('toggle',syncPanels);
  }
  let active;

  function options(select, records, label) {
    const previous = select.value;
    select.replaceChildren(new Option(label, ''), ...records.map(({name,id}) => new Option(name,id)));
    if ([...select.options].some(option => option.value === previous)) select.value = previous;
  }

  function start() {
    const selected = products.find(item => item.name === product.value);
    const division = divisions.find(item => item.id === brand.value);
    title.textContent = selected?.name || division?.name || 'Portfolio';
    mode.disabled = !selected;
    record.replaceChildren();
    if (selected?.desc) {
      const text = document.createElement('p');
      text.textContent = selected.desc;
      record.append(text);
    }
    const route = selected?.workspaceUrl || selected?.url;
    if (route && /^https:\/\//i.test(route)) {
      const link = document.createElement('a');
      link.href = route;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Open product workspace';
      record.append(link);
    }
    active?.destroy();
    active = null;
    if (!details.open || location.hash !== '#portfolio') return;
    const management = selected && mode.value === 'management';
    const names = selected ? [management ? 'Admin Manage ' + selected.name : selected.name] :
      division ? [division.id, ...products.filter(p => p.division === division.id ||
        p.relatedDivisions?.includes(division.id)).map(p => p.name)] : ['Admin Overview', ...products.map(p => p.name)];
    active = window.HBShowroom.mount(stage, names, {
      active: !document.hidden, walkthrough: Boolean(selected && !management),
    });
  }

  function scope() {
    const filtered = products.filter(item => !brand.value ||
      item.division === brand.value || item.relatedDivisions?.includes(brand.value));
    options(product, filtered.map(item => ({id:item.name,name:item.name})), 'All products');
    start();
  }

  function syncPanels() {
    const target = location.hash.slice(1) || 'overview';
    for (const [id, panel] of panels) {
      if (target === id && panel.disclosure.open) {
        panel.player ||= window.HBShowroom.mount(panel.screen, [panel.name], {active:!document.hidden});
      } else if (panel.player) {
        panel.player.destroy();
        panel.player = null;
      }
    }
  }

  options(brand, divisions, 'All brands');
  brand.addEventListener('change', scope);
  product.addEventListener('change', start);
  mode.addEventListener('change', start);
  details.addEventListener('toggle', start);
  window.addEventListener('hashchange', () => { start(); syncPanels(); });
  document.addEventListener('visibilitychange', () => {
    active?.setActive(!document.hidden);
    for (const panel of panels.values()) panel.player?.setActive(!document.hidden);
  });
  scope();
  syncPanels();
})();
