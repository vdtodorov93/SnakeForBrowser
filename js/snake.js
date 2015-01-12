var FieldEnum = {
    FREE: 0,
    WALL: 1,
    FRUIT: 2,
    SNAKE: 3
};

var ClassEnum = {
    FREE: 'free-field',
    WALL: 'obstacle',
    FRUIT: 'fruit',
    SNAKE: 'snake'
};

var score = -1,
    theSnake,
    miliseconds = 600;

var matrix = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

var Direction = {
    LEFT: 0,
    TOP: 1,
    RIGHT: 2,
    BOTTOM: 3
};

var KeyCode = {
    LEFT: 37,
    TOP: 38,
    RIGHT: 39,
    DOWN: 40
};

function Position(x, y) {
    this.x = x;
    this.y = y;
}

function Snake(positions) {
    this.body = positions;
    this.direction = Direction.TOP;
    this.temporateDirection = this.direction;
}

function visualizeMap(matrix) {
    var lenX = matrix.length,
        lenY = matrix[0].length,
        $container = $('#container');
    $container.html('');
    for(var i = 0; i < lenX; i+=1) {
        var $lineDiv = $('<div>');
        for(var j = 0; j < lenY; j+=1) {
            var $span = $('<span>');
            switch(matrix[i][j])
            {
                case FieldEnum.FREE:
                    $span.addClass(ClassEnum.FREE);
                    break;
                case FieldEnum.WALL:
                    $span.addClass(ClassEnum.WALL);
                    break;
                case FieldEnum.FRUIT:
                    $span.addClass(ClassEnum.FRUIT);
                    break;
                case FieldEnum.SNAKE:
                    $span.addClass(ClassEnum.SNAKE);
                    break;
            }
            $lineDiv.append($span);
        }

        $container.append($lineDiv);
    }
}

var gameInterval;

function startGame() {
    document.onkeydown = changeDirectionEvent;
    theSnake = new Snake([new Position(5, 5), new Position(5, 6)]);
    applySnake(theSnake, matrix);
    updateScore(0);
    visualizeMap(matrix);
    gameInterval = setInterval(playTurn, miliseconds)
}

function playTurn() {
    var x = theSnake.body[0].x,
        y = theSnake.body[0].y,
        lost = false;

    theSnake.direction = theSnake.temporateDirection;

    switch(theSnake.direction) {
        case Direction.LEFT:
            y--;
            break;
        case Direction.TOP:
            x--;
            break;
        case Direction.RIGHT:
            y++;
            break;
        case Direction.BOTTOM:
            x++;
            break;
    }

    theSnake.body.unshift(new Position(x, y));
    if(matrix[x][y] === FieldEnum.FRUIT) {
        updateScore();
        generateNewFruit();
    } else if(matrix[x][y] === FieldEnum.WALL || matrix[x][y] === FieldEnum.SNAKE) {
        gameOver();
        lost = true;
    } else {
        var pos = theSnake.body.pop();
        matrix[pos.x][pos.y] = FieldEnum.FREE;
    }
    applySnake(theSnake, matrix);
    visualizeMap(matrix);
    if(lost) {
        clearInterval(gameInterval);
    }
}

function updateScore(update) {
    update = update || 1;
    score += update;
    $('#score').html(score);
}

function applySnake(snake, matrix) {
    for(var i = 0; i < snake.body.length; i+=1) {
        var x = snake.body[i].x,
            y = snake.body[i].y;
        matrix[x][y] = FieldEnum.SNAKE;
    }
}

function changeDirectionEvent (e) {
    switch(e.keyCode){
        case KeyCode.LEFT:
            if(theSnake.direction != Direction.RIGHT) {
                theSnake.temporateDirection = Direction.LEFT;
            }
            break;
        case KeyCode.RIGHT:
            if(theSnake.direction != Direction.LEFT) {
                theSnake.temporateDirection = Direction.RIGHT;
            }
            break;
        case KeyCode.TOP:
            if(theSnake.direction != Direction.BOTTOM) {
                theSnake.temporateDirection = Direction.TOP;
            }
            break;
        case KeyCode.DOWN:
            if(theSnake.direction != Direction.TOP) {
                theSnake.temporateDirection = Direction.BOTTOM;
            }
            break;
    }
}

function gameOver() {
    $('#score-section').append('<span>GAME OVER</span>')
}

function generateNewFruit() {
    var x = -1,
        y = -1;
    do {
        x = Math.floor(Math.random() * matrix.length);
        y = Math.floor(Math.random() * matrix[0].length);
    } while(matrix[x][y] !== FieldEnum.FREE);
    matrix[x][y] = FieldEnum.FRUIT;
}

startGame();