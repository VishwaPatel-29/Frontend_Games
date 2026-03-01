var player1 = prompt("Please Enter Player 1 Name:");
var player2 = prompt("Please Enter Player 2 Name:");

const boxes = document.querySelectorAll('.box');
const winnerText = document.getElementById("winnerText");

let player = true; 

const winner = [
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,4,8],
    [2,4,6]
];

function checkWinner(){
    for(let row of winner){
        const btn1 = boxes[row[0]].innerHTML;
        const btn2 = boxes[row[1]].innerHTML;
        const btn3 = boxes[row[2]].innerHTML;

        if(btn1 !== "" && btn2 !== "" && btn3 !== ""){
            if(btn1 === btn2 && btn2 === btn3){

                if(btn1 === "o"){
                    winnerText.innerText = `🏆 The winner is ${player1}`;
                }
                else{
                    winnerText.innerText = `🏆 The winner is ${player2}`;
                }

                for(let box of boxes){
                    box.disabled = true;
                }
            }
        }
    }
}

Array.from(boxes).forEach((box)=>{
    box.addEventListener("click", ()=>{
        if(player){
            box.innerHTML = "o";
            player = false;
        }
        else{
            box.innerHTML = "X";
            player = true;
        }
        box.disabled = true;
        checkWinner();
    });
});