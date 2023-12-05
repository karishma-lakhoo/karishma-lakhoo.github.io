// Event listener when the window has finished loading
window.addEventListener('load', () => {
    const body = document.querySelector('body')
    todos = JSON.parse(localStorage.getItem('todos')) || [];
    const nameInput = document.querySelector('#name');
    const newTodoForm = document.querySelector('#new-todo-form');

    const username = localStorage.getItem('username') || '';
    const toggle = document.querySelector(".toggle");
    const isDarkModeEnabled = localStorage.getItem('mode') === 'dark';
    nameInput.value = username;


    if (isDarkModeEnabled) {
        body.classList.add('dark');
        toggle.classList.add('active');
    }

    // Event listener for toggling dark mode
    toggle.addEventListener("click", () => toggle.classList.toggle("active"))
    toggle.addEventListener('click', () => {
        body.classList.toggle('dark')

        if(!body.classList.contains("dark")){
            return localStorage.setItem('mode', 'light')
        }
        localStorage.setItem('mode', 'dark')
    })

    // Event listener for changing the username
    nameInput.addEventListener('change', (e) => {
        localStorage.setItem('username', e.target.value);
    })

    // Event listener for adding a new todo
    newTodoForm.addEventListener('submit', e => {
        e.preventDefault();

        // Validate the form fields
        const contentValue = e.target.elements.content.value.trim();
        const categoryValue = e.target.elements.category.value.trim();
        const dueDateValue = e.target.elements.dueDate.value.trim();

        if (!contentValue || !categoryValue || !dueDateValue) {
            // Alert the user or provide feedback that all fields are required
            showCustomAlert("Please fill in all fields.");
            return;
        }

        // Creating a new todo object
        const todo = {
            content: contentValue,
            category: categoryValue,
            dueDate: dueDateValue,
            done: false,
        }

        // Adding the todo to the list and saving todos to local storage
        todos.push(todo);

        localStorage.setItem('todos', JSON.stringify(todos));

        // Reset the form
        e.target.reset();
        // displaying the updated list of todos
        DisplayTodos()
    })
    // initial display of todos
    DisplayTodos()
})


// Function to display todos
function DisplayTodos () {
    const todoList = document.querySelector('#todo-list');
    todoList.innerHTML = "";

    todos.sort((a, b) => {
        return new Date(a.dueDate) - new Date(b.dueDate);
    });

    todos.map(todo => {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');

        const label = document.createElement('label');
        const input = document.createElement('input');
        const span = document.createElement('span');
        const content = document.createElement('div');
        const dueDate = document.createElement('div');
        const actions = document.createElement('div');
        const edit = document.createElement('button');
        const deleteButton = document.createElement('button');


        input.type = 'checkbox';
        input.checked = todo.done;
        span.classList.add('bubble');
        if (todo.category === 'Personal') {
            span.classList.add('personal');
        } else {
            span.classList.add('business');
        }
        content.classList.add('todo-content');
        dueDate.classList.add('due-date')
        actions.classList.add('actions');
        edit.classList.add('edit');
        deleteButton.classList.add('delete');

        // replacing the innerHTML
        // content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
        const contentInput = document.createElement('input');
        contentInput.type = 'text'
        contentInput.value = todo.content
        contentInput.readOnly = true;
        content.appendChild(contentInput)

        // replacing the innerHTML
        // dueDate.innerHTML = `<input type="text" value="${todo.dueDate}" readonly>`;
        const dueDateInput = document.createElement("input");
        dueDateInput.type = 'text'
        dueDateInput.value = todo.dueDate
        dueDateInput.readOnly = true
        dueDate.appendChild(dueDateInput)

        // edit.innerHTML = 'Edit';
        edit.innerText = "Edit"
        // deleteButton.innerHTML = 'Delete';
        deleteButton.innerText = "Delete"

        // Appending elements to the todo item
        label.appendChild(input);
        label.appendChild(span);
        actions.appendChild(edit);
        actions.appendChild(deleteButton);
        todoItem.appendChild(label);
        todoItem.appendChild(content);
        todoItem.appendChild(dueDate);
        todoItem.appendChild(actions);

        // Appending todo item to the todo list
        todoList.appendChild(todoItem);

        // Adding 'done' class to check if the todo is completed
        if (todo.done) {
            todoItem.classList.add('done');
        }
        // Event Listener to check the changes in the checkbox
        input.addEventListener('change', (e) => {
            todo.done = e.target.checked;
            localStorage.setItem('todos', JSON.stringify(todos));
            // adding and removing the done items
            if (todo.done) {
                todoItem.classList.add('done');
            } else {
                todoItem.classList.remove('done');
            }
            // displaying updated todos
            DisplayTodos()

        })

        edit.addEventListener('click', (e) => {
            const input = content.querySelector('input');
            input.removeAttribute('readonly');
            input.focus();
            input.addEventListener('blur', (e) => {
                input.setAttribute('readonly', true);
                todo.content = e.target.value;
                localStorage.setItem('todos', JSON.stringify(todos));
                DisplayTodos()

            })
        })

        deleteButton.addEventListener('click', (e) => {
            todos = todos.filter(t => t !== todo);
            localStorage.setItem('todos', JSON.stringify(todos));
            DisplayTodos()
        })

    })
}

function showCustomAlert(message) {
    var customAlert = document.getElementById('customAlert')
    var alertContent = customAlert.querySelector('p');
    alertContent.textContent = message;
    customAlert.style.display = 'block'
}

function closeAlert(){
    var customAlert = document.getElementById('customAlert')
    customAlert.style.display = "none";

}