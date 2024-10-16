fetch("/get_labels", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ token })
})
    .then(result => {
        if (result.ok) {
            return result.json();
        }
        return result.text().then(text => { throw new Error(text) });
    })
    .then(response => {
        // response is an array containing all the labels
        if (response != undefined && response.length > 0) {
            for (let i = 0; i < response.length; i++) {
                add_label(response[i].id, response[i].color, response[i].name);
                // adding label's data to the Labels object
                Labels[response[i].id] = { is_loaded: false, color: response[i].color, name: response[i].name };
            }
            // selecting the first label
            select_label(response[0].id);
        }
    })
    .catch(err => {
        alert(err.message);
        location.reload()
    })

async function get_tasks(parent_id) {
    try {
        const response = await fetch("/get_tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token, parent_id })
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text);
        }

        const result = await response.json();
        result.forEach(task => {
            // creating sub object for each label to hold tasks
            if (!Tasks[task.parent_id]) Tasks[task.parent_id] = {};

            // adding task's data to the Tasks object
            Tasks[task.parent_id][task.id] = { title: task.title, description: task.description, priority: task.priority, completed: task.completed};
            add_task(task);
        });
    }
    catch (err) {
        console.error(err);
    }
}

async function add_label_data(id, name, color){
    try {
        const res = await fetch("/add_label", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token, id, name, color })
        })
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text);
        }
        Labels[id] = { name, color, is_loaded: true };
        Tasks[id] = {};

        return {success: true};
    }
    catch (err) {
        console.error(err);
        return {success: false, err: err};
    }
}

async function edit_label_data(id, name, color){
    try {
        const res = await fetch("/update_label", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token, id, name, color })
        })
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text);
        }
        Labels[id].name = name;
        Labels[id].color = color;

        return {success: true};
    }
    catch (err) {
        console.error(err);
        return {success: false, err: err};
    }
}

async function delete_label_data(id){
    try {
        const res = await fetch("/delete_label", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token, id })
        })
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text);
        }
        delete Labels[id];
        delete Tasks[id];

        return {success: true};
    }
    catch (err) {
        console.error(err);
        return {success: false, err: err};
    }
}

async function add_task_data(task_data){
    try {
        const res = await fetch("/add_task", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token, ...task_data })
        })
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text);
        }
        Tasks[task_data.parent_id][task_data.id] = { title: task_data.title, description: task_data.description, priority: task_data.priority, completed: task_data.completed};
        return {success: true};
    }
    catch (err) {
        console.error(err);
        return {success: false, err: err};
    }
}

async function edit_task_data(task_data){
    try {
        const res = await fetch("/update_task", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token, ...task_data })
        })
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text);
        }
        Tasks[task_data.parent_id][task_data.id] = { title: task_data.title, description: task_data.description, priority: task_data.priority, completed: task_data.completed};
        return {success: true};
    }
    catch (err) {
        console.error(err);
        return {success: false, err: err};
    }
}

async function delete_task_data(task_id){
    try {
        const res = await fetch("/delete_task", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token, id: task_id })
        })
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text);
        }
        delete Tasks[selected_label][task_id];
        return {success: true};
    }
    catch (err) {
        console.error(err);
        return {success: false, err: err};
    }
}

async function set_theme_data(theme){
    try {
        const res = await fetch("/set_theme", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token, theme })
        })
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text);
        }
        return {success: true};
    }
    catch (err) {
        console.error(err);
        return {success: false, err: err};
    }
}