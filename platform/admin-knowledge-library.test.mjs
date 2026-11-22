import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {resolveRoute} from './router.mjs';

const root = new URL('../apps/admin/', import.meta.url);
const assets = new URL('_hb/admin-cinema/', root);
const library = JSON.parse(fs.readFileSync(new URL('knowledge-library.json', assets), 'utf8'));
const page = fs.readFileSync(new URL('admin.html', root), 'utf8');

test('the private library has documents, provenance, and all four collections', () => {
  assert.equal(library.collections.length, 4);
  assert.match(library.sourceRevision, /^[0-9a-f]{40}$/);
  assert.equal(new Set(library.documents.map(document => document.id)).size, library.documents.length);
  for (const collection of library.collections) {
    assert.ok(library.documents.some(document => document.collection === collection.id));
  }
  for (const document of library.documents) {
    assert.ok(document.title && document.description && document.kind && document.review);
    assert.ok(document.sections.length && document.sources.length);
    for (const source of document.sources) {
      assert.ok(source.label && (source.path || source.external));
      if (source.external) assert.equal(new URL(source.external).hostname, 'github.com');
    }
  }
});

test('Overview remains first and the private reader replaces the retired cards', () => {
  const sections = [...page.matchAll(/<section[^>]*id="([^"]+)"/g)].map(match => match[1]);
  assert.equal(sections[0], 'overview');
  assert.ok(sections.includes('github-knowledge'));
  assert.match(page, /data-hbk-search/);
  assert.doesNotMatch(page, /adigun-github-knowledge\.js/);
  assert.doesNotMatch(page, /id="githubKnowledgeModal"/);
});

test('library resources are rejected on the public host and routed as private Admin assets', () => {
  for (const file of ['knowledge-library.json', 'knowledge-library.js', 'knowledge-library.css']) {
    assert.ok(fs.statSync(new URL(file, assets)).size > 0);
    const path = '/_hb/admin-cinema/' + file;
    assert.equal(resolveRoute(new URL(path, 'https://hephzibahbehulah.com')).status, 404);
    const admin = resolveRoute(new URL(path, 'https://admin.hephzibahbehulah.com'));
    assert.equal(admin.privateHost, true);
    assert.equal(admin.kind, 'shared');
  }
});
