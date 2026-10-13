
'use strict';
// Local-only game. The six PNG motifs are listed in ASSETS (index.html).
// No dependencies, analytics or remote storage; sw.js only caches the game's own files for offline play.
const $ = id => document.getElementById(id);
const LEVELS = [2,3,4,5];
const STORAGE_KEY = 'sternenpuzzle.v1';
const BOARD_SIZE = 1200;
const svgIcon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const runtime = {page:'gallery', game:null, selected:null, drag:null, loading:false, generation:0,
  sessionStarted:null, help:true, sound:false, audio:null, hintTimer:null, saveTimer:null,
  paused:false, ghost:null, hoveredSlot:null, suppressClicksUntil:0, updateReady:false, heroStarted:false};
let storageAvailable = true;
let saved = {version:1, level:3, theme:THEMES[0].id, stars:[], sound:false, labels:'zahlen', pieceLabels:false, resume:null};
function seededRandom(seed) {
  let value=seed>>>0;
  return function(){value=(value+0x6D2B79F5)>>>0;let t=Math.imul(value^(value>>>15),1|value);t^=t+Math.imul(t^(t>>>7),61|t);return ((t^(t>>>14))>>>0)/4294967296;};
}
function shuffled(items,rng=Math.random){const a=items.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function newSeed(){try{return crypto.getRandomValues(new Uint32Array(1))[0];}catch{return Math.floor(Math.random()*4294967296);}}
function formatTime(milliseconds){const seconds=Math.floor(Math.max(0,milliseconds)/1000);return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;}
function generatePieces(n,seed){
  const random=seededRandom(seed), h=Array.from({length:n-1},()=>Array.from({length:n},()=>random()>.5?1:-1)),
    v=Array.from({length:n},()=>Array.from({length:n-1},()=>random()>.5?1:-1));
  return Array.from({length:n*n},(_,id)=>{const row=Math.floor(id/n),col=id%n;return {id,row,col,
    edges:[row===0?0:-h[row-1][col],col===n-1?0:v[row][col],row===n-1?0:h[row][col],col===0?0:-v[row][col-1]],placed:false};});
}
// A clockwise edge's positive offset points outwards. Adjacent signs are opposite.
function puzzlePath(piece,cell,pad,PathClass=Path2D){
  const p=new PathClass();p.moveTo(pad,pad);
  function edge(x,y,dx,dy,sign){
    const point=(t,z)=>[x+dx*t+dy*z*sign,y+dy*t-dx*z*sign];
    const line=(t,z=0)=>p.lineTo(...point(t,z));
    const curve=(a,b,c,d,e,f)=>p.bezierCurveTo(...point(a,b),...point(c,d),...point(e,f));
    if(sign===0){line(1);return;}
    line(.33);curve(.41,0,.445,-.025,.44,.035);curve(.435,.066,.36,.086,.37,.14);
    curve(.38,.223,.62,.223,.63,.14);curve(.64,.086,.565,.066,.56,.035);
    curve(.555,-.025,.59,0,.67,0);line(1);
  }
  edge(pad,pad,cell,0,piece.edges[0]);edge(pad+cell,pad,0,cell,piece.edges[1]);
  edge(pad+cell,pad+cell,-cell,0,piece.edges[2]);edge(pad,pad+cell,0,-cell,piece.edges[3]);p.closePath();return p;
}
function sanitizeSave(data){
  const clean={version:1,level:3,theme:THEMES[0].id,stars:[],sound:false,labels:'zahlen',pieceLabels:false,resume:null};
  if(!data || data.version!==1)return clean;
  if(LEVELS.includes(data.level))clean.level=data.level;
  if(THEMES.some(t=>t.id===data.theme))clean.theme=data.theme;
  clean.sound=data.sound===true;
  if(LABEL_MODES.includes(data.labels))clean.labels=data.labels;
  clean.pieceLabels=data.pieceLabels===true;
  if(Array.isArray(data.stars))clean.stars=[...new Set(data.stars.filter(x=>typeof x==='string'&&ASSETS.some(a=>LEVELS.some(n=>x===`${a.id}:${n}`))))];
  const r=data.resume;
  if(r && Number.isInteger(r.motif) && r.motif>=0 && r.motif<ASSETS.length && LEVELS.includes(r.n) && Number.isInteger(r.seed)){
    const placed=Array.isArray(r.placed)?[...new Set(r.placed.filter(x=>Number.isInteger(x)&&x>=0&&x<r.n*r.n))]:[];
    const raw=Array.isArray(r.order)?[...new Set(r.order.filter(x=>Number.isInteger(x)&&x>=0&&x<r.n*r.n&&!placed.includes(x)))]:[];
    const missing=Array.from({length:r.n*r.n},(_,i)=>i).filter(x=>!placed.includes(x)&&!raw.includes(x));
    if(placed.length<r.n*r.n)clean.resume={motif:r.motif,n:r.n,seed:r.seed>>>0,placed,order:raw.concat(missing),
      elapsed:Number.isFinite(r.elapsed)?Math.min(Math.max(0,r.elapsed),31536000000):0,
      moves:Number.isFinite(r.moves)?Math.min(Math.max(0,Math.floor(r.moves)),1000000):0,
      hints:Number.isFinite(r.hints)?Math.min(Math.max(0,Math.floor(r.hints)),1000000):0};
  }
  return clean;
}
function readSaved(){try{const raw=localStorage.getItem(STORAGE_KEY);if(raw)saved=sanitizeSave(JSON.parse(raw));}catch{storageAvailable=false;}}
function writeSaved(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(saved));}catch{storageAvailable=false;$('storageNote').textContent='Offline · Keine Datenübertragung · Fortschritt nur in dieser Sitzung';}}
function elapsedNow(){const g=runtime.game;if(!g)return 0;return g.elapsed+(runtime.sessionStarted!==null?performance.now()-runtime.sessionStarted:0);}
function pauseClock(){if(runtime.sessionStarted!==null&&runtime.game){runtime.game.elapsed+=performance.now()-runtime.sessionStarted;runtime.sessionStarted=null;}}
function resumeClock(){if(runtime.page==='game'&&runtime.game&&!runtime.game.complete&&!runtime.loading&&!document.hidden&&!runtime.paused&&runtime.sessionStarted===null)runtime.sessionStarted=performance.now();}
function persistGame(){
  if(runtime.game&&!runtime.game.complete){const g=runtime.game;saved.resume={motif:g.motif,n:g.n,seed:g.seed,placed:g.pieces.filter(p=>p.placed).map(p=>p.id),order:g.order.filter(id=>!g.pieces[id].placed),elapsed:elapsedNow(),moves:g.moves,hints:g.hints};}
  writeSaved();
}
function setStatus(text){$('statusText').textContent=text;}
function playSound(kind){
  if(!runtime.sound)return;
  try{
    if(!runtime.audio)runtime.audio=new (window.AudioContext||window.webkitAudioContext)();
    const ctx=runtime.audio;if(ctx.state==='suspended')ctx.resume().catch(()=>{});
    const notes=kind==='win'?[523.25,659.25,783.99,1046.5]:kind==='correct'?[659.25,880]:kind==='hint'?[523.25,587.33]:[330];
    notes.forEach((freq,i)=>{const osc=ctx.createOscillator(),gain=ctx.createGain(),start=ctx.currentTime+i*.105;
      osc.type='sine';osc.frequency.value=freq;gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(.055,start+.015);gain.gain.exponentialRampToValueAtTime(.0001,start+.19);osc.connect(gain);gain.connect(ctx.destination);osc.start(start);osc.stop(start+.21);});
  }catch{runtime.sound=false;saved.sound=false;updateSound();writeSaved();}
}
function updateSound(){const on=runtime.sound;$('soundBtn').setAttribute('aria-pressed',String(on));$('soundBtn').setAttribute('aria-label',on?'Ton ausschalten':'Ton einschalten');$('soundUse').setAttribute('href',on?'#i-sound':'#i-mute');$('soundLabel').textContent=on?'Ton an':'Ton aus';}
// Learning labels on the board: numbers, capital letters, dice dots (up to 9 pieces) or none.
const LABEL_MODES=['zahlen','buchstaben','wuerfel','aus'];
const LETTER_NAMES=['A','Be','Ze','De','E','Eff','Ge','Ha','I','Jott','Ka','Ell','Emm','Enn','O','Pe','Ku','Err','Ess','Te','U','Vau','We','Ix','Ypsilon'];
const LETTER_WORDS=['Affe','Ball','Clown','Dino','Esel','Fisch','Giraffe','Hund','Igel','Jacke','Katze','Löwe','Maus','Nase','Ohr','Pinguin','Qualle','Rakete','Sonne','Tiger','Uhu','Vogel','Wal','Xylophon','Yeti'];
// Dot positions in a 3×3 grid, like on a die; 7 to 9 continue the pattern.
const DICE_DOTS=[[4],[0,8],[0,4,8],[0,2,6,8],[0,2,4,6,8],[0,2,3,5,6,8],[0,2,3,4,5,6,8],[0,1,2,3,5,6,7,8],[0,1,2,3,4,5,6,7,8]];
const diceSvg=count=>`<svg class="dice" viewBox="0 0 24 24" aria-hidden="true">${DICE_DOTS[count-1].map(i=>`<circle cx="${5+i%3*7}" cy="${5+Math.floor(i/3)*7}" r="2.3"/>`).join('')}</svg>`;
const labelMode=n=>saved.labels==='wuerfel'&&n*n>DICE_DOTS.length?'zahlen':saved.labels;
// text: short name for screen readers, show: written in the status line, say: read aloud.
function slotLabel(id,mode){
  const number=String(id+1);
  if(mode==='buchstaben'){const letter=String.fromCharCode(65+id);return {text:letter,show:`${letter} wie ${LETTER_WORDS[id]}`,say:`${LETTER_NAMES[id]} wie ${LETTER_WORDS[id]}`,html:letter};}
  if(mode==='wuerfel')return {text:number,show:id===0?'1 Punkt':`${number} Punkte`,say:number,html:diceSvg(id+1)};
  return {text:number,show:number,say:number,html:mode==='aus'?'':number};
}
function labelElement(id,mode,className){const el=document.createElement('span');el.className=className+(mode==='wuerfel'?' is-dice':'');el.innerHTML=slotLabel(id,mode).html;el.setAttribute('aria-hidden','true');return el;}
// Read-aloud uses the device's own German voice (works offline on iPhone/iPad) and follows the sound button.
function speak(text){
  if(!runtime.sound||!text||!('speechSynthesis' in window))return;
  try{const synth=window.speechSynthesis,utterance=new SpeechSynthesisUtterance(text);utterance.lang='de-DE';utterance.rate=.85;
    const voice=synth.getVoices().find(v=>/^de([-_]|$)/i.test(v.lang));if(voice)utterance.voice=voice;synth.cancel();synth.speak(utterance);}catch{}
}
function updateLabelOptions(){
  document.querySelectorAll('.mode').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===saved.labels)));
  const toggle=$('pieceLabelsBtn'),on=saved.pieceLabels&&saved.labels!=='aus';toggle.disabled=saved.labels==='aus';toggle.setAttribute('aria-pressed',String(on));
  $('pieceLabelsText').textContent=on?'Zeichen auf den Teilen: an':'Zeichen auf den Teilen: aus';
  $('modeNote').hidden=!(saved.labels==='wuerfel'&&saved.level*saved.level>DICE_DOTS.length);
}
function updateStars(){ $('starsCount').textContent=`${saved.stars.length} / ${ASSETS.length*LEVELS.length}`; }
const activeThemes=()=>THEMES.filter(t=>ASSETS.some(a=>a.theme===t.id));
const themeOf=id=>activeThemes().find(t=>t.id===id)||activeThemes()[0];
// Indexes into ASSETS (the saved resume and startGame use global indexes) for one theme.
const themeMotifs=themeId=>ASSETS.map((a,i)=>a.theme===themeId?i:-1).filter(i=>i>=0);
function themeStars(themeId){const ids=new Set(themeMotifs(themeId).map(i=>ASSETS[i].id));return saved.stars.filter(s=>ids.has(s.split(':')[0])).length;}
function renderThemes(){
  $('themes').replaceChildren();$('themes').hidden=activeThemes().length<2;
  activeThemes().forEach(theme=>{
    const hero=ASSETS.find(a=>a.id===theme.hero)||ASSETS[themeMotifs(theme.id)[0]],total=themeMotifs(theme.id).length*LEVELS.length,stars=themeStars(theme.id);
    const button=document.createElement('button');button.type='button';button.className='theme';button.setAttribute('aria-pressed',String(theme.id===saved.theme));
    button.setAttribute('aria-label',`Welt ${theme.title}, ${stars} von ${total} Sternen`);
    button.innerHTML=`<img src="${hero.src}" alt="" width="64" height="64"><span><span class="theme-name">${svgIcon(theme.icon)}${theme.title}</span><span class="theme-stars">${svgIcon('star')}${stars} / ${total}</span></span>`;
    button.addEventListener('click',()=>{if(saved.theme===theme.id)return;saved.theme=theme.id;writeSaved();renderGallery();});
    $('themes').append(button);
  });
}
function updateHero(){
  const theme=themeOf(saved.theme);
  $('heroEyebrow').textContent=theme.eyebrow;$('heroHighlight').textContent=theme.highlight;$('heroText').textContent=theme.text;
}
// Treasure route: every world has one route per piece count. Each finished picture lights up its station,
// all stations together open the chest. Nothing is locked; any station can be played at any time.
const routeDone=(themeId,n)=>themeMotifs(themeId).filter(i=>saved.stars.includes(`${ASSETS[i].id}:${n}`));
const routeComplete=(themeId,n)=>routeDone(themeId,n).length===themeMotifs(themeId).length;
function chestSvg(open){
  const line='stroke="#29284F" stroke-width="3" stroke-linejoin="round"';
  const lid=open?`<circle cx="32" cy="28" r="24" fill="#FFE9A8" opacity=".75"/><path d="M12 30 17 8h30l5 22Z" fill="#C27A48" ${line}/><path d="M16 26 20 12h24l4 14Z" fill="#9C5F3A"/>`
    :`<path d="M9 33c0-11 9-17 23-17s23 6 23 17Z" fill="#C27A48" ${line}/><path d="M9 29h46" stroke="#FFD36E" stroke-width="4"/>`;
  const treasure=open?`<path d="M12 33c3-7 10-9 20-9s17 2 20 9Z" fill="#FFD36E" ${line}/><circle cx="22" cy="27" r="3.5" fill="#F6A1BD" stroke="#29284F" stroke-width="2"/><circle cx="40" cy="26" r="3.5" fill="#A8DBE9" stroke="#29284F" stroke-width="2"/><path d="M31 18l2 4 4 .6-3 2.8.8 4.2-3.8-2-3.8 2 .8-4.2-3-2.8 4-.6Z" fill="#FFF3B0" stroke="#29284F" stroke-width="1.8"/>`:'';
  const lock=open?'':`<rect x="27" y="36" width="10" height="11" rx="2.5" fill="#FFD36E" ${line}/><circle cx="32" cy="41" r="1.6" fill="#29284F"/>`;
  return `<svg class="chest" viewBox="0 0 64 64" aria-hidden="true">${lid}${treasure}<rect x="9" y="32" width="46" height="24" rx="5" fill="#D9925C" ${line}/><path d="M9 41h46" stroke="#FFD36E" stroke-width="5"/>${lock}</svg>`;
}
function renderRoute(){
  const theme=themeOf(saved.theme),n=saved.level,motifs=themeMotifs(theme.id),done=new Set(routeDone(theme.id,n));
  const next=motifs.find(i=>!done.has(i)),open=next===undefined,left=motifs.length-done.size,chests=LEVELS.filter(l=>routeComplete(theme.id,l)).length;
  $('routeTitle').textContent=`Deine Schatzroute · ${n*n} Teile`;
  $('routeText').textContent=open?`Geschafft! Die Schatztruhe für ${n*n} Teile ist offen.`:`Noch ${left} ${left===1?'Bild':'Bilder'} bis zur Schatztruhe. Jede Teilezahl hat ihre eigene Truhe.`;
  $('routeChests').innerHTML=`${svgIcon('chest')}${chests} / ${LEVELS.length}`;$('routeChests').title=`${chests} von ${LEVELS.length} Schatztruhen in dieser Welt geöffnet`;
  $('routePath').replaceChildren();$('routePath').style.setProperty('--count',motifs.length+1);
  motifs.forEach((index,position)=>{
    const asset=ASSETS[index],isDone=done.has(index),item=document.createElement('li'),button=document.createElement('button');
    button.type='button';button.className=`station${isDone?' done':''}${index===next?' next':''}`;
    button.setAttribute('aria-label',`Station ${position+1}: ${asset.title}, ${isDone?'geschafft':index===next?'nächster Halt':'noch offen'}. Puzzle mit ${n*n} Teilen starten.`);
    button.innerHTML=`<img src="${asset.src}" alt="" width="64" height="64" loading="lazy"><span class="station-badge">${isDone?svgIcon('check'):position+1}</span>`;
    button.addEventListener('click',()=>startGame(index,n));item.append(button);$('routePath').append(item);
  });
  const goal=document.createElement('li');goal.className=`route-goal${open?' open':''}`;
  goal.innerHTML=`<span role="img" aria-label="${open?'Schatztruhe geöffnet':'Schatztruhe, noch verschlossen'}">${chestSvg(open)}</span>`;$('routePath').append(goal);
}
function renderGallery(){
  saved.theme=themeOf(saved.theme).id;
  $('gallery').replaceChildren();renderThemes();updateHero();renderRoute();$('heroCount').textContent=`${ASSETS.length} gezeichnete Abenteuer`;
  const icon=themeOf(saved.theme).icon;
  themeMotifs(saved.theme).forEach((index,position)=>{
    const asset=ASSETS[index],earned=saved.stars.filter(s=>s.startsWith(asset.id+':')).length;
    const button=document.createElement('button');button.type='button';button.className='motif';
    button.setAttribute('aria-label',`${asset.title}: Puzzle mit ${saved.level*saved.level} Teilen starten. ${earned} von 4 Sternen.`);
    const starIcons=LEVELS.map(n=>`<svg class="icon ${saved.stars.includes(asset.id+':'+n)?'earned':''}" aria-hidden="true"><use href="#i-star"/></svg>`).join('');
    button.innerHTML=`<div class="motif-image"><img src="${asset.src}" alt="${asset.alt}" width="480" height="480" loading="lazy"><span class="motif-badge">${svgIcon(icon)}ABENTEUER ${String(position+1).padStart(2,'0')}</span></div><div class="motif-copy"><h3>${asset.title}</h3><p>${asset.description}</p><div class="motif-foot"><span class="motif-action">Los geht’s ${svgIcon('arrow')}</span><span class="star-row" aria-label="${earned} von 4 Sternen">${starIcons}</span></div></div>`;
    button.addEventListener('click',()=>startGame(index,saved.level));$('gallery').append(button);
  });
  document.querySelectorAll('.level').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.n)===saved.level)));
  updateLabelOptions();updateStars();updateResume();syncHeroVideo();
}
// The start-page video only plays while the gallery is visible. With reduced motion (or when autoplay is
// blocked, e.g. iOS low power mode) it waits for the play button instead of starting by itself.
function syncHeroVideo(){
  const video=$('heroVideo'),still=window.matchMedia('(prefers-reduced-motion: reduce)').matches&&!runtime.heroStarted;
  if(runtime.page!=='gallery'||document.hidden||still){video.pause();$('heroPlay').hidden=runtime.page!=='gallery'||!still;return;}
  video.muted=true;const playing=video.play();
  if(playing)playing.then(()=>{$('heroPlay').hidden=true;}).catch(()=>{$('heroPlay').hidden=false;});
}
function updateResume(){const r=saved.resume;$('resumeBox').hidden=!r;if(r)$('resumeText').textContent=`${ASSETS[r.motif].title} · ${r.placed.length} von ${r.n*r.n} Teilen geschafft`;}
const imageCache=new Map();
function loadImage(asset){
  if(imageCache.has(asset.id))return imageCache.get(asset.id);
  const promise=new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('Das eingebettete Bild konnte nicht geladen werden.'));img.src=asset.src;});imageCache.set(asset.id,promise);return promise;
}
function buildPieceCanvas(piece,img,n){
  const cell=BOARD_SIZE/n,pad=cell*.235,size=Math.ceil(cell+pad*2),canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;
  const c=canvas.getContext('2d');if(!c)throw new Error('Canvas ist in diesem Browser nicht verfügbar.');
  const path=puzzlePath(piece,cell,pad);c.save();c.clip(path);c.drawImage(img,pad-piece.col*cell,pad-piece.row*cell,BOARD_SIZE,BOARD_SIZE);c.restore();
  c.strokeStyle='rgba(41,34,74,.7)';c.lineWidth=Math.max(1.8,cell*.007);c.stroke(path);piece.canvas=canvas;piece.pad=pad;piece.cell=cell;return canvas;
}
async function startGame(motif,n,restore=null){
  if(runtime.loading)return;
  if(runtime.game&&!runtime.game.complete){pauseClock();persistGame();}
  cleanupDrag();clearHint();runtime.selected=null;runtime.loading=true;runtime.paused=false;runtime.sessionStarted=null;
  const generation=++runtime.generation;
  const seed=restore?restore.seed:newSeed(),pieces=generatePieces(n,seed),placed=new Set(restore?restore.placed:[]);
  pieces.forEach(p=>p.placed=placed.has(p.id));
  runtime.game={motif,n,seed,pieces,order:restore?restore.order.slice():shuffled(pieces.map(p=>p.id),seededRandom(seed^0xA28C49E1)),
    elapsed:restore?restore.elapsed:0,moves:restore?restore.moves:0,hints:restore?restore.hints:0,complete:false};
  const asset=ASSETS[motif];if(saved.theme!==asset.theme){saved.theme=asset.theme;writeSaved();}runtime.page='game';syncHeroVideo();$('galleryPage').hidden=true;$('gamePage').hidden=false;
  $('gameTitle').textContent=asset.title;$('gameSubtitle').textContent=`${n*n} Teile · Du schaffst das!`;
  $('referenceImg').src=asset.src;$('previewImg').src=asset.src;$('previewImg').alt=asset.alt;
  $('board').classList.remove('complete');$('helpBtn').disabled=false;runtime.help=true;updateHelp();
  $('slots').replaceChildren();$('slots').style.setProperty('--n',n);$('slots').classList.remove('has-selection');
  const mode=labelMode(n);
  pieces.forEach(p=>{const b=document.createElement('button');b.type='button';b.className='slot';b.dataset.id=p.id;b.setAttribute('aria-label',`Platz ${slotLabel(p.id,mode).text}, Reihe ${p.row+1}, Spalte ${p.col+1}`);if(mode!=='aus')b.append(labelElement(p.id,mode,'slot-label'));b.addEventListener('click',()=>tryPlace(runtime.selected,p.id));b.addEventListener('keydown',event=>{const step={ArrowLeft:-1,ArrowRight:1,ArrowUp:-n,ArrowDown:n}[event.key];if(step!==undefined){event.preventDefault();let next=p.id+step;while(next>=0&&next<pieces.length){const target=$('slots').children[next];if(!target.disabled){target.focus({preventScroll:true});break;}next+=step;}}});$('slots').append(b);});
  $('boardCanvas').getContext('2d').clearRect(0,0,BOARD_SIZE,BOARD_SIZE);$('tray').replaceChildren();$('tray').dataset.count=n*n;
  $('hintBtn').disabled=true;$('shuffleBtn').disabled=true;$('restartBtn').disabled=true;setStatus('Deine Puzzleteile werden vorbereitet …');window.scrollTo(0,0);
  try{
    const img=await loadImage(asset);if(generation!==runtime.generation)return;
    pieces.forEach(p=>buildPieceCanvas(p,img,n));runtime.loading=false;
    renderBoard();renderTray();updateProgress();setStatus(placed.size?'Willkommen zurück! Dein Abenteuer geht weiter.':'Wähle ein Teil. Dein Abenteuer beginnt!');
    $('hintBtn').disabled=false;$('shuffleBtn').disabled=false;$('restartBtn').disabled=false;resumeClock();persistGame();
    $('gameTitle').setAttribute('tabindex','-1');$('gameTitle').focus({preventScroll:true});
  }catch(err){runtime.loading=false;setStatus('Das Puzzle konnte nicht geladen werden. Öffne die Datei bitte in einem aktuellen Browser.');$('restartBtn').disabled=false;}
}
function renderBoard(){
  const g=runtime.game,c=$('boardCanvas').getContext('2d');c.clearRect(0,0,BOARD_SIZE,BOARD_SIZE);
  g.pieces.forEach(p=>{const slot=$('slots').children[p.id];slot.classList.toggle('placed',p.placed);slot.disabled=p.placed;slot.setAttribute('aria-label',`Platz ${slotLabel(p.id,labelMode(g.n)).text}, Reihe ${p.row+1}, Spalte ${p.col+1}${p.placed?', bereits eingesetzt':''}`);if(p.placed)c.drawImage(p.canvas,p.col*p.cell-p.pad,p.row*p.cell-p.pad);});
}
function renderTray(){
  const g=runtime.game,mode=labelMode(g.n),marked=saved.pieceLabels&&mode!=='aus';$('tray').replaceChildren();g.order=g.order.filter(id=>!g.pieces[id].placed);
  g.order.forEach((id,index)=>{
    const piece=g.pieces[id],button=document.createElement('button');button.type='button';button.className='piece';button.dataset.piece=id;
    button.setAttribute('aria-label',`Puzzleteil ${index+1} auswählen`);button.setAttribute('aria-pressed',String(runtime.selected===id));button.classList.toggle('selected',runtime.selected===id);button.title='Antippen oder ins Bild ziehen';button.append(piece.canvas);
    if(marked){button.append(labelElement(id,mode,'piece-label'));button.setAttribute('aria-label',`Puzzleteil ${index+1} mit Zeichen ${slotLabel(id,mode).text} auswählen`);}
    button.addEventListener('click',event=>{if(performance.now()<runtime.suppressClicksUntil)return;selectPiece(runtime.selected===id?null:id);if(event.detail===0&&runtime.selected!==null){const first=[...$('slots').children].find(s=>!s.disabled);if(first)first.focus({preventScroll:true});}});
    button.addEventListener('pointerdown',event=>onPiecePointerDown(event,id,button));$('tray').append(button);
  });
  if(!g.order.length){const done=document.createElement('div');done.className='tray-empty';done.innerHTML=`${svgIcon('star')}<h3>Alles am richtigen Platz!</h3><p>Dein Bild ist fertig. Das hast du richtig gut gemacht.</p>`;$('tray').append(done);}
  $('trayHeading').textContent=g.order.length?`Deine Puzzleteile · noch ${g.order.length}`:'Dein Abenteuer ist komplett';
}
function updateProgress(){
  const g=runtime.game,count=g.pieces.filter(p=>p.placed).length,total=g.n*g.n;
  $('progressBar').style.width=`${count/total*100}%`;$('progressLabel').textContent=`${count} / ${total} Teile`;
  $('progressTrack').setAttribute('aria-valuemax',total);$('progressTrack').setAttribute('aria-valuenow',count);$('timeStat').textContent=formatTime(elapsedNow());$('movesStat').textContent=g.moves;
}
function selectPiece(id,quiet=false){
  if(runtime.loading||!runtime.game||runtime.game.complete)return;
  if(id!==null&&runtime.game.pieces[id].placed)return;
  runtime.selected=id;$('slots').classList.toggle('has-selection',id!==null);
  $('tray').querySelectorAll('.piece').forEach(b=>{const on=Number(b.dataset.piece)===id;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on));});
  if(!quiet)setStatus(id===null?'Wähle ein anderes Teil. Lass dir ruhig Zeit.':'Teil ausgewählt. Tippe auf seinen Platz im Bild.');
}
function tryPlace(id,target){
  const g=runtime.game;if(runtime.loading||!g||g.complete)return;
  const mode=labelMode(g.n);
  if(id===null||id===undefined){
    // Tapping a free place without a piece names its sign, so the signs can be explored on their own.
    if(mode!=='aus'&&Number.isInteger(target)&&target>=0&&target<g.pieces.length){const l=slotLabel(target,mode);setStatus(`Das ist ${l.show}. Tippe jetzt auf ein Puzzleteil.`);speak(l.say);}
    else setStatus('Tippe zuerst auf eines der freien Puzzleteile.');
    return;
  }
  if(!Number.isInteger(id)||id<0||id>=g.pieces.length||!Number.isInteger(target)||target<0||target>=g.pieces.length)return;
  if(g.pieces[id].placed||g.pieces[target].placed)return;
  g.moves++;
  if(id===target){
    clearHint();g.pieces[id].placed=true;runtime.selected=null;$('slots').classList.remove('has-selection');renderBoard();renderTray();updateProgress();playSound('correct');
    const count=g.pieces.filter(p=>p.placed).length;
    const phrases=['Super, das passt!','Ein Stück näher an den Sternen!','Wunderbar eingesetzt!','Genau richtig. Weiter so!','Dein Bild wird immer schöner!'],phrase=phrases[count%phrases.length];
    if(mode==='aus')setStatus(phrase);else{const l=slotLabel(id,mode);setStatus(`${l.show}! ${phrase}`);speak(l.say);}
    persistGame();
    if(count===g.pieces.length)finishGame();
    else {const next=$('tray').querySelector('.piece');if(next)next.focus({preventScroll:true});}
  }else{
    const button=$('tray').querySelector(`[data-piece="${id}"]`);if(button){button.classList.remove('wrong');void button.offsetWidth;button.classList.add('wrong');}
    setStatus('Fast! Probier einen anderen Platz. Schau auf die Farben und die Form.');playSound('wrong');updateProgress();persistGame();
  }
}
function clearHint(){if(runtime.hintTimer){clearTimeout(runtime.hintTimer);runtime.hintTimer=null;}$('slots').querySelectorAll('.hint').forEach(s=>s.classList.remove('hint'));}
function giveHint(){
  const g=runtime.game;if(!g||g.complete||runtime.loading)return;clearHint();
  const id=runtime.selected!==null?runtime.selected:g.order[0];if(id===undefined)return;
  selectPiece(id,true);g.hints++;const slot=$('slots').children[id];slot.classList.add('hint');
  const button=$('tray').querySelector(`[data-piece="${id}"]`);if(button)button.scrollIntoView({block:'nearest',behavior:'smooth'});
  const mode=labelMode(g.n),l=slotLabel(id,mode);
  setStatus(`Der leuchtende Platz${mode==='aus'?'':' '+l.show} gehört zu deinem ausgewählten Teil. Probier’s aus!`);playSound('hint');if(mode!=='aus')speak(l.say);
  runtime.hintTimer=setTimeout(clearHint,5500);persistGame();
}
function updateHelp(){const on=runtime.help;$('board').classList.toggle('show-help',on);$('helpBtn').setAttribute('aria-pressed',String(on));$('helpLabel').textContent=on?'Bildhilfe an':'Bildhilfe aus';}
function cleanupDrag(){
  if(runtime.drag?.button){runtime.drag.button.classList.remove('drag-origin');try{runtime.drag.button.releasePointerCapture(runtime.drag.pointerId);}catch{}}
  if(runtime.ghost){runtime.ghost.remove();runtime.ghost=null;}if(runtime.hoveredSlot)runtime.hoveredSlot.classList.remove('drop-hover');runtime.hoveredSlot=null;runtime.drag=null;
}
function onPiecePointerDown(event,id,button){
  if(event.button!==0||runtime.loading||runtime.game.complete||runtime.drag)return;
  runtime.drag={id,button,pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,active:false};
  try{button.setPointerCapture(event.pointerId);}catch{}
  if(runtime.sound&&runtime.audio?.state==='suspended')runtime.audio.resume().catch(()=>{});
}
function slotAt(x,y){
  const el=document.elementFromPoint(x,y),slot=el?.closest('.slot');
  return slot&&!slot.disabled&&slot.parentElement===$('slots')?slot:null;
}
function pointerMove(event){
  const d=runtime.drag;if(!d||event.pointerId!==d.pointerId)return;
  if(!d.active&&Math.hypot(event.clientX-d.startX,event.clientY-d.startY)>7){
    d.active=true;selectPiece(d.id,true);d.button.classList.add('drag-origin');
    const g=runtime.game,p=g.pieces[d.id],ghost=document.createElement('div');ghost.className='drag-ghost';
    const clone=document.createElement('canvas');clone.width=p.canvas.width;clone.height=p.canvas.height;clone.getContext('2d').drawImage(p.canvas,0,0);ghost.append(clone);
    const mode=labelMode(g.n);if(saved.pieceLabels&&mode!=='aus')ghost.append(labelElement(d.id,mode,'piece-label'));
    const boardSize=$('board').getBoundingClientRect().width,size=boardSize/g.n*1.47;ghost.style.width=size+'px';ghost.style.height=size+'px';d.ghostSize=size;runtime.ghost=ghost;document.body.append(ghost);
  }
  if(d.active){event.preventDefault();runtime.ghost.style.left=(event.clientX-d.ghostSize/2)+'px';runtime.ghost.style.top=(event.clientY-d.ghostSize/2)+'px';
    const target=slotAt(event.clientX,event.clientY);if(runtime.hoveredSlot&&runtime.hoveredSlot!==target)runtime.hoveredSlot.classList.remove('drop-hover');if(target)target.classList.add('drop-hover');runtime.hoveredSlot=target;
  }
}
function pointerUp(event){
  const d=runtime.drag;if(!d||event.pointerId!==d.pointerId)return;
  const id=d.id,active=d.active,target=active?slotAt(event.clientX,event.clientY):null;
  cleanupDrag();
  if(active){runtime.suppressClicksUntil=performance.now()+400;if(target)tryPlace(id,Number(target.dataset.id));else{selectPiece(id,true);setStatus('Teil ausgewählt. Zieh es ins Bild oder tippe auf seinen Platz.');}}
}
function showGallery(){
  if(runtime.loading){++runtime.generation;runtime.loading=false;}
  cleanupDrag();clearHint();pauseClock();persistGame();if(runtime.updateReady){reloadForUpdate();return;}runtime.page='gallery';runtime.paused=false;
  $('gamePage').hidden=true;$('galleryPage').hidden=false;renderGallery();window.scrollTo(0,0);
}
function openDialog(id){if(runtime.loading)return;cleanupDrag();runtime.paused=true;pauseClock();persistGame();$(id).showModal();}
function closeDialog(id){$(id).close();}
function afterDialogClose(){runtime.paused=false;resumeClock();}
function confetti(){
  const layer=$('confetti');layer.replaceChildren();if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const colors=['#b4a3e3','#f6a1bd','#aadfcb','#ffdb94','#a8dbe9'];
  for(let i=0;i<65;i++){const p=document.createElement('i');p.className='confetti';p.style.left=Math.random()*100+'%';p.style.background=colors[i%colors.length];p.style.setProperty('--dx',(Math.random()-.5)*280+'px');p.style.setProperty('--turn',(Math.random()-.5)*1200+'deg');p.style.setProperty('--dur',(2+Math.random()*2)+'s');p.style.setProperty('--delay',Math.random()*.5+'s');layer.append(p);}
  setTimeout(()=>layer.replaceChildren(),5000);
}
function finishGame(){
  pauseClock();const g=runtime.game;g.complete=true;clearHint();$('board').classList.add('complete');
  $('hintBtn').disabled=true;$('shuffleBtn').disabled=true;$('helpBtn').disabled=true;updateProgress();
  const key=ASSETS[g.motif].id+':'+g.n,newStar=!saved.stars.includes(key);if(newStar)saved.stars.push(key);
  saved.resume=null;writeSaved();updateStars();
  const themeId=ASSETS[g.motif].theme,chest=newStar&&routeComplete(themeId,g.n);
  $('winText').textContent=`${ASSETS[g.motif].title} ist komplett. Du hast alle Teile an ihren Platz gebracht!`;
  $('winPieces').textContent=g.n*g.n;$('winTime').textContent=formatTime(g.elapsed);
  $('winTitle').textContent=chest?'Schatz gefunden!':'Sternenstark!';if(chest)speak('Schatz gefunden!');
  document.querySelector('.win-star').innerHTML=chest?chestSvg(true):svgIcon('star');document.querySelector('.win-star').classList.toggle('treasure',chest);
  $('winAward').textContent=chest?`Die Schatztruhe ist offen! Alle ${themeOf(themeId).title}-Bilder mit ${g.n*g.n} Teilen geschafft.`
    :newStar?'Ein neuer Stern für deine Sammlung!':'Dieses Abenteuer hast du wieder wunderbar geschafft!';
  setStatus('Sternenstark! Dein Puzzle ist fertig.');playSound('win');confetti();runtime.paused=true;$('winDialog').showModal();
}
function init(){
  readSaved();runtime.sound=saved.sound;updateSound();renderGallery();
  if(!storageAvailable)$('storageNote').textContent='Offline · Keine Datenübertragung · Fortschritt nur in dieser Sitzung';
  document.querySelectorAll('.level').forEach(button=>button.addEventListener('click',()=>{saved.level=Number(button.dataset.n);writeSaved();renderGallery();}));
  document.querySelectorAll('.mode').forEach(button=>button.addEventListener('click',()=>{saved.labels=button.dataset.mode;writeSaved();updateLabelOptions();}));
  $('pieceLabelsBtn').addEventListener('click',()=>{saved.pieceLabels=!saved.pieceLabels;writeSaved();updateLabelOptions();});
  $('heroPlay').addEventListener('click',()=>{runtime.heroStarted=true;syncHeroVideo();});
  $('soundBtn').addEventListener('click',()=>{runtime.sound=!runtime.sound;saved.sound=runtime.sound;updateSound();writeSaved();if(runtime.sound)playSound('correct');});
  $('homeBtn').addEventListener('click',showGallery);$('backBtn').addEventListener('click',showGallery);
  $('resumeBtn').addEventListener('click',()=>{const r=saved.resume;if(r)startGame(r.motif,r.n,r);});
  $('helpBtn').addEventListener('click',()=>{runtime.help=!runtime.help;updateHelp();});
  $('hintBtn').addEventListener('click',giveHint);
  $('shuffleBtn').addEventListener('click',()=>{if(runtime.game&&!runtime.loading&&!runtime.game.complete){cleanupDrag();runtime.game.order=shuffled(runtime.game.order);renderTray();setStatus('Neu gemischt. Vielleicht entdeckst du jetzt das nächste Teil!');persistGame();}});
  $('previewBtn').addEventListener('click',()=>openDialog('previewDialog'));
  $('closePreview').addEventListener('click',()=>closeDialog('previewDialog'));$('continuePreview').addEventListener('click',()=>closeDialog('previewDialog'));
  $('restartBtn').addEventListener('click',()=>openDialog('restartDialog'));
  $('closeRestart').addEventListener('click',()=>closeDialog('restartDialog'));$('cancelRestart').addEventListener('click',()=>closeDialog('restartDialog'));
  $('confirmRestart').addEventListener('click',()=>{const g=runtime.game;closeDialog('restartDialog');$('helpBtn').disabled=false;startGame(g.motif,g.n);});
  $('closeWin').addEventListener('click',()=>closeDialog('winDialog'));
  $('winHome').addEventListener('click',()=>{closeDialog('winDialog');showGallery();});
  $('nextPuzzle').addEventListener('click',()=>{const g=runtime.game;closeDialog('winDialog');$('helpBtn').disabled=false;
    // Continue along the treasure route: the next picture without a star at this piece count, otherwise simply the next one.
    const list=themeMotifs(ASSETS[g.motif].theme),at=list.indexOf(g.motif),ahead=list.slice(at+1).concat(list.slice(0,at+1));
    startGame(ahead.find(i=>!saved.stars.includes(`${ASSETS[i].id}:${g.n}`))??ahead[0],g.n);});
  ['previewDialog','restartDialog','winDialog'].forEach(id=>$(id).addEventListener('close',afterDialogClose));
  window.addEventListener('pointermove',pointerMove,{passive:false});window.addEventListener('pointerup',pointerUp);
  window.addEventListener('pointercancel',event=>{if(runtime.drag&&event.pointerId===runtime.drag.pointerId)cleanupDrag();});
  window.addEventListener('keydown',event=>{if(event.key==='Escape'){cleanupDrag();if(runtime.page==='game'&&!runtime.paused)selectPiece(null);}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cleanupDrag();pauseClock();persistGame();}else resumeClock();syncHeroVideo();});
  window.addEventListener('pagehide',()=>{pauseClock();persistGame();});window.addEventListener('pageshow',()=>resumeClock());
  window.addEventListener('resize',cleanupDrag);
  setInterval(()=>{if(runtime.page==='game'&&runtime.game)$('timeStat').textContent=formatTime(elapsedNow());},500);
  runtime.saveTimer=setInterval(()=>{if(runtime.game&&!runtime.game.complete&&runtime.page==='game')persistGame();},10000);
  initWebApp();
}
// Home-screen web app: offline cache, install hint for iPhone/iPad, no accidental zooming.
const INSTALL_HINT_KEY='sternenpuzzle.installHintHidden';
function reloadForUpdate(){pauseClock();persistGame();location.reload();}
function isStandalone(){return navigator.standalone===true||window.matchMedia('(display-mode: standalone)').matches;}
function isAppleMobile(){return /iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);}
function initWebApp(){
  if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol)){
    // A new version takes over: reload right away on the start page, otherwise when returning to it.
    const hadController=!!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!hadController||runtime.updateReady)return;runtime.updateReady=true;if(runtime.page==='gallery')reloadForUpdate();});
    navigator.serviceWorker.register('sw.js').then(registration=>{
      // iOS resumes home-screen apps without a new page load, so look for updates when the app comes back.
      document.addEventListener('visibilitychange',()=>{if(!document.hidden)registration.update().catch(()=>{});});
    }).catch(()=>{});
  }
  let hintHidden=false;try{hintHidden=localStorage.getItem(INSTALL_HINT_KEY)==='1';}catch{}
  $('installHint').hidden=hintHidden||isStandalone()||!isAppleMobile();
  $('installHintClose').addEventListener('click',()=>{$('installHint').hidden=true;try{localStorage.setItem(INSTALL_HINT_KEY,'1');}catch{}});
  if(isStandalone()){document.documentElement.classList.add('standalone');['gesturestart','gesturechange'].forEach(type=>document.addEventListener(type,event=>event.preventDefault()));}
}
// Export only deterministic helpers for local tests; not needed by the player.
window.SternenpuzzleTest={generatePieces,puzzlePath,seededRandom,shuffled,formatTime,sanitizeSave,slotLabel};
init();
