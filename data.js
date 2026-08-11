/* ============ AI YATRI — DESTINATION DATA (hackathon demo, manually researched) ============ */
const DESTINATIONS = {
  guwahati: {
    key: 'guwahati', name: 'Guwahati', state: 'Assam',
    tagline: 'Gateway to the Northeast, on the banks of the Brahmaputra',
    blurb: "Assam's largest city sits where the Brahmaputra widens into braided channels. It mixes riverine calm, hilltop shakti-temple pilgrimage, and the everyday hum of Northeast India's biggest trading hub.",
    nearestAirport: 'Lokpriya Gopinath Bordoloi Intl. Airport (GAU), ~20km from city',
    nearestRail: 'Guwahati Railway Station (GHY) / Kamakhya Junction',
    coords: {lat: 26.1445, lng: 91.7362},
    spots: [
      {id:'kamakhya', name:'Kamakhya Temple', tags:['spiritual','heritage'], image:'https://commons.wikimedia.org/wiki/Special:FilePath/Kamakhya%20Temple.jpg?width=1200', desc:'One of India\u2019s oldest Shakti Peethas, on Nilachal Hill overlooking the river. A living centre of Tantric worship for over a thousand years.', bestTime:'Weekday mornings, 6:00\u20138:00 AM', reason:'Queues build fast after 9 AM and on weekends; mornings are cooler for the hill climb.', duration:'2 hrs', fee:'Free \u00b7 special darshan ~\u20b9500'},
      {id:'umananda', name:'Umananda Island (Peacock Island)', tags:['relaxation','heritage','nature'], image:'https://commons.wikimedia.org/wiki/Special:FilePath/Umananda%20Temple.jpg?width=1200', desc:'A short ferry ride to the world\u2019s smallest inhabited river island, home to a Shiva temple and a resident troop of golden langurs.', bestTime:'Late afternoon, 4:00\u20136:00 PM', reason:'River breeze picks up before sunset; ferries run less frequently after dark.', duration:'1.5 hrs', fee:'Ferry ~\u20b930 return'},
      {id:'zoo', name:'Assam State Zoo cum Botanical Garden', tags:['nature','wildlife'], image:'https://commons.wikimedia.org/wiki/Special:FilePath/Indian%20rhinoceros%20at%20Kaziranga%20National%20Park.jpg?width=1200', desc:'One of India\u2019s larger zoos, with one-horned rhinos, tigers and a sprawling botanical section \u2014 a good primer before Kaziranga.', bestTime:'Weekday mornings, 9:00\u201311:00 AM', reason:'Avoids weekend family crowds and the midday heat that keeps animals hidden.', duration:'2\u20133 hrs', fee:'\u20b920 approx.'},
      {id:'cruise', name:'Brahmaputra Sunset Cruise', tags:['relaxation','nightlife'], image:'https://commons.wikimedia.org/wiki/Special:FilePath/Brahmaputra%20River%20in%20Assam.jpg?width=1200', desc:'A slow boat out onto Asia\u2019s widest river as the sky over the Nilachal hills turns marigold.', bestTime:'Evening, 5:00\u20137:00 PM', reason:'Timed to catch sunset over the river without the evening chill.', duration:'1.5 hrs', fee:'\u20b9300\u2013600 approx.'},
      {id:'sankardev', name:'Srimanta Sankardev Kalakshetra', tags:['culture','heritage'], image:'https://commons.wikimedia.org/wiki/Special:FilePath/Srimanta%20Sankardev%20Kalakshetra.jpg?width=1200', desc:'A cultural complex celebrating Assamese saint-reformer Srimanta Sankardev, with an art gallery, artificial hillock and craft village.', bestTime:'Daytime, 10:00 AM\u20134:00 PM', reason:'Indoor galleries make it a good midday, out-of-sun stop.', duration:'2 hrs', fee:'\u20b930 approx.'},
      {id:'basistha', name:'Basistha Ashram & Waterfall', tags:['nature','spiritual'], image:'https://commons.wikimedia.org/wiki/Special:FilePath/Basistha%20Temple%20Guwahati.jpg?width=1200', desc:'A quiet hillside hermitage on the city\u2019s edge, named for the sage Vasishtha, with a small waterfall and stream.', bestTime:'Morning, 7:00\u20139:00 AM', reason:'Peaceful before day-trippers arrive; birdsong is best at dawn.', duration:'1.5 hrs', fee:'Free'},
      {id:'fancybazaar', name:'Fancy Bazaar & Paltan Bazaar', tags:['food','nightlife'], image:'https://commons.wikimedia.org/wiki/Special:FilePath/Fancy%20Bazaar%20Guwahati.jpg?width=1200', desc:'The city\u2019s beating commercial heart \u2014 Assamese silk, spices, and street food stalls packed into narrow lanes.', bestTime:'Evening, 6:00\u20139:00 PM', reason:'Stalls light up and the market gets its best energy after office hours.', duration:'2 hrs', fee:'Free entry'},
    ],
    stays: [
      {name:'Brahmaputra Riverside Inn', type:'Mid-range hotel', rating:4.2, price:2800, distance:'1.2 km from Fancy Bazaar'},
      {name:'Nilachal Backpackers Homestay', type:'Homestay', rating:4.5, price:1100, distance:'2.8 km from Kamakhya'},
      {name:'GS Road Business Suites', type:'Business hotel', rating:4.0, price:3600, distance:'3 km from railway station'},
      {name:'Zoo Road Budget Stay', type:'Budget hotel', rating:3.8, price:1500, distance:'1 km from Assam State Zoo'},
      {name:'Riverfront Heritage Lodge', type:'Boutique hotel', rating:4.6, price:5200, distance:'0.5 km from river ghat'},
    ],
    localMobility: {
      buses: [{route:'City Bus 12', path:'Railway Station \u2194 Kamakhya Gate', fare:'\u20b915\u201325'}, {route:'City Bus 4', path:'Paltan Bazaar \u2194 Zoo Road', fare:'\u20b910\u201320'}],
      auto: 'Metered where available; otherwise negotiate before boarding \u2014 typical short hop \u20b950\u2013100.',
      cab: 'Ola & Uber both operate in Guwahati.',
      bestBooking: 'Avoid booking cabs 9:00\u20139:45 AM and 5:30\u20137:00 PM (office rush on GS Road); ferry/hill routes near Kamakhya get slow on weekend mornings.'
    },
    safety: {
      zones: [
        {area:'GS Road / Six Mile', level:'safer', note:'Well-lit, high footfall, frequent police patrol.'},
        {area:'Fancy Bazaar (late night)', level:'caution', note:'Very crowded market lanes; keep valuables secure after dark.'},
        {area:'River ghats after sunset', level:'caution', note:'Lower lighting near some ghat approaches; prefer daytime visits or go with a group.'},
      ],
      helplines: [{label:'Police', num:'100'},{label:'Women\u2019s Helpline (Assam)', num:'181'},{label:'National Emergency', num:'112'},{label:'Ambulance', num:'108'}],
      sourceNote: 'Illustrative demo overlay only \u2014 not live NCRB/state police data. In production this panel would pull district-level published statistics from data.gov.in / NCRB and the Assam Police open data portal.',
      lastUpdated: 'Demo data \u2014 not date-stamped to a real dataset'
    },
    culture: {
      cuisine: ['Assamese thali with khar & tenga', 'Masor tenga (tangy fish curry)', 'Duck curry with black sesame', 'Pitha (rice cakes) around Bihu season', 'Assam orthodox tea, best had riverside'],
      heritage: ['Kamakhya Temple (Shakti Peetha)', 'Ugratara Temple', 'Guwahati Planetarium, Pandu', 'Guwahati War Cemetery'],
      markets: ['Fancy Bazaar \u2014 silk & spices', 'Paltan Bazaar \u2014 everyday shopping', 'Zoo Road \u2014 street food'],
      festivals: [{name:'Bohag Bihu', when:'Mid-April', note:'Assamese New Year \u2014 the biggest festival, with dance, feasting and folk music citywide.'}, {name:'Ambubachi Mela', when:'Mid-June', note:'A major Tantric fair at Kamakhya Temple drawing pilgrims from across India.'}]
    }
  },

  shillong: {
    key: 'shillong', name: 'Shillong', state: 'Meghalaya',
    tagline: 'The Scotland of the East \u2014 pine hills, waterfalls and living root bridges',
    blurb: "Meghalaya's capital sits at 1,500m in the Khasi Hills, ringed by pine forest, lakes and some of the wettest country on earth just a short drive south.",
    nearestAirport: 'No airport in Shillong itself \u2014 fly into Guwahati (GAU), then ~3 hr road transfer',
    nearestRail: 'No rail line to Shillong \u2014 nearest station is Guwahati',
    coords: {lat: 25.5788, lng: 91.8933},
    spots: [
      {id:'wardslake', name:"Ward's Lake", tags:['relaxation','nature'], image:'https://commons.wikimedia.org/wiki/Special:FilePath/Wards%20Lake%20Shillong.jpg?width=1200', desc:'A horseshoe-shaped lake in the city centre with a Victorian-style garden and paddle boats.', bestTime:'Morning, 8:00\u201310:00 AM', reason:'Mist over the water is prettiest early; gets busy with joggers and families by mid-morning.', duration:'1 hr', fee:'\u20b920 approx.'},
      {id:'elephantfalls', name:'Elephant Falls', tags:['nature','adventure'], image:'https://commons.wikimedia.org/wiki/Special:FilePath/Elephant%20Falls%20Shillong.jpg?width=1200', desc:'A three-tiered waterfall a short drive from the city, reached by a short forested stairway.', bestTime:'Weekday mornings before 10 AM', reason:'Waterfall flow and light are best before midday tour buses arrive.', duration:'1.5 hrs', fee:'\u20b930 approx.'},
      {id:'shillongpeak', name:'Shillong Peak', tags:['nature','adventure'], image:'https://commons.wikimedia.org/wiki/Special:FilePath/Shillong%20Peak.jpg?width=1200', desc:'The highest point around the city, with a sweeping view over the whole Khasi plateau.', bestTime:'Late afternoon, clear days only', reason:'Cloud cover often rolls in by late morning \u2014 check visibility before heading up.', duration:'1 hr', fee:'\u20b910 approx. (permit at entry)'},
      {id:'donbosco', name:'Don Bosco Centre for Indigenous Cultures', tags:['culture','heritage'], image:'https://commons.wikimedia.org/wiki/Special:FilePath/Don%20Bosco%20Museum%20Shillong.jpg?width=1200', desc:'A seven-storey museum on the tribal cultures of Northeast India, with a rooftop view over Shillong.', bestTime:'Any day, 9:00 AM\u20135:00 PM', reason:'Indoor \u2014 a good rainy-day plan B, which matters here.', duration:'2\u20133 hrs', fee:'\u20b9100 approx.'},
      {id:'livingroot', name:'Cherrapunji Living Root Bridges (day trip)', tags:['adventure','nature'], image:'https://commons.wikimedia.org/wiki/Special:FilePath/Double%20Decker%20Living%20Root%20Bridge.jpg?width=1200', desc:'Double-decker root bridges hand-grown by the Khasi over generations, reached by a steep forest trek near Nongriat.', bestTime:'Start by 7:00 AM', reason:'The trek down (and back up) 3,000+ steps is best done before the heat and afternoon rain.', duration:'Full day', fee:'Village entry fees vary, \u20b950\u2013100'},
      {id:'policebazar', name:'Police Bazar & Iewduh (Bara Bazar)', tags:['food','nightlife'], image:'https://commons.wikimedia.org/wiki/Special:FilePath/Police%20Bazar%20Shillong.jpg?width=1200', desc:'Shillong\u2019s commercial hub and one of Northeast India\u2019s largest traditional markets.', bestTime:'Evening for Police Bazar, morning for Iewduh', reason:'Iewduh trading peaks early morning; Police Bazar cafes come alive after dusk.', duration:'2 hrs', fee:'Free entry'},
    ],
    stays: [
      {name:'Laitumkhrah Pine Cottage', type:'Boutique homestay', rating:4.6, price:2400, distance:'2 km from Ward\u2019s Lake'},
      {name:'Police Bazar City Hotel', type:'Mid-range hotel', rating:4.1, price:2600, distance:'0.3 km from Police Bazar'},
      {name:'Shillong Peak View Resort', type:'Resort', rating:4.4, price:4800, distance:'5 km from city centre'},
      {name:'Khasi Hills Budget Inn', type:'Budget hotel', rating:3.7, price:1200, distance:'1.5 km from Police Bazar'},
    ],
    localMobility: {
      buses: [{route:'Shared Sumo/taxi routes', path:'Police Bazar \u2194 most neighbourhoods', fare:'\u20b915\u201330 shared'}],
      auto: 'Few autos \u2014 city runs mostly on shared taxis (Sumo/Bolero) with fixed short hops.',
      cab: 'App cabs limited; local taxi unions run point-to-point routes from Police Bazar.',
      bestBooking: 'Book Cherrapunji/root-bridge day trips the evening before \u2014 taxis fill up fast; avoid Police Bazar taxi stand 5:30\u20136:30 PM (peak local rush).'
    },
    safety: {
      zones: [
        {area:'Police Bazar (daytime)', level:'safer', note:'Busy, well-patrolled commercial centre.'},
        {area:'Cherrapunji root-bridge trek routes', level:'caution', note:'Remote forest trail \u2014 go with a local guide, avoid after dark or in heavy rain.'},
        {area:'Shillong Peak road after sunset', level:'caution', note:'Low visibility on hill roads once fog sets in.'},
      ],
      helplines: [{label:'Police', num:'100'},{label:'Women\u2019s Helpline', num:'1091'},{label:'National Emergency', num:'112'},{label:'Ambulance', num:'108'}],
      sourceNote: 'Illustrative demo overlay only \u2014 not live NCRB/state police data. In production this panel would pull district-level published statistics from data.gov.in / NCRB and the Meghalaya Police open data portal.',
      lastUpdated: 'Demo data \u2014 not date-stamped to a real dataset'
    },
    culture: {
      cuisine: ['Jadoh (Khasi rice & pork/meat dish)', 'Tungrymbai (fermented soybean)', 'Smoked pork with bamboo shoot', 'Local Khasi rice beer, kyat', 'Cafes around Police Bazar for continental-Khasi fusion'],
      heritage: ['Ward\u2019s Lake & Lady Hydari Park', 'Don Bosco Museum', 'Living Root Bridges, Nongriat'],
      markets: ['Police Bazar', 'Iewduh (Bara Bazar) \u2014 one of NE India\u2019s largest markets', 'Laitumkhrah local shops'],
      festivals: [{name:'Ka Pomblang Nongkrem', when:'Usually November', note:'A major Khasi harvest thanksgiving festival with ritual dance near Smit village.'}, {name:'Shillong Cherry Blossom Festival', when:'Mid-November', note:'City-wide music and cherry blossom celebration.'}]
    }
  },

  kaziranga: {
    key: 'kaziranga', name: 'Kaziranga', state: 'Assam',
    tagline: 'Home to two-thirds of the world\u2019s one-horned rhinos',
    blurb: 'A UNESCO World Heritage grassland-and-forest park along the Brahmaputra floodplain, built around one animal above all: the great Indian one-horned rhinoceros.',
    nearestAirport: 'Jorhat Airport (JRH), ~97 km \u2014 or Guwahati (GAU), ~217 km',
    nearestRail: 'Furkating Junction, ~75 km from the park',
    coords: {lat: 26.5775, lng: 93.1714},
    spots: [
      {id:'centralsafari', name:'Central Range Jeep Safari (Kohora)', tags:['wildlife','adventure'], image:'https://commons.wikimedia.org/wiki/Special:FilePath/Kaziranga%20National%20Park.jpg?width=1200', desc:'The park\u2019s classic safari zone \u2014 tall elephant grass, waterholes and the best odds of a rhino sighting.', bestTime:'6:30\u20138:30 AM', reason:'Animals feed near waterholes at dawn before retreating into tall grass as it warms up.', duration:'2.5 hrs', fee:'~\u20b9650 (Indian) + camera & vehicle fees'},
      {id:'elephantsafari', name:'Elephant-back Safari', tags:['wildlife','adventure'], image:'https://commons.wikimedia.org/wiki/Special:FilePath/Elephant%20safari%20in%20Kaziranga.jpg?width=1200', desc:'A slower, closer approach into the grassland on elephant-back, departing before sunrise.', bestTime:'5:30\u20136:30 AM', reason:'Only offered at first light; grass is easier to move through and animals are less wary of elephants.', duration:'1 hr', fee:'~\u20b9700 approx.'},
      {id:'bagori', name:'Western Range (Bagori)', tags:['wildlife'], image:'https://commons.wikimedia.org/wiki/Special:FilePath/One-horned%20rhinoceros%20in%20Kaziranga.jpg?width=1200', desc:'A second safari zone with a high density of rhinos, closer to the wetlands.', bestTime:'Afternoon, 2:00\u20134:00 PM', reason:'A good second safari slot on the same day, when Central Range permits are full.', duration:'2 hrs', fee:'~\u20b9650 approx.'},
      {id:'agaratoli', name:'Eastern Range (Agaratoli)', tags:['wildlife','nature'], image:'https://commons.wikimedia.org/wiki/Special:FilePath/Kaziranga%20wetland.jpg?width=1200', desc:'Known for birdlife \u2014 storks, pelicans and migratory waterfowl alongside rhino and wild buffalo.', bestTime:'Early morning', reason:'Bird activity peaks at dawn before the heat sets in.', duration:'2.5 hrs', fee:'~\u20b9650 approx.'},
      {id:'orchidpark', name:'Kaziranga Orchid & Biodiversity Park', tags:['nature','relaxation'], image:'https://commons.wikimedia.org/wiki/Special:FilePath/Kaziranga%20Orchid%20Park.jpg?width=1200', desc:'A cultivated park showcasing Northeast India\u2019s orchids alongside a small tribal-life museum.', bestTime:'Late afternoon', reason:'A relaxed, low-heat activity to fill the gap between morning and evening safaris.', duration:'1.5 hrs', fee:'\u20b950 approx.'},
      {id:'teagarden', name:'Local Tea Garden Visit', tags:['culture','relaxation'], image:'https://commons.wikimedia.org/wiki/Special:FilePath/Tea%20garden%20in%20Assam.jpg?width=1200', desc:'A working Assam tea estate near the park boundary, with tastings and a look at the plucking and withering process.', bestTime:'Mid-morning', reason:'Estates are most active and cool enough to walk through mid-morning.', duration:'1.5 hrs', fee:'\u20b9100\u2013200 approx.'},
    ],
    stays: [
      {name:'Kohora Forest Edge Resort', type:'Resort', rating:4.5, price:4200, distance:'0.8 km from Central Range gate'},
      {name:'Kaziranga Riverside Camp', type:'Eco-camp / tents', rating:4.3, price:2600, distance:'3 km from park entrance'},
      {name:'Bagori Village Homestay', type:'Homestay', rating:4.4, price:1400, distance:'1 km from Bagori Range'},
      {name:'National Highway Budget Lodge', type:'Budget hotel', rating:3.6, price:1000, distance:'2 km from Kohora'},
    ],
    localMobility: {
      buses: [{route:'ASTC highway bus', path:'Guwahati / Jorhat \u2194 Kohora (NH37)', fare:'\u20b9150\u2013300'}],
      auto: 'Very few autos here \u2014 most movement is by pre-booked jeep (also used for safaris) or resort transfer.',
      cab: 'Limited app-cab coverage; hotels typically arrange safari jeeps and transfers directly.',
      bestBooking: 'Book safari permits and jeeps the evening before \u2014 Central Range morning slots sell out first, especially in peak season (Nov\u2013Apr).'
    },
    safety: {
      zones: [
        {area:'Kohora main road', level:'safer', note:'Well-travelled highway strip with resorts, forest office and eateries.'},
        {area:'Park buffer / village edges after dark', level:'caution', note:'Wild elephant movement is a real risk near forest edges at night \u2014 follow forest department guidance, avoid walking after dusk.'},
        {area:'Riverside / floodplain areas in monsoon', level:'caution', note:'Seasonal flooding closes some park roads June\u2013September.'},
      ],
      helplines: [{label:'Forest Dept. Control Room', num:'Contact via park office'},{label:'Police', num:'100'},{label:'National Emergency', num:'112'},{label:'Ambulance', num:'108'}],
      sourceNote: 'Illustrative demo overlay only \u2014 not live NCRB/state police data. Wildlife-safety notes reflect general Kaziranga forest-department guidance, not a live feed.',
      lastUpdated: 'Demo data \u2014 not date-stamped to a real dataset'
    },
    culture: {
      cuisine: ['Assamese/Mishing tribal thali', 'Fresh river fish curry', 'Estate-fresh Assam tea', 'Rice beer (apong) in nearby villages'],
      heritage: ['Kaziranga National Park (UNESCO World Heritage Site)', 'Nearby Mishing tribal villages on stilts'],
      markets: ['Kohora roadside handloom & handicraft stalls', 'Local tea-estate shops'],
      festivals: [{name:'Kaziranga Elephant Festival', when:'Around February', note:'Conservation-themed celebration with cultural performances near the park.'}, {name:'Bohag Bihu', when:'Mid-April', note:'Celebrated across surrounding Assamese villages.'}]
    }
  }
};

const FROM_CITIES = ['Delhi','Mumbai','Kolkata','Bengaluru','Chennai','Hyderabad','Guwahati'];

/* Mock transport generator \u2014 deterministic "random" from strings so it's stable per session */
function seedRand(seed){ let h=0; for(let i=0;i<seed.length;i++){h=Math.imul(31,h)+seed.charCodeAt(i)|0;} return function(){ h = Math.imul(48271, h) | 0 % 2147483647; return ((h>>>0)/4294967295); }; }

function mockTransport(fromCity, destKey){
  const rnd = seedRand(fromCity+destKey);
  const far = !['guwahati'].includes(destKey) ; // shillong/kaziranga need connecting leg
  const base = 2200 + Math.floor(rnd()*2600);
  const flights = fromCity==='Guwahati' ? [] : [
    {id:'fl1', mode:'flight', operator:'IndiGo', bookingUrl:'https://www.goindigo.in/', from:fromCity, to:'Guwahati (GAU)'+(destKey!=='guwahati'?' + road transfer':''), duration: (2+Math.round(rnd()*2))+'h '+Math.floor(rnd()*59)+'m', price: base + Math.floor(rnd()*1500), stops:'Non-stop'},
    {id:'fl2', mode:'flight', operator:'Air India', bookingUrl:'https://www.airindia.com/', from:fromCity, to:'Guwahati (GAU)'+(destKey!=='guwahati'?' + road transfer':''), duration: (3+Math.round(rnd()*2))+'h '+Math.floor(rnd()*59)+'m', price: base + 800 + Math.floor(rnd()*1200), stops: rnd()>0.5?'Non-stop':'1 stop'},
    {id:'fl3', mode:'flight', operator:'SpiceJet', bookingUrl:'https://www.spicejet.com/', from:fromCity, to:'Guwahati (GAU)'+(destKey!=='guwahati'?' + road transfer':''), duration: (2+Math.round(rnd()*3))+'h '+Math.floor(rnd()*59)+'m', price: base - 400 + Math.floor(rnd()*900), stops:'Non-stop'},
  ];
  const trains = [
    {id:'tr1', mode:'train', operator:'Rajdhani Express', bookingUrl:'https://www.irctc.co.in/nget/train-search', from:fromCity, to:'Guwahati Jn.'+(destKey!=='guwahati'?' + road transfer':''), duration: (20+Math.round(rnd()*10))+'h', price: 1400+Math.floor(rnd()*1200), stops:'3AC/2AC'},
    {id:'tr2', mode:'train', operator:'Northeast Express', bookingUrl:'https://www.irctc.co.in/nget/train-search', from:fromCity, to:'Kamakhya Jn.'+(destKey!=='guwahati'?' + road transfer':''), duration: (28+Math.round(rnd()*12))+'h', price: 900+Math.floor(rnd()*900), stops:'Sleeper/3AC'},
  ];
  const buses = fromCity==='Kolkata'||fromCity==='Guwahati' ? [
    {id:'bs1', mode:'bus', operator:'ASTC Volvo', from:fromCity, to: destKey==='guwahati'?'Guwahati':'Kohora/Shillong via Guwahati', duration: fromCity==='Guwahati' ? (3+Math.round(rnd()*2))+'h' : (16+Math.round(rnd()*4))+'h', price: fromCity==='Guwahati'? 250+Math.floor(rnd()*250) : 1100+Math.floor(rnd()*500), stops:'AC sleeper'},
  ] : [];
  return {flights, trains, buses};
}
