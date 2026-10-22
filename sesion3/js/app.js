// const: valor fijo durante toda la ejecución
const SITE_AUTHOR = 'Hebert Cussi';
const API_BASE = 'https://jsonplaceholder.typicode.com';
const POKE_API = 'https://pokeapi.co/api/v2';
const COUNTRIES_API = 'https://countries.dev';

// let: cambia según la interacción del usuario
let currentFilter = 'all';
let pokemonPage = 0;
let projectsData = [];

//export { renderProjects, initContactForm, fetchProjects };
export const PI = 3.14159;

// export por defecto (uno por archivo)
export default class App { }

// otro-archivo.js
//import { renderProjects } from './app.js';
// import App from './app.js';
import * as utils from './utils.js';

// Función tradicional
function greetf(name) {
    return '¡Hola desde el portafolio de desde la funcion tradicinal ' + name + '!';
}
console.log(greetf(SITE_AUTHOR));

// Arrow function equivalente
const greet = (name) => `¡Hola desde el portafolio de ${name}!`;
console.log(greet(SITE_AUTHOR));
// alert(greet(SITE_AUTHOR));

const sayHi = () => 'Hola';
const double = n => n * 2;
const getFullName = (first, last) => {
    const full = `${first} ${last}`;
    return full.trim();
};
const makeUser = (name) => ({ name, active: true });

function sumar(a, b) {
    return a + b;
}
const a = 4;
const b = 5;
console.log('las suma de ' + a + ' y ' + b + 'es: ' + sumar(5, 4));

// Arrow function equivalente
const sumaAB = (a, b) => a + b;
console.log('las suma de ' + a + ' y ' + b + 'es: ' + sumaAB(5, 4));

const name = 'Hebert';
const monto = 1500.05;

const formatPrice = (monto) => `Bs. ${Number(monto).toLocaleString('es-BO')}`;
const formatPriceUS = (monto) => `US ${Number(monto).toLocaleString('en-US')}`;
console.log(formatPrice(monto));
console.log(formatPriceUS(monto));


const html = `
  <article class="project-card">
    <h3>${name}</h3>
    <p>Desarrollador Full Stack</p>
  </article>`;

const total = `Total: ${10 * 5} items`;

// Destructuring de objeto
const devProfile = {
    full_name: 'Hebert Cussi',
    role: 'Full Stack Developer',
    location: 'La Paz, Bolivia',
    skills: ['JavaScript', 'React', 'Nodejs', 'Python'],
}

const { full_name, role, skills } = devProfile; // object destructuring
console.log('full Name ' + full_name);

//const { mainSkill, ...otherSkills}= skills; // array destructuring + rest
const [mainSkill, ...otherSkills] = skills; // array destructuring + rest

console.log(`${full_name} – ${role}`);
console.log('Skill principal:', mainSkill);            // 'JavaScript'
console.log('Otras skills:', otherSkills);             // ['React', 'Node.js', 'Python']

const frontEnd = ['React', 'Angular', 'TypeScript'];
const backEnd = ['Nodejs', 'Express', 'Django'];
const allTechs = [...frontEnd, ...backEnd];

console.log('Stack completo:', allTechs);

// Spread: clonar y extender un objeto sin mutarlo
const updatedProfile = { ...devProfile, disponible: false };

console.log('Pefil actualizado:', updatedProfile);

// en llamada a función
console.log('El Maximo es:', Math.max(...[3, 8, 4, 1, 5]));
console.log('El Minimo es:', Math.min(...[3, 8, 4, 1, 5]));


class Project {
    #id;            //campo privado

    constructor({ id, title, description, techs, emoji, category }) {
        this.#id = id;
        this.title = title;
        this.description = description;
        this.techs = techs;
        this.emoji = emoji;
        this.category = category;
    }

    get id() { return this.#id; }
    //templeta literal
    toHTML() {
        const insignia = this.techs
            .map(t => `<span class="tech-badge">${t}</span> `)
            .join('');

        return `
              <article class="project-card" data-id="${this.#id}" data-category="${this.category}">
                <div class="project-img" aria-hidden="true">${this.emoji}</div>
                <div class="project-info">
                    <h3>${this.title}</h3>
                    <p>${this.description}</p>
                    <footer class="project-tags">
                    ${insignia}
                    </footer>
                </div>
              </article>
           `;
    }
}

const localProjects = [
    new Project({
        id: 1,
        category: 'frontend',
        emoji: '📱',
        title: 'App de Tareas',
        description: ' Aplicación web con drag &amp; drop, almacenamiento local y modo oscuro. UI minimalista con microinteracciones',
        techs: ['React', 'CSS Modules', 'Flexbox']
    }),
    new Project({
        id: 2, category: 'frontend', emoji: '🌿',
        title: 'EcoShop',
        description: 'E-commerce sostenible con sistema de filtros y carrito de compras.',
        techs: ['HTML5', 'CSS Grid', 'JavaScript'],
    }),
    new Project({
        id: 3, category: 'fullstack', emoji: '📊',
        title: 'Dashboard Analytics',
        description: 'Panel con gráficas en tiempo real, filtros dinámicos y exportación.',
        techs: ['Node.js', 'PostgreSQL', 'Chart.js'],
    }),
    new Project({
        id: 4, category: 'backend', emoji: '🔧',
        title: 'REST API – Inventario',
        description: 'API REST completa con autenticación JWT y documentación Swagger.',
        techs: ['Express', 'MySQL', 'JWT'],
    }),
    new Project({
        id: 5, category: 'fullstack', emoji: '🌍',
        title: 'GeoWeather App',
        description: 'Consulta clima en tiempo real usando la API de OpenWeather y países.',
        techs: ['React', 'Fetch API', 'OpenWeather'],
    }),
]

const totalProject=localProjects.length;

if (totalProject===0){
    console.log('Aun no tenemos proyectos');    
} else if(totalProject<5){
    console.log(`Tienes ${totalProject} proyectos, Sigue sumando!`);    
}
else{
    console.log(`Portafolio completo con ${totalProject} proyectos`);    
}

// -- operadore ternario
const disponibleText= updatedProfile.disponible? 'Disponible para Trabajar': 'No Disponible';
console.log(disponibleText);

//-- switch
const getCategoryLabel = (category) =>{
    switch(category){
        case 'frontend': return '🎨 Frontend';
        case 'backend': return '⚙ Backend';
        case 'fullstack': return '🚀 Full Stack';
        default: return '❓ Sin categoria';
    }
}

console.log(getCategoryLabel('backend'));

// for clasico

for(let i=0; i<localProjects.length; i++){
    console.log(`${i+1}. ${localProjects[i].title}`);    
}

// while 

let intentos=0;
while(intentos<3){
    console.log(`Intentos de conxeion #${intentos}`);
    intentos++;
}

let pagina=0

do{
    console.log(`Cargando pagina ${pagina}`);
    pagina++;    
} while (pagina<2)

const renderFotter=({full_name,role,location,skills})=>{
    const nameEl = document.querySelector('#footer-name');
    const roleEl = document.querySelector('#footer-role');
    const skillsEl = document.querySelector('#footer-skills');
    if(nameEl) nameEl.textContent=full_name;
    if(roleEl) roleEl.textContent=`${role} · ${location}`;
    if(skillsEl) {
        skillsEl.innerHTML = skills.map(skill=>`<span class="tech-badge">${skill}</span>`).join('');
    }
}

renderFotter(devProfile)

const projectsGrid=document.querySelector('.projects-grid')
const filterButtons=document.querySelectorAll('.filter-btn')
const toastEl= document.getElementById('toast');

function renderProjects(category='all'){
    
    if(!projectsGrid) return;
    console.log(category);

    const filtered = filterProjects(category);

    projectsGrid.innerHTML = filtered
    .map(p => p.toHTML())
    .join('');

    filterButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === category);
    });

    const counter=document.getElementById('project-count');
    if(counter) counter.textContent=`${filtered.length} proyectos`
}

const filterProjects = (category)=>
    category === 'all'
    ?localProjects
    :localProjects.filter(p=>p.category === category);

filterButtons.forEach(btn=>{
    btn.addEventListener('click',(e)=>{
        currentFilter=e.currentTarget.dataset.filter;
        console.log(currentFilter);        
        renderProjects(currentFilter);
    });    
})


renderProjects('all');


const getTitles = () => localProjects.map(p => p.title);

const countByCategory = localProjects.reduce((acc, p) => {  // .reduce()
  acc[p.category] = (acc[p.category] || 0) + 1;
  return acc;
}, {});

const findProject = (id) => localProjects.find(p => p.id === id); 

console.log('1 – Síncrono');
setTimeout(() => console.log('3 – Macrotarea'), 0);
Promise.resolve()
  .then(() => console.log('2 – Microtarea'));
console.log('1b – Síncrono también');

function validateEmail(email) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const valid =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (valid) resolve({ ok: true, email });
      else reject(new Error('Email inválido'));
    }, 500);
  });
}

validateEmail('hebert@ejemplo.com')
  .then(({ email }) => console.log(`✅ Email válido: ${email}`))
  .catch(err => console.error('❌', err.message));

async function fetchJSON(url){
    const res=await fetch(url);
    if(!res.ok) throw new Error(`HTTP ${res.status} – ${res.statusText}`)
    return await res.json();
}

async function fetchProjects() {
    const loader=document.getElementById('projects-loader');
    if(loader) loader.classList.remove('hidden');
    
    try{

        const post= await fetchJSON(`${API_BASE}/posts?_limit=3`)

        const extra= post.map(({ id, title, body })=> new Project({
            id: id+50,
            emoji: '🌐',
            title: title.slice(0,40)+'...',
            description: body.slice(0,100)+'...',
            techs: ['Fetch API','JSONPlaceholder', 'REST']
        }));

        projectsData=[... localProjects, ...extra];

        console.log(projectsData);
        
        showToast('Proyectos de API cargados ✅');
    }
    catch (error){
        console.log('Error al cargar proyectos', error);
        showToast(`Error: ${error.message}`, 'error');
    }
    // finally{
    //     if(loader) loader.classList.add('hidden')

    // }
    
}

function showToast(msg, type = 'success') {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.className = `toast toast--${type} toast--show`;

  // Remover clase después de 3s con setTimeout (Event Loop)
  setTimeout(() => {
    toastEl.classList.remove('toast--show');
  }, 3000);
}

const pokeGrid       = document.getElementById('poke-grid')
const pokeSection    = document.getElementById('poke-section');
const pokeBtnNext    = document.getElementById('poke-next');

async function fetchPokemons(offset=0) {
    if(!pokeGrid) return;
    
    pokeGrid.innerHTML = '<p class="loading-text">Cargando Pokémon...</p>';

    try {
        const data= await fetchJSON(`${POKE_API}/pokemon?limit=6&offset=${offset}`)  
        const details= await Promise.all(
            data.results.map(p=> fetchJSON(p.url))
        )
        pokeGrid.innerHTML= details.map(({ id, name,  sprites, types })=>{
            const type = types[0].type.name;
            const img  = sprites.other['official-artwork'].front_default
                || sprites.front_default;
                return `
                <div class="poke-card poke--${type}">
                <img src="${img}" alt="${name}" loading="lazy" />
                <p class="poke-name">${name}</p>
                <span class="poke-type">${type}</span>
                </div>`;
            }).join('');
    } catch (error) {
        pokeGrid.innerHTML=`<p class="error-text">Error: ${error.message}</p>`;
    }
    // finally{
    //     pokeGrid.innerHTML='';
    // }

}

if (pokeBtnNext) {
  pokeBtnNext.addEventListener('click', () => {
    pokemonPage += 6;
    fetchPokemons(pokemonPage);
  });
}
const countryInput   = document.getElementById('country-search');
const countryResult  = document.getElementById('country-result');

async function fetchCountry(query){
    if (!countryResult || !query.trim()) return;
    countryResult.innerHTML = '<p class="loading-text">Buscando...</p>';
    try {
        const [country]=await fetchJSON(
            `${COUNTRIES_API}/name/${encodeURIComponent(query)}?fields=name,capital,population,flags,region`
        )
        const {
            name,
            capital = 'N/A',
            population,
            flags: { svg: flag },
            region,
            } = country;

            // Template literal para construir el HTML
            countryResult.innerHTML = `
            <div class="country-card">
                <img src="${flag}" alt="Bandera de ${name}" class="country-flag" />
                <div class="country-info">
                <h4>${name}</h4>
                <p>🏛 Capital: <strong>${capital}</strong></p>
                <p>🌍 Región: <strong>${region}</strong></p>
                <p>👥 Población: <strong>${population.toLocaleString()}</strong></p>
                </div>
            </div>`;
    } catch (error) {
        countryResult.innerHTML=`<p class="error-text">País no encontrado.</p>`;
    }
}

let searchTimer;
if (countryInput) {
  countryInput.addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => fetchCountry(e.target.value), 600);
  });
}

document.addEventListener('DOMContentLoaded',()=>{
    if(pokeSection) fetchPokemons(0);

    //fetchProjects();

})

