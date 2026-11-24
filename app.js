const alphaConfig={
  chatbotEndpoint:'',
  crmEndpoint:'',
  knowledgeBaseLabel:'Base vitrine ALPHA'
};

const q=(s,c=document)=>c.querySelector(s), qa=(s,c=document)=>[...c.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const escapeHTML=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

function splitTitles(){
  qa('.split-title').forEach(title=>{
    const walk=node=>{
      [...node.childNodes].forEach(child=>{
        if(child.nodeType===3&&child.textContent.trim()){
          const frag=document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(part=>{
            if(/^\s+$/.test(part)) frag.append(part);
            else if(part){const w=document.createElement('span');w.className='word';const inner=document.createElement('span');inner.textContent=part;w.append(inner);frag.append(w)}
          });
          child.replaceWith(frag);
        }else if(child.nodeType===1&&child.tagName!=='BR') walk(child);
      });
    };
    walk(title);
    requestAnimationFrame(()=>setTimeout(()=>title.classList.add('ready'),350));
  });
}

function initPreloader(){
  const loader=q('.preloader');
  addEventListener('load',()=>setTimeout(()=>loader?.classList.add('loaded'),650),{once:true});
  setTimeout(()=>loader?.classList.add('loaded'),1800);
}

function initChrome(){
  const header=q('[data-header]'),menu=q('#main-menu'),button=q('.menu-button');
  const closeMenu=()=>{menu?.classList.remove('open');document.body.classList.remove('menu-open');button?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-hidden','true')};
  button?.addEventListener('click',()=>{const open=!menu.classList.contains('open');menu.classList.toggle('open',open);document.body.classList.toggle('menu-open',open);button.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-hidden',String(!open))});
  addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
  addEventListener('scroll',()=>{
    header?.classList.toggle('scrolled',scrollY>30);
    const max=document.documentElement.scrollHeight-innerHeight;
    const p=max>0?scrollY/max*100:0;
    const bar=q('.scroll-progress i'); if(bar) bar.style.width=p+'%';
  },{passive:true});
  qa('a[href]').forEach(a=>a.addEventListener('click',e=>{
    const url=new URL(a.href,location.href);
    if(url.origin!==location.origin||a.target==='_blank'||e.metaKey||e.ctrlKey||e.shiftKey)return;
    if(url.pathname===location.pathname&&url.hash)return;
    if(!url.pathname.endsWith('.html')&&!url.pathname.endsWith('/'))return;
    if(reduced)return;
    e.preventDefault();closeMenu();
    q('.page-transition')?.classList.add('active');
    setTimeout(()=>location.href=url.href,720);
  }));
}

function initCursor(){
  if(reduced||matchMedia('(pointer: coarse)').matches)return;
  const dot=q('.cursor-dot'),ring=q('.cursor-ring'); if(!dot||!ring)return;
  let x=innerWidth/2,y=innerHeight/2,rx=x,ry=y;
  addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;dot.style.left=x+'px';dot.style.top=y+'px'});
  const tick=()=>{rx+=(x-rx)*.14;ry+=(y-ry)*.14;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(tick)};tick();
  qa('a,button,input,select,textarea,.tilt').forEach(el=>{el.addEventListener('mouseenter',()=>ring.classList.add('hover'));el.addEventListener('mouseleave',()=>ring.classList.remove('hover'))});
}

function initReveal(){
  if(reduced){qa('.reveal').forEach(el=>el.classList.add('in'));return}
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -5%'});
  qa('.reveal').forEach((el,i)=>{el.style.transitionDelay=(i%4)*.055+'s';observer.observe(el)});
}

function initParallax(){
  if(reduced)return;
  qa('[data-parallax]').forEach(el=>addEventListener('scroll',()=>{const speed=Number(el.dataset.parallax||.08);el.style.transform=`translate3d(0,${scrollY*speed}px,0)`},{passive:true}));
  qa('.tilt').forEach(card=>{
    card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${-y*6}deg) rotateY(${x*8}deg) translateY(-4px)`});
    card.addEventListener('pointerleave',()=>card.style.transform='');
  });
  qa('.magnetic').forEach(btn=>{
    btn.addEventListener('pointermove',e=>{const r=btn.getBoundingClientRect();btn.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.12}px,${(e.clientY-r.top-r.height/2)*.12}px)`});
    btn.addEventListener('pointerleave',()=>btn.style.transform='');
  });
}

const pidData={
  feed:{family:'ALPHA MIX',title:'Incorporation',copy:'Introduit poudres et liquides dans une boucle de préparation pensée pour la dispersion et la répétabilité.',function:'DOSER / INCORPORER',signal:'RECETTE & LOT'},
  tank:{family:'ALPHA SKID',title:'Préparation',copy:'Réunit cuve, agitation et recirculation pour établir une base homogène avant traitement.',function:'ASSEMBLER / HOMOGÉNÉISER',signal:'NIVEAU & AGITATION'},
  filter:{family:'ALPHA FLOW',title:'Filtration',copy:'Protège les fonctions aval et rend visible l’état de la barrière physique.',function:'PROTÉGER L’AVAL',signal:'ÉTAT FILTRE'},
  pump:{family:'ALPHA FLOW',title:'Transfert',copy:'Met le produit en mouvement dans une enveloppe opératoire définie et surveillée.',function:'ÉTABLIR LE DÉBIT',signal:'MARCHE & DÉBIT'},
  heat:{family:'ALPHA POWER',title:'Échange thermique',copy:'Orchestre montée et descente en température dans une architecture énergétique cohérente.',function:'TRANSFÉRER L’ÉNERGIE',signal:'TEMPÉRATURES'},
  hold:{family:'ALPHA FLOW',title:'Maintien',copy:'Met en relation flux et temps de passage. Les valeurs de qualification ne sont pas publiées.',function:'MAÎTRISER LE TRAITEMENT',signal:'TEMPS & FLUX'},
  divert:{family:'ALPHA DRIVE',title:'Orientation sécurisée',copy:'Dirige le produit vers la destination autorisée ou vers un état sûr selon des conditions validées.',function:'SÉCURISER LE PARCOURS',signal:'POSITIONS & AUTORISATIONS'},
  storage:{family:'ALPHA TANK',title:'Maturation',copy:'Conserve le lot identifié dans les conditions prévues avant les transformations suivantes.',function:'STOCKER / DISTRIBUER',signal:'LOT & STATUT'},
  hotloop:{family:'ALPHA POWER',title:'Boucle énergie',copy:'Fournit l’énergie utile et prépare l’étude des opportunités de récupération sans révéler le schéma propriétaire.',function:'ALIMENTER / RÉCUPÉRER',signal:'DISPONIBILITÉ'},
  coldloop:{family:'ALPHA POWER',title:'Utilité froide',copy:'Assure la capacité de refroidissement requise et sa preuve de disponibilité.',function:'REFROIDIR',signal:'ÉTAT UTILITÉ'},
  control:{family:'ALPHA DRIVE',title:'Pilotage & historique',copy:'Rassemble mesures, événements, recettes et états pour donner du contexte au lot.',function:'CONDUIRE / DOCUMENTER',signal:'DONNÉES VALIDÉES'}
};
function initPID(){
  const shell=q('.pid-shell');if(!shell)return;
  const select=key=>{const d=pidData[key];if(!d)return;qa('.pid-node').forEach(n=>n.classList.toggle('active',n.dataset.pid===key));shell.classList.add('panel-open');q('[data-pid-family]').textContent=d.family;q('[data-pid-title]').textContent=d.title;q('[data-pid-copy]').textContent=d.copy;q('[data-pid-function]').textContent=d.function;q('[data-pid-signal]').textContent=d.signal};
  qa('.pid-node').forEach(n=>{n.addEventListener('click',()=>select(n.dataset.pid));n.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(n.dataset.pid)}})});
  const reset=()=>{qa('.pid-node').forEach(n=>n.classList.remove('active'));shell.classList.remove('panel-open')};
  q('[data-pid-close]')?.addEventListener('click',reset);q('[data-pid-reset]')?.addEventListener('click',reset);
}

const stages=[
  ['01','Réception & dosage','Les matières sont identifiées et engagées dans un parcours de recette.'],['02','Incorporation','Les solides et liquides rejoignent une boucle de mélange contrôlée.'],['03','Préparation','Agitation, géométrie et temps construisent une base homogène.'],['04','Filtration','Une barrière sanitaire protège les fonctions en aval.'],['05','Mise en régime','Le flux se stabilise avant autorisation du traitement.'],['06','Traitement thermique','L’énergie est transférée selon une architecture à qualifier.'],['07','Maintien','Le couple temps–flux est surveillé comme une fonction cohérente.'],['08','Sécurisation','Toute dérive replace le produit vers un état défini comme sûr.'],['09','Refroidissement','Le lot n’avance que lorsque la condition aval est établie.'],['10','Gestion des interfaces','Les transitions sont suivies sans publier la logique propriétaire.'],['11','Maturation','Le produit rejoint une destination identifiée et disponible.'],['12','Historisation','Mesures, événements et décisions composent le dossier du lot.']
];
function initStages(){const wrap=q('[data-process-stages]');if(!wrap)return;wrap.innerHTML=stages.map(s=>`<article class="process-stage reveal"><span>${s[0]}</span><h3>${s[1]}</h3><p>${s[2]}</p><i>→</i></article>`).join('');setTimeout(initReveal,0)}

const factoryData={
  mix:['01 / 05','Préparation & incorporation','Point d’entrée de la recette : dosage, incorporation, agitation et mise en régime.',['Cuves de préparation','Station poudres','Recirculation']],
  skid:['02 / 05','Skid de traitement','Le cœur compact réunit transfert, filtration, échange et instrumentation.',['Thermal Core','Mesures process','Sécurisation']],
  tank:['03 / 05','Maturation & stockage','Des cuves identifiées conservent le lot et le rendent disponible pour l’aval.',['Agitation adaptée','Statut de lot','Distribution']],
  utility:['04 / 05','Utilités & ressources','Énergie, froid, eau et air sont intégrés dans l’étude globale du système.',['Boucles thermiques','Eau & NEP','Air process']],
  drive:['05 / 05','Pilotage & données','L’automatisme et ALPHA Pilot donnent du contexte aux mesures et aux événements.',['Conduite opérateur','Historisation','Maintenance']]
};
function initFactory(){
  const panel=q('.factory-panel');if(!panel)return;
  qa('[data-factory]').forEach(btn=>btn.addEventListener('click',()=>{qa('[data-factory]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const d=factoryData[btn.dataset.factory];q('[data-factory-index]').textContent=d[0];q('[data-factory-title]').textContent=d[1];q('[data-factory-copy]').textContent=d[2];q('[data-factory-list]').innerHTML=d[3].map(x=>`<li>${x}</li>`).join('');panel.animate([{opacity:.5,transform:'translateX(12px)'},{opacity:1,transform:'none'}],{duration:400,easing:'cubic-bezier(.16,1,.3,1)'})}));
}
function initMachineFilters(){
  qa('[data-machine-filter]').forEach(btn=>btn.addEventListener('click',()=>{qa('[data-machine-filter]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.machineFilter;qa('[data-category]').forEach(card=>{const show=f==='all'||card.dataset.category===f;card.classList.toggle('hidden',!show);if(show)card.animate([{opacity:0,transform:'translateY(15px)'},{opacity:1,transform:'none'}],{duration:400,easing:'ease-out'})})}));
}

const chatAnswers={
  'pourquoi le lot est-il en attente':'Le démonstrateur indique qu’une autorisation aval reste à confirmer. Dans une version connectée, je citerais la mesure, l’événement et la notice applicables, sans proposer de contournement.',
  'résume le dernier écart qualité':'Projection : un écart de température aval a été détecté, le lot a été maintenu dans un état sûr et une vérification de l’utilité froide est à documenter. Ces éléments sont fictifs.',
  'que vérifier avant le prochain lot':'Vérifier le statut de nettoyage, la disponibilité des utilités, l’identification de la recette et du lot, les éléments filtrants et l’enregistrement. Les critères réels doivent provenir de la procédure validée.'
};
function localAnswer(question){
  const k=question.toLowerCase().trim();
  if(chatAnswers[k])return chatAnswers[k];
  if(k.includes('pid')||k.includes('schéma'))return 'Le P&ID vitrine montre les fonctions et leurs relations : préparation, transfert, échange, maintien, orientation et stockage. Les dimensions, seuils et séquences d’exécution ne sont volontairement pas exposés.';
  if(k.includes('ia')||k.includes('intelligence'))return 'L’IA sert ici à rechercher, expliquer, comparer et synthétiser. Elle reste hors de la chaîne de sécurité et toute décision industrielle doit être validée par un rôle autorisé.';
  if(k.includes('machine')||k.includes('skid'))return 'La gamme conceptuelle combine préparation, skid thermique, cuverie et matrice de flux. Chaque module peut être étudié seul ou intégré à une ligne.';
  return 'Je peux répondre sur le parcours process, le parc machine, ALPHA Pilot et le rôle de l’IA. Pour une réponse industrielle, la future version devra interroger une base documentaire validée et citer ses sources.';
}
function initChat(){
  const form=q('[data-chat-form]'),messages=q('[data-chat-messages]');if(!form||!messages)return;
  const add=(text,type)=>{const div=document.createElement('div');div.className='message '+type;div.innerHTML=`<span>${type==='user'?'FF':'Ai'}</span><p>${escapeHTML(text)}</p>`;messages.append(div);messages.scrollTop=messages.scrollHeight};
  const ask=async question=>{if(!question.trim())return;add(question,'user');add('Analyse en cours…','assistant');const pending=messages.lastElementChild;let answer='';
    if(alphaConfig.chatbotEndpoint){try{const r=await fetch(alphaConfig.chatbotEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question,context:'alpha-public-showcase'})});if(!r.ok)throw Error();const data=await r.json();answer=data.answer||data.message}catch{answer='Le connecteur est configuré mais indisponible. Réponse vitrine : '+localAnswer(question)}}else{await new Promise(r=>setTimeout(r,650));answer=localAnswer(question)}
    pending.querySelector('p').textContent=answer;messages.scrollTop=messages.scrollHeight};
  form.addEventListener('submit',e=>{e.preventDefault();const input=form.elements.question;const value=input.value;input.value='';ask(value)});
  qa('[data-question]').forEach(b=>b.addEventListener('click',()=>ask(b.dataset.question)));
  q('[data-chat-clear]')?.addEventListener('click',()=>{messages.innerHTML='<div class="message assistant"><span>Ai</span><p>Conversation effacée. Que souhaitez-vous explorer ?</p></div>'});
}

const pilotViews={
  production:{title:'Vue production',html:`<div class="metric-grid"><div class="metric-card"><small>ORDRE EN COURS</small><strong>LOT–042</strong><span>● Phase active</span></div><div class="metric-card"><small>ÉTAT THERMIQUE</small><strong>Stable</strong><span>Dans l’enveloppe fictive</span></div><div class="metric-card"><small>FLUX PRODUIT</small><strong>Nominal</strong><span>Mesure disponible</span></div><div class="metric-card"><small>AVANCEMENT</small><strong>68 <em>%</em></strong><span>Projection</span></div><div class="metric-card pilot-wide"><small>PARCOURS DU LOT</small><div class="live-process"><div class="live-node done"><i></i><b>Préparation</b><span>Terminée</span></div><div class="live-node done"><i></i><b>Mise en régime</b><span>Conforme</span></div><div class="live-node active"><i></i><b>Traitement</b><span>Actif</span></div><div class="live-node"><i></i><b>Froid</b><span>Attente</span></div><div class="live-node"><i></i><b>Stockage</b><span>Disponible</span></div></div></div><div class="metric-card chart-card"><small>TENDANCE PROCESS — DONNÉES SIMULÉES</small><div class="demo-chart"><svg viewBox="0 0 700 150" preserveAspectRatio="none"><path d="M0 130 C70 125 80 95 135 92 S205 30 280 42 S360 55 420 44 S520 38 580 46 S650 44 700 35"/></svg></div></div><div class="metric-card event-card"><small>POINTS DE CONTRÔLE</small><div class="event-row"><span>Parcours autorisé</span><i></i></div><div class="event-row"><span>Utilités disponibles</span><i></i></div><div class="event-row"><span>Historique actif</span><i></i></div><div class="event-row"><span>Destination prête</span><i></i></div></div></div>`},
  quality:{title:'Qualité & traçabilité',html:`<div class="pilot-two"><div class="pilot-list"><small>DOSSIER DU LOT</small><div class="pilot-list-row"><span>Identité recette</span><b>PRÉSENTE</b></div><div class="pilot-list-row"><span>Mesures requises</span><b>COMPLÈTES</b></div><div class="pilot-list-row"><span>Événements</span><b>TRACÉS</b></div><div class="pilot-list-row"><span>Décision qualité</span><b>À VALIDER</b></div></div><div class="pilot-list"><small>COMPLÉTUDE DOCUMENTAIRE</small><div class="gauge-ring"></div></div><div class="pilot-list"><small>DERNIERS ÉCARTS — FICTION</small><div class="pilot-list-row"><span>Utilité froide</span><b>CLÔTURÉ</b></div><div class="pilot-list-row"><span>Identification matière</span><b>CLÔTURÉ</b></div></div><div class="pilot-list"><small>EXPORTS</small><div class="pilot-list-row"><span>Rapport lot</span><b>PRÊT</b></div><div class="pilot-list-row"><span>Courbes</span><b>PRÊT</b></div><div class="pilot-list-row"><span>Journal événements</span><b>PRÊT</b></div></div></div>`},
  resources:{title:'Ressources & efficacité',html:`<div class="metric-grid"><div class="metric-card"><small>ÉNERGIE / LOT</small><strong>Index A</strong><span>Projection comparative</span></div><div class="metric-card"><small>EAU PROCESS</small><strong>Suivie</strong><span>Compteurs fictifs</span></div><div class="metric-card"><small>TRANSITIONS</small><strong>Tracées</strong><span>Bilan disponible</span></div><div class="metric-card"><small>RÉCUPÉRATION</small><strong>Active</strong><span>Principe vitrine</span></div><div class="metric-card chart-card"><small>PROFIL DE CONSOMMATION COMPARÉ</small><div class="demo-chart"><svg viewBox="0 0 700 150" preserveAspectRatio="none"><path d="M0 110 C70 108 90 75 150 78 S240 92 290 52 S390 45 450 75 S560 58 620 45 S680 50 700 35"/></svg></div></div><div class="metric-card event-card"><small>LEVIERS</small><div class="event-row"><span>Ordonnancement</span><i></i></div><div class="event-row"><span>Échanges thermiques</span><i></i></div><div class="event-row"><span>Rinçages</span><i></i></div></div></div>`},
  maintenance:{title:'Maintenance connectée',html:`<div class="pilot-two"><div class="pilot-list"><small>SANTÉ DE LA LIGNE</small><div class="gauge-ring"></div></div><div class="pilot-list"><small>PROCHAINES ACTIONS — FICTION</small><div class="pilot-list-row"><span>Inspection filtration</span><b>PLANIFIÉE</b></div><div class="pilot-list-row"><span>Contrôle capteur</span><b>À PRÉPARER</b></div><div class="pilot-list-row"><span>Revue vannes</span><b>À VENIR</b></div></div><div class="pilot-list"><small>ÉVÉNEMENTS</small><div class="pilot-list-row"><span>Critiques</span><b>0</b></div><div class="pilot-list-row"><span>À surveiller</span><b>2</b></div></div><div class="pilot-list"><small>ASSISTANCE</small><div class="pilot-list-row"><span>Dossier équipement</span><b>OUVRIR</b></div><div class="pilot-list-row"><span>Historique interventions</span><b>OUVRIR</b></div></div></div>`}
};
function initPilot(){
  const content=q('[data-pilot-content]');if(!content)return;
  const show=key=>{content.innerHTML=pilotViews[key].html;q('[data-pilot-title]').textContent=pilotViews[key].title;content.animate([{opacity:.25,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{duration:450,easing:'cubic-bezier(.16,1,.3,1)'})};show('production');
  qa('[data-pilot-tab]').forEach(btn=>btn.addEventListener('click',()=>{qa('[data-pilot-tab]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');show(btn.dataset.pilotTab)}));
  const clock=q('[data-pilot-clock]');setInterval(()=>{if(clock)clock.textContent=new Date().toLocaleTimeString('fr-FR')},1000);
}

function initConfigurator(){
  const form=q('[data-configurator]');if(!form)return;
  const labels={capacity:['Compacte','Intermédiaire','Étendue'],automation:['Assisté','Piloté','Orchestré'],resources:['Essentielle','Optimisée','Avancée']};
  const update=()=>{['capacity','automation','resources'].forEach(name=>q(`[data-output="${name}"]`).textContent=labels[name][Number(form.elements[name].value)-1]);const modules=[...form.querySelectorAll('input[name=module]:checked')].map(i=>i.value);const cap=labels.capacity[Number(form.elements.capacity.value)-1],auto=labels.automation[Number(form.elements.automation.value)-1];q('[data-config-title]').textContent=`ALPHA ${cap} / ${auto}`;q('[data-config-copy]').textContent=`Une architecture ${cap.toLowerCase()} avec ${modules.length} module${modules.length>1?'s':''} à étudier et un niveau de conduite ${auto.toLowerCase()}.`;q('[data-config-tags]').innerHTML=modules.map(x=>`<span>${escapeHTML(x)}</span>`).join('')||'<span>À composer</span>'};
  form.addEventListener('input',update);update();
}

function initForms(){q('[data-contact-form]')?.addEventListener('submit',async e=>{e.preventDefault();const status=q('[data-form-status]');if(!alphaConfig.crmEndpoint){status.textContent='Demande préparée. Connectez un endpoint CRM ou messagerie validé pour activer l’envoi.';status.style.color='#27e0ff';return}status.textContent='Envoi en cours…'})}

document.addEventListener('DOMContentLoaded',()=>{
  splitTitles();initPreloader();initChrome();initCursor();initParallax();initStages();initReveal();initPID();initFactory();initMachineFilters();initChat();initPilot();initConfigurator();initForms();
});
