//массив с самой картой
var arr=[
]

//параметры игрока
var player={row: 6, column: 4, hp: 5,  coins: 0,  char: "P", items: []};
//обьект который отвечает за бомбу, boomStep надо что б эффекты от взрыва оставались на карте только на один фрайм(он сохраняет steps, что б сравнивать его)
var bomb={onMap: false, row: 0, column: 0, tick: 0, type: "default", dmg: 5, boomStep: 0, coins: 0}; //массив всех бомб на карте

var prices={square: 2, random: 3, superBomb: 4, detonation: 1};//массив c ценами разных услуг

var steps=0; //количество ходов
var itage=0;
var maxItage=0;

//элементы с html
const map=document.getElementById("map");
const states=document.getElementById("states");

/*массив с врагами
target - координаты цели к которой стремиться враг
isAgr - если тру, то он стремиться у цели
*/
var enemys=[ 
]
let enemydefault={row: 0, column: 0, hp: 3, dmg: 1, char: "E", target: {X: 0, y: 0}, isAgr: false};

//обьект терминал
var terminal=document.getElementById("terminal-txt");

//отключаем базовые функции браузера а имеено скролл страницы на кнопки =
document.addEventListener("keydown", function(event) {
    const key = event.key.toLowerCase();
    if (key === "w" || key === "s" || key==="arrowup" || key ==="arrowdown") {
        event.preventDefault();
    }
});



//печатает текст в терминал
function printTerminal(txt, type){
    if(type!=undefined && type==="red"){
        terminal.innerHTML+=steps+") "+"<span style='color: #dc143c'>"+txt+"</span>"+"<br>";
        return;
    }
    terminal.innerHTML+=steps+") "+txt+"<br>";
}

//отрисовка карты
function renderMap(){
    //бомба делает бум
    if(bomb.tick===0 && bomb.onMap){ //если тик равен 0, то бомба взрывается
        let x=bomb.column;
        let y=bomb.row;

        if(bomb.type==="default"){
            arr[y][x]="*";
            if(y-1>=0){              arr[y-1][x]="*";}
            if(y+1<=arr.length-1){   arr[y+1][x]="*";}
            if(x-1>=0){              arr[y][x-1]="*";}
            if(x+1<=arr[0].length-1){arr[y][x+1]="*";}
        }
        else if(bomb.type==="square"){
            for(let i=0; i<3; i++){
                for(let j=0; j<3; j++){
                    let setRow=bomb.row+(i-1);
                    let setColumn=bomb.column+(j-1);

                    //если нету элемента с таким индексом (надо что б убрать ошибки)
                    if(arr[setRow] === undefined || arr[setRow][setColumn] === undefined){
                         //почему условие выглядет так? так как сначало проверяется arr[setRow], затем arr[setRow][setColumn] , но если ошибка начинается уже в arr[setRow], то мы даже можем не дойти к проверке полного массива
                        continue;
                    }

                    arr[setRow][setColumn]="*";
                }
            }
        }
        else if(bomb.type==="random"){
            for(let i=0; i<3; i++){
                let setRow = bomb.row;
                let setColumn = bomb.column;

                for(let j=0; j<5; j++){
                    // Генерация случайного направления
                    let random = Math.floor(Math.random() * 4); 
                    

                    if (random === 0) setRow--; 
                    else if (random === 1) setRow++; 
                    else if (random === 2) setColumn--; 
                    else if (random === 3) setColumn++; 

                    if(arr[setRow]===undefined || arr[setRow][setColumn]===undefined){
                        continue;
                    }

                    arr[setRow][setColumn]="*";
                }
            }

            arr[bomb.row][bomb.column]="*";
        }
        else if(bomb.type==="superBomb"){
            for(let i=0; i<arr.length; i++){
                arr[i][bomb.column]="*";
                arr[bomb.row][i]="*";
            }
        }

        bomb.type="default";
        bomb.boomStep=steps; //нужна что б взырв от бомбы стоял только один ход
        bomb.onMap=false;
    }

    //печатаем карту
    let txt="";

    for(let i=0; i<arr.length; i++){
        outerLoop: for(var j=0; j<arr[0].length; j++){
            //регистрация взрывов
            if(arr[i][j]==="*"){
                if(bomb.boomStep===steps-1){ //если эффект взрыва должен был уже рассеится
                    arr[i][j]=" ";
                }
                else{
                    //наносим урон по врагам если в радиусе взрыва находиться враг
                    for (let enemy of enemys) {
                        if (enemy.row === i && enemy.column === j) {
                            enemy.hp -= bomb.dmg;
                        }
                    }

                    //наносим урон по игроку
                    if(player.row===i && player.column===j){
                        playerGetDmg(bomb.dmg);
                        console.log("player get dmg by bomb");
                    }

                    //печать врзрыва
                    txt+='<span class="blink" style="color: red">* </span>';
                    continue;
                }
            }

            //если на текущей клеточке находиться игрок "P"
            if(player.row==i && player.column==j){
                txt+=player.char+" ";
                if(arr[i][j]==="@"){
                    itage++;
                    randonGeneration();
                    update();
                    return;
                }else if(arr[i][j]=="c"){
                    player.coins++;
                    arr[i][j]=" ";
                    printTerminal("player got coin");
                }
                continue;
            }

            //если на текущей клеточке находиться Враг (например "E")
            for(let enemy of enemys){
                if(enemy.row==i && enemy.column==j && enemy.hp>0){
                    txt+='<span style="color: #ffC0CB">E </span>';
                    continue outerLoop;
                }
            }

            //если на текущей клеточке находиться бомба которая обазначена цифрой
            /*if(!isNaN(arr[i][j]) && arr[i][j]!==" "){
                if(arr[i][j]==0){
                    console.log("boom");

                    if(player.bombType==="default"){
                        arr[i][j]="*";
                        arr[i-1][j]="*";
                        arr[i+1][j]="*";
                        arr[i][j-1]="*";
                        arr[i][j+1]="*";

                        arr[i][j]="*";
                        continue outerLoop;
                    }
                }
                arr[i][j]=Number(arr[i][j])-1;
                txt+=arr[i][j]+" ";
                continue outerLoop;
            }*/
            if(bomb.onMap && bomb.row===i && bomb.column===j){ //если на текущей клеточке бомба и на ней нету обьектов(игрок , враг), то делается тик
                txt+=bomb.tick+" ";
                bomb.tick--;
                continue;
            }

            if(arr[i][j]=="#"){ 

                txt+='<span style="color: #404040"># </span>';
                continue;
            }

            if(arr[i][j]=="@"){ 

                txt+='<span class="blink" style="color: #00ffff">@ </span>';
                continue;
            }
            
            if(arr[i][j]=="c"){ 

                txt+='<span style="color: yellow">c </span>';
                continue;
            }

            //если это пустая клетка то печатается точка
            if(arr[i][j]===" "){
                txt+=". ";
                continue;
            }

            //если ничегоо важного нету на клеточке , то просто печатаеться , то что находиться в массиве
            txt+=arr[i][j]+" ";
            
        }

        txt+="\n";
    }

    map.innerHTML=txt;

    if(player.hp<=0){
        playerDying();
    }
}


//генерация карты
function randonGeneration(){
    console.log("dungeon number "+itage);

    let playerReplaced=false; //тру если игро уже рандомно разместили
    //запонлянем карту блоками
    let demoMap=[];
    let maxRows=30;
    let maxColumns=30;

    //обнуляем количество ходов
    steps=0;
    terminal.innerHTML="";

    //количество монет и врагов в зависимости от этажа
    let numberOfEnemys=2+itage;
    let numberOfCoins=Math.max(Math.floor(Math.random()*1.5*Math.max(itage, 1)));
    
    for (let i = 0; i < maxRows; i++) {//заполняем все стенами
        demoMap[i] = Array(maxColumns).fill("#");
    }

 
    for(let i=0; i<4; i++){
        let current={x: Math.floor(maxColumns/2), y: Math.floor(maxRows/2)}
        demoMap[current.y][current.x]=" ";

        for(let j=0; j<50+itage*10; j++){
            let enemy={row: 0, column: 0, hp: 3, dmg: 1, char: "E", target: {X: 0, y: 0}, isAgr: false};

            let a = Math.floor(Math.random() * 4);

            //Math.floor - округлляет в меньшую сторону
            if (a === 0 && current.y > 0) { current.y -= 1;} // Вверх
            if (a === 1 && current.x < maxColumns - 1) {current.x += 1;} // Вправо
            if (a === 2 && current.y < maxRows - 1) {current.y += 1;} // Вниз
            if (a === 3 && current.x > 0) {current.x -= 1;} // Влево
        
            demoMap[current.y][current.x] = " "; 

           
            if(numberOfEnemys>0 && Math.random()<=0.05 && (!playerReplaced || (Math.abs(player.row-current.y)>2 && Math.abs(player.column-current.x)>2))){
                //если игрока еще не размесили размещаем его
                if(!playerReplaced){
                    player.row=current.y;
                    player.column=current.x;
                    playerReplaced=true;
                    continue;
                }
                enemy.row=current.y;
                enemy.column=current.x;
                enemys.push(enemy);
                numberOfEnemys--;
            }
            else if(numberOfCoins>0 && Math.random()<=0.04){
                demoMap[current.y][current.x]="c";
            }
        }
    }


    console.log("map was random generated");
    arr=demoMap;
    update();
}

//если не наводить мышкой на обьект то не будет его описание
document.addEventListener("mouseover", (event) => {
    let desc=document.getElementById("bomb-description-txt");
    let txt;

    if (event.target.classList.contains("hoverable")) {
        desc.innerHTML="💰цена: "+prices[event.target.id]+"<br> <br>";
        if(event.target.id==="square"){
            txt="бомба взрывается  в виде квадрата 3на3";
        }
        else if(event.target.id==="random"){
            txt="бомба взрывается в виде рандомно сгенерированной фигуры";
        }
        else if(event.target.id==="superBomb"){
            txt="супер бомба взрывает все клетки по диагонали и вертикали";
        }
        else if(event.target.id==="detonation"){
            txt="детонирует к бомбу";
        }
    
        desc.innerHTML+="<span style='color: #D3D3D3'>"+txt+"</span>";
    }
    else{
        desc.innerText="";
    }
});

// Обработчик отправки комментария
document.getElementById("commentForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы

    const username = document.getElementById("username").value.trim();
    const commentText = document.getElementById("commentText").value.trim();

    if (username && commentText) {
        // Получаем текущее время
        const now = new Date();
        const timeString = now.toLocaleString("ru-RU", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

        // Создаем элемент для нового комментария
        const commentItem = document.createElement("li");
        commentItem.classList.add("comment-item");
        
        // Добавляем имя, текст комментария и время
        commentItem.innerHTML = 
        "<div class='comment-header'>" +
            "<strong>" + username + "</strong>" + 
            "<span class='comment-time'>" + timeString + "</span>" +
        "</div>" +
        "<p>" + commentText + "</p>";
    
        
        // Добавляем комментарий в список
        document.getElementById("commentsList").appendChild(commentItem);
        
        // Очищаем форму
        document.getElementById("username").value = "";
        document.getElementById("commentText").value = "";
    } else {
        alert("Пожалуйста, заполните оба поля.");
    }
});

//показывает туториал как играть
function showTutorial(type){
    document.getElementById("tutorial_player").style.display="none";
    document.getElementById("tutorial_enemy").style.display="none";
    document.getElementById("tutorial_bombs").style.display="none";
    document.getElementById("tutorial_how-to-play").style.display="none";

    if(type=="player"){
        document.getElementById("tutorial_player").style.display="block";
    }
    else if(type=="enemy"){
        document.getElementById("tutorial_enemy").style.display="block";
    }else if(type=="bombs"){
        document.getElementById("tutorial_bombs").style.display="block";
    }else if(type=="how-to-play"){
        document.getElementById("tutorial_how-to-play").style.display="block";
    }
}


randonGeneration();
