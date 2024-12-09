function update(){
    if(arr[Math.floor(arr.length/2)][Math.floor(arr[0].length/2)]!=="@"){
        let haveEnemy=false; //тру если хотя б один враг жив
        for(let enemy of enemys){
            if(enemy.hp>0){
                haveEnemy=true;
                break;
            }
        }
        if(!haveEnemy){
            arr[Math.floor(arr.length/2)][Math.floor(arr[0].length/2)]="@"
        }
    }

    //передвигаем игрока
    /*playerMove();*/

    //передвигаем врагов
    if(steps!==0 && steps%2==0){ //что при первой гинерации враги не ходили и только каждые х ходов враги ходят
        for(let i=0; i<enemys.length; i++){
            if(enemys[i].hp>0){
                enemyMove(i);
            }
            
        }
    }

    //отрисовываем карту
    renderMap();

    //отображение статов игрока
    states.innerHTML="<h3>floor number "+itage+"</h3>"+
                        "<h4>Max itage: "+maxItage+"</h4>"+
                        "hp: "+player.hp+"<br>"+
                        "gold: "+player.coins+"<br>"+
                        "x="+player.column+", y="+player.row+"<br>"+
                        "bomb: ";
    if(bomb.onMap){
        states.innerHTML+="none";
    }else{
        states.innerHTML+=bomb.type;
    }

}

update();