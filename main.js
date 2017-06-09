$(function() {

  let game = {
    movieNames: ['wonder woman', 'monty python and the holy grail', 'being john malkovich'],
    movieName: '',
    playing: true,
    blankMovieName: '',
    chances: 5,
    initialize: function () {
      this.canvas.clearCanvas();
      this.blankMovieName = '';
      $('#chances').text(this.chances);
      updateTextInDom('#incorrect', '');
      this.chooseRandomMovie(),
      this.canvas.initializeCanvas();
      this.updateBlankName();
      drawBlanks();
    },
    chooseRandomMovie: function () {
      this.movieName = this.movieNames[Math.floor(Math.random()*this.movieNames.length)];
      //console.log(this.movieName);
    },
    updateBlankName: function () {
      for(let i=0;i<this.movieName.length;i++) {
        if(this.movieName.charAt(i) === (' ')) {
          this.blankMovieName += '/';
        } else {
          this.blankMovieName  += '_';
        }
      }
      //console.log(this.blankMovieName);
    },
    canvas: {
      canvasElement: document.getElementById('wordCanvas'),
      ctx: document.getElementById('wordCanvas').getContext('2d'),
      initializeCanvas: function() {
        this.ctx.font = '30px Arial';
      },
      getWidthOfCanvas: function () {
        return this.canvasElement.width;
      },
      clearCanvas: function () {
        this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        //console.log('canvas cleared');
      }
    }
  };

  game.initialize();

  $(document).keypress(function (event) {
    if(game.playing) {
      $('#note').text('');
      let keyCode = event.which || event.keyCode;
      //console.log(keyCode);
      if((keyCode >= 65 && keyCode<=90) || (keyCode>=97 && keyCode<=122)) {
        processKey(keyCode);
      } else {
        updateTextInDom('#note', 'Please enter alphabets only!');
      }
    }
  });

  function drawBlanks() {
    //console.log(game.blankMovieName);
    let x = 50;
    let y = 50;
    let canvasWidth = game.canvas.getWidthOfCanvas();

    for(let i=0;i<game.blankMovieName.length;i++) {
      x = 10+(i*50);
      y = 50;
      if(x > canvasWidth) {
        y = 50 + Math.floor(x/canvasWidth)*50;
        //console.log(x+' '+y);
        x = x % canvasWidth;
      }
      game.canvas.ctx.fillText(game.blankMovieName.charAt(i), x, y);
    }
    if(game.blankMovieName.indexOf('_') == -1) {
      setTimeout(function () {resetPlay('won');}, 10);
    }
  }

  function resetPlay(gameStatus) {
    let gameEndMessage = '';
    if(gameStatus === 'lost') {
      gameEndMessage = 'You lost! The movie was ' + game.movieName + '. Do you \
want to continue?';
    }
    else {
      gameEndMessage = 'You won! Good Job! Do you want to continue?';

    }
    let continueResult = confirm(gameEndMessage);
    if(continueResult) {
      //game.initialize();
      //game.canvas.clearCanvas();
      game.initialize();
    } else {
      game.playing = false;
    }
  }

  function updateTextInDom(domElement, text) {
    $(domElement).text(text);
  }

  function processKey(keyCode) {
    let keyPressed = String.fromCharCode(keyCode).toLowerCase();
    if(game.movieName.indexOf(keyPressed) > -1) {
      revealChar(keyPressed);
    } else {
      wrongGuess(keyPressed);
    }
  }

  function wrongGuess (keyPressed) {
    let curChances = $('#chances').html();
    let incorrectGuess = $('#incorrect').html().trim();

    if(incorrectGuess.length > 0){
      if(incorrectGuess.indexOf(keyPressed) > -1){
        updateTextInDom('#note', 'You tried \'' + keyPressed + '\' already!');
      } else {
        updateTextInDom('#incorrect', incorrectGuess + ', ' + keyPressed);
        updateTextInDom('#chances', --curChances);
      }
    } else {
      updateTextInDom('#incorrect', keyPressed);
      updateTextInDom('#chances', --curChances);
    }
    if(curChances == 0) {
      setTimeout(function () {resetPlay('lost');}, 10);
    }
  }

  function revealChar(char) {
    let blankMovieNameAsArray = game.blankMovieName.split('');
    let startingIndex = 0;
    let indexOfChar = 0;
    //console.log('here');
    while((indexOfChar = game.movieName.indexOf(char, startingIndex)) > -1) {
      //console.log('found at : ' + indexOfChar);
      blankMovieNameAsArray[indexOfChar] = char;
      startingIndex = indexOfChar + 1;
    }
    game.blankMovieName = blankMovieNameAsArray.toString().replace(/,/g, '');
    //console.log(blankMovieName);
    drawBlanks();
  }

});
