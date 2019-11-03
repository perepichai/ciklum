import './scss/style.scss';

// const priorityArray = ['low', 'normal', 'high'];
const taskActions = ['done', 'edit', 'delete'];

const formState = {
  state: 'newTask',
  taskID: 1,
};

const saveChanges = (id) => {
  const task = document.querySelector(`[data-id="${id}"]`);
  const title = document.querySelector('input[name=task-title]').value;
  const description = document.querySelector('textarea[name=task-description]').value;
  const priority = document.querySelector('#task-priority').value;

  task.getElementsByClassName('list-task-title')[0].innerHTML = title;
  task.getElementsByClassName('list-task-description')[0].innerHTML = description;
  task.getElementsByClassName('list-task-priority')[0].innerHTML = priority;
};

const updateFormState = (title, description, priority, id) => {
  document.querySelector('input[name=task-title]').value = title;
  document.querySelector('textarea[name=task-description]').value = description;
  document.querySelector('#task-priority').value = priority;
  if (id) saveChanges(id);
};

const showEditFormToggle = () => {
  const form = document.querySelector('.task-editor');
  form.style.display = (getComputedStyle(form).display === 'none') ? 'block' : 'none';
};

const editTask = (e) => {
  const card = e.target.closest('.task');
  const title = card.getElementsByClassName('list-task-title')[0].innerHTML;
  const description = card.getElementsByClassName('list-task-description')[0].innerHTML;
  const priority = card.getElementsByClassName('list-task-priority')[0].innerHTML;
  const id = card.getAttribute('data-id');
  formState.editTaskId = id;
  updateFormState(title, description, priority);
  showEditFormToggle();
};
const doneTask = (e) => {
  const card = e.target.closest('.task');
  card.classList.add('task-done');
  card.classList.remove('open');
};

const runAction = (btn) => {
  const action = btn.target.innerHTML;
  if (action === 'delete') btn.target.closest('.task').remove();
  else if (action === 'edit') editTask(btn);
  else if (action === 'done') doneTask(btn);
};

const actionsToggle = (btn) => {
  const neighbor = btn.target.nextSibling;
  neighbor.style.display = (neighbor.style.display === 'none') ? 'block' : 'none';
};


const createElem = (details) => {
  const el = document.createElement('div');
  const name = document.createElement('p');
  const description = document.createElement('p');
  const priority = document.createElement('p');
  const btn = document.createElement('button');
  const actions = document.createElement('ul');

  el.classList.add('task', 'open');
  el.setAttribute('data-id', formState.taskID);
  // eslint-disable-next-line no-plusplus
  formState.taskID++;
  name.innerHTML = details.title;
  name.classList.add('list-task-title');
  description.innerHTML = details.description;
  description.classList.add('list-task-description');
  priority.innerHTML = details.priority;
  priority.classList.add('list-task-priority');
  btn.innerHTML = '...';
  btn.classList.add('list-task-actions');
  btn.addEventListener('click', (e) => { actionsToggle(e); });
  actions.classList.add('task-actions');
  actions.style.display = 'none';

  el.appendChild(name);

  el.appendChild(description);
  taskActions.forEach((item) => {
    const action = document.createElement('li');
    const actionBtn = document.createElement('button');
    actionBtn.innerHTML = item;
    actionBtn.classList.add(item);
    actionBtn.addEventListener('click', (e) => { runAction(e); });
    action.appendChild(actionBtn);
    actions.appendChild(action);
  });
  el.appendChild(priority);
  el.appendChild(btn);
  el.appendChild(actions);
  return el;
};

const getNewTaskDetails = () => {
  const details = {};
  const temp = document.querySelector('#task-priority');
  details.priority = temp.options[temp.selectedIndex].value;
  details.title = document.querySelector('input[name=task-title]').value;
  details.description = document.querySelector('textarea[name=task-description]').value;
  return details;
};

const appendToDOM = (DOM, newElem) => DOM.appendChild(newElem);

const addTask = () => {
  if (formState.editTaskId) {
    saveChanges(formState.editTaskId);
    showEditFormToggle();
    formState.editTaskId = false;
  } else {
    const details = Object.assign(getNewTaskDetails());
    const elem = createElem(details);
    const parrent = document.querySelector('#task-list');
    appendToDOM(parrent, elem);
    updateFormState('', '', 'high');
    showEditFormToggle();
  }
};

const cancelTask = () => {
  updateFormState('', '', 'high');
  showEditFormToggle();
};

const filterTasks = () => {
  const filterString = document.querySelector('#task-name').value;
  const allTasks = [].slice.call(document.querySelectorAll('.list-task-title')) || [];
  const allTasksPriority = [].slice.call(document.querySelectorAll('.list-task-priority')) || [];
  const temp = document.querySelector('#filter-priority');
  const temp2 = document.querySelector('#filter-status');
  const filterPriority = temp.options[temp.selectedIndex].value;
  const filterStatus = temp2.options[temp2.selectedIndex].value;

  allTasks.forEach((item) => {
    const cardTemp = item.closest('.task');
    cardTemp.style.display = (item.innerHTML.includes(filterString)) ? 'block' : 'none';
  });

  if (filterPriority !== 'all') {
    allTasksPriority.forEach((item) => {
      const cardTemp = item.closest('.task');
      if (item.innerHTML !== filterPriority) cardTemp.style.display = 'none';
    });
  }

  if (filterStatus === 'done') {
    const open = [].slice.call(document.querySelectorAll('.open')) || [];
    open.forEach((item) => {
      const el = item;
      el.style.display = 'none';
    });
  } else if (filterStatus === 'open') {
    const done = [].slice.call(document.querySelectorAll('.task-done')) || [];
    done.forEach((item) => {
      const elem = item;
      elem.style.display = 'none';
    });
  }
};


// init start state
document.addEventListener('submit', (e) => e.preventDefault());
document.querySelector('#add-task').addEventListener('click', addTask);
document.querySelector('#cancel-task').addEventListener('click', cancelTask);
document.querySelector('#create').addEventListener('click', showEditFormToggle);
document.querySelector('#task-name').addEventListener('input', filterTasks);
document.querySelector('#filter-priority').addEventListener('change', filterTasks);
document.querySelector('#filter-status').addEventListener('change', filterTasks);
updateFormState('', '', 'normal');
