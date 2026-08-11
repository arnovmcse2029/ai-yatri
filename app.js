/* ============ AI YATRI — APP LOGIC ============ */
const STATE = {
  screen: 'home',
  auth: { user: readStoredUser() },
  authOpen: false,
  authMode: 'login',
  tab: 'itinerary',
  persona: { interests: [], pace: null, group: null, activity: null },
  chat: [], // {role:'assistant'|'user', text}
  chatDone: false,
  trip: { destKey: null, fromCity: 'Delhi', budget: 25000, days: 3, travelers: 2, startDate: '' },
  itineraryDays: null, // generated
  itineraryMode: null, // 'ai' | 'fallback'
  transportSelected: null,
  staySelected: null,
  offline: { downloaded: false, progress: 0, simulating: false, downloadingKey: null },
  aiAvailable: true,
  introSeen: false,
  destinationQuery: '',
};

function readStoredUser(){
  try { return JSON.parse(localStorage.getItem('ai-yatri-session') || 'null'); }
  catch(e){ localStorage.removeItem('ai-yatri-session'); return null; }
}

const INTEREST_OPTIONS = [
  {key:'adventure', label:'Adventure & hiking', emoji:'\ud83e\udd7e'},
  {key:'heritage', label:'Culture & heritage', emoji:'\ud83c\udfdb\ufe0f'},
  {key:'food', label:'Food', emoji:'\ud83c\udf5b'},
  {key:'wildlife', label:'Wildlife', emoji:'\ud83d\udc06'},
  {key:'spiritual', label:'Spiritual', emoji:'\ud83d\udd4f'},
  {key:'nightlife', label:'Nightlife', emoji:'\ud83c\udf19'},
  {key:'relaxation', label:'Relaxation', emoji:'\ud83c\udf3f'},
];

function $(sel, root=document){ return root.querySelector(sel); }
function $all(sel, root=document){ return [...root.querySelectorAll(sel)]; }
function el(html){ const t=document.createElement('template'); t.innerHTML=html.trim(); return t.content.firstElementChild; }
function fmtINR(n){ return '\u20b9' + Math.round(n).toLocaleString('en-IN'); }
function escapeHtml(s){ return (s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function isAuthenticated(){ return !!STATE.auth.user; }
function getAccounts(){
  try { return JSON.parse(localStorage.getItem('ai-yatri-accounts') || '[]'); }
  catch(e){ return []; }
}
function setAccounts(accounts){ localStorage.setItem('ai-yatri-accounts', JSON.stringify(accounts)); }
function restoreValidSession(){
  const session = STATE.auth.user;
  const account = session && getAccounts().find(item=>item.id===session.id && item.email===session.email);
  if (!account){
    STATE.auth.user = null;
    localStorage.removeItem('ai-yatri-session');
  }
}
function hashPassword(password){
  let hash = 2166136261;
  for (let i=0; i<password.length; i++) hash = Math.imul(hash ^ password.charCodeAt(i), 16777619);
  return (hash >>> 0).toString(16);
}
function openAuthModal(mode='login'){
  STATE.authOpen = true;
  STATE.authMode = mode;
  if (typeof renderAuthModal === 'function') renderAuthModal();
}
function closeAuthModal(){
  STATE.authOpen = false;
  const modal = document.getElementById('authModal');
  if (modal) modal.remove();
}
function requireAuth(){
  if (isAuthenticated()) return true;
  openAuthModal(getAccounts().length ? 'login' : 'register');
  return false;
}
function registerAccount(name, email, password){
  const accounts = getAccounts();
  const normalizedEmail = email.toLowerCase();
  if (accounts.some(account=>account.email===normalizedEmail)) return 'An account with this email already exists. Please log in.';
  const user = {id: crypto.randomUUID ? crypto.randomUUID() : `user-${Date.now()}`, name, email:normalizedEmail, passwordHash:hashPassword(password), createdAt:new Date().toISOString()};
  accounts.push(user);
  setAccounts(accounts);
  STATE.auth.user = {id:user.id, name:user.name, email:user.email, createdAt:user.createdAt};
  localStorage.setItem('ai-yatri-session', JSON.stringify(STATE.auth.user));
  closeAuthModal();
  render();
}
function loginAccount(email, password){
  const account = getAccounts().find(item=>item.email===email.toLowerCase());
  if (!account || account.passwordHash!==hashPassword(password)) return 'Email or password is incorrect.';
  STATE.auth.user = {id:account.id, name:account.name, email:account.email, createdAt:account.createdAt};
  localStorage.setItem('ai-yatri-session', JSON.stringify(STATE.auth.user));
  closeAuthModal();
  render();
}
function logout(){
  localStorage.removeItem('ai-yatri-session');
  STATE.auth.user = null;
  STATE.screen = 'home';
  render();
}
function makeDestinationFromQuery(name){
  const cleanName = name.trim().replace(/\s+/g,' ');
  const key = `custom-${cleanName.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}`;
  if (!cleanName || cleanName.length < 2) return null;
  if (!DESTINATIONS[key]){
    DESTINATIONS[key] = {
      key, name: cleanName, state: 'India', tagline: `Plan a personal trip to ${cleanName}`,
      blurb: `A flexible starter plan for ${cleanName}. Add your interests and dates to refine it.`,
      nearestAirport: `${cleanName} nearest airport / gateway`, nearestRail: `${cleanName} nearest railway station`,
      coords: null,
      spots: [
        {id:`${key}-heritage`, name:`${cleanName} heritage walk`, tags:['heritage'], desc:`Explore the historic heart and local stories of ${cleanName}.`, bestTime:'Morning', reason:'Cooler temperatures make walking easier.', duration:'2 hrs', fee:'Local entry fees vary'},
        {id:`${key}-food`, name:`${cleanName} local food trail`, tags:['food'], desc:`Try local dishes and everyday markets in ${cleanName}.`, bestTime:'Evening', reason:'Markets and food streets are liveliest after sunset.', duration:'2 hrs', fee:'Pay as you go'},
        {id:`${key}-nature`, name:`${cleanName} nature escape`, tags:['nature','relaxation'], desc:`Take a slower break in a nearby park, lake, or scenic area.`, bestTime:'Late afternoon', reason:'Soft light and cooler air suit a relaxed visit.', duration:'2 hrs', fee:'Varies'},
        {id:`${key}-culture`, name:`${cleanName} culture experience`, tags:['culture','heritage'], desc:`Find a museum, craft space, or cultural performance nearby.`, bestTime:'Daytime', reason:'Indoor cultural stops work well around midday.', duration:'2 hrs', fee:'Varies'}
      ],
      stays: [{name:`${cleanName} budget stay`, type:'Budget hotel', rating:4, price:1800, distance:'Central area'}, {name:`${cleanName} city hotel`, type:'Mid-range hotel', rating:4.3, price:3000, distance:'Near main attractions'}],
      localMobility: {buses:[{route:'Local bus', path:`Central area ↔ ${cleanName} attractions`, fare:'Local fare'}], auto:'Use a metered auto or agree on the fare before the ride.', cab:'Use a trusted local cab or app where available.', bestBooking:'Reserve longer transfers ahead of busy travel periods.'},
      safety: {zones:[{area:'Central visitor areas', level:'safer', note:'Stay in busy, well-lit areas and follow local guidance.'}], helplines:[{label:'National Emergency', num:'112'},{label:'Police', num:'100'}], sourceNote:'General travel guidance, not live safety data.', lastUpdated:'Starter destination'},
      culture: {cuisine:['Local regional dishes','Street snacks','Tea or coffee specialties'], heritage:['Historic centre','Local museum or cultural space'], markets:['Main market','Craft and souvenir shops'], festivals:[{name:'Local festival calendar', when:'Check locally', note:'Dates vary by year.'}]}
    };
  }
  return key;
}

/* ---------------- NAVIGATION ---------------- */
function goScreen(name, tab){
  if (!requireAuth()) return;
  STATE.screen = name;
  if (tab) STATE.tab = tab;
  render();
  const main = document.getElementById('main-scroll');
  if (main) main.scrollTop = 0;
}
function goTab(tab){ STATE.tab = tab; render(); }

/* ---------------- PERSONA / CHAT (AI + fallback) ---------------- */
const SCRIPTED_STEPS = [
  { field:'interests', prompt:"Namaste! I'm your AI Yatri planner. First \u2014 what draws you on a trip? Pick everything that fits.", multi:true, options: INTEREST_OPTIONS.map(o=>o.label) },
  { field:'pace', prompt:"Got it. Do you like a fast-paced trip that packs in a lot, or a relaxed one with room to breathe?", multi:false, options:['Fast-paced \u2014 pack it in','Relaxed \u2014 leave room to breathe'] },
  { field:'group', prompt:"Who's travelling with you?", multi:false, options:['Solo','Couple','Family','Friends'] },
  { field:'activity', prompt:"Last one \u2014 how comfortable are you with physical activity like hiking or long treks?", multi:false, options:['Low \u2014 prefer easy walking','Moderate \u2014 a few hours is fine','High \u2014 bring on the trek'] },
];

function personaComplete(){
  const p = STATE.persona;
  return p.interests.length>0 && p.pace && p.group && p.activity;
}

function initChatIfNeeded(){
  if (STATE.chat.length===0){
    STATE.chat.push({role:'assistant', text: SCRIPTED_STEPS[0].prompt, options: SCRIPTED_STEPS[0].options, multi:true, field:'interests'});
  }
}

function currentScriptedStep(){
  const p = STATE.persona;
  if (p.interests.length===0) return SCRIPTED_STEPS[0];
  if (!p.pace) return SCRIPTED_STEPS[1];
  if (!p.group) return SCRIPTED_STEPS[2];
  if (!p.activity) return SCRIPTED_STEPS[3];
  return null;
}

async function submitChatChoice(values){
  const step = currentScriptedStep();
  if (!step) return;
  // record the user's message
  STATE.chat.push({role:'user', text: values.join(', ')});
  applyPersonaField(step.field, values);

  const next = currentScriptedStep();
  if (next){
    STATE.chat.push({role:'assistant', text: next.prompt, options: next.options, multi: next.multi, field: next.field});
  } else {
    STATE.chatDone = true;
    STATE.chat.push({role:'assistant', text: buildPersonaSummaryLine() + " I've saved that to your traveller profile \u2014 head to Home to pick a destination, or tell me more any time and I'll refine it."});
  }
  render();
  await tryAIEnrich();
}

function applyPersonaField(field, values){
  const p = STATE.persona;
  if (field==='interests'){
    p.interests = values.map(v => (INTEREST_OPTIONS.find(o=>o.label===v)||{key:v.toLowerCase()}).key);
  } else if (field==='pace'){
    p.pace = values[0].startsWith('Fast') ? 'fast' : 'relaxed';
  } else if (field==='group'){
    p.group = values[0].toLowerCase();
  } else if (field==='activity'){
    p.activity = values[0].startsWith('Low') ? 'low' : values[0].startsWith('Moderate') ? 'moderate' : 'high';
  }
}

function buildPersonaSummaryLine(){
  const p = STATE.persona;
  const interestLabels = p.interests.map(k => (INTEREST_OPTIONS.find(o=>o.key===k)||{label:k}).label).join(', ');
  return `Nice \u2014 so you're after ${interestLabels.toLowerCase()}, at a ${p.pace} pace, travelling as ${p.group}, with ${p.activity} activity comfort.`;
}

// Free-text chat input -> try real Claude API; merge any persona fields it extracts; else nudge back to chips.
async function submitFreeText(text){
  STATE.chat.push({role:'user', text});
  render();
  const reply = await tryAIFreeText(text);
  if (reply){
    STATE.chat.push({role:'assistant', text: reply});
    const next = currentScriptedStep();
    if (next){
      STATE.chat.push({role:'assistant', text: next.prompt, options: next.options, multi: next.multi, field: next.field});
    }
  } else {
    const step = currentScriptedStep();
    if (step){
      STATE.chat.push({role:'assistant', text: "Thanks! Tap an option below so I capture that clearly in your profile.", options: step.options, multi: step.multi, field: step.field});
    } else {
      STATE.chat.push({role:'assistant', text: "Got it \u2014 noted. You can always adjust your traveller profile from the Profile tab."});
    }
  }
  render();
}

function localFreeTextReply(userText){
  const text = userText.toLowerCase();
  const found = [];
  const interestKeywords = {
    adventure: ['adventure','hike','hiking','trek','trekking','mountain','waterfall'],
    heritage: ['heritage','culture','history','temple','museum'],
    food: ['food','eat','cuisine','restaurant','street food'],
    wildlife: ['wildlife','rhino','safari','animals','birds','forest'],
    spiritual: ['spiritual','temple','pilgrim','pilgrimage'],
    nightlife: ['nightlife','party','bars','music'],
    relaxation: ['relax','relaxed','peaceful','quiet','slow']
  };
  Object.entries(interestKeywords).forEach(([key, words])=>{
    if (words.some(word=>text.includes(word)) && !found.includes(key)) found.push(key);
  });

  const p = STATE.persona;
  const step = currentScriptedStep();
  if (step && step.field==='interests' && found.length){
    p.interests = [...new Set([...p.interests, ...found])];
  }
  if (!p.pace && /(fast|packed|busy|many places)/.test(text)) p.pace = 'fast';
  if (!p.pace && /(relax|slow|easy|unhurried)/.test(text)) p.pace = 'relaxed';
  if (!p.group){
    if (/(solo|alone|myself)/.test(text)) p.group = 'solo';
    else if (/(couple|partner|spouse)/.test(text)) p.group = 'couple';
    else if (/(family|children|kids)/.test(text)) p.group = 'family';
    else if (/(friend|friends)/.test(text)) p.group = 'friends';
  }
  if (!p.activity){
    if (/(no hike|not active|easy walking|low activity)/.test(text)) p.activity = 'low';
    else if (/(trek|hike|very active|high activity)/.test(text)) p.activity = 'high';
    else if (/(moderate|few hours|some walking)/.test(text)) p.activity = 'moderate';
  }

  const destination = text.match(/\b(guwahati|shillong|kaziranga)\b/);
  if (destination){
    const dest = DESTINATIONS[destination[1]];
    return `${dest.name} is a good fit. ${dest.tagline}. I can shape the plan around ${p.interests.length ? p.interests.join(', ') : 'your travel style'}.`;
  }

  const vadodara = /\b(vadodara|vadodra|baroda)\b/.test(text);
  if (/(zoo|zoological|wildlife park|animal park)/.test(text) && vadodara){
    return 'Yes. In Vadodara, visit Sayaji Baug (Kamati Baug) Zoo, next to the museum and gardens. Go in the morning, then explore the park. Want a one-day Vadodara plan?';
  }
  if (/(zoo|zoological|wildlife park|animal park)/.test(text)){
    return 'A zoo is a nice easy-going wildlife stop. Tell me the city and I will suggest the best nearby zoo, opening-time strategy, and other places to combine with it.';
  }
  if (/(suggest|recommend|where should|place to visit|places to visit)/.test(text)){
    return 'I can recommend places, food, stays, or a complete itinerary. Tell me the city, dates, budget, and what you enjoy, and I will make specific suggestions.';
  }
  if (/(hello|hi|namaste|hey)\b/.test(text)) return 'Namaste! I can help with destinations, zoos, food, budgets, transport, and day-by-day plans. What would you like to explore?';
  if (found.length) return `That sounds like a ${found.join(' and ')} trip. I will use that preference when I build your itinerary.`;
  if (/(budget|cost|price|cheap|afford)/.test(text)) return 'I can keep the plan budget-conscious. Set your total budget on Home and I will prioritise transport and stays that fit it.';
  if (/(day|days|itinerary|plan|trip)/.test(text)) return 'Tell me your destination and number of days, and I will arrange a practical day-by-day plan.';
  return 'I can help with that. Tell me the place you want to visit and what you need there, such as attractions, food, transport, budget, or a complete plan.';
}

async function tryAIFreeText(userText){
  const fallbackReply = localFreeTextReply(userText);
  try {
    const messages = STATE.chat
      .filter(m=>m.role==='user' || m.role==='assistant')
      .map(m=>({role:m.role, content:m.text}));
    messages.push({role:'user', content:userText});
    const res = await fetch('/api/chat', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({messages, persona:STATE.persona})
    });
    if (!res.ok) throw new Error('AI service unavailable');
    const data = await res.json();
    return data.reply || fallbackReply;
  } catch(e){
    return fallbackReply;
  }
}

async function tryAIEnrich(){ /* placeholder hook for future proactive enrichment */ }

/* ---------------- ITINERARY GENERATION ---------------- */
async function generateItinerary(){
  const dest = DESTINATIONS[STATE.trip.destKey];
  if (!dest) return;
  STATE.itineraryDays = null;
  render();
  let days = null;
  if (STATE.aiAvailable){
    days = await tryAIItinerary(dest);
  }
  if (!days){
    days = fallbackItinerary(dest);
    STATE.itineraryMode = 'fallback';
  } else {
    STATE.itineraryMode = 'ai';
  }
  STATE.itineraryDays = days;
  render();
}

function fallbackItinerary(dest){
  const p = STATE.persona;
  const interests = p.interests.length ? p.interests : ['heritage','nature','food'];
  const scored = dest.spots.map(s => ({...s, score: s.tags.filter(t=>interests.includes(t)).length}));
  scored.sort((a,b)=> b.score - a.score);
  const perDay = p.pace==='fast' ? 3 : 2;
  const totalDays = STATE.trip.days;
  const days = [];
  let idx = 0;
  for (let d=1; d<=totalDays; d++){
    const items = [];
    for (let i=0;i<perDay && idx<scored.length;i++){ items.push(scored[idx]); idx++; }
    if (items.length===0){ // wrap around if ran out
      for (let i=0;i<perDay;i++){ items.push(scored[i % scored.length]); }
    }
    days.push({ day:d, label: d===1 ? `Day 1 \u2014 Arrival & first taste of ${dest.name}` : (d===totalDays ? `Day ${d} \u2014 Last looks & departure` : `Day ${d} \u2014 Deeper into ${dest.name}`), items });
  }
  return days;
}

async function tryAIItinerary(dest){
  try {
    const system = `You are the itinerary engine inside "AI Yatri", an India domestic-travel app. You must build a day-by-day plan using ONLY places from the provided candidate list (do not invent new places). Traveller profile: ${JSON.stringify(STATE.persona)}. Trip: ${STATE.trip.days} days, starting from ${STATE.trip.fromCity}, budget \u20b9${STATE.trip.budget}, ${STATE.trip.travelers} traveller(s). Candidate places (JSON): ${JSON.stringify(dest.spots.map(s=>({id:s.id,name:s.name,tags:s.tags,desc:s.desc,bestTime:s.bestTime,reason:s.reason,duration:s.duration,fee:s.fee})))}. Prioritize places matching the traveller's interests; respect pace (fast-paced = more items/day, relaxed = fewer). Reply ONLY with strict JSON, no markdown fences: {"days":[{"day":1,"label":"short day title","items":["<place id>", "..."]}]}. Use each place id at most once across the whole trip. Include ${STATE.persona.pace==='fast'?'3':'2'} to ${STATE.persona.pace==='fast'?'4':'3'} items per day where possible.`;
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ model:'claude-sonnet-4-6', max_tokens:1200, system, messages:[{role:'user', content:'Generate the itinerary now.'}] })
    });
    if (!res.ok) throw new Error('bad status');
    const data = await res.json();
    const textBlock = (data.content||[]).find(b=>b.type==='text');
    if (!textBlock) throw new Error('no text');
    const clean = textBlock.text.replace(/```json|```/g,'').trim();
    const parsed = JSON.parse(clean);
    if (!parsed.days || !Array.isArray(parsed.days)) throw new Error('bad shape');
    const byId = {}; dest.spots.forEach(s=>byId[s.id]=s);
    const days = parsed.days.map(d => ({
      day: d.day, label: d.label || `Day ${d.day}`,
      items: (d.items||[]).map(id=>byId[id]).filter(Boolean)
    })).filter(d=>d.items.length>0);
    if (days.length===0) throw new Error('empty');
    return days;
  } catch(e){
    return null;
  }
}

/* ---------------- BUDGET HELPERS ---------------- */
function transportCost(){
  if (!STATE.transportSelected) return 0;
  return STATE.transportSelected.price * STATE.trip.travelers;
}
function stayCost(nights){
  if (!STATE.staySelected) return 0;
  return STATE.staySelected.price * (nights||STATE.trip.days);
}
function remainingBudget(){
  return STATE.trip.budget - transportCost();
}

/* ---------------- OFFLINE PACK SIMULATION ---------------- */
function startOfflineDownload(){
  if (!STATE.trip.destKey) return;
  STATE.offline.downloadingKey = STATE.trip.destKey;
  STATE.offline.progress = 0;
  STATE.offline.downloaded = false;
  render();
  const timer = setInterval(()=>{
    STATE.offline.progress += 14 + Math.random()*10;
    if (STATE.offline.progress >= 100){
      STATE.offline.progress = 100;
      STATE.offline.downloaded = true;
      STATE.offline.downloadingKey = null;
      clearInterval(timer);
    }
    render();
  }, 260);
}
