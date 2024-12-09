/*function playerMove(){
    if (!terminal.value || terminal.value.length == 0) {
        console.log("player did not move");
        return; // Игнорируем пустой ввод
    }

    var value = terminal.value[0].toLowerCase(); // Приводим ввод к нижнему регистру

    if (value == "w" && player.row > 0 && arr[player.row - 1][player.column] != "#") {
        player.row -= 1;
    }
    else if (value == "s" && player.row < arr.length - 1 && arr[player.row + 1][player.column] != "#") {
        player.row += 1;
    }
    else if (value == "d" && player.column < arr[0].length - 1 && arr[player.row][player.column + 1] != "#") {
        player.column += 1;
    }
    else if (value == "a" && player.column > 0 && arr[player.row][player.column - 1] != "#") {
        player.column -= 1;
    }
    

    terminal.value="";
 }*/    

document.addEventListener("keydown", function(event) {

    var key = event.key; // Получаем нажатую клавишу 
    let directionX=0;
    let directionY=0;

    //движение игрока в зависимости от нажатой кнопки
    let playerIsMoving=false;
    if (key.toLowerCase() == "w" 
        && player.row > 0 ) {
        directionY=-1;
        playerIsMoving=true;
    }
    else if (key.toLowerCase() == "s" 
        && player.row < arr.length - 1 ) {
        directionY=1;
        playerIsMoving=true;
    }
    else if (key.toLowerCase() == "d"
         && player.column < arr[0].length - 1 ) {
        directionX=1; 
        playerIsMoving=true;
    }
    else if (key.toLowerCase() == "a" 
        && player.column > 0 ) {
        directionX=-1;
        playerIsMoving=true;
    }
        
    if(playerIsMoving){
        let playerDetectedWall=false; //если перед игроком стоит стена
        if(arr[player.row+directionY][player.column+directionX]=="#"){
            console.log("player detected wall");
            playerDetectedWall=true;
            return;
        }
            
        let playerDetectedEnemy=false; //тру когда перед игроком враг
        for(var enemy of enemys){
            if(player.column+directionX === enemy.column && player.row +directionY===enemy.row 
                && enemy.hp>0){
                console.log("player cant move потому что перед ним вражина");
                playerDetectedEnemy=true;
                return;
            }
        }

        //если перед игроком не стоит ни каких припядствий
        if(!playerDetectedEnemy && !playerDetectedWall){
            player.column+=directionX;
            player.row+=directionY; 
        }
          
        steps++;
        console.log("player moved");
        update();
    }

    //игрок атакует
    let playerIsAttacking=false;
    if(key=="ArrowUp"){
        directionY=-1;
        playerIsAttacking=true;
    }else if(key =="ArrowDown"){
        directionY=1;
        playerIsAttacking=true;
    }else if(key=="ArrowLeft"){
        directionX=-1;
        playerIsAttacking=true;
    }else if(key=="ArrowRight"){
        directionX=1;
        playerIsAttacking=true;
    }

    if(playerIsAttacking){
        if(arr[player.row+directionY][player.column+directionX]!="#" && !bomb.onMap){
            console.log("бомба размешена");
            bomb.row=player.row+directionY;
            bomb.column=player.column+directionX;

            bomb.onMap=true;
            bomb.tick=3;

            steps++;
            update();
        }
    }
});

function playerGetDmg(dmg){
    player.hp-=dmg;
    printTerminal("player got dmg", "red");
}

function changeBomb(newBombType) {
    let price = prices[newBombType];

    if(price<=player.coins){
        if(newBombType=="detonation" ){
            if(!bomb.onMap){
                printTerminal("бомбы нету на карте , что б детонировать ее");
            }
            bomb.tick=0;
            player.coins-=price;
           printTerminal("бомба была детонировано за 1 монетку");
            renderMap();

        }else{
            bomb.type = newBombType; // меняем тип бомбы на переданный аргумент
            player.coins-=price;
            console.log("player changed bomb type to " + bomb.type);

            if(newBombType==="square"){
                printTerminal("current bomb is 'square'", "red");
            }else if(newBombType==="random"){
                printTerminal("current bomb is 'random'", "red");
            }else if(newBombType==="superBomb"){
                printTerminal("current bomb is 'super bomba", "red");
            }
        }
    }else{
        console.log("not enought money");
        printTerminal("нет достаточно денег");
    }

}

function playerDying() {
    // Уведомление об окончании игры
    console.log("Player has died!");
    printTerminal("You have died. Game Over.");
    maxItage=itage>maxItage?maxItage=itage:maxItage;
    itage=0;
    player.hp=5;
    player.coins=0;
    enemys=[];
    randonGeneration();
    printTerminal("you were killed");
}
