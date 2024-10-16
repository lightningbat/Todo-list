let selected_label = undefined; // holds id of selected label
let selected_clr = undefined; // temporary variable to hold selected color, when editing label
let selected_priority = -1; // temporary variable to hold selected priority, when editing task
const priority_types = ['urgent','high','medium','low']; // css class name for priority color style used by task

// keep track of all the labels and also track which label is fully loaded (including their notes),
// format {label_id : {is_loaded: boolean, color: string, name: string}, ...}
const Labels = {}; 

// keep track of all the tasks and their parent label,
// format {parent_id : {task_id : {title: string, description: string, priority: int, completed: boolean}, ...}, ...}
const Tasks = {};

const labels_cont = document.querySelector('.content-cont').querySelector('.labels'); // html container for labels
const label_temp = document.getElementById('temp--label'); // label template used to create new labels
const label_editor_temp = document.getElementById('temp--label-editor');
const mobile_label_menu = document.querySelector('.phone-lbl-popup');
const clr_selector_temp = document.getElementById('temp--clr-selector');

// notes_cont holds div(s) for each label
// and each div contains task(s) for that label
const notes_cont = document.querySelector('.notes-cont');
const task_template = document.getElementById('temp--task');
const task_editor_temp = document.getElementById('temp--task-editor');

// a semi transparent layer to add behind popup
const popup_bkg_layer = document.querySelector('.popup-back');

const custom_confirm_layout = document.querySelector('.custom-confirm');



// <<<<< supportive functions >>>>>>> \\

// generates unique id for labels and tasks
const id_generator = () => {
    return Math.random().toString(16).slice(2);
}

const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const leadingZeros = (num) => { return num < 10 ? '0' + num : num; }

// converts time to 12 hour format
const timeFormatter = (hour) => {
    const meridiem = hour >= 12 ? 'PM' : 'AM';
    hour = (hour % 12) || 12;
    return {hour, meridiem};
}

const prettifyTime = (time) => {

    const weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    const created_dateTime = new Date(time);
    const current_time = new Date();

    if (created_dateTime.getFullYear() != current_time.getFullYear()) {
        // not the same year
        return `${months[created_dateTime.getMonth()]} ${created_dateTime.getDate()}, ${created_dateTime.getFullYear()}`;
    }
    else {
        if (created_dateTime.getDate() == current_time.getDate() && created_dateTime.getMonth() == current_time.getMonth())
        {
            // same day
            const hour = timeFormatter(created_dateTime.getHours());
            return `${hour.hour}:${leadingZeros(created_dateTime.getMinutes())} ${hour.meridiem}`
        }
        else {
            // same month
            return `${weekDays[created_dateTime.getDay()]}, ${months[created_dateTime.getMonth()]} ${created_dateTime.getDate()}`;
        }
    }
}