
(() => {
  const workspace = document.querySelector('.hb-control-workspace');
  if (!workspace) return;
  const panels = [...workspace.querySelectorAll(':scope > .admin-section[id]')];
  function showWorkspace() {
    const hash = location.hash.slice(1);
    const active = panels.find(panel => panel.id === hash || panel.querySelector('[id="' + CSS.escape(hash) + '"]')) ?? panels[0];
    for (const panel of panels) panel.hidden = panel !== active;
  }
  window.addEventListener('hashchange', showWorkspace);
  showWorkspace();
})();
