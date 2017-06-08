$(function() {
  let mainName = 'wonder woman';
  let blankName = '';
  let playing = true;

  $('#chances').text(3);
  let canvas = document.getElementById('wordCanvas');
  let ctx = canvas.getContext('2d');
  ctx.font = '30px Arial';

  updateBlankName(mainName);

  $(document).keypress(function (event) {
    if(playing) {
      var keyPressed = String.fromCharCode(event.which || event.keyCode);
      $('#note').text('');
      if(mainName.indexOf(keyPressed) > -1) {
        revealChar(keyPressed);
      } else {
        let curChances = $('#chances').html();
        let incorrectGuess = $('#incorrect').html().trim();
        if(incorrectGuess.length > 0){
          if(incorrectGuess.indexOf(keyPressed) > -1){
            $('#note').text('You tried \'' + keyPressed + '\' already!');
          } else {
            $('#incorrect').text(incorrectGuess + ', ' + keyPressed);
            $('#chances').text(--curChances);
          }
        } else {
          $('#incorrect').text(keyPressed);
          $('#chances').text(--curChances);
        }
        if(curChances == 0) {
          setTimeout(function () {alert('You lost');}, 100);
          setTimeout(function () {resetPlay();}, 100);
        }
      }
    }
  });

  function updateBlankName (name) {
    //console.log(name.length);
    for(let i=0;i<name.length;i++) {
      if(name.charAt(i) === (' ')) {
        blankName += '/';
      } else {
        blankName  += '_';
      }
    }
    drawBlanks();
  }

  function drawBlanks() {
    //console.log(blankName);
    let x = 50;
    let y = 50;
    let canvasWidth = canvas.width;

    for(let i=0;i<blankName.length;i++) {
      x = 10+(i*50);
      y = 50;
      if(x > canvasWidth) {
        y = 50 + Math.floor(x/canvasWidth)*50;
        //console.log(x+' '+y);
        x = x % canvasWidth;
      }
      ctx.fillText(blankName.charAt(i), x, y);
    }
    if(blankName.indexOf('_') == -1) {
      setTimeout(function () {alert('You won!');}, 100);
    }
  }

  function revealChar(char) {
    let blankNameAsArray = blankName.split('');
    let i = 0;
    let indexChar = 0;
    //console.log('here');
    while((indexChar = mainName.indexOf(char, i)) > -1) {
      //console.log('found at : ' + indexChar);
      blankNameAsArray[indexChar] = char;
      i = indexChar + 1;
    }
    blankName = blankNameAsArray.toString().replace(/,/g, '');
    //console.log(blankName);
    drawBlanks();
  }

  function resetPlay() {
    playing = false;
  }
});
