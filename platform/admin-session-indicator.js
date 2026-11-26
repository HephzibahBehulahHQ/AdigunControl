(() => {
  'use strict';

  const utility = document.querySelector('.hb-utilities');
  if (!utility || utility.querySelector('#hbAdminSession')) return;

  const button = document.createElement('button');
  button.id = 'hbAdminSession';
  button.className = 'hb-admin-session';
  button.type = 'button';
  button.dataset.state = 'checking';
  button.setAttribute('aria-label', 'Administrator session: checking');
  button.title = 'Administrator session: checking';

  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('aria-hidden', 'true');
  const shoulders = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  shoulders.setAttribute('d', 'M20 21a8 8 0 0 0-16 0');
  const head = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  head.setAttribute('cx', '12');
  head.setAttribute('cy', '8');
  head.setAttribute('r', '4');
  icon.append(shoulders, head);
  const dot = document.createElement('span');
  dot.className = 'hb-admin-session-dot';
  dot.setAttribute('aria-hidden', 'true');
  button.append(icon, dot);
  utility.append(button);

  let verifiedSession = null;
  let dialog = null;

  function setState(state, label) {
    button.dataset.state = state;
    button.setAttribute('aria-label', label);
    button.title = label;
  }

  function openDetails() {
    if (!verifiedSession) return;
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.className = 'hb-admin-session-dialog';
      dialog.setAttribute('aria-labelledby', 'hbAdminSessionTitle');
      const heading = document.createElement('h2');
      heading.id = 'hbAdminSessionTitle';
      heading.textContent = 'Administrator session';
      const identity = document.createElement('p');
      identity.dataset.sessionIdentity = 'true';
      const expiry = document.createElement('p');
      expiry.dataset.session-expiry = 'true';
      const logout = document.createElement('a');
      logout.dataset.sessionLogout = 'true';
      logout.textContent = 'Sign out';
      const close = document.createElement('button');
      close.type = 'button';
      close.textContent = 'Close';
      close.addEventListener('click', () => dialog.close());
      dialog.append(heading, identity, expiry, logout, close);
      dialog.addEventListener('close', () => dialog.remove(), {once: true});
      document.body.append(dialog);
    }
    dialog.querySelector('[data-session-identity]').textContent = verifiedSession.email;
    dialog.querySelector('[data-session-expiry]').textContent = verifiedSession.expiresAt
      ? 'Session expires ' + new Date(verifiedSession.expiresAt).toLocaleString()
      : 'Session expiry is not available';
    const logout = dialog.querySelector('[data-session-logout]');
    const target = new URL(verifiedSession.logout || '/cdn-cgi/access/logout', location.origin);
    if (target.origin === location.origin && target.pathname === '/cdn-cgi/access/logout') {
      logout.href = target.href;
    } else {
      logout.removeAttribute('href');
    }
    if (!dialog.open) dialog.showModal();
  }

  button.addEventListener('click', openDetails);

  fetch('/api/admin/security/session', {
    method: 'GET',
    credentials: 'same-origin',
    cache: 'no-store',
    headers: {accept: 'application/json'}
  }).then(async response => {
    if (!response.ok) throw new Error('Session verification failed');
    const data = await response.json();
    if (typeof data.session?.email !== 'string' || !data.session.email) {
      throw new Error('Verified identity is unavailable');
    }
    verifiedSession = data.session;
    setState('active', 'Administrator session active: ' + verifiedSession.email);
    const access = document.querySelector('#accessStatus');
    if (access) {
      access.textContent = '● ACTIVE';
      access.classList.add('ok');
      access.classList.remove('denied');
    }
    const identity = document.querySelector('#identityEmail');
    if (identity) identity.textContent = verifiedSession.email;
    const clearance = document.querySelector('#overviewClearance');
    if (clearance) clearance.textContent = 'ACTIVE';
    const edge = document.querySelector('#overviewIdentity');
    if (edge) edge.textContent = 'CLOUDFLARE ACCESS · VERIFIED';
    const identityStatus = document.querySelector('#overviewIdentityStatus');
    if (identityStatus) identityStatus.textContent = 'ACTIVE';
    const identityDetail = document.querySelector('#overviewIdentityDetail');
    if (identityDetail) identityDetail.textContent = verifiedSession.email;
    const sessionStatus = document.querySelector('#overviewSessionStatus');
    if (sessionStatus) sessionStatus.textContent = verifiedSession.expiresAt
      ? new Date(verifiedSession.expiresAt).toLocaleString()
      : 'Verified; expiry unavailable';
    const lastSeen = document.querySelector('#overviewLastSeen');
    if (lastSeen) lastSeen.textContent = 'Verified ' + new Date(verifiedSession.serverTime).toLocaleString();
  }).catch(() => {
    setState('unverified', 'Administrator session status unavailable');
    const access = document.querySelector('#accessStatus');
    if (access) {
      access.textContent = '● UNVERIFIED';
      access.classList.remove('ok');
      access.classList.add('denied');
    }
    const clearance = document.querySelector('#overviewClearance');
    if (clearance) clearance.textContent = 'UNVERIFIED';
    const identityStatus = document.querySelector('#overviewIdentityStatus');
    if (identityStatus) identityStatus.textContent = 'UNAVAILABLE';
  });
})();
