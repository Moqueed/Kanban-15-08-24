const addBtn = document.querySelector('.add-btn');
const deleteBtn = document.querySelector('.remove-btn');
const modalCont = document.querySelector('.modal-cont');
const textArea = document.querySelector('textArea');
const mainCont = document.querySelector('.main-cont');
const allPriorityColors = document.querySelectorAll('.priority-color');
const allFiltercolor = document.querySelectorAll('.color');

const colors = ['red','blue','green','black'];
let isModalOpen = false;
let deleteFlag = false; //true means it is red
let ticketPriorityColor = 'red';
let ticketsArr = []; //maintaining array of tickets to store in LocalStorage
var uid = new ShortUniqueId();
// console.log(uid.rnd());

if(localStorage.getItem('ticketsDetail')){
    let stringifiedArr = localStorage.getItem('ticketsDetail');
    let arr = JSON.parse(stringifiedArr);
    for(let i=0; i<arr.length; i++){
        let ticketObj = arr[i];
        createTicket(ticketObj.id,ticketObj.task,ticketObj.color);
    }
}

for(let i=0; i<allFiltercolor.length; i++){
    allFiltercolor[i].addEventListener('click',function(e){
        // console.log(e.target.classList[1]);
        const selectedColor = e.target.classList[1];
        // console.log(selectedColor);
        const allTicketsPriority = document.querySelectorAll('.ticket-color');
        // console.log(allTicketsPriority);
        for(let j=0; j<allTicketsPriority.length; j++){
            // console.log(allTicketsPriority[j].classList[1]);
            const ticketPriorityColor = allTicketsPriority[j].classList[1];
            if(selectedColor == ticketPriorityColor){
                allTicketsPriority[j].parentElement.style.display = 'block';
            }else{
                allTicketsPriority[j].parentElement.style.display = 'none';
            }
        }
    })
    allFiltercolor[i].addEventListener('dblclick',function(){
        const allTickets = document.querySelectorAll('.ticket-cont');
        for(let j=0; j<allTickets.length; j++){
            allTickets[j].style.display = 'block'; //show the tickets
        }
    })
}

addBtn.addEventListener('click',function(){
    if(isModalOpen === true){
        modalCont.style.display = 'none';
        isModalOpen = false;
    }else{
        modalCont.style.display = 'flex';
        isModalOpen = true;
    }
})

deleteBtn.addEventListener('click',function(){
    console.log('deleteBtn clicked');
    deleteBtn.style.color = 'red';
    if(deleteFlag){
        deleteFlag = false;
        deleteBtn.style.color = 'black';
    } else{
        deleteFlag = true;
        deleteBtn.style.color = 'red';
    }
});

textArea.addEventListener('keydown',function(e){
    // console.log(e);
    if(e.key == 'Enter'){
        // console.log('Enter pressed now move to second objective which hide the modal');
        modalCont.style.display = 'none'; //change in UI only
        isModalOpen = false;
        const task = textArea.value;
        textArea.value = ''; //reset the value
        createTicket(undefined,task,ticketPriorityColor);
    }
})
for(let i=0; i<allPriorityColors.length; i++){
    allPriorityColors[i].addEventListener('click',function(e){
        // console.log('click');
        // console.log(e.target);
        for(let j=0; j<allPriorityColors.length; j++){
            if(allPriorityColors[j].classList.contains('active')){
                allPriorityColors[j].classList.remove('active');
            }
        }

        e.target.classList.add('active');
        // console.log(e.target.classList[1]);
        ticketPriorityColor = e.target.classList[1];
    })
}


function createTicket(ticketId,task,priorityColor){  
    if(task == ""){
        alert("Please add a task")
        return;
     }
    let id;
    if(ticketId){
        id = ticketId; // it means generating ticket from localStorage data
    }else{
        id = uid.rnd(); // it means generating ticket from UI
    }

    const ticket = document.createElement('div');
        ticket.className = 'ticket-cont';
        ticket.innerHTML = `<div class="ticket-color ${priorityColor}"></div>
                         <div class="ticket-id">#${id}</div>
                         <div class="task-area">${task}</div>
                         <div class="lock-unlock"><i class="fa-solid fa-lock"></i></div>`;
        mainCont.appendChild(ticket);
        let ticketObj = {id:id,task:task,color:priorityColor};
        ticketsArr.push(ticketObj); //adding the ticket info to the ticket array
        console.log(ticketsArr);
        updateLocalStorage();
        // console.log(ticket);
        //remove ticket
        ticket.addEventListener('click',function(){
            if(deleteFlag){
            ticket.remove();//removing ticket from te UI
            let index = ticketsArr.findIndex(function(ticketObj){
                return ticketObj.id == id;
            })
            ticketsArr.splice(index,1);
            console.log(ticketsArr);
            updateLocalStorage();
            }
        })

        //lock and unlock
        const lockUnlockIcon = ticket.querySelector('.fa-solid');
        const taskArea = ticket.querySelector('.task-area');
        lockUnlockIcon.addEventListener('click',function(e){
            // console.log(lockUnlockIcon);
            if(e.target.classList.contains('fa-lock')){
                e.target.classList.remove('fa-lock');
                e.target.classList.add('fa-lock-open');
                taskArea.setAttribute('contenteditable',true);
            }else{
                e.target.classList.remove('fa-lock-open');
                e.target.classList.add('fa-lock');
                taskArea.setAttribute('contenteditable',false);
            }
           
        })
    //change priority of ticket
    const ticketColorBand = ticket.querySelector('.ticket-color');
    ticketColorBand.addEventListener('click',function(e){
        console.log(e.target.classList[1]);
        // ['red','blue','green','black']
        const currentColorClass = e.target.classList[1];
        e.target.classList.remove(currentColorClass);
        let currentColorIndex = colors.indexOf(currentColorClass);
        // for(let j=0; j<colors.length; j++){
        //     if(colors[j] == currentColorClass){
        //         currentColorIndex = j;
        //         break;
        //     }
        // }
        const nextColorIndex = (currentColorIndex+1)%colors.length;
        const nextColorClass = colors[nextColorIndex];
        console.log(nextColorClass);
        e.target.classList.add(nextColorClass);
        let index = ticketsArr.findIndex(function(ticketObj){
            return ticketObj.id == id;
        })
        ticketsArr[index].color = nextColorClass;
        console.log(ticketsArr);
        updateLocalStorage();
    }) 
}
function updateLocalStorage(){
    let stringifiedTicketArr = JSON.stringify(ticketsArr);
    localStorage.setItem('ticketsDetail',stringifiedTicketArr);
}

