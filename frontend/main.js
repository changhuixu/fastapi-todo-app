const titleEditInput = document.getElementById('title-edit');
const descEditInput = document.getElementById('desc-edit');
let data = [];
let selectedTodo = {};
const BASE_URL = 'https://fastapi-todo-app-r10q.onrender.com/todos';

// GET - Fetch all todos
const getTodos = async () => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const todos = await response.json();
    console.log('Todos fetched successfully:', todos);
    return todos;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

// POST - Create a new todo
const createTodo = async (todo) => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const newTodo = await response.json();
    console.log('Todo created successfully:', newTodo);
    return newTodo;
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
};

// PUT - Update an existing todo by ID
const updateTodo = async (id, updatedTodo) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTodo),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const todo = await response.json();
    console.log('Todo updated successfully:', todo);
    return todo;
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

// DELETE - Delete a todo by ID
const deleteTodo = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    console.log(`Todo with ID ${id} deleted successfully`);
    return true;
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};

document.getElementById('form-add').addEventListener('submit', async (e) => {
  e.preventDefault();
  await addTodo();
});

const addTodo = async () => {
  const titleInput = document.getElementById('title');
  const descInput = document.getElementById('desc');
  const msgDiv = document.getElementById('msg');

  if (!titleInput.value || !descInput.value) {
    msgDiv.innerHTML = 'Todo cannot be blank';
    return;
  }

  await createTodo({
    title: titleInput.value.trim(),
    desc: descInput.value.trim(),
  }).then((newTodo) => {
    data.push(newTodo);
    refreshTodos();
    // close modal
    const closeBtn = document.getElementById('add-close-btn');
    closeBtn.click();
    // clean up
    msgDiv.innerHTML = '';
    titleInput.value = '';
    descInput.value = '';
  });
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
          <pre class="text-secondary ps-3">${x.desc}</pre>
  
          <span class="options">
            <i onclick="tryEditTodo(${x.id})" data-bs-toggle="modal" data-bs-target="#modal-edit" class="fas fa-edit"></i>
            <i onclick="removeTodo(${x.id})" class="fas fa-trash-alt"></i>
          </span>
        </div>
    `);
    });
};

const removeTodo = async (id) => {
  await deleteTodo(id).then((_) => {
    data = data.filter((x) => x.id !== id);
    refreshTodos();
  });
};

const tryEditTodo = (id) => {
  const todo = data.find((x) => x.id === id);
  selectedTodo = todo;
  const todoId = document.getElementById('todo-id');
  todoId.innerText = todo.id;
  titleEditInput.value = todo.title;
  descEditInput.value = todo.desc;
};

document.getElementById('form-edit').addEventListener('submit', async (e) => {
  e.preventDefault();

  const msgDiv = document.getElementById('msg-edit');

  if (!titleEditInput.value) {
    msgDiv.innerHTML = 'Todo cannot be blank';
    return;
  }

  await updateTodo(selectedTodo.id, {
    title: titleEditInput.value.trim(),
    desc: descEditInput.value.trim(),
  }).then((updatedTodo) => {
    selectedTodo.title = updatedTodo.title;
    selectedTodo.desc = updatedTodo.desc;
    refreshTodos();
    // close modal
    const closeBtn = document.getElementById('edit-close');
    closeBtn.click();
  });
});

(async () => {
  await getTodos().then((todos) => {
    data = todos;
    refreshTodos();
  });
})();
