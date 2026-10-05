import assert from 'node:assert/strict';
import { validate } from './catalogue.mjs';
import fs from 'node:fs';
const data=JSON.parse(fs.readFileSync(new URL('../site/data/catalogue.json',import.meta.url),'utf8'));
assert.equal(validate(data),true);
for(const mutate of [d=>d.projects[0].visibility='private',d=>d.projects[0].sourcePath='/private',d=>d.projects[0].summary.en='/Users/test/document',d=>d.tasks[0].projectId='missing-project',d=>d.projects.push(d.projects[0]),d=>d.projects[0].url='javascript:alert(1)',d=>d.projects[0].url='https://example.com/?token=private',d=>d.projects[0].summary.ar='',d=>d.projects.find(p=>p.id==='abs-erp').companyId='missing-company',d=>d.projects.find(p=>p.id==='abs-erp').companyId='watad-estimator',d=>d.projects.find(p=>p.id==='abs').companyId='ppdc']){
 const copy=structuredClone(data);mutate(copy);assert.throws(()=>validate(copy));
}
console.log('Catalogue validation and publication boundary tests passed');
