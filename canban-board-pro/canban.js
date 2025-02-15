const addBtn = document.querySelector(".add-btn");
const modalCont = document.querySelector(".modal-cont");
const mainCont = document.querySelector(".main-cont");
const textArea = document.querySelector(".textArea-cont");
const assignedToInput = document.querySelector(".assigned-to-cont");
const allPriorityColors = document.querySelectorAll(".priority-color");
const removeBtn = document.querySelector(".remove-btn");
const clearBtn = document.querySelector(".clear-btn");
const toolboxColors = document.querySelectorAll(".color");

/** local variables */
let modalPriorityColor = "black";
let addTaskFlag = false;
let removeTaskFlag = false;
let editTaskFlag = false;
let editTicketId = null;
const lockClose = "fa-lock";
const lockOpen = "fa-lock-open";
const colors = ["lightpink", "lightgreen", "lightblue", "black"];
const ticketsArr = JSON.parse(localStorage.getItem("tickets")) || [];
// Initialize ticket counter
let ticketCounter = localStorage.getItem("ticketCounter") ? parseInt(localStorage.getItem("ticketCounter")) : 1;

/** event handlers */

toolboxColors.forEach(function (colorElem) {
  colorElem.addEventListener("click", function () {
    const allTickets = document.querySelectorAll(".ticket-cont"); // []
    console.log("color clicked", colorElem.classList[0]);
    const selectedColor = colorElem.classList[0];
    allTickets.forEach(function (ticket) {
      const ticketColorband = ticket.querySelector(".ticket-color");
      if (ticketColorband.style.backgroundColor == selectedColor) {
        ticket.style.display = "block";
      } else {
        ticket.style.display = "none";
      }
    });
  });
  colorElem.addEventListener("dblclick", function () {
    const allTickets = document.querySelectorAll(".ticket-cont");
    allTickets.forEach(function (ticket) {
      ticket.style.display = "block";
    });
  });
});

addBtn.addEventListener("click", function () {
  addTaskFlag = !addTaskFlag;
  if (addTaskFlag) {
    modalCont.classList.add("show");
  } else {
    modalCont.classList.remove("show");
  }
});

removeBtn.addEventListener("click", function () {
  removeTaskFlag = !removeTaskFlag;
  if (removeTaskFlag) {
    alert("Select the tikit you want to delete");
    removeBtn.style.color = "red";
  } else {
    removeBtn.style.color = "white";
  }
});

clearBtn.addEventListener("click", function () {
  clearLocalStorage();
});

function init() {
  if (localStorage.getItem("tickets")) {
    ticketsArr.forEach(function (ticket) {
      createTicket(ticket.ticketColor, ticket.taskContent, ticket.ticketId, ticket.assignedTo);
    });
  }
}
init();

function getTicketIdx(id) {
  const tikcetIdx = ticketsArr.findIndex(function (ticket) {
    return ticket.ticketId == id;
  });
  return tikcetIdx;
}

function handleRemoval(ticket) {
  ticket.addEventListener("click", function () {
    if (!removeTaskFlag) return;
    else {
      ticket.remove();
    }
  });
}

function handleLock(ticket) {
  const ticketLockElem = ticket.querySelector(".ticket-lock");
  const tikcetLockIcon = ticketLockElem.children[0];
  const ticketTaskArea = ticket.querySelector(".task-area");
  const id = ticket.querySelector(".ticket-id").innerText;

  tikcetLockIcon.addEventListener("click", function () {
    const ticketIdx = getTicketIdx(id);
    if (tikcetLockIcon.classList.contains(lockClose)) {
      tikcetLockIcon.classList.remove(lockClose);
      tikcetLockIcon.classList.add(lockOpen);
      ticketTaskArea.setAttribute("contenteditable", "true"); // changed contenteditable to true
    } else {
      tikcetLockIcon.classList.remove(lockOpen);
      tikcetLockIcon.classList.add(lockClose);
      ticketTaskArea.setAttribute("contenteditable", "false"); // changed contenteditable to true
    }
    ticketsArr[ticketIdx].taskContent = ticketTaskArea.innerText;
    updateLocalStorage();
  });
}

function handleColor(ticket) {
  const ticketColorBand = ticket.querySelector(".ticket-color");
  const id = ticket.querySelector(".ticket-id").innerText;
  ticketColorBand.addEventListener("click", function () {
    const ticketIdx = getTicketIdx(id);
    let currentColor = ticketColorBand.style.backgroundColor; // black
    let currentColorIdx = colors.findIndex(function (color) {
      return currentColor == color;
    }); // 3
    console.log("current color idx", currentColorIdx); // 3
    currentColorIdx++; // 3 -> 4
    const newTicketColorIdx = currentColorIdx % colors.length; // 0
    const newTicketColor = colors[newTicketColorIdx]; // lightpink
    ticketColorBand.style.backgroundColor = newTicketColor; // lightpink
    ticketsArr[ticketIdx].ticketColor = newTicketColor;
    updateLocalStorage();
  });
}

function handleEdit(ticket) {
  const editBtn = ticket.querySelector(".edit-btn");
  editBtn.addEventListener("click", function () {
    editTaskFlag = true;
    editTicketId = ticket.querySelector(".ticket-id").innerText;
    const ticketIdx = getTicketIdx(editTicketId);
    const ticketData = ticketsArr[ticketIdx];
    textArea.value = ticketData.taskContent;
    assignedToInput.value = ticketData.assignedTo;
    modalPriorityColor = ticketData.ticketColor;
    modalCont.classList.add("show");
  });
}

function createTicket(ticketColor, ticketTask, ticketId, assignedTo) {
  const ticketCont = document.createElement("div");
  ticketCont.setAttribute("class", "ticket-cont");
  ticketCont.innerHTML = `
   <div class="ticket-color" style="background-color:${ticketColor}"></div>
    <div class="ticket-id">${ticketId}</div>
    <div class="task-area">${ticketTask}</div>
    <div class="assigned-to">Assigned To: ${assignedTo}</div>
    <div class="ticket-lock">
        <i class="fa-solid fa-lock"></i>
    </div>
    <div class="edit-btn">
        <i class="fa-solid fa-edit"></i>
    </div>
   `;
  mainCont.appendChild(ticketCont);
  handleRemoval(ticketCont);
  handleLock(ticketCont);
  handleColor(ticketCont);
  handleEdit(ticketCont);
}

// Function to clear local storage
function clearLocalStorage() {
  localStorage.clear();
  ticketsArr.length = 0;
  ticketCounter = 1;
  mainCont.innerHTML = '';
}

// ADD LISTENNER ON MODAL / POPUP
modalCont.addEventListener("keydown", function (e) {
  const key = e.key;
  if (key == "Shift" || key == "Escape") {
    const taskContent = textArea.value; // get the content from textArea
    const assignedTo = assignedToInput.value; // get the assigned to value
    if (editTaskFlag) {
      const ticketIdx = getTicketIdx(editTicketId);
      ticketsArr[ticketIdx].taskContent = taskContent;
      ticketsArr[ticketIdx].assignedTo = assignedTo;
      ticketsArr[ticketIdx].ticketColor = modalPriorityColor;
      updateLocalStorage();
      mainCont.innerHTML = '';
      init();
      editTaskFlag = false;
      editTicketId = null;
    } else {
      const ticketId = ticketCounter++; // use the counter for ticket ID and increment it
      createTicket(modalPriorityColor, taskContent, ticketId, assignedTo);
      ticketsArr.push({ ticketId, taskContent, ticketColor: modalPriorityColor, assignedTo });
      updateLocalStorage();
      localStorage.setItem("ticketCounter", ticketCounter); // update the counter in local storage
    }
    modalCont.classList.remove("show");
    textArea.value = "";
    assignedToInput.value = "";
    addTaskFlag = false;
  }
});

// for(let i = 0; i < allPriorityColors.length; i++){
//     allPriorityColors[i].addEventListener("click", function(e){
//         // some functionality
//     })
// }

allPriorityColors.forEach(function (colorElem) {
  // some funcitonality with the priorityCOlor
  colorElem.addEventListener("click", function () {
    // some functionality
    // remove active class from all prioriity colors
    allPriorityColors.forEach(function (priorityElem) {
      priorityElem.classList.remove("active");
    });
    // add active class to clicked colorElem
    colorElem.classList.add("active");
    modalPriorityColor = colorElem.classList[0];
  });
});

// localStorage.setItem("user",JSON.stringify({name:"Arshad",age:24}))
// const userObj = JSON.parse(localStorage.getItem("user"))
// console.log("userObj",userObj)
// localStorage.removeItem("user") // synchronous api
// // localStorage.clear()

function updateLocalStorage() {
  localStorage.setItem("tickets", JSON.stringify(ticketsArr));
}