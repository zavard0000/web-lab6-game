function enemyMove(id) {
    if (enemyLosPlayer(id)) { // Если враг видит игрока, он становится агрессивным
        enemys[id].isAgr = true;
        enemys[id].target.x = player.column;
        enemys[id].target.y = player.row;

        console.log("enemy " + id + ": see player");
    } else if (!enemys[id].isAgr) { // Если враг не видит игрока и не агрессивен
        console.log("enemy " + id + ": do not see player and it is not agr");
    }

    if (enemys[id].isAgr) {
        let direction = {x: enemys[id].column < enemys[id].target.x ? 1 : enemys[id].column > enemys[id].target.x ? -1 : 0,
            y: enemys[id].row < enemys[id].target.y ? 1 : enemys[id].row > enemys[id].target.y ? -1 : 0};

        // Проверка на занятость клеток другими врагами
        for (let enemy of enemys) {
            if (enemys[id].column + direction.x === enemy.column && enemys[id].row === enemy.row) {
                direction.x = 0; // Блокируем движение по X
            }
            if (enemys[id].column === enemy.column && enemys[id].row + direction.y === enemy.row) {
                direction.y = 0; // Блокируем движение по Y
            }
        }

        // Проверка на стены
        if (arr[enemys[id].row + direction.y][enemys[id].column] === "#") {
            direction.y = 0;
            console.log("enemy " + id + ": detected wall on Y");
        }
        if (arr[enemys[id].row][enemys[id].column + direction.x] === "#") {
            direction.x = 0;
            console.log("enemy " + id + ": detected wall on X");
        }

        // Проверка столкновения с игроком
        if (direction.x !== 0 && enemys[id].column + direction.x === player.column && enemys[id].row === player.row ||
            direction.y !== 0 && enemys[id].row + direction.y === player.row && enemys[id].column === player.column) {
            playerGetDmg(enemys[id].dmg); 
            return;
        }

        // Движение врага
        if (direction.x !== 0 || direction.y !== 0) {
            if (direction.x === 0) {
                enemys[id].row += direction.y; // Двигаемся только по Oy
            } else if (direction.y === 0) {
                enemys[id].column += direction.x; // Двигаемся только по Ox
            } else {
                // Еесли два путя разного размера выбераем тот что длинее 
                if (Math.abs(player.column - enemys[id].column) > Math.abs(player.row - enemys[id].row)) {
                    enemys[id].column += direction.x; 
                } 
                else if (Math.abs(player.column - enemys[id].column) < Math.abs(player.row - enemys[id].row)) {
                    enemys[id].row += direction.y; 
                } 
                else {// Если расстояние одинаковое, выбираем случайное направление
                    
                    let random = Math.floor(Math.random() * 2); // сдесь выйдет 2,99 но так как у нас floor мы округляем к меньшему
                    if (random === 0) {
                        enemys[id].column += direction.x;
                    } else {
                        enemys[id].row += direction.y;
                    }
                }
            }

            console.log("enemy " + id + ": moved");

            // Проверка достижения цели
            if (enemys[id].column === enemys[id].target.x && enemys[id].row === enemys[id].target.y) {
                enemys[id].isAgr = false; // Враг перестаёт быть агрессивным
                console.log("enemy " + id + ": arrived to target");
            }
        }
    }
}




/*проверяет ест ли не прирывающая линия меду игроком и врагом, если 
реализовано с помощью алгоритма Брэзэнхема , который рисует воброжаемую линию от игрока до врага, если линия не прирывается , то враг видит игрока*/
function enemyLosPlayer(id) {
    //координаты начала и конца воображаемой линии
    let fromX = enemys[id].column;
    let fromY = enemys[id].row;
    /*var toX=target.x;
    var toY=target.y;*/
    /*enemys[id].target.x=player.column;
    enemys[id].target.y=player.row
    var toX =enemys[id].target.x;
    var toY =enemys[id].target.y;*/
    let toX=player.column;
    let toY=player.row

    //разница осей
    let deltaX = Math.abs(fromX - toX);
    let deltaY = Math.abs(fromY - toY);

    //err представляет собой отклонение текущей точки от идеальной линии на клеточной сетке
    let err = deltaX - deltaY;

    //показывает в каком направлении надо идти, чтобы дойти до цели
    let directionX =toX> fromX ? 1 :-1;
    let directionY = toY > fromY ? 1 :-1 ;

    //перемееная которая нужна для избегание бесконечного цикла
    let step=0;

    while (step<=deltaX+deltaY) {
        console.log("enemy "+id+": x="+fromX + ", Y=" + fromY );

        //если дошли до цели
        if(fromX==toX && fromY == toY) {
            console.log("enemy "+id+": fround player");
            return true;
        }

        //если поле зрения перекрывает объект
        else if (arr[fromY] === undefined || arr[fromY][fromX] === undefined || arr[fromY][fromX] == "#") {
            console.log("enemy "+id+": could't look player");
            return false;
        }

        var err2 =err* 2;

        //если ошибка слишком велика, значит сильно отклонились по вертикали
        if (err2>-deltaY) {
            err-=deltaY;
            fromX+=directionX;
        }
        //если ошибка слишком мала, значит сильно отклонились по горизонтали
        if(err2 < deltaX) {
            err+= deltaX;
            fromY += directionY;
        }

        // Предотвращение бесконечного цикла на случай ошибки
        if (Math.abs(fromX -toX) > deltaX || Math.abs(fromY-toY)>deltaY) {
            console.log("enemy "+id+": error");
            return false;
        }
    }
}

