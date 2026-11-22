import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const read = path => fs.readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('engineering calculator and reference are reachable only in the Tool Lab page', () => {
  const lab = read('apps/admin/admin-tools.html');
  const cyber = read('apps/cyber-os/index.html');
  for (const id of ['formulas', 'engineering-reference']) {
    assert.match(lab, new RegExp('href="#' + id + '"'));
    assert.match(lab, new RegExp('id="' + id + '"'));
    assert.doesNotMatch(cyber, new RegExp('id="' + id + '"|href="#' + id + '"'));
  }
  assert.doesNotMatch(read('cyber-os/cyber-os-data.js'), /^formulas:/m);
  assert.doesNotMatch(read('cyber-os/knowledge-hub.js'), /^electronics:/m);
});

test('Tool Lab computes an engineering result with the migrated calculator', () => {
  const fields = Object.fromEntries(['formulaSelect', 'formulaInputs', 'calculateFormula', 'formulaResult', 'formulaGrid', 'formulaReference', 'engineeringConcepts'].map(id => [id, {}]));
  fields.formulaSelect.value = 'ohm';
  fields.formulaInputs.querySelectorAll = () => [
    {value: '12', dataset: {var: 'V'}},
    {value: '2', dataset: {var: 'I'}},
  ];
  const window = {};
  vm.runInNewContext(read('js/engineering-reference.js'), {
    window,
    document: {getElementById: id => fields[id]},
    fetch: async () => ({ok: true, json: async () => JSON.parse(read('apps/admin/data/engineering-formulas.json'))}),
  });
  fields.calculateFormula.onclick();
  assert.equal(fields.formulaResult.textContent, 'R = 6');
  assert.match(fields.engineeringConcepts.innerHTML, /Oscilloscope/);
});

test('each Cyber OS section anchor resolves once', () => {
  const ids = [...read('apps/cyber-os/index.html').matchAll(/<section[^>]+\bid="([^"]+)"/g)].map(([, id]) => id);
  assert.equal(new Set(ids).size, ids.length);
});
