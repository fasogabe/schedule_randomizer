// DATA CONTROLLER
const DataCtrl = (() => {
  // Constructor
  class Task {
    constructor(id, name, min, max) {
      this.id = id;
      this.name = name;
      this.min = min;
      this.max = max;
    }
  }

  // Data structure
  const data = {
    tasks: [],
    selectedTask: null
  };

  // Shuffle tasks
  function shuffleTasks(tasks) {
    for (let i = tasks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = tasks[i];
      tasks[i] = tasks[j];
      tasks[j] = temp;
    }
    return tasks;
  }

  // Public methods
  return {
    getTasks: () => {
      return data.tasks;
    },
    addTaskData: (name, min, max) => {
      let id;
      if (data.tasks.length > 0) {
        id = data.tasks[data.tasks.length - 1].id + 1;
      } else {
        id = 0;
      }
      newTask = new Task(id, name, min, max);
      data.tasks.push(newTask);

      return newTask;
    },
    deleteTaskData: (id) => {
      const ids = data.tasks.map((task) => {
        return task.id;
      });
      const index = ids.indexOf(id);
      data.tasks.splice(index, 1);
    },
    isTaskListEmpty: () => {
      if (tasks.length > 0) {
        return false;
      }
    },
    getShuffledTasks: () => {
      return shuffleTasks(data.tasks);
    }
  };
})();

// UI CONTROLLER
const UICtrl = (() => {
  // Define UI selectors
  const UISelectors = {};

  // Define bg color array
  const bgColors = [
    'bg-warning',
    'bg-danger',
    'bg-success',
    'bg-info',
    'bg-secondary'
  ];

  // Get random int within min/max range
  const getRandomTime = (min, max) => {
    const x = parseInt(min);
    const y = parseInt(max);
    return Math.floor(Math.random() * (y - x + 1)) + x;
  };

  // Public methods
  return {
    getTaskInput: () => {
      return {
        name: document.querySelector('#task-name').value,
        min: document.querySelector('#task-min').value,
        max: document.querySelector('#task-max').value
      };
    },
    addTaskUI: (task) => {
      const table = document.querySelector('#task-table-body');
      const row = document.createElement('tr');
      row.classList.add('table-dark');
      row.innerHTML = `
        <th scope="row">${task.id + 1}</th>
        <td>${task.name}</td>
        <td style="text-align:center">${task.min} min</td>
        <td style="text-align:center">${task.max} min</td>
        <td><i class="fa fa-times delete-task" aria-hidden="true"></i></td>
      `;
      table.appendChild(row);
    },
    deleteTaskUI: (target) => {
      if (target.classList.contains('delete-task')) {
        target.parentElement.parentElement.remove();
      }
    },
    createBtnEnabled: (enable) => {
      const createBtn = document.querySelector('#create-schedule-btn');
      enable
        ? (createBtn.className = 'btn btn-block btn-primary')
        : (createBtn.className = 'btn btn-block btn-primary disabled');
    },
    displaySchedule: (tasks) => {
      const display = document.querySelector('#schedule-output');
      const card = document.createElement('div');
      card.className = 'card border-primary';
      let output = ``;
      tasks.forEach((task, index) => {
        let duration = getRandomTime(task.min, task.max);
        console.log(duration);
        output += `
          <div style="height: ${duration * 3}px" class="card my-2 mx-3 ${
          bgColors[index % 5]
        } task-block">
            <h4>${task.name}: ${duration} minutes</h4>
          </div>
        `;
      });

      // for (let i = 0; i < tasks.length; i++) {
      //   output += `
      //     <div style="color: white" class="card my-2 mx-3 ${bgColors[i % 5]}">
      //       <h4>${tasks[i].name}: ${getRandomTime(tasks[i])} min</h4>
      //     </div>
      //   `;
      // }
      card.innerHTML = output;
      display.appendChild(card);
    }
  };
})();

// APP CONTROLLER
const App = ((DataCtrl, UICtrl) => {
  // Event listeners
  const loadEventListeners = () => {
    document
      .querySelector('#add-task-btn')
      .addEventListener('click', addTaskSubmit);

    document
      .querySelector('#task-table-body')
      .addEventListener('click', deleteTaskSubmit);

    document
      .querySelector('#create-schedule-btn')
      .addEventListener('click', createSchedule);
  };

  // Add task to table
  const addTaskSubmit = (e) => {
    const input = UICtrl.getTaskInput();
    const task = DataCtrl.addTaskData(input.name, input.min, input.max);
    UICtrl.addTaskUI(task);

    UICtrl.createBtnEnabled(true);

    e.preventDefault();
  };

  // Delete task from table
  const deleteTaskSubmit = (e) => {
    DataCtrl.deleteTaskData();
    UICtrl.deleteTaskUI(e.target);

    if (DataCtrl.isTaskListEmpty) {
      UICtrl.createBtnEnabled(false);
    }

    e.preventDefault();
  };

  const createSchedule = (e) => {
    const shuffledTasks = DataCtrl.getShuffledTasks();
    UICtrl.displaySchedule(shuffledTasks);

    e.preventDefault();
  };

  // Public methods
  return {
    init: () => {
      loadEventListeners();
    }
  };
})(DataCtrl, UICtrl);

// Init App
App.init();
