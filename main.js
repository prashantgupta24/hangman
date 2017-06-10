$(function() {

  let game = {
    movieNames: ['wonder woman', 'monty python and the holy grail', 'being john malkovich',
      'the dark knight', 'how to train your dragon', 'la la land', 'the road to el dorado',
      'gladiator', 'the secret life of walter mitty', 'harry potter and the order of the phoenix'],
    movieName: '',
    playing: true,
    blankMovieName: '',
    chances: 5,
    chancesElem: $('#chances'),
    incorrectElem: $('#incorrect'),
    noteElem: $('#note'),
    initialize: function () {
      this.canvas.clearCanvas();
      this.blankMovieName = '';
      $(this.chancesElem).text(this.chances);
      $(this.incorrectElem).text('');
      this.chooseRandomMovie(),
      this.canvas.initializeCanvas();
      this.updateBlankName();
      this.drawBlanks();
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
    drawBlanks: function () {
        //console.log(this.blankMovieName);
      let x = 50;
      let y = 50;
      let canvasWidth = this.canvas.getWidthOfCanvas();

      for(let i=0;i<this.blankMovieName.length;i++) {
        x = 10+(i*50);
        y = 50;
        if(x > canvasWidth) {
          y = 50 + Math.floor(x/canvasWidth)*50;
          //console.log(x+' '+y);
          x = x % canvasWidth;
        }
        this.canvas.ctx.fillText(this.blankMovieName.charAt(i), x, y);
      }
      if(this.blankMovieName.indexOf('_') == -1) {
        setTimeout(function () {game.resetPlay('won');}, 10);
      }
    },
    revealChar: function (char) {
      let blankMovieNameAsArray = this.blankMovieName.split('');
      let startingIndex = 0;
      let indexOfChar = 0;
      //console.log('here');
      while((indexOfChar = this.movieName.indexOf(char, startingIndex)) > -1) {
        //console.log('found at : ' + indexOfChar);
        blankMovieNameAsArray[indexOfChar] = char;
        startingIndex = indexOfChar + 1;
      }
      this.blankMovieName = blankMovieNameAsArray.toString().replace(/,/g, '');
      //console.log(blankMovieName);
      this.drawBlanks();
    },
    processKey:function (keyCode) {
      let keyPressed = String.fromCharCode(keyCode).toLowerCase();
      if(this.movieName.indexOf(keyPressed) > -1) {
        this.revealChar(keyPressed);
      } else {
        this.wrongGuess(keyPressed);
      }
    },
    resetPlay: function (gameStatus) {
      let gameEndMessage = '';
      if(gameStatus === 'lost') {
        gameEndMessage = 'You lost! The movie was ' + this.movieName + '. Do you \
want to continue?';
      }
      else {
        gameEndMessage = 'You won! Good Job! Do you want to continue?';

      }
      let continueResult = confirm(gameEndMessage);
      if(continueResult) {
        this.initialize();
      } else {
        this.playing = false;
      }
    },
    wrongGuess: function (keyPressed) {
      let curChances = $(this.chancesElem).html();
      let incorrectGuess = $(this.incorrectElem).html().trim();

      if(incorrectGuess.length > 0){
        if(incorrectGuess.indexOf(keyPressed) > -1){
          $(this.noteElem).text('You tried \'' + keyPressed + '\' already!');
        } else {
          $(this.incorrectElem).text(incorrectGuess + ', ' + keyPressed);
          $(this.chancesElem).text(--curChances);
        }
      } else {
        $(this.incorrectElem).text(keyPressed);
        $(this.chancesElem).text(--curChances);
      }
      if(curChances == 0) {
        setTimeout(function () {game.resetPlay('lost');}, 10);
      }
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
      $(game.noteElem).text('');
      let keyCode = event.which || event.keyCode;
      //console.log(keyCode);
      if((keyCode >= 65 && keyCode<=90) || (keyCode>=97 && keyCode<=122)) {
        game.processKey(keyCode);
      } else {
        $(game.noteElem).text('Please enter alphabets only!');
      }
    }
  });

});
