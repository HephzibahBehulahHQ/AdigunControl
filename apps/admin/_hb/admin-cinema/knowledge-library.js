(() => {
  const library = document.getElementById('github-knowledge');
  if (!library?.querySelector('[data-hbk-search]')) return;
  const search = library.querySelector('[data-hbk-search]');
  const collection = library.querySelector('[data-hbk-collection]');
  const results = library.querySelector('[data-hbk-results]');
  const reader = library.querySelector('[data-hbk-reader]');
  const status = library.querySelector('[data-hbk-status]');
  const asset = new URL('./knowledge-library.json', document.currentScript.src);
  let selected = '';

  function element(tag, text) {
    const node = document.createElement(tag);
    node.textContent = text;
    return node;
  }

  function show(doc, version, moveFocus = false) {
    selected = doc?.id || '';
    for (const button of results.querySelectorAll('button')) {
      if (button.dataset.hbkId === selected) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    }
    reader.replaceChildren();
    if (!doc) return;
    const heading = element('h3', doc.title);
    heading.tabIndex = -1;
    reader.append(heading, element('p', doc.description),
      element('p', [doc.kind, doc.review, version].join(' · ')));
    for (const section of doc.sections) {
      reader.append(element('h4', section.title), element('p', section.body));
    }
    const sources = element('ul', '');
    for (const item of doc.sources) {
      const label = element('li', '');
      const url = item.path
        ? 'https://github.com/HephzibahBehulah/Hephzibahbehulah.github.io/blob/' +
          encodeURIComponent(doc.sourceRevision) + '/' + item.path.split('/').map(encodeURIComponent).join('/')
        : item.external;
      const link = element('a', item.label);
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      label.append(link);
      sources.append(label);
    }
    reader.append(element('h4', 'Sources'), sources);
    if (moveFocus) heading.focus({preventScroll:true});
  }

  fetch(asset, {credentials:'same-origin'})
    .then(response => {
      if (!response.ok) throw new Error('Library unavailable');
      return response.json();
    })
    .then(({collections, documents, version, sourceRevision}) => {
      for (const item of collections) collection.add(new Option(item.title, item.id));
      for (const doc of documents) doc.sourceRevision = sourceRevision;
      function filter() {
        const query = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
        const matches = documents.filter(doc => {
          const text = [doc.title, doc.description, doc.kind, doc.review,
            collections.find(item => item.id === doc.collection)?.title,
            ...doc.sections.flatMap(section => [section.title, section.body])].join(' ').toLowerCase();
          return (!collection.value || collection.value === doc.collection) && query.every(term => text.includes(term));
        });
        results.replaceChildren(...matches.map(doc => {
          const button = element('button', doc.title);
          button.type = 'button';
          button.className = 'os-btn hbk-result';
          button.dataset.hbkId = doc.id;
          button.addEventListener('click', () => show(doc, version, true));
          return button;
        }));
        status.textContent = matches.length === 1 ? '1 document' : matches.length + ' documents';
        show(matches.find(doc => doc.id === selected) || matches[0], version);
      }
      search.addEventListener('input', filter);
      collection.addEventListener('change', filter);
      search.disabled = false;
      collection.disabled = false;
      filter();
    })
    .catch(() => {
      status.textContent = 'The private library could not load. Refresh the page and try again.';
    });
})();
