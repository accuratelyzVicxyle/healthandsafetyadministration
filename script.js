// --- DARK MODE TOGGLE (auto or user) ---
(function(){
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if(prefersDark) document.documentElement.setAttribute("data-bs-theme","dark");
})();

// --- ANIMATED COUNTERS ---
document.addEventListener("DOMContentLoaded", function(){
  document.querySelectorAll('.stat-number').forEach(function(el){
    let count = parseInt(el.dataset.count,10), step = Math.ceil(count/40), cur = 0;
    function update(){
      cur += step;
      if(cur >= count) { el.textContent = count; return; }
      el.textContent = cur;
      requestAnimationFrame(update);
    }
    update();
  });

  // --- CHART.JS PIE CHART ---
  if(window.Chart && document.getElementById('statsChart')) {
    new Chart(document.getElementById('statsChart'), {
      type: 'doughnut',
      data: {
        labels: ['Certified Staff','Programs','Resolved Cases'],
        datasets: [{
          data: [1275,16,99],
          backgroundColor: ['#2C786C','#56BBA6','#00B8A9'],
          borderWidth: 2,
        }]
      },
      options: {cutout:'65%', plugins:{legend:{display:true,position:'bottom'}}}
    });
  }
});

// --- ENROLLMENT FORM VALIDATION ---
document.getElementById('enrollForm').addEventListener('submit', function(e){
  e.preventDefault();
  let ok = true;
  ['enrollName','enrollEmail','enrollCourse'].forEach(id=>{
    let input = document.getElementById(id);
    if(!input.value || (input.type==='email' && !/^[^@]+@[^@]+\.[^@]+$/.test(input.value))){
      input.classList.add('is-invalid'); ok=false;
    } else input.classList.remove('is-invalid');
  });
  if(ok){
    this.reset();
    alert('Enrollment submitted! Our team will contact you soon.');
  }
});

// --- SIMPLE CALENDAR (Upcoming Sessions) ---
(function(){
  const cal = document.getElementById('calendar');
  if(!cal) return;
  const today = new Date(), days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  let html = '<table class="table table-sm table-borderless text-center mb-0"><thead><tr>';
  days.forEach(d=>html+=`<th>${d}</th>`); html+='</tr></thead><tbody>';
  let d=new Date(today.getFullYear(),today.getMonth(),1), firstDay=d.getDay();
  d.setDate(1-(firstDay));
  for(let w=0;w<6;w++){
    html+='<tr>';
    for(let i=0;i<7;i++){
      let isCurMonth = d.getMonth()===today.getMonth(),
          isToday = d.toDateString()===today.toDateString();
      html+=`<td class="cal-cell${isCurMonth?'':' text-muted'}${isToday?' cal-today':''}" data-date="${d.toISOString().slice(0,10)}">${d.getDate()}</td>`;
      d.setDate(d.getDate()+1);
    }
    html+='</tr>';
  }
  html+='</tbody></table>';
  cal.innerHTML = html;
  cal.querySelectorAll('.cal-cell').forEach(td=>{
    td.onclick = function(){
      if(td.classList.contains('text-muted')) return;
      alert('Sessions on '+td.dataset.date+':\n- 6pm: BLS Training\n- 8pm: Safety Workshop');
    };
  });
})();

// --- REPORT FORM WIZARD ---
(function(){
  const form = document.getElementById('reportWizard');
  const steps = [...form.querySelectorAll('.wizard-page')];
  const navs = [...form.querySelectorAll('.wizard-step')];
  let cur = 0;

  function showStep(n){
    steps.forEach((el,i)=>el.classList.toggle('d-none',i!==n));
    navs.forEach((el,i)=>el.classList.toggle('active',i===n));
    document.getElementById('wizardPrev').disabled = n===0;
    document.getElementById('wizardNext').textContent = n===steps.length-1 ? "Submit" : "Next";
  }
  showStep(cur);

  document.getElementById('wizardPrev').onclick = ()=>{ if(cur>0){cur--;showStep(cur);} };
  document.getElementById('wizardNext').onclick = function(){
    // Validate
    if(cur===0) {
      let sel = form.querySelector("#incidentType");
      if(!sel.value) { sel.classList.add('is-invalid'); return;}
      else sel.classList.remove('is-invalid');
    }
    if(cur===1) {
      let ta = form.querySelector("#incidentDesc");
      if(!ta.value || ta.value.trim().length<20) { ta.classList.add('is-invalid'); return;}
      else ta.classList.remove('is-invalid');
    }
    if(cur===2) {
      // No required validation
    }
    if(cur===3) {
      // Review step: "submit"
      alert('Your incident report has been submitted. Thank you!');
      form.reset();
      cur=0;showStep(cur);
      return;
    }
    cur++; showStep(cur);
    // Step 3: Review summary
    if(cur===3){
      let type = form.querySelector("#incidentType").value,
          desc = form.querySelector("#incidentDesc").value,
          files = form.querySelector("#incidentFiles").files,
          list = [];
      for(let f of files) list.push(f.name);
      form.querySelector("#wizardReview").innerHTML = `<div><b>Type:</b> ${type}</div><div><b>Description:</b> ${desc}</div><div><b>Files:</b> ${list.join(", ")||"None"}</div>`;
    }
  };
  // File preview
  form.querySelector("#incidentFiles").addEventListener('change',function(){
    let wrap = form.querySelector(".file-previews");
    wrap.innerHTML = '';
    for(let f of this.files) {
      if(f.type.startsWith("image/")) {
        let img = document.createElement("img");
        img.src = URL.createObjectURL(f); img.alt=f.name;
        wrap.appendChild(img);
      } else if(f.type==="application/pdf") {
        let div = document.createElement("span");
        div.className="file-pdf"; div.textContent="PDF";
        wrap.appendChild(div);
      }
    }
  });
  // AI Draft (mockup)
  document.getElementById('aiAssistBtn').onclick = function(){
    let sel = form.querySelector("#incidentType").value;
    form.querySelector("#aiAssistOutput").textContent = sel
      ? `Suggested: "Report of ${sel.toLowerCase()} observed at Maple Hospital. Please review and take necessary action."`
      : "Select incident type for AI draft.";
  };
})();

// --- STAFF VERIFICATION (mock) ---
document.getElementById('staffVerifyForm').addEventListener('submit',function(e){
  e.preventDefault();
  let id = document.getElementById('staffVerifyInput').value.trim();
  let out = document.getElementById('staffVerifyResult');
  if(!id) { out.textContent="Please enter a staff ID or username."; return; }
  // Mock: Accept 'avery', 'taylor', 'jordan'
  if(['avery','taylor','jordan'].includes(id.toLowerCase()))
    out.innerHTML = `<span class="text-success">✅ Verified staff member: ${id}</span>`;
  else
    out.innerHTML = `<span class="text-danger">❌ No record found for: ${id}</span>`;
});

// --- CASE TRACKING (mock) ---
document.getElementById('caseTrackForm').addEventListener('submit',function(e){
  e.preventDefault();
  let id = document.getElementById('caseTrackInput').value.trim();
  let out = document.getElementById('caseTrackResult');
  if(!id) { out.textContent="Please enter a case ID."; return; }
  // Mock: Accept 'R2025-01', 'R2025-02'
  if(['r2025-01','r2025-02'].includes(id.toLowerCase()))
    out.innerHTML = `<span class="text-success">Case ${id.toUpperCase()} is <b>Resolved</b>.</span>`;
  else
    out.innerHTML = `<span class="text-warning">No case found for: ${id}</span>`;
});

// --- LIVE CHAT WIDGET (Demo) ---
(function(){
  let w = document.getElementById('liveChatWidget');
  w.innerHTML = '<button class="btn btn-accent position-fixed bottom-0 end-0 m-4 shadow-lg rounded-circle" style="width:60px;height:60px;z-index:9999;" title="Live chat support"><svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M21 12.3C21 7.97 16.97 4.5 12 4.5c-4.97 0-9 3.47-9 7.8 0 2.08 1.07 3.98 2.83 5.38l-1.01 2.81c-.14.39.28.77.65.62l3.46-1.39C10.03 20.21 11 20.3 12 20.3c4.97 0 9-3.47 9-7.8Z" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>';
  w.querySelector('button').onclick = function(){
    alert("Live chat coming soon! For urgent queries, email support@maplehsa.org");
  };
})();
