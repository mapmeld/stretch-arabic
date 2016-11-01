var mainWord;
var rLength = 20;

function clearCanvas(canvas, ctx) {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function repaintWord(canvas, ctx) {
  var letters = $('#letters input');
  var segments = [];
  var gaps = [];
  var lastLetter = 0;
  for (var i = 0; i < letters.length; i++) {
    if (letters[i].value > 0) {
      var nextLetter = letters[i].className.split('slider-')[1] * 1 + 1;
      segments.push(mainWord.slice(lastLetter, nextLetter));
      gaps.push(letters[i].value * 1);
      lastLetter = nextLetter;
    }
  }
  segments.push(mainWord.slice(lastLetter));

  var lengths = [];
  var totalLength = 0;
  for (var s = 0; s < segments.length; s++) {
    var len = ctx.measureText(segments[s] + 'ر').width - rLength;
    lengths.push(len);
    totalLength += len;
  }
  for (var g = 0; g < gaps.length; g++) {
    totalLength += gaps[g];
  }

  clearCanvas(canvas, ctx);

  var consumedLength = 0;
  for (var s = 0; s < segments.length; s++) {
    consumedLength += lengths[s];
    var segmentText = (s === segments.length - 1) ? segments[s] : segments[s] + 'ر';

    ctx.fillStyle = '#000';
    ctx.fillText(segmentText, totalLength - consumedLength, 100);

    if (s !== segments.length - 1) {
      ctx.fillStyle = '#fff';
      ctx.fillRect(totalLength - consumedLength, 0, rLength, 150);

      consumedLength += gaps[s];

      ctx.fillStyle = '#000';

      var continuation = (s === gaps.length - 1) ? -5 : 16;

      ctx.fillRect(totalLength - consumedLength + continuation, 94, gaps[s] + rLength - continuation, 4);
    }
  }
}

function addStretchLetter(canvas, ctx, letter, index) {
  var stretch = $('<div>');
  stretch.append($('<strong>').text(letter));
  var slider = $('<input>')
    .attr('type', 'range')
    .addClass('slider-' + index)
    .val(0)
    .on('change', function(e) {
      // console.log(e.target.value);
      repaintWord(canvas, ctx);
    });
  stretch.append(slider);
  $('#letters').append(stretch);
}

function startWord(canvas, word) {
  var connectsOnLeft = ['ب', 'ج', 'غ', 'ظ', 'ض', 'خ', 'ث', 'ت', 'ش', 'ق', 'ص', 'ف', 'ع', 'س', 'ن', 'م', 'ل', 'ك', 'ي', 'ح', 'ه'];
  mainWord = word;

  var ctx = canvas.getContext('2d');
  clearCanvas(canvas, ctx);
  ctx.fillStyle = '#000';
  ctx.font = '45px sans-serif';
  ctx.fillText(word, 0, 100);
  
  $('#letters').empty();

  for (var w = 0; w < word.length - 1; w++) {
    var letter = word[w];
    if (connectsOnLeft.indexOf(letter) > -1) {
      addStretchLetter(canvas, ctx, letter, w);
    }
  }
}

$(function() {
  var canv = $('#canvas')[0];
  startWord(canv, 'أستراليا');

  $('#reprint').click(function() {
    startWord(canv, $('#original').val());
  });
});
