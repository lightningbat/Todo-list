// sets the theme based on the applied_theme variable
function set_theme() {
    if (applied_theme) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}
// used by the button to toggle the theme
function toggleTheme() {
    applied_theme = !applied_theme;
    set_theme();
    set_theme_data(applied_theme);
}

// update style of popup background layer
const style_pbl = (display_type = "none", bkg_clr = "rgba(0, 0, 0, 0)") => {
    popup_bkg_layer.style.display = display_type;
    popup_bkg_layer.style.backgroundColor = bkg_clr;
}

const custom_confirm = (title = '', message = '') => {
    return new Promise((resolve, reject) => {
        // making the popup background layer appear behind the confirmation
        style_pbl('block', 'rgba(0, 0, 0, 0.5)');

        // display the confirm layout
        custom_confirm_layout.style.display = 'block';
        custom_confirm_layout.querySelector('.confirm-title').textContent = title;
        custom_confirm_layout.querySelector('.confirm-message').textContent = message;

        const cancelled = () => {
            custom_confirm_layout.style.display = 'none';
            style_pbl()
            resolve(0); // returning 0 when cancelled
        }

        custom_confirm_layout.querySelector('.btn-cancel').onclick = cancelled;
        popup_bkg_layer.onclick = cancelled;
        
        custom_confirm_layout.querySelector('.btn-delete').addEventListener('click', () => {
            custom_confirm_layout.style.display = 'none';
            style_pbl()
            resolve(1); // returning 1 when confirmed
        })
    })
}

// creates a new label
function add_label(label_id, label_clr, label_text){
    // creating label using pre defined template
    const temp_clone = label_temp.content.cloneNode(true);
    labels_cont.appendChild(temp_clone);

    // getting the newly created label
    const label = labels_cont.children[labels_cont.children.length - 1];

    label.id = label_id;
    label.querySelector('.label-color').classList.add(label_clr);
    label.querySelector('.label-text').textContent = label_text;

    label.addEventListener('click', () => {
        select_label(label_id);
    })

    // div to hold tasks for each label
    // as each label has a different container for tasks
    // sub notes div is nested inside the notes_cont
    const sub_notes_cont = document.createElement('div');
    sub_notes_cont.id = label_id + '-notes';
    sub_notes_cont.classList.add('notes');
    notes_cont.appendChild(sub_notes_cont);
}

function select_label(label_id){
    // loading all the tasks of the selected label if not loaded
    if (! Labels[label_id].is_loaded) {
        // retrieving tasks of the selected label from server
        get_tasks(label_id);

        Labels[label_id].is_loaded = true;
    }

    if (selected_label != label_id) // disable selection of already selected label
    {
        if (selected_label != undefined){ // if some other label was selected
            document.getElementById(selected_label).classList.remove('selected');
            // hiding the notes of the previously selected label
            document.getElementById((selected_label + '-notes')).style.display = 'none';
        }
        // showing the notes of the newly selected label
        document.getElementById((label_id + '-notes')).style.display = 'grid';
        document.getElementById(label_id).classList.add('selected');
        // updating selected_label
        selected_label = label_id;
    }
}

function open_label_menu(label_id, event){
    // preventing propagation of click event
    (event) ? event.stopPropagation() : null;

    // adding popup background layer
    style_pbl('block', 'rgba(0, 0, 0, 0.05)');
    popup_bkg_layer.onclick = ()=> {close_label_menu(label_id)};

    // enabling pc menu
    document.getElementById(label_id).querySelector('.popup').style.visibility = 'visible';

    // enabling mobile menu
    mobile_label_menu.style.visibility = 'visible';
    mobile_label_menu.querySelector('.lbl-color').className = 'lbl-color ' + Labels[label_id].color;
    mobile_label_menu.querySelector('.lbl-text').textContent = Labels[label_id].name;
    mobile_label_menu.querySelector('.close-btn').setAttribute('onclick', `close_label_menu('${label_id}')`);
    mobile_label_menu.querySelector('.btn-del').setAttribute('onclick', `delete_label('${label_id}')`);
    mobile_label_menu.querySelector('.btn-edit').setAttribute('onclick', `open_label_editor('${label_id}')`);
}

function close_label_menu(label_id) {
    // removing popup background layer
    style_pbl();
    // hiding pc and mobile menu
    document.getElementById(label_id).querySelector('.popup').style.visibility = 'hidden';
    mobile_label_menu.style.visibility = 'hidden';
}

function open_label_editor(label_id, event){
    (event) ? event.stopPropagation() : null;

    // if label_id not undefined, then the function was called by label menu edit btn
    if (label_id) close_label_menu(label_id);

    // adding popup background layer
    style_pbl('block', 'rgba(0, 0, 0, 0.5)');
    popup_bkg_layer.onclick = close_label_editor;

    const temp_clone = label_editor_temp.content.cloneNode(true);
    document.body.appendChild(temp_clone);

    selected_clr = label_id ? Labels[label_id].color : 'clr-red-1';

    if (label_id) {
        // displaying label's name and clr in the editor
        // if any pre existed lbl is opened for editing
        document.body.querySelector('.label-editor input').value = Labels[label_id].name;
        style_lbl_editor_clrBox();
        document.body.querySelector('.label-editor .btn-create').textContent = "Update";
    }

    // adding color selector
    // to prevent cloning of color selector template every time user wants to edit the color
    // and since it has display none property by default so it doesn't show up instantly
    document.body.appendChild(clr_selector_temp.content.cloneNode(true));

    // all the color boxes in the color selector
    const clr_boxes = document.querySelector('.clr-selector-cont .colors-cont').children;

    // adding click listeners to all the color boxes
    for (let i = 0; i < clr_boxes.length; i++) {
        clr_boxes[i].onclick = function () {
            // passing the class name of the color box
            select_clr(clr_boxes[i].classList.item(0));
        }
    }
    
    // selecting the color box(of color selector) for the first time
    style_clr_box();

    document.body.querySelector('.label-editor .btn-create').onclick = () => {
        if (label_id) edit_label(label_id);
        else create_label();
    };
}

// sets label editor color box to selected color
function style_lbl_editor_clrBox(){
    document.body.querySelector('.label-editor .label-color').className = "label-color clr-selected " + selected_clr;
}

function close_label_editor(){
    style_pbl();
    document.body.querySelector('.label-editor').remove();
    document.body.querySelector('.clr-selector-cont').remove();
}

function open_clr_selector(){
    document.querySelector('.clr-selector-cont').style.display = 'block';
}
function close_clr_selector(){
    document.querySelector('.clr-selector-cont').style.display = 'none';
}

function select_clr(clr_class){
    const colors_cont = document.querySelector('.colors-cont');
    try{
        // changing style of last selected clr
        colors_cont.querySelector('.selected').classList.remove('selected');
    }
    catch(err){/* no clr_box was selected */}
    finally{
        selected_clr = clr_class;
        style_clr_box();
        style_lbl_editor_clrBox();
        setTimeout(close_clr_selector, 70);
    }
}
// style the selected clr box in the color selector
function style_clr_box(){
    const selected_clr_box = document.querySelector(`.colors-cont .${selected_clr}`);
    selected_clr_box.classList.add('selected');
    // setting outline color
    // as some clr boxes have slightly different color in dark theme
    selected_clr_box.style.outlineColor = window.getComputedStyle(selected_clr_box).backgroundColor;
}

async function create_label(){
    // getting label name from the input
    const name = document.querySelector('.label-editor input');

    if (name.value.length > 0){
        const random_id = id_generator(); // generating unique id for the label
        const result = await add_label_data(random_id, name.value, selected_clr);
        if (result.success) {
            // adding label to the view
            add_label(random_id, selected_clr, name.value)
            close_label_editor();
        }
        else{
            alert("Failed to add label\n" + result.err);
        }
    }
    else{
        name.style.borderColor = "#f00";
    }
}

async function edit_label(label_id){
    // getting label name from the input
    const name = document.querySelector('.label-editor input');

    if (name.value.length > 0)
    {
        // if no new changes were made
        if (name.value == Labels[label_id].name && selected_clr == Labels[label_id].color) {
            close_label_editor();
            return;
        }
        const result = await edit_label_data(label_id, name.value, selected_clr);
        if (result.success) {
            edit_label_in_view(label_id, name.value, selected_clr)
            close_label_editor();
        }
        else{
            alert("Failed to edit label\n" + result.err);
        }
    }
}

// updates the label configuration
function edit_label_in_view(label_id, name, clr){
    const label = document.getElementById(label_id);
    label.querySelector('.label-color').className = 'label-color ' + clr;
    label.querySelector('.label-text').textContent = name;
}

async function delete_label(label_id, event){
    (event) ? event.stopPropagation() : null;

    close_label_menu(label_id);
    const confirmation = await custom_confirm(
        `Confirm delete \n label "${capitalize(Labels[label_id].name)}" ?`,
        "All tasks under this label will also be deleted"
    );
    if (!confirmation) {
        open_label_menu(label_id);
        return;
    }

    const result = await delete_label_data(label_id);
    if (result.success) {
        close_label_menu(label_id);

        document.getElementById(label_id).remove(); // deleting the label
        document.getElementById(label_id+'-notes').remove(); // deleting its notes div

        if (selected_label == label_id){
            // if deleted label was selected, selecting another
            selected_label = undefined;
            // selecting first label, if any
            if (Object.keys(Labels).length > 0) select_label(Object.keys(Labels)[0]);
        }
    }
    else{
        alert("Failed to delete label\n" + result.err);
    }
}

function add_task(task_data){
    // task_data structure {id, parent_id, title, description, priority, completed, date_created}

    // each label has its own notes div(container to hold tasks)
    const notes = document.getElementById(`${task_data.parent_id}-notes`);
    // creating task using pre defined template
    notes.appendChild(task_template.content.cloneNode(true));

    // getting the newly created task
    const task = notes.children[notes.children.length - 1];
    task.id = task_data.id;
    task.querySelector('h2').textContent = task_data.title;
    task.querySelector('.description').textContent = task_data.description;

    task.querySelector('._date').textContent = prettifyTime(task_data.date_created);

    if (task_data.priority != -1){
        // setting priority color using the css class name defined in a list
        task.querySelector('.priority-clr').classList.add(priority_types[task_data.priority]);
    }
    else {
        // hiding the priority color box as it was not set
        task.querySelector('.priority-clr').style.display = 'none';
    }

    if (task_data.completed) task.classList.add('checked');
}

function open_task_menu(task_id){
    style_pbl("block", "rgba(0, 0, 0, 0.05)");
    popup_bkg_layer.onclick = ()=> {close_task_menu(task_id)};
    document.getElementById(task_id).querySelector('.popup').style.display = 'block';
}

function close_task_menu(task_id){
    style_pbl();
    document.getElementById(task_id).querySelector('.popup').style.display = 'none';
}

function open_task_editor(task_id){
    // closing the task menu if it was open
    // as the task_id having a value means that the task menu is open
    if (task_id) close_task_menu(task_id);

    style_pbl("block", "rgba(0, 0, 0, 0.5)");
    popup_bkg_layer.onclick = ()=> {close_task_editor(task_id)};

    selected_priority = -1; // resetting priority

    document.body.appendChild(task_editor_temp.content.cloneNode(true));

    const editor = document.querySelector('.note-editor');
    if  (task_id) {
        // if editing an existing task
        const task_data = Tasks[selected_label][task_id];

        selected_priority = task_data.priority;

        editor.querySelector(".btn-save").textContent = "Update";
        editor.querySelector("input#title-input").value = task_data.title;
        editor.querySelector("textarea#description-input").value = task_data.description;

        // setting priority color, if any is set
        if (selected_priority != -1) style_selected_priority(selected_priority, true);
    }

    editor.querySelector(".btn-save").onclick = function(){
        if (task_id) {
            edit_task(task_id);
        }
        else create_task();
    }
}

function close_task_editor(){
    style_pbl();
    document.querySelector('.note-editor').remove();
}

// mechanism to select priority
function select_priority(index) {
    // if the old selected priority is not the same as the one being selected now
    if (index != selected_priority) {
        if (selected_priority != -1) style_selected_priority(selected_priority, false); // unselecting old priority
        style_selected_priority(index, true);
        selected_priority = index;
    }
    else {
        // if the old selected priority is the same as the one being selected now
        // then unselecting it
        style_selected_priority(index, false);
        selected_priority = -1;
    }
}
function style_selected_priority(index, to_add) {
    // to_add : true to add style, false to remove style

    if (to_add) {
        document.querySelector('.note-editor .priorities-cont').children[index].classList.add('selected');
    }
    else {
        document.querySelector('.note-editor .priorities-cont').children[index].classList.remove('selected');
    }
}

async function create_task(){
    const title = document.querySelector('.note-editor input#title-input').value;
    const description = document.querySelector('.note-editor textarea#description-input').value;
    const priority = selected_priority;

    const random_id = id_generator();

    const task_data = {
        id: random_id,
        parent_id: selected_label,
        title,
        description,
        priority,
        completed: false,
        date_created: new Date().toUTCString()
    };

    const result = await add_task_data(task_data);

    if (result.success){
        add_task(task_data);
        close_task_editor();
    }
    else{
        alert("Failed to create task\n" + result.err);
    }
}

async function edit_task(task_id){
    const title = document.querySelector('.note-editor input#title-input').value;
    const description = document.querySelector('.note-editor textarea#description-input').value;
    const priority = selected_priority;

    const task_data = Tasks[selected_label][task_id];
    if (task_data.title == title && task_data.description == description && task_data.priority == priority) {
        close_task_editor();
        return;
    }

    const new_task_data = {
        id: task_id,
        parent_id: selected_label,
        title,
        description,
        priority,
        completed: Tasks[selected_label][task_id].completed,
    };

    const result = await edit_task_data(new_task_data);

    if (result.success){
        edit_task_in_view(task_id);
        close_task_editor();
    }
    else{
        alert("Failed to edit task\n" + result.err);
    }
}

function edit_task_in_view(task_id){
    const task_data = Tasks[selected_label][task_id];
    const task = document.getElementById(task_id);
    task.querySelector('h2').textContent = task_data.title;
    task.querySelector('.description').textContent = task_data.description;
    const priority_clr_box = task.querySelector('.priority-clr');
    if (task_data.priority != -1){
        priority_clr_box.style.display = 'block';
        priority_clr_box.className = 'priority-clr ' + priority_types[task_data.priority];
    }
    else{
        priority_clr_box.style.display = 'none';
    }
}

async function delete_task(task_id){
    close_task_menu(task_id);
    const confirmation = await custom_confirm('Confirm delete ?', "");
    if (!confirmation) {
        open_task_menu(task_id);
        return;
    }

    const result = await delete_task_data(task_id);
    if (result.success){
        document.getElementById(task_id).remove();
    }
    else{
        alert("Failed to delete task\n" + result.err);
    }
}

function toggle_task_checkbox(task_id) {
    document.getElementById(task_id).classList.toggle('checked');
    const task_data = Tasks[selected_label][task_id];
    const new_task_data = {
        id: task_id,
        parent_id: selected_label,
        title: task_data.title,
        description: task_data.description,
        priority: task_data.priority,
        completed: !(task_data.completed)
    };

    // sending whole task data as there is no special route to edit task status data

    edit_task_data(new_task_data);
}
