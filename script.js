
// All JS features: functions, objects, arrays, template literals, localStorage, DOM manipulation, conditional branching
(function(){
  // helper: set footer years
  function setYears(){
    const y = new Date().getFullYear();
    document.getElementById('year')?.textContent = y;
    document.getElementById('year2')?.textContent = y;
    document.getElementById('year3')?.textContent = y;
  }
  setYears();

  // NAV TOGGLE
  const navToggle = document.querySelector('.nav-toggle');
  if(navToggle){
    navToggle.addEventListener('click', function(){
      const menu = document.getElementById('primary-menu');
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('show');
    });
  }

  // Storage key
  const STORAGE_KEY = 'giovani_submissions_v1';

  // Helper: get submissions array
  function loadSubmissions(){
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return [];
    try{
      const parsed = JSON.parse(raw);
      if(Array.isArray(parsed)) return parsed;
      return [];
    }catch(e){
      return [];
    }
  }

  // Helper: save submissions array
  function saveSubmissions(arr){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  }

  // Example object creation and use of template literals
  function createSubmissionObject(formData){
    // formData is an object with keys
    const submission = {
      id: Date.now(),
      name: formData.fullName?.trim() || 'N/A',
      email: formData.email?.trim() || 'N/A',
      phone: formData.phone?.trim() || '',
      course: formData.courseSelect,
      referrals: formData.referrals || [], // array
      message: formData.message?.trim() || '',
      createdAt: new Date().toISOString()
    };
    return submission;
  }

  // Form handling (on enroll page)
  const enrollForm = document.getElementById('enrollForm');
  if(enrollForm){
    enrollForm.addEventListener('submit', function(e){
      e.preventDefault();

      // collect data
      const fullName = document.getElementById('fullName').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const courseSelect = document.getElementById('courseSelect').value;
      const message = document.getElementById('message').value;

      // referrals (checkboxes) -> demonstrate array & array methods
      const referralNodes = Array.from(document.querySelectorAll('input[name="referral"]:checked'));
      const referrals = referralNodes.map(n => n.value);

      // simple validation (conditional branching)
      if(!fullName || fullName.length < 2){
        alert('Please enter your full name (at least 2 characters).');
        return;
      }
      if(!email || !/.+@.+\..+/.test(email)){
        alert('Please enter a valid email address.');
        return;
      }
      if(!courseSelect){
        alert('Please choose a course.');
        return;
      }

      const formData = {fullName, email, phone, courseSelect, referrals, message};
      const submission = createSubmissionObject(formData);

      // load current submissions (array), push new, and save
      const submissions = loadSubmissions();
      submissions.push(submission);
      saveSubmissions(submissions);

      // show success with template literal
      alert(`Thanks, ${submission.name}! Your enrollment for "${submission.course}" has been saved.`);

      // go to view page
      window.location.href = 'view.html';
    });
  }

  // View page rendering
  function renderList(){
    const area = document.getElementById('listArea');
    if(!area) return;
    const submissions = loadSubmissions();
    if(submissions.length === 0){
      area.innerHTML = '<p>No submissions saved yet. <a href="enroll.html">Add one</a>.</p>';
      return;
    }

    // Create a copy and sort by createdAt descending
    const sorted = submissions.slice().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Use array methods to render
    const html = sorted.map(s => {
      const shortDate = new Date(s.createdAt).toLocaleString();
      // conditional on phone existence
      const phoneLine = s.phone ? `<div><strong>Phone:</strong> ${s.phone}</div>` : '';
      const referrals = (s.referrals && s.referrals.length) ? s.referrals.join(', ') : '—';

      return `
        <div class="card submission-card" data-id="${s.id}">
          <h3>${s.name}</h3>
          <div><strong>Email:</strong> ${s.email}</div>
          ${phoneLine}
          <div><strong>Course:</strong> ${s.course}</div>
          <div><strong>Referrals:</strong> ${referrals}</div>
          <div><strong>Message:</strong> ${s.message || '—'}</div>
          <div class="meta">Submitted: ${shortDate}</div>
          <div class="actions"><button class="btn delete-btn">Delete</button></div>
        </div>
      `;
    }).join('\n');

    area.innerHTML = html;

    // Attach delete handlers (DOM manipulation)
    const deleteButtons = area.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => btn.addEventListener('click', function(){
      const card = this.closest('.submission-card');
      const id = Number(card.dataset.id);
      if(!confirm('Delete this submission?')) return;
      const all = loadSubmissions();
      const filtered = all.filter(item => item.id !== id);
      saveSubmissions(filtered);
      renderList(); // re-render
    }));
  }
  renderList();

  // expose small API for debugging (optional) — demonstrates object and functions
  window.Giovani = window.Giovani || {};
  window.Giovani.loadSubmissions = loadSubmissions;
  window.Giovani.saveSubmissions = saveSubmissions;
  window.Giovani.createSubmissionObject = createSubmissionObject;

})();