import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'site/data/catalogue.json');
const allowed = {
 project: ['id','name','summary','kind','group','status','verified','visibility','url'],
 task: ['id','projectId','title','summary','status','date','visibility']
};
const fail = message => { throw new Error(message); };
const date = value => { if(typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || new Date(value+'T12:00:00Z').toISOString().slice(0,10)!==value) fail('Invalid date'); };
const text = value => {
 if(typeof value !== 'string'||!value.trim()||value.length>700) fail('Text must be 1–700 characters');
 if(/(?:\/Users\/|OneDrive-|file:\/\/|gh[pousr]_[A-Za-z0-9]|github_pat_|sk-[A-Za-z0-9]{12,}|-----BEGIN|api[_ -]?key\s*[:=]|bearer\s+[A-Za-z0-9])/i.test(value)) fail('Private path or credential pattern detected');
};
const bilingual = value => {if(!value||typeof value !== 'object'||Object.keys(value).some(k=>!['ar','en'].includes(k)))fail('Use Arabic and English text only');text(value.ar);text(value.en);};
export function validateEntry(entry, kind) {
 if(!entry||typeof entry!=='object'||Array.isArray(entry))fail('Expected an object');
 if(Object.keys(entry).some(k=>!allowed[kind].includes(k)))fail('Unsupported field: use public summary fields only');
 if(entry.visibility!=='public')fail('Only public entries are accepted');
 if(typeof entry.id!=='string'||!(/^[a-z0-9][a-z0-9-]{0,99}$/).test(entry.id))fail('Invalid stable ID');
 bilingual(entry.summary);
 if(kind==='project'){
  bilingual(entry.name);if(!['company','app','website'].includes(entry.kind))fail('Invalid project kind');
  if(!['marasi','ppdc','al-aoula','independent','personal'].includes(entry.group))fail('Invalid project group');
  if(!['listed','active','live','paused','completed'].includes(entry.status))fail('Invalid project status');date(entry.verified);
  if(entry.url){const url=new URL(entry.url);if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash)fail('Use a public HTTPS URL without credentials, queries or fragments');}
 }else{
  bilingual(entry.title);if(!['planned','active','completed','paused','blocked'].includes(entry.status))fail('Invalid task status');date(entry.date);if(typeof entry.projectId!=='string')fail('Missing projectId');
 }
}
export function validate(data){
 if(Object.keys(data).some(k=>!['version','updated','projects','tasks'].includes(k)))fail('Unsupported catalogue field');
 if(data.version!==1||!Array.isArray(data.projects)||!Array.isArray(data.tasks))fail('Invalid catalogue');date(data.updated);
 for(const [kind,list] of [['project',data.projects],['task',data.tasks]]){const ids=new Set();for(const entry of list){validateEntry(entry,kind);if(ids.has(entry.id))fail('Duplicate ID');ids.add(entry.id);}}
 for(const task of data.tasks)if(!data.projects.some(p=>p.id===task.projectId))fail('Task points to an unknown project');
 return true;
}
function main(){
 const [command, kind] = process.argv.slice(2);const data=JSON.parse(fs.readFileSync(file,'utf8'));
 if(command==='upsert'){
  if(!['project','task'].includes(kind))fail('Usage: node scripts/catalogue.mjs upsert project|task < public-entry.json');
  const entry=JSON.parse(fs.readFileSync(0,'utf8'));validateEntry(entry,kind);const list=data[kind==='project'?'projects':'tasks'];const i=list.findIndex(x=>x.id===entry.id);if(i<0)list.push(entry);else list[i]=entry;
  data.updated=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Muscat',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());validate(data);fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');console.log('Updated public '+kind+': '+entry.id);
 }else if(command==='validate'){validate(data);console.log(`Valid: ${data.projects.length} projects, ${data.tasks.length} task updates`);}else fail('Usage: node scripts/catalogue.mjs validate|upsert');
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){try{main();}catch(error){console.error(error.message);process.exitCode=1;}}
