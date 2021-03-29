let size = 10;
let nMines = 15;

let mines = new Array(size);    // position of mines: 1-mine 0-no mine
let opened = new Array(size);   // has it been opened, and number of mines around it: -1-not opened  0-8 - opened with nthe number of mines 

let firstPress = true;          // to mark the first press, to generate a
let player = true;              // to not allow player to continue playing after pressing a mine

let theme = 'light';
let pallete = ['orange', 'purple', 'green', 'pink', 'blue'];
let color = pallete[0];

function generateMap(){
    let playingField = document.getElementById("playingField");
    let fieldButtonAsset = document.getElementById("fieldButtonAsset");

    mines = new Array(size);
    opened = new Array(size);

    for(let i = 0; i < size; i++){
        for(let j = 0; j < size; j++){
            let idNumber = i*100 + j;
            fieldButtonAsset.setAttribute('id',idNumber.toString());
            fieldButtonAsset.setAttribute('onmousedown','fieldClicked('+i+','+j+',event);');
            
            playingField.innerHTML += fieldButtonAsset.outerHTML;
        }
        playingField.innerHTML += "<br>";
    }
}

function generateMines(y, x){
    let nMines_temp = nMines;


    for(let i=0; i<size; i++){
        for(let j=0; j<size; j++){ 
            mines[i] = Array(size).fill(0);
            opened[i] = Array(size).fill(-1);
        }
    }

    while(nMines_temp>0){
        for(let i=0; i<size; i++){
            for(let j=0; j<size; j++){
                if(nMines_temp>0){
                    if(mines[i][j]==0){
                        if(i!=y || j!=x){
                            let a = Math.floor(Math.random()*(size*size)/nMines);
                            if(a==0){
                                nMines_temp--;
                                mines[i][j] = 1;
                            }
                        }
                    }   
                }   
                else
                    break; 
            }
        }
    }
}

function openField(y, x){
    if(player){
        if(mines[y][x]==0 && !document.getElementById(y*100+x).classList.contains("flag")){
            document.getElementById(y*100+x).disabled = true;
            opened[y][x]=0;

            for(let i=y-1; i<=y+1; i++){
                for(let j=x-1; j<=x+1; j++){
                    if(i>=0 && i<size && j>=0 && j<size){
                        if(mines[i][j]!=0)
                            opened[y][x]++;
                    }
                }
            }

            if(opened[y][x]==0){
                document.getElementById(y*100+x).innerText = '';
                for(let i=y-1; i<=y+1; i++){
                    for(let j=x-1; j<=x+1; j++){
                        if(i>=0 && i<size && j>=0 && j<size){
                            if(mines[i][j]==0 && opened[i][j]==-1)
                                openField(i,j);
                        }
                    }
                }
            }
            else{
                document.getElementById(y*100+x).innerText = opened[y][x];
            }
        }
        else if(mines[y][x]==1){
            gameOver();
        }

        checkAll();
    }
}

function checkAll(){
    let won = true;
    for(let i = 0; i < size; i++){
        for(let j = 0; j < size; j++){
            if(mines[i][j]==0 && opened[i][j]==-1){
                won=false;
                console.log('oof');
                break;
            }
        }
    }
    if(won){
        document.getElementById('alert').classList.add('victory');
        document.getElementById('alert').innerText = 'Victory!';
    }
}

function restart(){
    if(document.getElementById('spinnable').classList.contains('spin')){
        document.getElementById('spinnable').classList.add('spin2');
        document.getElementById('spinnable').classList.remove('spin');
    }
    else{
        document.getElementById('spinnable').classList.add('spin');
        document.getElementById('spinnable').classList.remove('spin2');
    }

    for(let i = 0; i < size; i++){
        for(let j = 0; j < size; j++){
            document.getElementById(i*100+j).innerText='';
            document.getElementById(i*100+j).classList.remove('mine');
            document.getElementById(i*100+j).classList.remove('flag');
            document.getElementById(i*100+j).disabled = false;
        }
    }

    firstPress = true;
    player = true;

    document.getElementById('alert').classList.remove('game-over');
    document.getElementById('alert').classList.remove('victory');

    
    generateMines();
}

function gameOver(){
    for(let i = 0; i < size; i++){
        for(let j = 0; j < size; j++){
            if(mines[i][j]==1){
               document.getElementById(i*100+j).classList.add('mine');
               document.getElementById(i*100+j).innerHTML='<i class="fas fa-times"></i>';
            }
        }
    }

    document.getElementById('alert').classList.add('game-over');
    document.getElementById('alert').innerText = 'Game Over!';

    player = false;
}

function fieldClicked(y, x, event){
    event.preventDefault();
    if(event.button==0){
        if(firstPress){
            generateMines(y, x);
            openField(y, x);
            firstPress=false;
        }
        if(!document.getElementById(y*100+x).classList.contains("flag"))
            openField(y, x);
    }
    else if(event.button==2 && !firstPress)
        flagField(y,x);
}

function flagField(y, x){
    if(document.getElementById(y*100+x).classList.contains("flag")){
        document.getElementById(y*100+x).classList.remove("flag");
    }
    else{
        document.getElementById(y*100+x).classList.add("flag");
        document.getElementById(y*100+x).innerHTML = '<i class="fas fa-flag"></i>';
    }
}

function switchClick() {


    if(theme=='light'){
        theme='dark';
        document.getElementById('switch-head').classList.add('switchOn');
        document.getElementById('switch-backdrop').classList.add('switchOn');
    }
    else{
        theme='light';
        document.getElementById('switch-head').classList.remove('switchOn');
        document.getElementById('switch-backdrop').classList.remove('switchOn');
    }
    document.documentElement.setAttribute('data-theme', theme);
}

function palleteChange(){

    let n;

    for(let i=0; i<pallete.length; i++){
        if(color==pallete[i]){
            n=i+1;
            break;
        }
    }

    if(n>=pallete.length) n=0;
    color=pallete[n];

    document.documentElement.setAttribute('pallete', color);
}

window.onload = generateMap;