(() => {
  const sidebar = document.querySelector('.os-sidebar');
  const header = document.querySelector('.os-top');
  const content = document.querySelector('.os-content');
  if (!sidebar || !header || !content) return;

  const path = location.pathname.replace(/\/$/, '');
  const control = header.classList.contains('hb-control-top');
  const cyber = path.endsWith('/cyber-os');
  const workspace = control ? 'Control' : cyber ? 'Cyber OS' : 'Tool Lab';
  document.body.classList.add('hb-admin-workspace');

  if (!control) {
    sidebar.querySelector('.os-brand')?.remove();
    header.querySelector('.os-breadcrumb')?.remove();
    const brand = document.createElement('a');
    brand.className = 'hb-admin-brand';
    brand.href = '/';
    const logo = document.createElement('img');
    logo.src = '/_hb/admin-cinema/hb-mark.png';
    logo.alt = '';
    const brandCopy = document.createElement('span');
    const scope = document.createElement('small');
    scope.textContent = workspace;
    brandCopy.append('Adigun Control', scope);
    brand.append(logo, brandCopy);
    header.prepend(brand);
  }

  const switcher = document.createElement('nav');
  switcher.className = 'hb-workspace-switcher';
  switcher.setAttribute('aria-label', 'Admin workspaces');
  for (const [label, url] of [['Control', '/'], ['Tool Lab', '/admin/tools/'], ['Cyber OS', '/admin/cyber-os/']]) {
    const link = document.createElement('a');
    link.href = url;
    link.textContent = label;
    if (label === workspace) link.setAttribute('aria-current', 'page');
    switcher.append(link);
  }
  sidebar.prepend(switcher);
  if (!control && !cyber) {
    const homeLink = document.createElement('a');
    homeLink.href = '/admin/tools/#tool-lab-overview';
    homeLink.textContent = 'Overview';
    homeLink.className = 'hb-workspace-overview';
    switcher.after(homeLink);
  }
  sidebar.querySelectorAll('.hb-platform-apps').forEach(group => group.remove());
  const footer = document.querySelector('.hb-platform-footer, footer.os-footer');
  if (footer) {
    footer.classList.add('hb-admin-footer');
    const top = document.createElement('button');
    top.type = 'button';
    top.textContent = '↑';
    top.setAttribute('aria-label', 'Back to top');
    top.title = 'Back to top';
    top.addEventListener('click', () => {
      document.querySelector('.os-main').scrollTop = 0;
      header.querySelector('a, button, input')?.focus({preventScroll: true});
    });
    if (!footer.querySelector('[aria-label="Back to top"]')) footer.append(top);
    document.querySelector('.os-main').append(footer);
  }

  const account = header.querySelector('.hb-member-actions');
  if (account) {
    document.addEventListener('click', event => {
      if (!account.contains(event.target)) account.open = false;
    });
    account.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !account.open) return;
      account.open = false;
      account.querySelector('summary').focus();
    });
  }

  if (control) return;
  if (!cyber) {
    const bench = sidebar.querySelector('a[href$="#toolbench"]')?.closest('nav');
    if (bench) {
      const links = new Map([...bench.querySelectorAll('a')].map(link => [link.hash.slice(1), link]));
      const group = bench.closest('details');
      for (const [label, ids] of [
        ['Engineering', ['toolbench', 'projects', 'megaTools', 'formulas', 'engineering-reference']],
        ['References', ['ebookVault', 'knowledgeLibrary']],
        ['Workspace tools', ['terminal', 'operator', 'ai-agent']]
      ]) {
        const details = document.createElement('details');
        const heading = document.createElement('summary');
        const nav = document.createElement('nav');
        details.className = 'hb-sidebar-group';
        details.open = label === 'Engineering';
        heading.textContent = label;
        nav.className = 'os-nav';
        nav.setAttribute('aria-label', label);
        for (const id of ids) {
          const link = links.get(id);
          if (link) nav.append(link);
        }
        details.append(heading, nav);
        (group || bench).before(details);
      }
      (group || bench).remove();
    }
  }
  const sections = [...content.querySelectorAll('section[id], .tool-lab-command-deck')]
    .filter(section => !section.parentElement.closest('section[id]'));
  const home = document.getElementById('dashboard') || content.querySelector('.tool-lab-command-deck');
  if (!home || !sections.includes(home)) return;

  const main = document.querySelector(".os-main");

  function show(anchor, scroll = true) {
    const view = sections.find(section => section === anchor || section.contains(anchor)) || home;
    for (const section of sections) section.hidden = section !== view;
    for (const link of sidebar.querySelectorAll('a[href*="#"]')) {
      const selected = link.pathname === location.pathname && link.hash === '#' + view.id;
      link.classList.toggle('active', selected);
      if (selected) {
        link.setAttribute('aria-current', 'location');
        const group = link.closest('details');
        if (group) group.open = true;
      } else link.removeAttribute('aria-current');
    }
    if (scroll && anchor && anchor !== view) anchor.scrollIntoView({block: 'start'});
    else if (scroll) main.scrollTop = 0;
  }

  function sync() {
    let id = location.hash.slice(1);
    try { id = decodeURIComponent(id); } catch {}
    if (!cyber && id === 'ebookVault') {
      location.replace('/admin/cyber-os/#ebookVault');
      return;
    }
    if (cyber && id === 'formulas') {
      location.replace('/admin/tools/#formulas');
      return;
    }
    show(document.getElementById(id));
  }
  window.addEventListener('hashchange', sync);
  sync();

  // Existing catalog search mirrors this field and scrolls to the results.
  if (cyber) header.querySelector('#globalSearch')?.addEventListener('input', event => {
    if (event.target.value.trim()) show(document.getElementById('cybersecurity-tools-academy'));
  }, true);
})();
