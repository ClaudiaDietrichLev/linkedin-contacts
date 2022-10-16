const apiURL = 'https://dummy-apis.netlify.app/api/contact-suggestions?count=';
let persons = [];
const personsPerPage = 8;
let personsFromApi = [];

function renderPersons() {
  console.log(persons);
  const personContainer = document.querySelector('.person-container');
  personContainer.innerHTML = '';
  let output = '';
  for (let i = 0; i < personsPerPage; i++) {
    output += `<section class="person">
        <button class="delete">x</button>
        <img src="${persons[i].picture}" alt="${
      persons[i].name.last
    }" class="person-avatar" />
        <h2 class="person-name">${namePerson(persons[i])}</h2>
        <p class="person-position">${persons[i].title}</p>
        <p class="person-mutual">${mutualConnectsOrCompany(persons[i])}</p>
        <button class="connect">connect</button>
        </section>`;
    personContainer.dataObj = persons[i];
  }
  personContainer.innerHTML = output;
}

async function getPersonsFromApi(count) {
  const response = await fetch(apiURL + count);
  persons = await response.json();
}
async function init() {
  await getPersonsFromApi(personsPerPage);
  await checkLocalstorage();
  initPersons();
  renderPersons();
  setPending();
}

function namePerson(person) {
  let name = '';
  if (person.name.title !== '') {
    name += person.name.title + ' ';
  }
  if (person.name.first !== '') {
    name += person.name.first + ' ';
  }
  if (person.name.last !== '') {
    name += person.name.last;
  }
  return name;
}

function mutualConnectsOrCompany(person) {
  if (person.mutualConnections > 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-infinity" viewBox="0 0 16 16">
        <path d="M5.68 5.792 7.345 7.75 5.681 9.708a2.75 2.75 0 1 1 0-3.916ZM8 6.978 6.416 5.113l-.014-.015a3.75 3.75 0 1 0 0 5.304l.014-.015L8 8.522l1.584 1.865.014.015a3.75 3.75 0 1 0 0-5.304l-.014.015L8 6.978Zm.656.772 1.663-1.958a2.75 2.75 0 1 1 0 3.916L8.656 7.75Z"/>
      </svg> ${person.mutualConnections} mutual connections`;
  } else return 'GFK';
}

function checkLocalstorage() {
  let personsFromLocal = JSON.parse(localStorage.getItem('linkedInContacts'));
  if (personsFromLocal !== null) {
    persons = personsFromLocal;
  }
}

function initPersons() {
  for (let i = 0; i < personsPerPage; i++) {
    if (!persons[i].pending) persons[i].pending = false;
  }
}

function setPending() {
  let n = 0;
  let invitationsText = 'no pending invitations';
  for (person of persons) {
    if (person.pending) {
      n++;
    }
  }
  if (n > 0) {
    invitationsText = `${n} pending invitations`;
  }
  const invitations = document.querySelector('.pending');
  invitations.innerHTML = invitationsText;
}
init();
