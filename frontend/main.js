let titleInput = document.getElementById('title');
let descInput = document.getElementById('desc');
let titleEditInput = document.getElementById('title-edit');
let descEditInput = document.getElementById('desc-edit');
let data = [];
let selectedTodo = {};
const api = 'https://fastapi-todo-app-r10q.onrender.com';

function tryAdd() {
  let msg = document.getElementById('msg');
  msg.innerHTML = '';
}

document.getElementById('form-add').addEventListener('submit', (e) => {
  e.preventDefault();

  if (!titleInput.value) {
    document.getElementById('msg').innerHTML = 'Todo cannot be blank';
  } else {
    addTodo(titleInput.value, descInput.value);
  }
});

const addTodo = (title, description) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 201) {
      const newTodo = JSON.parse(xhr.responseText);
      data.push(newTodo);
      refreshTodos();
      // close modal
      const closeBtn = document.getElementById('add-close');
      closeBtn.click();
    }
  };
  xhr.open('POST', api, true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.send(JSON.stringify({ title, description }));
};

const refreshTodos = () => {
  const todos = document.getElementById('todos');
  todos.innerHTML = '';
  data
    .sort((a, b) => b.id - a.id)
    .map((x) => {
      return (todos.innerHTML += `
        <div id="todo-${x.id}">
          <span class="fw-bold fs-4">${x.title}</span>
          <pre class="text-secondary ps-3">${x.description}</pre>
  
          <span class="options">
            <i onClick="tryEditTodo(${x.id})" data-bs-toggle="modal" data-bs-target="#modal-edit" class="fas fa-edit"></i>
            <i onClick="deleteTodo(${x.id})" class="fas fa-trash-alt"></i>
          </span>
        </div>
    `);
    });

  resetForm();
};
const tryEditTodo = (id) => {
  const todo = data.find((x) => x.id === id);
  selectedTodo = todo;
  const todoId = document.getElementById('todo-id');
  todoId.innerText = todo.id;
  titleEditInput.value = todo.title;
  descEditInput.value = todo.description;
  document.getElementById('msg').innerHTML = '';
};

document.getElementById('form-edit').addEventListener('submit', (e) => {
  e.preventDefault();

  if (!titleEditInput.value) {
    msg.innerHTML = 'Todo cannot be blank';
  } else {
    editTodo(titleEditInput.value, descEditInput.value);
  }
});
const editTodo = (title, description) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      selectedTodo.title = title;
      selectedTodo.description = description;
      refreshTodos();
      // close modal
      const closeBtn = document.getElementById('edit-close');
      closeBtn.click();
    }
  };
  xhr.open('PUT', `${api}/${selectedTodo.id}`, true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.send(JSON.stringify({ title, description }));
};

const deleteTodo = (id) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      data = data.filter((x) => x.id !== id);
      refreshTodos();
    }
  };
  xhr.open('DELETE', `${api}/${id}`, true);
  xhr.send();
};

const resetForm = () => {
  titleInput.value = '';
  descInput.value = '';
};

const getTodos = () => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      data = JSON.parse(xhr.responseText) || [];
      refreshTodos();
    }
  };
  xhr.open('GET', api, true);
  xhr.send();
};

(() => {
  getTodos();
})();
