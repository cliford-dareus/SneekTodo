const todoList = document.querySelector('.todo_list');
const form = document.querySelector('.form');
const input = document.getElementById('todo_input');
const clearBtn = document.querySelector('.clear_btn');
const addBtn = document.querySelector('.add_btn');
const text = document.getElementById('text_input');
const formInput = document.querySelector('.form_input');
const body_ = document.querySelector('.note');
const select= document.querySelector('.category');
const addNavBtn = document.querySelector('.nav_addBtn');
const darkMode = document.querySelector('.dark_mode');
const category = document.querySelectorAll('.category_card');
const box = document.querySelector('.box');
const mobileBtn = document.querySelector('.mobile_btn');
const leftSide = document.querySelector('.left_side');

form.addEventListener('submit', showsmt);
clearBtn.addEventListener('click', clearList);
addBtn.addEventListener('click', addTOList);
addNavBtn.addEventListener('click', addTOList);
darkMode.addEventListener('click', toggleDarkMode);
mobileBtn.addEventListener('click', toggleMenu);
category.forEach(i => i.addEventListener('click', getCategory))
window.addEventListener('DOMContentLoaded', setupItems);

let edit;
let editSelect;
let editing = false;
let editingId = '';


function showsmt(e) {
    e.preventDefault();
    const newTodo = form.elements[0].value;
    const textContent = form.elements[2].value.toString();
    const category = select.value

    let todo = {
        title: newTodo,
        text_: textContent,
        date: new Date(),
        category: category
    }
    console.log('show_form')
    createTodo(todo);
    form.reset();
};

function addTOList(){
    formInput.classList.toggle('show_form')
    showCategory();
}

function createTodo(todo){
    const {title, date, text_, category} = todo;
    const id = date.getTime().toString();

    if(input.value !== '' && editing === false ){
        const emptyTodo = document.querySelector('.todo_empty');
        if(emptyTodo){
            emptyTodo.classList.add('hide_todo_empty');  
        }
            
        const element = document.createElement('li');
        element.classList.add('todo');
        const attr = document.createAttribute('data-id');
        attr.value = id;
        element.setAttributeNode(attr); 

        element.innerHTML = `
            <h3>${title}</h3> 
            <p>${date.toDateString()}</p>
            <button class="edit">
                <i class="ri-edit-line"></i>
            </button>
            <button class="delete">
                <i class="ri-delete-bin-2-line"></i>
            </button>
        `
            
        const editBtn = element.querySelector('.edit');
        const delet = element.querySelector('.delete');
        editBtn.addEventListener('click',editTodo);
        delet.addEventListener('click', deleteTodo);  

        const r = text_


        element.addEventListener('click', ()=>{
            console.log(r);
            setBodyHtml(r)});

        todoList.appendChild(element);
        // add to localStorage
        addToLocalStorage(id, todo={
            content: title,
            date: date.toDateString(),
            text: text_,
            category: category
        });
        setBackToDefault();
        
    }else if(input.value !== '' && editing === true){
        edit.innerHTML = input.value;
        editSelect.innerHTML = text.value;
        // edit localStorage\
        let values = {
            text_: text.value,
            title: input.value
        }

        setBodyHtml(text.value)
        editLocalStorage(editingId, values);
        setupItems();
        setBackToDefault();
        formInput.classList.remove('show_form');
    }else{
        console.log('Please enter a valid value');
    }
    
}

function setBodyHtml(text){
    body_.innerHTML = '';

    const element = document.createElement('div');
    element.classList.add('text_');
    element.innerHTML = 
    `
        <p>${text}</p>
    `

    hideCategory();

    formInput.classList.remove('show_form')
    body_.appendChild(element);
};

function getCategory(e){
    todoList.innerHTML = '';

    const filterId = e.target.alt
    let items = localStorage.getItem('list')? JSON.parse(localStorage.getItem('list')):[];
    let filterItems = []

    if(filterId === 'fun'){
        filterItems = items.filter(item =>{
            if(filterId.toLowerCase() === item.content.category){
                return item.id
            }
        })
    }

    if(filterId === 'business'){
        filterItems = items.filter(item =>{
            if(filterId.toLowerCase() === item.content.category){
                return item.id
            }
        })
    }

    if(filterId === 'personal'){
        filterItems = items.filter(item =>{
            if(filterId.toLowerCase() === item.content.category){
                return item.id
            }
        })
    }

    console.log(filterItems)

    // filterItems.forEach(item =>{
    //     filterHtml(item.id,{
    //         title: item.content.content,
    //         text_: item.content.text,
    //         date: item.content.date,
    //         category: item.content.category
    //     })
    // });

    for (let i = 0; i < filterItems.length; i++){
        filterHtml(filterItems[i].id,filterItems[i].content)
        console.log('eeeeeee')
    }
}

function filterHtml(id, items){
    const { content, date, text} = items

    console.log('hello')

    if(editing === false ){
        const element = document.createElement('li');
        element.classList.add('todo');
        const attr = document.createAttribute('data-id');
        attr.value = id;
        element.setAttributeNode(attr); 
        
        element.innerHTML = `
        <h3>${content}</h3> 
        <p>${date}</p>
        <button class="edit">
        <i class="ri-edit-line"></i>
        </button>
        <button class="delete">
        <i class="ri-delete-bin-2-line"></i>
        </button>
        `
                
        const editBtn = element.querySelector('.edit');
        const delet = element.querySelector('.delete');
        editBtn.addEventListener('click',editTodo);
        delet.addEventListener('click', deleteTodo);  
        
        element.addEventListener('click', () => {
            setBodyHtml(text)});
            
        setBackToDefault();
        todoList.appendChild(element);
    }
    
}

function showCategory(){
    body_.innerHTML = '';
    box.classList.add('box-on');
    console.log('im working')
}

function hideCategory(){
    box.classList.remove('box-on');
}

function deleteTodo(e){
    const element = e.currentTarget.parentElement;
    const id = element.dataset.id

    todoList.removeChild(element);
    removeFromLocalStorage(id)
    setBackToDefault();
}

function clearList() {
    const items = document.querySelectorAll('.todo');
    todoList.innerHTML = '';
    todoList.childElementCount === 0 ? emptyTodo(): '';

    console.log(todoList.childElementCount === 0);
     
    if(items.length > 0) {
        items.forEach(function(item){
            todoList.removeChild(item)
        })
    }

    setBackToDefault();
    showCategory();
    localStorage.removeItem("list");
}

function editTodo(e){
    const element = e.currentTarget.parentElement;
    edit = e.currentTarget.previousElementSibling.previousElementSibling;
    const t = document.querySelector('.text_')
    editSelect = t.firstElementChild
    
    input.value = edit.innerHTML;
    text.value = editSelect.innerHTML;
    editing = true;
    editingId = element.dataset.id;
    formInput.classList.add('show_form');
}

function setBackToDefault() {
    form.reset();
    editing = false;
    editingId = "";
}

function addToLocalStorage(id, content){
    const data = { id, content };
    let items = localStorage.getItem('list')? JSON.parse(localStorage.getItem('list')):[];
    items.push(data);
    localStorage.setItem('list',JSON.stringify(items));
}

function removeFromLocalStorage(id){
    let items = localStorage.getItem('list')? JSON.parse(localStorage.getItem('list')):[];

    items = items.filter(item => {
        if(item.id !== id){
            return item
        }
    });
    localStorage.setItem('list',JSON.stringify(items));
}

function editLocalStorage(id, content){
    let items = localStorage.getItem('list')? JSON.parse(localStorage.getItem('list')):[];

    items = items.map(item => {
        if(item.id === id){
            item.content.text = content.text_,
            item.content.content = content.title
        }
        return item;
    })
    localStorage.setItem('list',JSON.stringify(items));
}

function toggleDarkMode(){
    document.body.classList.toggle('dark_mode');
    setMode()
}

function toggleMenu(){
    leftSide.classList.toggle('left_side-open');
}

function setMode(){
    if(document.body.classList.contains('dark_mode')){
        localStorage.setItem('mode', 'true');
    }else{
        localStorage.setItem('mode', 'false');
    }
}

// set Item
function setupItems() {
    todoList.innerHTML = '';  
    let items = localStorage.getItem('list')? JSON.parse(localStorage.getItem('list')):[];
    let mode = localStorage.getItem('mode')

    mode === 'true'? document.body.classList.add('dark_mode'):
            document.body.classList.remove('dark_mode');
    
    if (items.length > 0) {
        items.forEach(function (item) {
            createListItem(item.id, item.content);
        });
    }

    if(items.length === 0) {
        emptyTodo();
    }

    showCategory();

}

function createListItem(id, value) {
    const element = document.createElement("li");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("todo");
    element.innerHTML = `
    <h3>${value.content}</h3> 
    <p>${value.date}</p>
    <button class="edit">
    <i class="ri-edit-line"></i>
    </button>
    <button class="delete">
    <i class="ri-delete-bin-2-line"></i>
    </button>
    `
    // add event listeners to both buttons
    const editBtn = element.querySelector('.edit');
    const delet = element.querySelector('.delete');
    delet.addEventListener('click', deleteTodo); 
    
    element.addEventListener('click',()=>{
        body_.innerHTML = '';

        editBtn.addEventListener('click', editTodo);
        const element = document.createElement('div');
        element.classList.add('text_');
        
        element.innerHTML = 
        `
        <p>${value.text}</p>
        `

        hideCategory();
        body_.appendChild(element);
    });
    
    // append child
    todoList.appendChild(element);
}

function emptyTodo(){
    const element = document.createElement('div');
    element.classList.add('todo_empty');
    element.innerHTML = `
        <h4>Note Empty</h4>
        <p>Add new Note</p>
    `
    todoList.appendChild(element);
}