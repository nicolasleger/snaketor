$(function() {

  // Configuration

  var SIZE = 50;
  var CASES_COUNT = SIZE * SIZE;
  var PIXELS_BY_POINT = 5;
  var REAL_SIZE = SIZE * PIXELS_BY_POINT;
  var MAX_FOOD_COUNT = 3;

  var SNAKE_COLOR     = "#04B404";
  var GAME_BACKGROUND_COLOR = "#FFF";
  var FOOD_COLOR = "#FF8000";

  $("header").append('<canvas id="game_window" height="'+ REAL_SIZE +'" width="'+ REAL_SIZE +'"></canvas>');
  var game_window = $("#game_window");

  var LEFT  = { x: -1,  y: 0  };
  var RIGHT = { x: 1,   y: 0  };
  var UP    = { x: 0,   y: -1 };
  var DOWN  = { x: 0,   y: 1  };

  var rounds_count = 0;

  var snake = [ { x: SIZE / 2, y: SIZE / 2 } ];

  var keyToDirection = function(key_code) {
    switch(key_code) {
      case 37:
        return LEFT;
      case 38:
        return UP;
      case 39:
        return RIGHT;
      case 40:
        return DOWN;
      default:
        return null;
    }
  };
  var snake_direction = keyToDirection(37 + Math.floor(Math.random() * 4));

  var foods = [];


  // Methods

  var add_positions = function(position1, position2) {
    var position = { x: (position1.x + position2.x), y: (position1.y + position2.y) };

    if (position.x >= SIZE)
      position.x -= SIZE;
    else if (position.x < 0)
      position.x += SIZE;
    if (position.y >= SIZE)
      position.y -= SIZE;
    else if (position.y < 0)
      position.y += SIZE;

    return position;
  };

  var drawPoint = function(position, color) {
    game_window.drawRect({
      fillStyle: color,
      x: position.x * PIXELS_BY_POINT,
      y: position.y * PIXELS_BY_POINT,
      width: PIXELS_BY_POINT,
      height: PIXELS_BY_POINT,
      fromCenter: false
    });
  };

  var drawSnake = function() {
    var i;
    for (i = 0; i < snake.length; i++)
      drawPoint(snake[i], SNAKE_COLOR);
  };

  var positionPresentInArray = function(position, array) {
    var i;
    for (i = 0; i < array.length; i++) // TODO: Use indexOf ?
      if (array[i].x == position.x && array[i].y == position.y)
        return true;
    return false;
  };

  var snakePresent = function(position) {
    return positionPresentInArray(position, snake);
  };

  var snakeMove = function(new_position) {
    var i;
    var i_max = snake.length - 1;
    var old_position = snake[0];
    for (i = 0; i < i_max; i++)
      snake[i] = snake[i+1];
    snake[i] = new_position;

    drawPoint(old_position, GAME_BACKGROUND_COLOR);
    drawPoint(new_position, SNAKE_COLOR);
  };

  var snakeGrowth = function(new_position) {
    snake[snake.length] = new_position;
    drawPoint(new_position, SNAKE_COLOR);
  };

  var foodPresent = function(position) {
    return positionPresentInArray(position, foods);
  };

  var nextRoundWaitingTime = function(rounds_count) {
    return (900 - (850 * (
      (Math.min(0.3, rounds_count / 100)) + (Math.min(0.7, 300 * (snake.length / CASES_COUNT)))
    )));
  };

  var clockRound = function() {
    var i, i_max;
    var last_position = snake[snake.length-1];
    var new_position = add_positions(last_position, snake_direction);

    if (snakePresent(new_position)) {
      alert("You loose!\nYour snake was "+ snake.length +" long in "+ rounds_count +" rounds.");
      return;
    }
    else if (foodPresent(new_position)) {
      snakeGrowth(new_position);

      // Remove the food and shift other values
      for (i = 0; i < foods.length; i++) {
        if (foods[i].x == new_position.x && foods[i].y == new_position.y)
          break;
      }
      i_max = foods.length - 1;
      while (i < i_max) {
        foods[i] = foods[i+1];
        i++;
      }
      foods.splice(i_max, 1);
    }
    else
      snakeMove(new_position);

    if (foods.length < MAX_FOOD_COUNT) {
      var new_food_position = { x: Math.floor(Math.random() * SIZE) , y: Math.floor(Math.random() * SIZE) };
      while (snakePresent(new_food_position))
        new_food_position = { x: Math.floor(Math.random() * SIZE) , y: Math.floor(Math.random() * SIZE) };

      foods[foods.length] = new_food_position;
      drawPoint(new_food_position, FOOD_COLOR);
    }

    rounds_count++;
    setTimeout(clockRound, nextRoundWaitingTime(rounds_count));
  };


  // UI
  $('body').keypress(function(e) {
    var new_direction = keyToDirection(e.keyCode);
    if (new_direction !== null)
      snake_direction = new_direction;
  });

  // Engine
  setTimeout(clockRound, 500);
});