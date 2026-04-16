const API = 'http://localhost:3000/api';

async function loadStudents(){
 const res = await fetch(`${API}/students`);
 const data = await res.json();
 displayStudents(data);
 updateStats(data);
}

function displayStudents(data){
 const list = document.getElementById('studentList');
 list.innerHTML = '';
 data.forEach(s=>{
   list.innerHTML += `
   <li>
     <div>
       <strong>${s.name}</strong> - ${s.course}<br>
       ${s.yearLevel} | Age ${s.age} <span class="badge">${s.status}</span>
     </div>
     <div>
       <button onclick="fillForm(${s.id},'${s.name}','${s.course}','${s.yearLevel}','${s.age}','${s.status}')">Edit</button>
       <button class="danger" onclick="deleteStudent(${s.id})">Delete</button>
     </div>
   </li>`;
 });
}

function updateStats(data){
 document.getElementById('total').textContent = data.length;
 document.getElementById('regularCount').textContent = data.filter(x=>x.status==='Regular').length;
 document.getElementById('courses').textContent = new Set(data.map(x=>x.course)).size;
}

function getForm(){
 return {
  id: document.getElementById('studentId').value,
  name: document.getElementById('name').value,
  course: document.getElementById('course').value,
  yearLevel: document.getElementById('yearLevel').value,
  age: document.getElementById('age').value,
  status: document.getElementById('status').value
 };
}

async function saveStudent(){
 const s = getForm();
 if(s.id){
   await fetch(`${API}/students/${s.id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(s)});
 }else{
   await fetch(`${API}/students`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(s)});
 }
 clearForm();
 loadStudents();
}

function fillForm(id,name,course,yearLevel,age,status){
 studentId.value=id; name.value=name; course.value=course; yearLevel.value=yearLevel; age.value=age; document.getElementById('status').value=status;
}
function clearForm(){ studentId.value=''; name.value=''; course.value=''; yearLevel.value=''; age.value=''; status.value='Regular'; }

async function deleteStudent(id){ await fetch(`${API}/students/${id}`,{method:'DELETE'}); loadStudents(); }
async function searchStudent(){ const q=search.value; const r=await fetch(`${API}/search?name=${q}`); const d=await r.json(); displayStudents(d); updateStats(d); }
async function loadRandom(){ const r=await fetch(`${API}/random`); const d=await r.json(); displayStudents([d]); updateStats([d]); }

loadStudents();