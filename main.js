window.addEventListener('load', () => {
    const body = document.querySelector('body')
    todos = JSON.parse(localStorage.getItem('todos')) || [];
    const nameInput = document.querySelector('#name');
    const newTodoForm = document.querySelector('#new-todo-form');

    const username = localStorage.getItem('username') || '';
    const toggle = document.querySelector(".toggle");
    let getMode = localStorage.getItem('mode');
    if(getMode && getMode === "dark"){
        body.classList.add('dark')
        toggle.classList.add('active')
    }

    toggle.addEventListener("click", () => toggle.classList.toggle("active"))
    toggle.addEventListener('click', () => {
        body.classList.toggle('dark')

        if(!body.classList.contains("dark")){
            return localStorage.setItem('mode', 'light')
        }
        localStorage.setItem('mode', 'dark')
    })

    nameInput.value = username;

    nameInput.addEventListener('change', (e) => {
        localStorage.setItem('username', e.target.value);
    })

    newTodoForm.addEventListener('submit', e => {
        e.preventDefault();

        // Validate the form fields
        const contentValue = e.target.elements.content.value.trim();
        const categoryValue = e.target.elements.category.value.trim();
        const dueDateValue = e.target.elements.dueDate.value.trim();

        if (!contentValue || !categoryValue || !dueDateValue) {
            // Alert the user or provide feedback that all fields are required
            alert("Please fill in all fields.");
            return;
        }

        const todo = {
            content: contentValue,
            category: categoryValue,
            dueDate: dueDateValue,
            done: false,
            createdAt: new Date().getTime()
        }


        todos.push(todo);

        localStorage.setItem('todos', JSON.stringify(todos));

        // Reset the form
        e.target.reset();

        DisplayTodos()
    })

    DisplayTodos()
})

function DisplayTodos () {
    const todoList = document.querySelector('#todo-list');
    todoList.innerHTML = "";

    todos.sort((a, b) => {
        return new Date(a.dueDate) - new Date(b.dueDate);
    });

    todos.forEach(todo => {
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
        actions.classList.add('actions');
        edit.classList.add('edit');
        deleteButton.classList.add('delete');

        content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
        dueDate.innerHTML = `<input type="text" value="${todo.dueDate}" readonly>`;
        edit.innerHTML = 'Edit';
        deleteButton.innerHTML = 'Delete';

        label.appendChild(input);
        label.appendChild(span);
        actions.appendChild(edit);
        actions.appendChild(deleteButton);
        todoItem.appendChild(label);
        todoItem.appendChild(content);
        todoItem.appendChild(dueDate);
        todoItem.appendChild(actions);

        todoList.appendChild(todoItem);

        if (todo.done) {
            todoItem.classList.add('done');
        }

        input.addEventListener('change', (e) => {
            todo.done = e.target.checked;
            localStorage.setItem('todos', JSON.stringify(todos));

            if (todo.done) {
                todoItem.classList.add('done');
            } else {
                todoItem.classList.remove('done');
            }

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