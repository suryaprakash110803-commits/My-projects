import { useEffect, useMemo, useRef, useState } from 'react';

const USER = { name: 'Alex Morgan', email: 'alex.morgan@example.com', phone: '(555) 014-2810' };
const CATEGORIES = ['All causes', 'Environment', 'Education', 'Health', 'Animal Welfare'];
const STORAGE_KEY = 'helpinghands-hub-state-v1';

const driveTemplates = [
  {
    id: 'tree-planting', title: 'Urban Tree Plantation Drive', organization: 'GreenEarth Brigade',
    category: 'Environment', date: '2026-11-21', location: 'Cedar Grove Park', neighborhood: 'Northside',
    hours: 4, emoji: '🌱', color: 'mint', goal: 'Plant 300 native saplings and make our neighborhood cooler, greener, and healthier.',
    description: 'Help prepare planting beds, place young native trees, and add protective mulch. No gardening experience needed; tools and a short orientation are provided.',
    shifts: [
      { id: 'tree-morning', period: 'Morning', time: '8:00 AM – 12:00 PM', capacity: 10 },
      { id: 'tree-afternoon', period: 'Afternoon', time: '1:00 PM – 5:00 PM', capacity: 10 },
      { id: 'tree-evening', period: 'Evening', time: '5:30 PM – 9:30 PM', capacity: 10 },
    ],
  },
  {
    id: 'community-pantry', title: 'Community Pantry Packing Day', organization: 'City Food Bank',
    category: 'Health', date: '2026-11-22', location: 'Central Community Kitchen', neighborhood: 'Downtown',
    hours: 3.5, emoji: '🥕', color: 'peach', goal: 'Pack 500 fresh-food boxes for families across the city.',
    description: 'Sort donated produce, pack balanced pantry boxes, and prepare deliveries for local families. Tasks can be done seated or standing.',
    shifts: [
      { id: 'pantry-morning', period: 'Morning', time: '8:30 AM – 12:00 PM', capacity: 10 },
      { id: 'pantry-afternoon', period: 'Afternoon', time: '12:30 PM – 4:00 PM', capacity: 10 },
      { id: 'pantry-evening', period: 'Evening', time: '4:30 PM – 8:00 PM', capacity: 10 },
    ],
  },
  {
    id: 'reading-buddies', title: 'Weekend Reading Buddies', organization: 'YouthMinds Tutoring',
    category: 'Education', date: '2026-11-22', location: 'Maple Street Learning Center', neighborhood: 'East End',
    hours: 2.5, emoji: '📚', color: 'lavender', goal: 'Give 24 young readers a little extra confidence and one-on-one attention.',
    description: 'Read together, play word games, and encourage elementary-age students. Volunteers are paired with a student and receive activity ideas.',
    shifts: [
      { id: 'reading-morning', period: 'Morning', time: '9:00 AM – 11:30 AM', capacity: 10 },
      { id: 'reading-afternoon', period: 'Afternoon', time: '1:00 PM – 3:30 PM', capacity: 10 },
    ],
  },
  {
    id: 'adoption-open-house', title: 'Paws & People Adoption Open House', organization: 'PawsRescue Shelter',
    category: 'Animal Welfare', date: '2026-11-28', location: 'PawsRescue Community Shelter', neighborhood: 'Westside',
    hours: 3, emoji: '🐾', color: 'rose', goal: 'Help 15 rescue pets meet the people who could become their forever families.',
    description: 'Welcome visitors, share each pet’s story, refresh water bowls, and help keep the adoption space calm. Animal-handling guidance is provided.',
    shifts: [
      { id: 'paws-morning', period: 'Morning', time: '9:00 AM – 12:00 PM', capacity: 10 },
      { id: 'paws-afternoon', period: 'Afternoon', time: '1:00 PM – 4:00 PM', capacity: 10 },
    ],
  },
  {
    id: 'river-cleanup', title: 'Riverside Clean-up & Nature Walk', organization: 'GreenEarth Brigade',
    category: 'Environment', date: '2026-11-29', location: 'Willowbend River Trail', neighborhood: 'Riverside',
    hours: 3, emoji: '🌳', color: 'mint', goal: 'Clear litter from two miles of riverbank and protect local wildlife.',
    description: 'Team up for a guided litter pick along the river. Gloves, bags, water, and a quick safety briefing are included.',
    shifts: [
      { id: 'river-morning', period: 'Morning', time: '8:00 AM – 11:00 AM', capacity: 10 },
      { id: 'river-afternoon', period: 'Afternoon', time: '12:00 PM – 3:00 PM', capacity: 10 },
      { id: 'river-evening', period: 'Evening', time: '3:30 PM – 6:30 PM', capacity: 10 },
    ],
  },
  {
    id: 'wellness-kits', title: 'Neighborhood Wellness Kit Assembly', organization: 'City Food Bank',
    category: 'Health', date: '2026-12-05', location: 'Central Community Kitchen', neighborhood: 'Downtown',
    hours: 3, emoji: '💛', color: 'peach', goal: 'Put together 200 practical care kits for neighborhood outreach teams.',
    description: 'Assemble personal-care kits, add handwritten welcome notes, and organize supplies for next week’s outreach.',
    shifts: [
      { id: 'wellness-morning', period: 'Morning', time: '9:00 AM – 12:00 PM', capacity: 10 },
      { id: 'wellness-afternoon', period: 'Afternoon', time: '1:00 PM – 4:00 PM', capacity: 10 },
      { id: 'wellness-evening', period: 'Evening', time: '4:30 PM – 7:30 PM', capacity: 10 },
    ],
  },
  {
    id: 'homework-club', title: 'Homework Club: Math & More', organization: 'YouthMinds Tutoring',
    category: 'Education', date: '2026-12-06', location: 'Maple Street Learning Center', neighborhood: 'East End',
    hours: 2, emoji: '✏️', color: 'lavender', goal: 'Make after-school learning welcoming for 18 middle-school students.',
    description: 'Support students with homework, study habits, and confidence. Bring your curiosity; the center supplies learning materials.',
    shifts: [
      { id: 'homework-morning', period: 'Morning', time: '9:30 AM – 11:30 AM', capacity: 10 },
      { id: 'homework-afternoon', period: 'Afternoon', time: '1:00 PM – 3:00 PM', capacity: 10 },
    ],
  },
  {
    id: 'shelter-enrichment', title: 'Shelter Enrichment Morning', organization: 'PawsRescue Shelter',
    category: 'Animal Welfare', date: '2026-12-12', location: 'PawsRescue Community Shelter', neighborhood: 'Westside',
    hours: 2.5, emoji: '🐕', color: 'rose', goal: 'Bring comfort and play to shelter pets waiting for their homes.',
    description: 'Prepare enrichment toys, spend time with cats, or take a dog on a supervised walk. A shelter team member will guide every activity.',
    shifts: [
      { id: 'shelter-morning', period: 'Morning', time: '9:00 AM – 11:30 AM', capacity: 10 },
      { id: 'shelter-afternoon', period: 'Afternoon', time: '12:30 PM – 3:00 PM', capacity: 10 },
    ],
  },
];

const sampleVolunteers = [
  ['Jordan Lee', 'jordan.lee@example.com'], ['Samira Patel', 'samira.patel@example.com'],
  ['Noah Brooks', 'noah.brooks@example.com'], ['Maya Chen', 'maya.chen@example.com'],
  ['Riley Thompson', 'riley.thompson@example.com'], ['Ava Williams', 'ava.williams@example.com'],
  ['Ethan Rivera', 'ethan.rivera@example.com'], ['Priya Shah', 'priya.shah@example.com'],
  ['Lucas Martin', 'lucas.martin@example.com'], ['Zoe Kim', 'zoe.kim@example.com'],
  ['Amir Hassan', 'amir.hassan@example.com'], ['Isabella Garcia', 'isabella.garcia@example.com'],
  ['Theo Nguyen', 'theo.nguyen@example.com'], ['Grace Wilson', 'grace.wilson@example.com'],
  ['Mateo Davis', 'mateo.davis@example.com'], ['Nina Kapoor', 'nina.kapoor@example.com'],
  ['Owen Clarke', 'owen.clarke@example.com'], ['Layla Robinson', 'layla.robinson@example.com'],
  ['Finn Cooper', 'finn.cooper@example.com'], ['Elena Torres', 'elena.torres@example.com'],
  ['Kai Bennett', 'kai.bennett@example.com'], ['Sofia Reed', 'sofia.reed@example.com'],
  ['Arjun Mehta', 'arjun.mehta@example.com'], ['Chloe Baker', 'chloe.baker@example.com'],
  ['Gabriel Flores', 'gabriel.flores@example.com'], ['Harper Evans', 'harper.evans@example.com'],
  ['Leo Murphy', 'leo.murphy@example.com'], ['Anika Das', 'anika.das@example.com'],
  ['Miles Foster', 'miles.foster@example.com'], ['Sara Ahmed', 'sara.ahmed@example.com'],
  ['Dylan Price', 'dylan.price@example.com'], ['Mei Lin', 'mei.lin@example.com'],
  ['Aiden Scott', 'aiden.scott@example.com'], ['Fatima Ali', 'fatima.ali@example.com'],
  ['Ruby James', 'ruby.james@example.com'],
];

function makeSeedState() {
  let volunteerIndex = 0;
  const drives = driveTemplates.map((drive) => ({
    ...drive,
    shifts: drive.shifts.map((shift) => ({ ...shift, volunteers: [] })),
  }));
  // Seed 35 registrations across the 20 shifts, leaving room for the live demo.
  drives.forEach((drive, driveIndex) => drive.shifts.forEach((shift, shiftIndex) => {
    const count = volunteerIndex < sampleVolunteers.length ? (driveIndex === 0 && shiftIndex === 0 ? 6 : 2) : 0;
    for (let i = 0; i < count && volunteerIndex < sampleVolunteers.length; i += 1) {
      const [name, email] = sampleVolunteers[volunteerIndex];
      shift.volunteers.push({ name, email, phone: `(555) 01${String(volunteerIndex + 10).padStart(2, '0')}-2840`, attended: volunteerIndex === 0 || volunteerIndex === 2 });
      volunteerIndex += 1;
    }
  }));
  return {
    drives,
    interests: ['Environment', 'Education'],
    pastAttendance: [{ id: 'past-park-day', title: 'Neighborhood Park Restoration', date: '2026-11-14', hours: 4, category: 'Environment' }],
  };
}

function readSavedState() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : makeSeedState();
  } catch {
    return makeSeedState();
  }
}

function formatDate(dateString, options = { weekday: 'short', month: 'short', day: 'numeric' }) {
  return new Intl.DateTimeFormat('en', options).format(new Date(`${dateString}T12:00:00`));
}

function getMatchPercent(drive, interests) {
  const union = new Set([drive.category, ...interests]);
  if (!union.size) return 0;
  return Math.round((interests.includes(drive.category) ? 1 : 0) / union.size * 100);
}

function totalRegistrations(drives) {
  return drives.reduce((sum, drive) => sum + drive.shifts.reduce((shiftSum, shift) => shiftSum + shift.volunteers.length, 0), 0);
}

function App() {
  const [state, setState] = useState(readSavedState);
  const stateRef = useRef(state);
  stateRef.current = state;
  const [page, setPage] = useState('Dashboard');
  const [activeCategory, setActiveCategory] = useState('All causes');
  const [query, setQuery] = useState('');
  const [matchOnly, setMatchOnly] = useState(false);
  const [selectedDriveId, setSelectedDriveId] = useState(null);
  const [organizerDriveId, setOrganizerDriveId] = useState('tree-planting');
  const [toast, setToast] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const { drives, interests, pastAttendance } = state;
  const selectedDrive = drives.find((drive) => drive.id === selectedDriveId);
  const organizerDrive = drives.find((drive) => drive.id === organizerDriveId) || drives[0];
  const mySignups = drives.flatMap((drive) => drive.shifts.flatMap((shift) =>
    shift.volunteers.filter((volunteer) => volunteer.email === USER.email).map((volunteer) => ({ drive, shift, volunteer })),
  ));
  const verifiedHours = pastAttendance.reduce((sum, record) => sum + record.hours, 0) + mySignups.reduce((sum, signup) => sum + (signup.volunteer.attended ? signup.drive.hours : 0), 0);
  const completedDrives = pastAttendance.length + new Set(mySignups.filter(({ volunteer }) => volunteer.attended).map(({ drive }) => drive.id)).size;
  const openSlots = drives.reduce((sum, drive) => sum + drive.shifts.reduce((shiftSum, shift) => shiftSum + Math.max(0, shift.capacity - shift.volunteers.length), 0), 0);
  const myDriveIds = new Set(mySignups.map(({ drive }) => drive.id));

  const visibleDrives = useMemo(() => drives.filter((drive) => {
    const matchesCategory = activeCategory === 'All causes' || drive.category === activeCategory;
    const matchesQuery = !query || `${drive.title} ${drive.organization} ${drive.location} ${drive.category}`.toLowerCase().includes(query.toLowerCase());
    const matchesInterest = !matchOnly || interests.includes(drive.category);
    return matchesCategory && matchesQuery && matchesInterest;
  }).sort((a, b) => getMatchPercent(b, interests) - getMatchPercent(a, interests) || a.date.localeCompare(b.date)), [drives, activeCategory, query, matchOnly, interests]);

  function updateInterests(category) {
    setState((current) => {
      const next = current.interests.includes(category)
        ? current.interests.filter((item) => item !== category)
        : [...current.interests, category];
      return { ...current, interests: next };
    });
  }

  function signUp(driveId, shiftId) {
    const current = stateRef.current;
    const drive = current.drives.find((item) => item.id === driveId);
    const shift = drive?.shifts.find((item) => item.id === shiftId);
    if (!drive || !shift) return;
    if (drive.shifts.some((candidate) => candidate.volunteers.some((volunteer) => volunteer.email === USER.email))) {
      setToast('You already have a spot in this drive.');
      return;
    }
    if (shift.volunteers.length >= shift.capacity) {
      setToast('Sorry, this shift just filled up.');
      return;
    }
    const next = {
      ...current,
      drives: current.drives.map((item) => item.id !== driveId ? item : {
        ...item,
        shifts: item.shifts.map((candidate) => candidate.id !== shiftId ? candidate : {
          ...candidate,
          volunteers: [...candidate.volunteers, { ...USER, attended: false }],
        }),
      }),
    };
    stateRef.current = next;
    setState(next);
    setToast('You’re on the list! Your spot is saved.');
    setSelectedDriveId(null);
  }

  function toggleAttendance(driveId, shiftId, email) {
    const current = stateRef.current;
    const next = {
      ...current,
      drives: current.drives.map((drive) => drive.id !== driveId ? drive : {
        ...drive,
        shifts: drive.shifts.map((shift) => shift.id !== shiftId ? shift : {
          ...shift,
          volunteers: shift.volunteers.map((volunteer) => volunteer.email !== email ? volunteer : { ...volunteer, attended: !volunteer.attended }),
        }),
      }),
    };
    stateRef.current = next;
    setState(next);
  }

  function goToExplore(onlyMatches = false) {
    setPage('Explore drives');
    setMatchOnly(onlyMatches);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const pageLabel = page === 'Dashboard' ? 'Your community dashboard' : page;

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setPage('Dashboard')} aria-label="HelpingHands Hub home">
          <span className="brand-mark" aria-hidden="true">✳</span>
          <span className="brand-copy"><strong>HelpingHands</strong><small>HUB</small></span>
        </button>
        <nav className="main-nav" aria-label="Main navigation">
          {['Dashboard', 'Explore drives', 'My impact', 'Organizer'].map((item) => (
            <button key={item} className={`nav-link ${page === item ? 'active' : ''}`} onClick={() => setPage(item)}>{item}</button>
          ))}
        </nav>
        <button className="profile-button" onClick={() => setPage('My impact')} aria-label={`Open ${USER.name}'s profile`}>
          <span className="avatar">AM</span><span className="profile-name">{USER.name}</span><span className="chevron">⌄</span>
        </button>
      </header>

      <main className="page-wrap">
        <div className="page-heading">
          <div><p className="eyebrow">YOUR NEIGHBORHOOD, A LITTLE BRIGHTER</p><h1>{pageLabel}</h1></div>
          <div className="date-pill"><span>◷</span> Saturday, November 21</div>
        </div>

        {page === 'Dashboard' && <DashboardPage
          drives={drives} interests={interests} mySignups={mySignups} verifiedHours={verifiedHours}
          completedDrives={completedDrives} openSlots={openSlots} myDriveIds={myDriveIds}
          onExplore={goToExplore} onOpenDrive={setSelectedDriveId} onToggleInterest={updateInterests}
        />}
        {page === 'Explore drives' && <ExplorePage
          drives={visibleDrives} allDrives={drives} interests={interests} activeCategory={activeCategory}
          setActiveCategory={setActiveCategory} query={query} setQuery={setQuery} matchOnly={matchOnly}
          setMatchOnly={setMatchOnly} myDriveIds={myDriveIds} mySignups={mySignups} onOpenDrive={setSelectedDriveId}
        />}
        {page === 'My impact' && <ImpactPage
          pastAttendance={pastAttendance} mySignups={mySignups} verifiedHours={verifiedHours} completedDrives={completedDrives}
          onOpenCertificate={() => setShowCertificate(true)} onExplore={goToExplore}
        />}
        {page === 'Organizer' && <OrganizerPage
          drives={drives} selectedDrive={organizerDrive} selectedDriveId={organizerDriveId}
          onSelectDrive={setOrganizerDriveId} onToggleAttendance={toggleAttendance}
        />}
      </main>

      <footer className="site-footer"><span>HelpingHands Hub</span><span>Good things grow when we do them together.</span><span>{totalRegistrations(drives)} neighbors signed up</span></footer>

      {selectedDrive && <DriveModal drive={selectedDrive} user={USER} onClose={() => setSelectedDriveId(null)} onSignUp={signUp} />}
      {showCertificate && <CertificateModal user={USER} hours={verifiedHours} completedDrives={completedDrives} onClose={() => setShowCertificate(false)} />}
      {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
    </div>
  );
}

function DashboardPage({ drives, interests, mySignups, verifiedHours, completedDrives, openSlots, myDriveIds, onExplore, onOpenDrive, onToggleInterest }) {
  const featured = drives.find((drive) => drive.id === 'tree-planting');
  const recommended = [...drives].filter((drive) => interests.includes(drive.category)).sort((a, b) => getMatchPercent(b, interests) - getMatchPercent(a, interests))[0];
  const upcoming = mySignups.filter(({ drive, volunteer }) => !volunteer.attended && drive.date >= '2026-11-18').sort((a, b) => a.drive.date.localeCompare(b.drive.date));
  return (
    <>
      <section className="hero-card">
        <div className="hero-copy">
          <span className="hero-kicker"><span className="sparkle">✦</span> SMALL ACTS. BIG CHANGE.</span>
          <h2>Make time for<br /><em>good things.</em></h2>
          <p>Find a local way to help, meet your neighbors, and see the difference your time makes.</p>
          <div className="hero-actions"><button className="button button-dark" onClick={() => onExplore(false)}>Find a volunteer shift <span>↗</span></button><button className="text-button" onClick={() => onExplore(true)}>See my matches <span>→</span></button></div>
        </div>
        <div className="hero-art" aria-label="Illustration of a hand holding a growing plant" role="img">
          <span className="sun-orbit" /><span className="art-sun">☼</span><span className="art-cloud cloud-one">· · ·</span><span className="art-cloud cloud-two">· ·</span>
          <div className="plant-pot"><span className="plant-stem" /><span className="plant-leaf leaf-left">◖</span><span className="plant-leaf leaf-right">◗</span><span className="pot">▰</span><span className="hand">⌣</span></div>
          <span className="art-note">good grows here</span>
          <span className="art-badge"><span>✿</span> YOUR KIND OF<br />COMMUNITY</span>
        </div>
        <div className="hero-index"><span>01</span><i /></div>
      </section>

      <section className="stats-grid" aria-label="Your volunteering at a glance">
        <StatCard label="Hours given" value={`${verifiedHours}`} unit="hrs" icon="◷" tone="peach" caption="time that made a difference" />
        <StatCard label="Drives completed" value={completedDrives} unit="" icon="✳" tone="mint" caption="and counting" />
        <StatCard label="Upcoming shifts" value={upcoming.length} unit="" icon="▦" tone="lavender" caption={upcoming.length ? 'you have plans to do good' : 'your next good thing awaits'} />
        <StatCard label="Open spots nearby" value={openSlots} unit="" icon="♡" tone="rose" caption="ways to show up this month" />
      </section>

      <div className="content-grid dashboard-grid">
        <section className="section-block">
          <div className="section-heading"><div><p className="eyebrow">PICKED FOR YOU</p><h2>Good things happening</h2></div><button className="arrow-link" onClick={() => onExplore(false)}>All drives <span>↗</span></button></div>
          <div className="drive-grid compact-grid">
            {[featured, recommended && recommended.id !== featured.id ? recommended : drives.find((drive) => drive.id !== featured.id)].filter(Boolean).map((drive) => <DriveCard key={drive.id} drive={drive} interests={interests} isSignedUp={myDriveIds.has(drive.id)} onOpen={() => onOpenDrive(drive.id)} />)}
          </div>
        </section>
        <aside className="side-column">
          <section className="panel next-panel">
            <div className="panel-heading"><div><p className="eyebrow">YOUR NEXT CHAPTER</p><h3>Coming up</h3></div><span className="panel-icon">↗</span></div>
            {upcoming.length ? upcoming.slice(0, 2).map(({ drive, shift }) => <div className="upcoming-item" key={shift.id}><span className={`mini-emoji ${drive.color}`}>{drive.emoji}</span><div><strong>{drive.title}</strong><small>{formatDate(drive.date)} · {shift.period}</small></div></div>) : <div className="empty-upcoming"><span>✦</span><p>No shifts on your calendar yet.</p><button className="text-button" onClick={() => onExplore(true)}>Find a good fit →</button></div>}
            <button className="panel-footer-link" onClick={() => onExplore(false)}>Explore the calendar <span>→</span></button>
          </section>
          <section className="panel interest-panel">
            <div className="panel-heading"><div><p className="eyebrow">MAKE IT YOURS</p><h3>What moves you?</h3></div><span className="panel-icon">✳</span></div>
            <p className="panel-description">Choose causes you care about. We’ll bring the right opportunities your way.</p>
            <div className="interest-chips">{CATEGORIES.slice(1).map((tag) => <button key={tag} className={`interest-chip ${interests.includes(tag) ? 'selected' : ''}`} onClick={() => onToggleInterest(tag)} aria-pressed={interests.includes(tag)}>{interests.includes(tag) ? '✓ ' : '+ '}{tag}</button>)}</div>
            <button className="panel-footer-link" onClick={() => onExplore(true)}>Show my matches <span>→</span></button>
          </section>
        </aside>
      </div>
    </>
  );
}

function StatCard({ label, value, unit, icon, tone, caption }) {
  return <article className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value}<small>{unit}</small></div><div className="stat-caption">{caption}</div></article>;
}

function ExplorePage({ drives, allDrives, interests, activeCategory, setActiveCategory, query, setQuery, matchOnly, setMatchOnly, myDriveIds, mySignups, onOpenDrive }) {
  return (
    <section className="explore-page">
      <div className="explore-intro"><div><p className="eyebrow">FIND YOUR WAY TO HELP</p><h2>There’s a place for you here.</h2><p>Good people, doing practical things, right around the corner.</p></div><div className="explore-count"><strong>{drives.length.toString().padStart(2, '0')}</strong><span>local drives<br />to explore</span></div></div>
      <div className="search-row"><label className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search drives, causes, or places" aria-label="Search drives" />{query && <button onClick={() => setQuery('')} aria-label="Clear search">×</button>}</label><button className={`match-toggle ${matchOnly ? 'selected' : ''}`} onClick={() => setMatchOnly(!matchOnly)} aria-pressed={matchOnly}><span>✦</span> Matched to me</button></div>
      <div className="filter-row" role="group" aria-label="Filter by cause">{CATEGORIES.map((category) => <button key={category} className={`filter-chip ${activeCategory === category ? 'active' : ''}`} onClick={() => setActiveCategory(category)}>{category}{category !== 'All causes' && <span>{allDrives.filter((drive) => drive.category === category).length}</span>}</button>)}</div>
      <div className="results-summary"><span>{drives.length} {drives.length === 1 ? 'opportunity' : 'opportunities'}</span><span>Sorted by best fit for you <i>✦</i></span></div>
      {drives.length ? <div className="drive-grid explore-grid">{drives.map((drive) => <DriveCard key={drive.id} drive={drive} interests={interests} isSignedUp={myDriveIds.has(drive.id)} onOpen={() => onOpenDrive(drive.id)} />)}</div> : <div className="no-results"><span>🌼</span><h3>No drives found just yet</h3><p>Try another cause or clear your search to see more local opportunities.</p><button className="button button-dark" onClick={() => { setQuery(''); setActiveCategory('All causes'); setMatchOnly(false); }}>Clear filters</button></div>}
      {mySignups.length > 0 && <p className="small-note">You’re already signed up for {mySignups.length} {mySignups.length === 1 ? 'shift' : 'shifts'}. Your places are saved to your impact page.</p>}
    </section>
  );
}

function DriveCard({ drive, interests, isSignedUp, onOpen }) {
  const spots = drive.shifts.reduce((sum, shift) => sum + Math.max(0, shift.capacity - shift.volunteers.length), 0);
  const match = getMatchPercent(drive, interests);
  return (
    <article className="drive-card">
      <button className={`drive-visual ${drive.color}`} onClick={onOpen} aria-label={`View ${drive.title}`}><span className="visual-emoji">{drive.emoji}</span><span className="visual-orbit orbit-a" /><span className="visual-orbit orbit-b" /><span className="visual-caption">{drive.organization}</span>{match > 0 && <span className="match-tag">✦ {match}% match</span>}</button>
      <div className="drive-card-body"><div className="drive-meta"><span className="category-label">{drive.category}</span><span>{formatDate(drive.date)}</span></div><h3>{drive.title}</h3><p className="drive-location">⌖ {drive.location}</p><p className="drive-goal">{drive.goal}</p>
        <div className="drive-card-bottom"><div className="spots-indicator"><span className="spots-dot" />{spots} spots left</div><button className={`card-action ${isSignedUp ? 'signed' : ''}`} onClick={onOpen}>{isSignedUp ? 'View your shift' : 'See details'} <span>↗</span></button></div>
      </div>
    </article>
  );
}

function ImpactPage({ pastAttendance, mySignups, verifiedHours, completedDrives, onOpenCertificate, onExplore }) {
  const allActivity = [
    ...pastAttendance.map((record) => ({ ...record, status: 'Verified', emoji: '🌳' })),
    ...mySignups.map(({ drive, shift, volunteer }) => ({ id: shift.id, title: drive.title, date: drive.date, hours: volunteer.attended ? drive.hours : 0, status: volunteer.attended ? 'Verified' : 'Upcoming', emoji: drive.emoji, period: shift.period })),
  ].sort((a, b) => b.date.localeCompare(a.date));
  const badge = verifiedHours >= 10 ? { title: '10-Hour Hero', icon: '🏅', note: 'You’ve given ten hours to your community.' } : verifiedHours >= 4 ? { title: 'Green Steward', icon: '🌿', note: 'You’re helping good things take root.' } : { title: 'Kindness Starter', icon: '🌱', note: 'Every hour of care begins somewhere.' };
  return (
    <section className="impact-page">
      <div className="impact-banner"><div><p className="eyebrow">YOUR TIME, YOUR IMPACT</p><h2>A little care adds up.</h2><p>Every hour you give becomes part of a stronger community.</p></div><div className="impact-total"><strong>{verifiedHours}</strong><span>verified<br />hours</span><i>✳</i></div><span className="impact-scribble">✦</span></div>
      <div className="impact-summary-grid"><StatCard label="Verified hours" value={verifiedHours} unit="hrs" icon="◷" tone="peach" caption="confirmed by a coordinator" /><StatCard label="Drives completed" value={completedDrives} unit="" icon="✳" tone="mint" caption="neighbors helped along the way" /><article className="badge-card"><span className="badge-medal">{badge.icon}</span><div><p className="eyebrow">YOUR LATEST BADGE</p><h3>{badge.title}</h3><p>{badge.note}</p></div><span className="badge-spark">✦</span></article></div>
      <div className="impact-content-grid"><section className="panel activity-panel"><div className="section-heading"><div><p className="eyebrow">YOUR GOOD WORK</p><h2>Service history</h2></div><button className="arrow-link" onClick={onOpenCertificate}>Certificate <span>↗</span></button></div>
        {allActivity.length ? <div className="activity-list">{allActivity.map((item) => <div className="activity-row" key={item.id}><span className="activity-emoji">{item.emoji}</span><div className="activity-info"><strong>{item.title}</strong><span>{formatDate(item.date, { month: 'short', day: 'numeric', year: 'numeric' })}{item.period ? ` · ${item.period}` : ''}</span></div><div className="activity-hours">{item.status === 'Verified' ? `+${item.hours} hrs` : '—'}<span className={item.status === 'Verified' ? 'verified-status' : 'upcoming-status'}>{item.status === 'Verified' ? '✓ Verified' : 'Upcoming'}</span></div></div>)}</div> : <div className="empty-activity"><span>✿</span><p>Your completed drives will bloom here.</p></div>}
      </section><aside className="panel certificate-panel"><span className="certificate-art">✉</span><p className="eyebrow">PROUD OF YOUR HOURS?</p><h3>Share the good you’ve done.</h3><p>Make a simple service certificate to celebrate your verified contribution.</p><button className="button button-dark full-button" onClick={onOpenCertificate}>Preview my certificate <span>↗</span></button><button className="panel-footer-link" onClick={() => onExplore(false)}>Find another opportunity <span>→</span></button></aside></div>
    </section>
  );
}

function OrganizerPage({ drives, selectedDrive, selectedDriveId, onSelectDrive, onToggleAttendance }) {
  const volunteers = selectedDrive.shifts.flatMap((shift) => shift.volunteers.map((volunteer) => ({ ...volunteer, shift })));
  const checkedIn = volunteers.filter((volunteer) => volunteer.attended).length;
  const capacity = selectedDrive.shifts.reduce((sum, shift) => sum + shift.capacity, 0);
  return (
    <section className="organizer-page">
      <div className="organizer-banner"><div><p className="eyebrow">ORGANIZER WORKSPACE</p><h2>Make every helping hand count.</h2><p>Manage your drive roster and confirm the people who showed up.</p></div><div className="organizer-banner-icon">☷</div></div>
      <div className="organizer-topline"><div><p className="eyebrow">DRIVE ROSTER</p><h2>Volunteer check-in</h2></div><label className="select-wrap"><span className="sr-only">Choose a drive</span><select value={selectedDriveId} onChange={(event) => onSelectDrive(event.target.value)}>{drives.map((drive) => <option key={drive.id} value={drive.id}>{drive.title}</option>)}</select><span>⌄</span></label></div>
      <div className="organizer-metrics"><div className="organizer-metric"><span className="metric-symbol">♧</span><span><strong>{volunteers.length}<small> / {capacity}</small></strong><small>registered volunteers</small></span></div><div className="organizer-metric"><span className="metric-symbol checked">✓</span><span><strong>{checkedIn}<small> / {volunteers.length}</small></strong><small>attendance confirmed</small></span></div><div className="organizer-metric"><span className="metric-symbol">◷</span><span><strong>{selectedDrive.hours}<small> hrs</small></strong><small>service time per shift</small></span></div><div className="organizer-metric"><span className="metric-symbol">⌖</span><span><strong className="metric-location">{selectedDrive.neighborhood}</strong><small>{formatDate(selectedDrive.date)}</small></span></div></div>
      <div className="panel roster-panel"><div className="roster-heading"><div><p className="eyebrow">{selectedDrive.organization.toUpperCase()}</p><h3>{selectedDrive.title}</h3><p>{formatDate(selectedDrive.date, { weekday: 'long', month: 'long', day: 'numeric' })} · {selectedDrive.location}</p></div><span className="roster-count">{volunteers.length} signed up</span></div>
        {volunteers.length ? <div className="table-wrap"><table className="roster-table"><thead><tr><th>Volunteer</th><th>Shift</th><th>Contact</th><th>Attendance</th><th>Confirm</th></tr></thead><tbody>{selectedDrive.shifts.flatMap((shift) => shift.volunteers.map((volunteer) => <tr key={`${shift.id}-${volunteer.email}`}><td><span className="roster-person"><span className="roster-avatar">{volunteer.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><strong>{volunteer.name}{volunteer.email === USER.email && <small className="you-tag">YOU</small>}</strong></span></td><td><span className="shift-pill">{shift.period}</span></td><td><a className="contact-link" href={`mailto:${volunteer.email}`}>{volunteer.email}</a><small className="contact-phone">{volunteer.phone}</small></td><td><span className={`attendance-state ${volunteer.attended ? 'present' : 'waiting'}`}><i />{volunteer.attended ? 'Attended' : 'Not checked in'}</span></td><td><button className={`attendance-button ${volunteer.attended ? 'confirmed' : ''}`} onClick={() => onToggleAttendance(selectedDrive.id, shift.id, volunteer.email)} aria-label={`${volunteer.attended ? 'Undo attendance for' : 'Mark attended'} ${volunteer.name}`}>{volunteer.attended ? '✓ Confirmed' : 'Mark attended'}</button></td></tr>))}</tbody></table></div> : <div className="empty-roster"><span>✿</span><h3>No one has signed up yet</h3><p>Share this drive with your community to fill the first spots.</p></div>}
      </div>
      <p className="organizer-note"><span>ⓘ</span> Confirm attendance after the shift. Verified hours will appear on each volunteer’s impact page.</p>
    </section>
  );
}

function DriveModal({ drive, user, onClose, onSignUp }) {
  const alreadySigned = drive.shifts.some((shift) => shift.volunteers.some((volunteer) => volunteer.email === user.email));
  useEffect(() => {
    function onKey(event) { if (event.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="drive-modal" role="dialog" aria-modal="true" aria-labelledby="drive-modal-title"><button className="modal-close" onClick={onClose} aria-label="Close details">×</button><div className={`modal-art ${drive.color}`}><span>{drive.emoji}</span><div><small>{drive.organization}</small><strong>{drive.category}</strong></div></div><div className="modal-content"><p className="eyebrow">{formatDate(drive.date, { weekday: 'long', month: 'long', day: 'numeric' })} · {drive.location}</p><h2 id="drive-modal-title">{drive.title}</h2><p className="modal-goal">{drive.goal}</p><p className="modal-description">{drive.description}</p><div className="modal-facts"><span>◷ <strong>{drive.hours} hours</strong> per shift</span><span>⌖ <strong>{drive.neighborhood}</strong></span><span>✦ <strong>{drive.category}</strong></span></div><div className="shift-picker"><div className="shift-picker-heading"><h3>Choose your shift</h3><span>One shift per drive</span></div>{drive.shifts.map((shift) => { const open = shift.capacity - shift.volunteers.length; const signed = shift.volunteers.some((volunteer) => volunteer.email === user.email); return <div className={`shift-option ${signed ? 'already-booked' : ''}`} key={shift.id}><div className="shift-option-info"><span className="shift-radio">{signed ? '✓' : ''}</span><div><strong>{shift.period}</strong><small>{shift.time}</small></div></div><div className="shift-option-action"><span className={open <= 2 ? 'few-spots' : ''}>{open} {open === 1 ? 'spot' : 'spots'} left</span><button disabled={signed || open <= 0 || alreadySigned} onClick={() => onSignUp(drive.id, shift.id)}>{signed ? 'Your spot' : alreadySigned ? 'One shift only' : open <= 0 ? 'Full' : 'Sign me up'}</button></div></div>; })}</div>{alreadySigned && <p className="already-note">You’re already registered for this drive. You can only choose one shift per drive.</p>}<div className="modal-bottom-note"><span>♡</span> Just show up ready to help. Your coordinator will take it from here.</div></div></section></div>
  );
}

function CertificateModal({ user, hours, completedDrives, onClose }) {
  return <div className="modal-backdrop certificate-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="certificate-modal" role="dialog" aria-modal="true" aria-labelledby="certificate-heading"><button className="modal-close" onClick={onClose} aria-label="Close certificate">×</button><div className="certificate-paper"><span className="certificate-star">✳</span><p className="eyebrow">HELPINGHANDS HUB · COMMUNITY SERVICE</p><h2 id="certificate-heading">Certificate of<br /><em>Good Work</em></h2><p className="certificate-presented">Proudly presented to</p><h3>{user.name}</h3><p className="certificate-copy">In recognition of your generous time and care shared with the community.</p><div className="certificate-number"><strong>{hours}</strong><span>verified service hours</span><i>·</i><strong>{completedDrives}</strong><span>drives completed</span></div><div className="certificate-signature"><span>HelpingHands Hub</span><span>Community Coordinator</span></div><span className="certificate-border-mark">✿</span></div><div className="certificate-actions"><p>Verified hours are based on attendance confirmed by a drive organizer.</p><button className="button button-dark" onClick={() => window.print()}>Print or save as PDF <span>↗</span></button></div></section></div>;
}

export default App;
