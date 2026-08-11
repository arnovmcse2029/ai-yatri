/* ============ AI YATRI — RENDER LAYER ============ */
function render(){
  $all('.navitem').forEach(b => b.classList.toggle('active', b.dataset.screen===STATE.screen));
  const root = document.getElementById('main-scroll');
  root.innerHTML = screenHtml(STATE.screen);
  wireScreen(STATE.screen);
  wireAuthButton();
  document.getElementById('app-title').textContent = SCREEN_TITLES[STATE.screen] || 'AI Yatri';
}

function wireAuthButton(){
  const button = $('#authBtn');
  if (!button) return;
  button.textContent = isAuthenticated() ? 'Log out' : 'Sign in';
  if (button.dataset.wired) return;
  button.dataset.wired = 'true';
  button.addEventListener('click', ()=> isAuthenticated() ? logout() : openAuthModal(getAccounts().length ? 'login' : 'register'));
}

function renderAuthModal(){
  const current = document.getElementById('authModal');
  if (current) current.remove();
  const registerMode = STATE.authMode==='register';
  const modal = el(`<div class="auth-backdrop" id="authModal">
    <form class="auth-card" id="authForm">
      <button type="button" class="auth-close" id="authClose" aria-label="Close">×</button>
      <span class="eyebrow">AI Yatri account</span>
      <h2>${registerMode ? 'Create your account' : 'Welcome back'}</h2>
      <p class="muted">${registerMode ? 'Create an account first, then use the same details to log in.' : 'Log in to continue to your saved trips and traveller profile.'}</p>
      <div class="auth-error" id="authError" role="alert"></div>
      ${registerMode ? '<label class="auth-label">Full name<input id="authName" type="text" required minlength="2" placeholder="Your name" autocomplete="name"/></label>' : ''}
      <label class="auth-label">Email<input id="authEmail" type="email" required placeholder="you@example.com" autocomplete="email"/></label>
      <label class="auth-label">Password<input id="authPassword" type="password" required minlength="6" placeholder="At least 6 characters" autocomplete="${registerMode?'new-password':'current-password'}"/></label>
      ${registerMode ? '<label class="auth-label">Confirm password<input id="authConfirmPassword" type="password" required minlength="6" placeholder="Repeat your password" autocomplete="new-password"/></label>' : ''}
      <button class="cta-btn" type="submit">${registerMode ? 'Create account' : 'Log in'}</button>
      <button class="auth-switch" type="button" id="authSwitch">${registerMode ? 'Already have an account? Log in' : 'New here? Create an account'}</button>
      <p class="auth-note">Local demo authentication: account data stays in this browser.</p>
    </form>
  </div>`);
  document.body.appendChild(modal);
  $('#authClose', modal).addEventListener('click', closeAuthModal);
  $('#authForm', modal).addEventListener('submit', e=>{
    e.preventDefault();
    const email = $('#authEmail', modal).value.trim();
    const password = $('#authPassword', modal).value;
    const error = $('#authError', modal);
    if (STATE.authMode==='register'){
      const name = $('#authName', modal).value.trim();
      const confirmPassword = $('#authConfirmPassword', modal).value;
      if (password!==confirmPassword){ error.textContent='Passwords do not match.'; return; }
      const result = registerAccount(name, email, password);
      if (result) error.textContent = result;
    } else {
      const result = loginAccount(email, password);
      if (result) error.textContent = result;
    }
  });
  $('#authSwitch', modal).addEventListener('click', ()=>openAuthModal(registerMode ? 'login' : 'register'));
}

const SCREEN_TITLES = { home:'AI Yatri', itinerary:'Your Trip', map:'Map & Safety', chat:'Traveller Chat', profile:'Profile' };

function screenHtml(screen){
  if (screen==='home') return homeHtml();
  if (screen==='itinerary') return itineraryHtml();
  if (screen==='map') return mapHtml();
  if (screen==='chat') return chatHtml();
  if (screen==='profile') return profileHtml();
  return '';
}

/* ================= HOME ================= */
function homeHtml(){
  const query = STATE.destinationQuery.trim().toLowerCase();
  const results = Object.values(DESTINATIONS).filter(d=>!query || `${d.name} ${d.state} ${d.tagline}`.toLowerCase().includes(query));
  const destCards = results.map(d => `
    <button class="dest-card ${STATE.trip.destKey===d.key?'selected':''}" data-dest="${d.key}">
      <span class="dest-stamp">${d.state}</span>
      <h3>${d.name}</h3>
      <p>${d.tagline}</p>
    </button>`).join('');
  const searchResult = query && !results.length ? `<button class="dest-card search-create" data-custom-dest="${escapeHtml(STATE.destinationQuery)}"><h3>Plan a trip to ${escapeHtml(STATE.destinationQuery)}</h3><p>Use this place as your destination and open its route on Google Maps.</p></button>` : '';

  return `
  <section class="hero">
    <img src="${IMG.home}" alt="" class="hero-img"/>
    <div class="hero-copy">
      <span class="eyebrow">SIH prototype \u00b7 domestic travel, planned around you</span>
      <h1>Your India,<br/>planned around you.</h1>
      <p>Tell AI Yatri who you are as a traveller once, and every itinerary, ride and stay it suggests bends around that \u2014 not a generic top-10 list.</p>
    </div>
  </section>

  <section class="block">
    <div class="block-head"><h2>Where to?</h2><span class="hint">Search India or choose a mapped destination</span></div>
    <div class="destination-search"><input id="destinationSearch" type="search" value="${escapeHtml(STATE.destinationQuery)}" placeholder="Search a city or place"/><button id="destinationSearchBtn" class="icon-btn" title="Search destinations">⌕</button></div>
    <div class="dest-grid">${destCards || searchResult || '<p class="muted">No matching place yet. Try another city name.</p>'}</div>
  </section>

  <section class="block trip-setup">
    <div class="block-head"><h2>Trip setup</h2></div>
    <div class="field">
      <label>Travelling from</label>
      <select id="fromCity">${FROM_CITIES.map(c=>`<option value="${c}" ${STATE.trip.fromCity===c?'selected':''}>${c}</option>`).join('')}</select>
    </div>
    <div class="field-row">
      <div class="field"><label>Budget (\u20b9 total)</label><input id="budget" type="number" min="1000" step="500" value="${STATE.trip.budget}"/></div>
      <div class="field"><label>Travellers</label><input id="travelers" type="number" min="1" max="10" value="${STATE.trip.travelers}"/></div>
    </div>
    <div class="field-row">
      <div class="field"><label>Days</label><input id="days" type="number" min="1" max="14" value="${STATE.trip.days}"/></div>
      <div class="field"><label>Start date</label><input id="startDate" type="date" value="${STATE.trip.startDate}"/></div>
    </div>
    <button class="cta-btn" id="buildTripBtn">${personaComplete() ? 'Build my itinerary' : 'Chat with AI Yatri first \u2192'}</button>
    ${!personaComplete() ? `<p class="microhint">I need a quick read on your travel style before I can personalise anything \u2014 2 minutes in Chat.</p>` : ''}
  </section>`;
}

function wireHome(){
  const search = $('#destinationSearch');
  const runSearch = ()=>{ if (!requireAuth()) return; STATE.destinationQuery = search ? search.value : ''; render(); };
  if (search) search.addEventListener('keydown', e=>{ if(e.key==='Enter') runSearch(); });
  const searchBtn = $('#destinationSearchBtn'); if(searchBtn) searchBtn.addEventListener('click', runSearch);
  $all('.dest-card').forEach(b => b.addEventListener('click', ()=>{
    if (!requireAuth()) return;
    STATE.trip.destKey = b.dataset.dest || makeDestinationFromQuery(b.dataset.customDest);
    render();
  }));
  const fc = $('#fromCity'); if(fc) fc.addEventListener('change', e=> STATE.trip.fromCity = e.target.value);
  const bd = $('#budget'); if(bd) bd.addEventListener('input', e=> STATE.trip.budget = +e.target.value||0);
  const tv = $('#travelers'); if(tv) tv.addEventListener('input', e=> STATE.trip.travelers = +e.target.value||1);
  const dy = $('#days'); if(dy) dy.addEventListener('input', e=> STATE.trip.days = +e.target.value||1);
  const sd = $('#startDate'); if(sd) sd.addEventListener('input', e=> STATE.trip.startDate = e.target.value);
  const btn = $('#buildTripBtn');
  if (btn) btn.addEventListener('click', async ()=>{
    if (!requireAuth()) return;
    if (!personaComplete()){ goScreen('chat'); return; }
    if (!STATE.trip.destKey){ toast('Pick a destination card first \u2014 try Kaziranga for wildlife!'); return; }
    goScreen('itinerary','itinerary');
    await generateItinerary();
  });
}

/* ================= ITINERARY (tabs: itinerary/transport/stay/mobility/discover) ================= */
function itineraryHtml(){
  if (!STATE.trip.destKey){
    return emptyState('Pick a destination first', 'Head to Home and choose Guwahati, Shillong or Kaziranga to start building your trip.', 'Go to Home', 'home');
  }
  const dest = DESTINATIONS[STATE.trip.destKey];
  const tabs = [['itinerary','Itinerary'],['transport','Transport'],['stay','Stay'],['mobility','Local transit'],['discover','Discover']];
  return `
  <div class="trip-header">
    <div>
      <span class="eyebrow">${dest.state}</span>
      <h1>${dest.name}</h1>
    </div>
    <button class="ghost-btn small" data-nav="home">Change trip</button>
  </div>
  <div class="tabbar">${tabs.map(([k,l])=>`<button class="tabbtn ${STATE.tab===k?'active':''}" data-tab="${k}">${l}</button>`).join('')}</div>
  <div class="tab-body">${itineraryTabBody(dest)}</div>`;
}

function itineraryTabBody(dest){
  if (STATE.tab==='itinerary') return tabItinerary(dest);
  if (STATE.tab==='transport') return tabTransport(dest);
  if (STATE.tab==='stay') return tabStay(dest);
  if (STATE.tab==='mobility') return tabMobility(dest);
  if (STATE.tab==='discover') return tabDiscover(dest);
  return '';
}

function travelModesForDestination(dest){
  const local = dest.localMobility;
  const gateway = dest.nearestAirport.split('(')[0].trim();
  return `<div class="reach-box"><strong>How to reach this place</strong><span>From ${STATE.trip.fromCity}: take a flight or train to ${gateway}, then use a local cab, shared taxi, bus, or auto for the final leg.</span><span><strong>Local modes:</strong> ${local.cab} ${local.auto}</span><a href="https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(STATE.trip.fromCity)}&destination=${encodeURIComponent(dest.name)}" target="_blank" rel="noopener">Open route in Google Maps ↗</a></div>`;
}

function realPhotoFor(item, index){
  const photos = {
    wildlife: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=900&q=82',
    nature: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=82',
    water: 'https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=900&q=82',
    culture: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=82',
    food: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=82',
    default: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=82'
  };
  const tags = item.tags || [];
  if (tags.includes('wildlife')) return photos.wildlife;
  if (tags.includes('food')) return photos.food;
  if (tags.includes('nature')) return tags.includes('relaxation') ? photos.water : photos.nature;
  if (tags.includes('culture') || tags.includes('heritage') || tags.includes('spiritual')) return photos.culture;
  return photos.default;
}

function visitImages(item, index){
  const photo = realPhotoFor(item, index);
  const dayImage = photo;
  const nightImage = item.nightImage || photo;
  return `<div class="visit-media"><figure><img src="${dayImage}" alt="Day view for ${escapeHtml(item.name)}"/><figcaption>Day view</figcaption></figure><figure><img src="${nightImage}" alt="Evening view for ${escapeHtml(item.name)}"/><figcaption>Evening / night plan</figcaption></figure></div>`;
}

function tabItinerary(dest){
  if (!personaComplete()){
    return emptyState('Build your traveller profile', 'Your itinerary is generated from your interests, pace and group \u2014 chat with AI Yatri first.', 'Go to Chat', 'chat');
  }
  if (!STATE.itineraryDays){
    return `<div class="loading-block"><div class="spinner"></div><p>Building your ${dest.name} itinerary from your traveller profile\u2026</p>
      <button class="cta-btn" id="genBtn">Generate itinerary</button></div>`;
  }
  const modeNote = STATE.itineraryMode==='ai'
    ? `<span class="badge badge-ai">AI-personalised</span>`
    : `<span class="badge badge-demo">Rule-based (AI offline)</span>`;
  const days = STATE.itineraryDays.map(d => `
    <div class="day-block">
      <div class="day-title-row"><h3>${d.label}</h3></div>
      <div class="route-track">
        ${d.items.map((it,i)=>`
          <div class="postcard">
            <div class="route-dot"></div>
            <div class="postcard-body">
              <div class="postcard-top">
                <h4>${it.name}</h4>
                <span class="chip-tag">${it.duration}</span>
              </div>
              ${visitImages(it,i)}
              <p class="pc-desc">${it.desc}</p>
              <div class="pc-meta">
                <div><strong>Best time:</strong> ${it.bestTime}</div>
                <div class="pc-reason">${it.reason}</div>
              </div>
              <div class="pc-footer"><span>${it.fee}</span></div>
              ${travelModesForDestination(dest)}
            </div>
          </div>`).join('')}
      </div>
    </div>`).join('');
  return `
    <div class="route-from"><span>Starting point:</span> ${STATE.trip.fromCity} \u2192 nearest gateway: ${dest.nearestAirport.split('(')[0].trim()}</div>
    <div class="mode-row">${modeNote}<button class="ghost-btn small" id="regenBtn">Regenerate</button></div>
    ${days}`;
}

function tabTransport(dest){
  const mt = mockTransport(STATE.trip.fromCity, dest.key);
  const groups = [['flights','Flights',mt.flights],['trains','Trains',mt.trains],['buses','Buses',mt.buses]];
  const sections = groups.filter(([,,arr])=>arr.length).map(([k,label,arr])=>{
    const sorted = [...arr].sort((a,b)=>a.price-b.price);
    return `<div class="transport-group"><h3>${label}</h3><div class="ticket-list">
      ${sorted.map(t=>`
        <div class="ticket ${STATE.transportSelected && STATE.transportSelected.id===t.id?'ticket-selected':''}" data-tid="${t.id}" data-mt='${btoa(unescape(encodeURIComponent(JSON.stringify(t))))}'>
          <div class="ticket-main">
            <div class="ticket-op">${t.operator}</div>
            <div class="ticket-route">${t.from} \u2192 ${t.to}</div>
            <div class="ticket-sub">${t.duration} \u00b7 ${t.stops}</div>
          </div>
          <div class="ticket-price">${fmtINR(t.price)}<span>/traveller</span></div>
        </div>`).join('')}
    </div></div>`;
  }).join('');
  return `<div class="demo-banner">Sample fares for demo \u2014 not live IRCTC/airline pricing.</div>${sections || '<p class="muted">No direct routes modelled from this city for the demo \u2014 try Delhi, Mumbai or Kolkata.</p>'}`;
}

function tabStay(dest){
  const remaining = remainingBudget();
  const perNightBudget = remaining / Math.max(STATE.trip.days,1) / Math.max(STATE.trip.travelers,1) * STATE.trip.travelers;
  const stays = [...dest.stays].sort((a,b)=>a.price-b.price);
  return `
  <div class="budget-strip">
    <div><span>Trip budget</span><strong>${fmtINR(STATE.trip.budget)}</strong></div>
    <div><span>\u2212 Transport${STATE.transportSelected?'':' (not chosen)'}</span><strong>${fmtINR(transportCost())}</strong></div>
    <div><span>Remaining for stay + rest</span><strong>${fmtINR(remaining)}</strong></div>
  </div>
  <div class="stay-list">
    ${stays.map(s=>{
      const fits = s.price*STATE.trip.days <= remaining;
      return `<div class="stay-card ${STATE.staySelected && STATE.staySelected.name===s.name?'stay-selected':''} ${fits?'':'stay-over'}" data-stay='${btoa(unescape(encodeURIComponent(JSON.stringify(s))))}'>
        <div class="stay-main">
          <h4>${s.name}</h4>
          <span class="chip-tag">${s.type}</span>
          <div class="stay-sub">${'\u2605'.repeat(Math.round(s.rating))}<span class="muted"> ${s.rating}</span> \u00b7 ${s.distance}</div>
        </div>
        <div class="stay-price">${fmtINR(s.price)}<span>/night</span>${!fits?'<div class="over-flag">over remaining budget</div>':''}</div>
      </div>`;
    }).join('')}
  </div>`;
}

function tabMobility(dest){
  const lm = dest.localMobility;
  return `
  <div class="mobility-grid">
    <div class="mobility-card"><h3>City buses</h3>${lm.buses.map(b=>`<div class="mob-row"><strong>${b.route}</strong><span>${b.path}</span><span class="chip-tag">${b.fare}</span></div>`).join('')}</div>
    <div class="mobility-card"><h3>Autos</h3><p>${lm.auto}</p></div>
    <div class="mobility-card"><h3>Cabs</h3><p>${lm.cab}</p></div>
    <div class="mobility-card highlight"><h3>Best time to book</h3><p>${lm.bestBooking}</p></div>
  </div>`;
}

function tabDiscover(dest){
  const c = dest.culture;
  return `
  <div class="discover-grid">
    <div class="discover-card"><h3>\ud83c\udf5b Local cuisine</h3><ul>${c.cuisine.map(x=>`<li>${x}</li>`).join('')}</ul></div>
    <div class="discover-card"><h3>\ud83c\udfdb\ufe0f Heritage sites</h3><ul>${c.heritage.map(x=>`<li>${x}</li>`).join('')}</ul></div>
    <div class="discover-card"><h3>\ud83c\udfea Markets</h3><ul>${c.markets.map(x=>`<li>${x}</li>`).join('')}</ul></div>
    <div class="discover-card"><h3>\ud83c\udf89 Festivals</h3><ul>${c.festivals.map(f=>`<li><strong>${f.name}</strong> \u2014 ${f.when}. ${f.note}</li>`).join('')}</ul></div>
  </div>`;
}

function wireItinerary(){
  const back = $('[data-nav="home"]'); if(back) back.addEventListener('click', ()=>goScreen('home'));
  $all('.tabbtn').forEach(b=>b.addEventListener('click', ()=>goTab(b.dataset.tab)));
  const genBtn = $('#genBtn'); if(genBtn) genBtn.addEventListener('click', generateItinerary);
  const regenBtn = $('#regenBtn'); if(regenBtn) regenBtn.addEventListener('click', generateItinerary);
  $all('.ticket').forEach(t=>t.addEventListener('click', ()=>{
    const data = JSON.parse(decodeURIComponent(escape(atob(t.dataset.mt))));
    STATE.transportSelected = data; render();
  }));
  $all('.stay-card').forEach(t=>t.addEventListener('click', ()=>{
    const data = JSON.parse(decodeURIComponent(escape(atob(t.dataset.stay))));
    STATE.staySelected = data; render();
  }));
}

/* ================= MAP (safety + offline) ================= */
function mapHtml(){
  if (!STATE.trip.destKey){
    return emptyState('No destination yet', 'Choose a destination on Home to see its safety layer and download an offline pack.', 'Go to Home', 'home');
  }
  const dest = DESTINATIONS[STATE.trip.destKey];
  const s = dest.safety;
  const levelDots = {safer:'#1D8377', caution:'#E8A33D'};
  const mapQuery = encodeURIComponent(dest.name);
  const mapSrc = (typeof GOOGLE_MAPS_API_KEY !== 'undefined' && GOOGLE_MAPS_API_KEY)
    ? `https://www.google.com/maps/embed/v1/search?key=${GOOGLE_MAPS_API_KEY}&q=${mapQuery}`
    : `https://www.google.com/maps?q=${mapQuery}&output=embed`;
  return `
  <img src="${IMG.map}" class="section-hero" alt=""/>
  <section class="block">
    <div class="block-head"><h2>Safety layer \u2014 ${dest.name}</h2></div>
    <div class="demo-banner">${s.sourceNote} <br/><span class="muted">${s.lastUpdated}</span></div>
    <div class="safety-map">
      ${renderSafetySVG(dest, s)}
    </div>
    <div class="zone-list">
      ${s.zones.map(z=>`<div class="zone-row"><span class="zone-dot" style="background:${levelDots[z.level]}"></span><div><strong>${z.area}</strong><p>${z.note}</p></div></div>`).join('')}
    </div>
    <div class="helpline-grid">
      ${s.helplines.map(h=>`<div class="helpline-chip"><span>${h.label}</span><strong>${h.num}</strong></div>`).join('')}
    </div>
  </section>

  <section class="block google-map-block">
    <div class="block-head"><h2>Google Maps</h2><a class="ghost-btn small" href="https://www.google.com/maps/search/?api=1&query=${mapQuery}" target="_blank" rel="noopener">Open full map ↗</a></div>
    <iframe class="google-map" title="Google Map for ${escapeHtml(dest.name)}" src="${mapSrc}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    <p class="muted">Use the map for live directions, traffic, place details, and current opening information.</p>
  </section>

  <section class="block">
    <div class="block-head"><h2>Offline emergency pack</h2></div>
    <p class="muted">Cache maps, key routes and emergency points before you lose signal. Live rerouting won\u2019t work offline \u2014 this stores pre-set routes and pins only.</p>
    ${offlineWidget(dest)}
  </section>`;
}

function renderSafetySVG(dest, s){
  const colors = {safer:'#1D8377', caution:'#E8A33D'};
  const pts = [[90,80],[220,120],[150,220],[280,60],[60,190]];
  const zoneCircles = s.zones.map((z,i)=>{
    const [x,y] = pts[i%pts.length];
    return `<circle cx="${x}" cy="${y}" r="34" fill="${colors[z.level]}" opacity="0.28"/><circle cx="${x}" cy="${y}" r="6" fill="${colors[z.level]}"/>`;
  }).join('');
  const pois = [[190,40,'\ud83c\udfe5'],[40,140,'\ud83d\udc6e'],[250,190,'\ud83c\udfe5'],[130,150,'\ud83d\udc6e']];
  const poiMarks = pois.map(([x,y,e])=>`<text x="${x}" y="${y}" font-size="18">${e}</text>`).join('');
  return `<svg viewBox="0 0 320 240" class="mini-map">
    <rect x="0" y="0" width="320" height="240" rx="14" fill="var(--sand-dark)"/>
    <path d="M0,180 Q80,140 160,175 T320,150" stroke="var(--teal-500)" stroke-width="10" fill="none" opacity="0.35"/>
    ${zoneCircles}${poiMarks}
  </svg>`;
}

function offlineWidget(dest){
  const off = STATE.offline;
  if (off.downloaded && off.downloadingKey===null){
    const pois = ['ATM \u2014 Kohora Main Rd','Police Post \u2014 Town Centre','Govt. Hospital','Bus/Jeep Pickup Point','24hr Pharmacy'];
    return `<div class="offline-ready">
      <div class="offline-status"><span class="dot-ok"></span> Offline pack ready for ${dest.name}</div>
      <ul class="offline-pois">${pois.map(p=>`<li>\ud83d\udccd ${p}</li>`).join('')}</ul>
      <button class="ghost-btn small" id="simOfflineBtn">${off.simulating? 'Exit offline preview' : 'Preview offline mode'}</button>
      ${off.simulating ? `<div class="offline-sim"><div class="offline-sim-map">${renderSafetySVG(dest,dest.safety)}</div><p class="muted">Signal lost \u2014 showing cached pins & last-known routes only. Live rerouting unavailable.</p></div>` : ''}
    </div>`;
  }
  if (off.downloadingKey===dest.key){
    return `<div class="offline-progress"><div class="bar"><div class="bar-fill" style="width:${off.progress}%"></div></div><p>Caching map tiles, routes & emergency points\u2026 ${Math.round(off.progress)}%</p></div>`;
  }
  return `<button class="cta-btn" id="dlOfflineBtn">Download offline pack for ${dest.name}</button>`;
}

function wireMap(){
  const back = $('[data-nav="home"]'); if(back) back.addEventListener('click', ()=>goScreen('home'));
  const dl = $('#dlOfflineBtn'); if(dl) dl.addEventListener('click', startOfflineDownload);
  const sim = $('#simOfflineBtn'); if(sim) sim.addEventListener('click', ()=>{ STATE.offline.simulating = !STATE.offline.simulating; render(); });
}

/* ================= CHAT ================= */
function chatHtml(){
  initChatIfNeeded();
  const bubbles = STATE.chat.map((m,i)=>{
    if (m.role==='assistant'){
      const isLast = i===STATE.chat.length-1;
      const opts = (m.options && isLast) ? `<div class="chip-row" data-multi="${!!m.multi}" data-field="${m.field||''}">
        ${m.options.map(o=>`<button class="chip-opt" data-val="${escapeHtml(o)}">${o}</button>`).join('')}
        ${m.multi ? `<button class="chip-opt chip-confirm" id="confirmMulti">Continue \u2192</button>` : ''}
      </div>` : '';
      return `<div class="bubble bubble-ai"><span class="bubble-avatar">\ud83e\udded</span><div><div class="bubble-text">${escapeHtml(m.text)}</div>${opts}</div></div>`;
    }
    return `<div class="bubble bubble-user"><div class="bubble-text">${escapeHtml(m.text)}</div></div>`;
  }).join('');

  const personaCard = (STATE.persona.interests.length || STATE.persona.pace) ? `
    <div class="persona-mini">
      ${STATE.persona.interests.map(k=>`<span class="chip-tag">${(INTEREST_OPTIONS.find(o=>o.key===k)||{label:k}).label}</span>`).join('')}
      ${STATE.persona.pace?`<span class="chip-tag chip-alt">${STATE.persona.pace} pace</span>`:''}
      ${STATE.persona.group?`<span class="chip-tag chip-alt">${STATE.persona.group}</span>`:''}
      ${STATE.persona.activity?`<span class="chip-tag chip-alt">${STATE.persona.activity} activity</span>`:''}
    </div>` : '';

  return `
  <img src="${IMG.chat}" class="section-hero" alt=""/>
  ${personaCard}
  <div class="chat-scroll" id="chatScroll">${bubbles}</div>
  <div class="chat-input-row">
    <input id="chatInput" type="text" placeholder="Or just type how you like to travel\u2026" autocomplete="off"/>
    <button id="micBtn" class="icon-btn" title="Voice input \u2014 coming soon">\ud83c\udfa4</button>
    <button id="sendBtn" class="icon-btn send">\u27a4</button>
  </div>`;
}

function wireChat(){
  let selectedMulti = new Set();
  $all('.chip-opt').forEach(b=>{
    if (b.id==='confirmMulti') return;
    b.addEventListener('click', async ()=>{
      const row = b.closest('.chip-row');
      const isMulti = row.dataset.multi==='true';
      if (isMulti){
        b.classList.toggle('chip-selected');
        if (b.classList.contains('chip-selected')) selectedMulti.add(b.dataset.val); else selectedMulti.delete(b.dataset.val);
      } else {
        await submitChatChoice([b.dataset.val]);
      }
    });
  });
  const confirm = $('#confirmMulti');
  if (confirm) confirm.addEventListener('click', async ()=>{
    if (selectedMulti.size===0){ toast('Pick at least one interest'); return; }
    await submitChatChoice([...selectedMulti]);
  });
  const send = $('#sendBtn');
  const input = $('#chatInput');
  const doSend = async ()=>{
    if (!requireAuth()) return;
    const v = input.value.trim();
    if (!v) return;
    input.value='';
    await submitFreeText(v);
    const cs = $('#chatScroll'); if (cs) cs.scrollTop = cs.scrollHeight;
  };
  if (send) send.addEventListener('click', doSend);
  if (input) input.addEventListener('keydown', e=>{ if(e.key==='Enter') doSend(); });
  const mic = $('#micBtn'); if (mic) mic.addEventListener('click', ()=>toast('Voice input is a stretch feature \u2014 planned for the next milestone.'));
  const cs = $('#chatScroll'); if (cs) cs.scrollTop = cs.scrollHeight;
}

/* ================= PROFILE ================= */
function profileHtml(){
  const p = STATE.persona;
  const dest = STATE.trip.destKey ? DESTINATIONS[STATE.trip.destKey] : null;
  const user = STATE.auth.user;
  return `
  <img src="${IMG.profile}" class="section-hero" alt=""/>
  <section class="block">
    <div class="block-head"><h2>Traveller profile</h2><div class="profile-actions"><button class="ghost-btn small" data-nav="chat">Edit in chat</button><button class="ghost-btn small" id="logoutBtn">Log out</button></div></div>
    ${personaComplete() ? `
      <div class="profile-tags">
        ${p.interests.map(k=>`<span class="chip-tag">${(INTEREST_OPTIONS.find(o=>o.key===k)||{label:k}).label}</span>`).join('')}
      </div>
      <div class="profile-facts">
        <div><span>Pace</span><strong>${p.pace}</strong></div>
        <div><span>Group</span><strong>${p.group}</strong></div>
        <div><span>Activity comfort</span><strong>${p.activity}</strong></div>
      </div>` : `<p class="muted">Not built yet \u2014 head to Chat to tell AI Yatri how you like to travel.</p>`}
  </section>

  <section class="block">
    <div class="block-head"><h2>Trip summary</h2></div>
    ${dest ? `
    <div class="profile-facts">
      <div><span>Destination</span><strong>${dest.name}, ${dest.state}</strong></div>
      <div><span>From</span><strong>${STATE.trip.fromCity}</strong></div>
      <div><span>Days</span><strong>${STATE.trip.days}</strong></div>
      <div><span>Travellers</span><strong>${STATE.trip.travelers}</strong></div>
      <div><span>Budget</span><strong>${fmtINR(STATE.trip.budget)}</strong></div>
      <div><span>Transport</span><strong>${STATE.transportSelected? STATE.transportSelected.operator+' \u2014 '+fmtINR(transportCost()) : 'Not chosen'}</strong></div>
      <div><span>Stay</span><strong>${STATE.staySelected? STATE.staySelected.name+' \u2014 '+fmtINR(stayCost())+' total' : 'Not chosen'}</strong></div>
    </div>` : `<p class="muted">No trip set up yet.</p>`}
  </section>

  <section class="block">
    <div class="block-head"><h2>Account</h2></div>
    <div class="account-stub">
      <div class="account-row"><span>\ud83d\udc64</span><div><strong>${escapeHtml(user ? user.name : 'Traveller')}</strong><small>Signed-in traveller</small></div></div>
      <div class="account-row"><span>\u2709</span><div><strong>${escapeHtml(user ? user.email : '')}</strong><small>Saved locally on this device</small></div></div>
      <div class="account-row"><span>\ud83c\udf10</span> Language: <select id="langSel"><option>English</option><option>\u0939\u093f\u0928\u094d\u0926\u0940 (Hindi)</option><option>\u0985\u09b8\u09ae\u09c0\u09af\u09bc\u09be (Assamese)</option></select></div>
    </div>
  </section>

  <p class="footnote">AI Yatri \u2014 Smart India Hackathon prototype. Destinations researched manually for this demo (Guwahati, Shillong, Kaziranga). Transport & stay prices are sample data. Safety layer is illustrative and not sourced from a live NCRB/police feed.</p>`;
}

function wireProfile(){
  const nav = $('[data-nav="chat"]'); if(nav) nav.addEventListener('click', ()=>goScreen('chat'));
  const logoutButton = $('#logoutBtn'); if(logoutButton) logoutButton.addEventListener('click', logout);
}

/* ================= SHARED ================= */
function emptyState(title, body, cta, target){
  return `<div class="empty-state">
    <h2>${title}</h2><p>${body}</p>
    <button class="cta-btn" data-nav="${target}">${cta}</button>
  </div>`;
}

function wireScreen(screen){
  $all('[data-nav]').forEach(b=>{
    if (b.dataset.wired) return;
  });
  $all('[data-nav]').forEach(b=> b.addEventListener('click', ()=> goScreen(b.dataset.nav)));
  if (screen==='home') wireHome();
  if (screen==='itinerary') wireItinerary();
  if (screen==='map') wireMap();
  if (screen==='chat') wireChat();
  if (screen==='profile') wireProfile();
}

let toastTimer=null;
function toast(msg){
  let t = document.getElementById('toast');
  if (!t){ t = el(`<div id="toast" class="toast"></div>`); document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 2600);
}
