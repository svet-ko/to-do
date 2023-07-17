(function() {
    let memArray = [];

    function getLocalStorageByKey(key) {
       return JSON.parse(localStorage.getItem(key));
    }

    function setLocalStorage(tmpArray) {
        localStorage.setItem(window.keyToDo, JSON.stringify(tmpArray));
    }

    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createToDoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div'); //Bootstrap stylization issues
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3'); //input-group - Bootstrap stylization, mb-3 - margin after form
        input.classList.add('form-control');
        input.placeholder = 'Enter the name of the new task';
        buttonWrapper.classList.add('input-group-append'); //bootstrap positioning
        button.classList.add('btn', 'btn-secondary'); //btn - bootstrap button, btn-primary - main button style
        button.textContent = 'Add task';

        button.disabled = true;

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button
        }
    }

    function createToDoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createToDoItem(name) {
        let item = document.createElement('li');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        //стили для элемента списка и размещения кнопок пр помощи flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Done';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Remove';

        //объединяем в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        return {
            item,
            doneButton,
            deleteButton,
        };
    }

    function prepareToDoItem(todoItem) {
        let loadedItem = createToDoItem(todoItem.name);
        memArray.push(todoItem);

        if (todoItem.done){
            loadedItem.item.classList.add('list-group-item-success');
        }

        loadedItem.doneButton.addEventListener('click', function() {
            todoItem.done = !todoItem.done;
            loadedItem.item.classList.toggle('list-group-item-success');
        });

        loadedItem.deleteButton.addEventListener('click', function() {
            if (confirm('Вы уверены?')) {
                memArray.splice(memArray.indexOf(todoItem), 1);
                loadedItem.item.remove();
            }
        });

        return loadedItem.item;
    }

    function createToDoApp(container, title = 'Список дел', toDosArray=null) {
        //let container = document.getElementById('todo-app');
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createToDoItemForm();
        let todoList = createToDoList();

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);


        if (toDosArray !== null ) {
            for (let toDosArrayItem of toDosArray) {
                todoList.append(prepareToDoItem(toDosArrayItem));
            }
        }

        todoItemForm.input.addEventListener('input', function() {
            todoItemForm.button.classList.remove('btn-secondary');
            todoItemForm.button.classList.add('btn-primary');
            todoItemForm.button.disabled = false;
            if (!todoItemForm.input.value) {
                todoItemForm.button.classList.remove('btn-primary');
                todoItemForm.button.classList.add('btn-secondary');
                todoItemForm.button.disabled = true;
            }
        });


        todoItemForm.form.addEventListener('submit', function(e){
            e.preventDefault();
            if (!todoItemForm.input.value) {
                return;
            }

            //let memArrayItemName = todoItemForm.input.value;
            let memArrayItem = {
                name: todoItemForm.input.value,
                done: false,
            };
            todoList.append(prepareToDoItem(memArrayItem));

            todoItemForm.input.value = '';
            todoItemForm.button.classList.remove('btn-primary');
            todoItemForm.button.classList.add('btn-secondary');
            todoItemForm.button.disabled = true;

        });
    }

    //отображение на одной странице:

    /*
    document.addEventListener('DOMContentLoaded', function() {
        createToDoApp(document.getElementById('my-todos'), 'Мои дела');
        createToDoApp(document.getElementById('mum-todos'), 'Мамины дела');
        createToDoApp(document.getElementById('dad-todos'), 'Папины дела');
    });
    */
    window.onbeforeunload = closingCode;
    function closingCode() {
        setLocalStorage(memArray);
       return null;
    }

    window.getLocalStorageByKey = getLocalStorageByKey;
    window.createToDoApp = createToDoApp;
})();
