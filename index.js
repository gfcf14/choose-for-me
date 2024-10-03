var choices = 2;
var spins = 2;

var allchoices = true;

var oneSpin = true;

var colors = new Array('131,0,0', '216,0,0', '247,198,210', '153,101,22','239,143,0', '249,211,158', '127,121,0', '251,221,0', '247,240,189', '198,239,0', '29,184,0', '178,249,179', '20,127,126', '125,253,247', '1,6,138', '66,121,221', '115,6,165', '222,187,247', '211,37,238', '183,180,173');

var section, prevdeg = 0;

var question = '';

$(window).on('load', function() {
  $('#c4mstart').on('click', () => startWheel());
  $('#c4mspin').on('click', () => spinWheel());
  $('#c4magain').on('click', () => restart());
});

function incrementChoices() {
  if (choices < 20) {
    var lastchild = '#c4mc' + choices;
    choices++;

    if (choices > 2) {
      $('#c4mrem').removeClass('grayedout');
      $('#c4mrem').css({'cursor': 'pointer'});
    }

    if (choices == 20) {
      $('#c4madd').addClass('grayedout');
      $('#c4madd').css({'cursor': ''});
    }

    $('#c4mchoicenum').html(choices);

    var childChoice = "<div id='c4mc" + choices + "'>" +
                        "<table class='w100p'>" +
                          "<tr>" +
                            "<td class='regulartext dreamgreen w20p'>" +
                              "Choice #" + choices + ":" +
                            "</td>" +
                            "<td class='w80p'>" +
                            "<input id='c4mct" + choices + "' type='text' class='w100p' style='border-radius: 5px;'>" +
                            "</td>" +
                          "</tr>" +
                        "</table>" +
                      "</div>";

    $('c4mct' + choices).on('change', () => checkComplete());
    $('c4mct' + choices).on('keypress', () => checkComplete());

    $(childChoice).insertAfter($(lastchild));
  }

  checkComplete();
}

function decrementChoices() {
  if (choices > 2) {
    var childtoremove = '#c4mc' + choices;
    choices--;

    if (choices < 20) {
      $('#c4madd').removeClass('grayedout');
      $('#c4madd').css({'cursor': 'pointer'});
    }

    if (choices == 2) {
      $('#c4mrem').addClass('grayedout');
      $('#c4mrem').css({'cursor': ''});
    }

    $('#c4mchoicenum').html(choices);

    $(childtoremove).remove();
  }

  checkComplete();
}

function incrementSpins() {
  spins++;

  $('#c4mcl').removeClass('grayedout');
  $('#c4mcl').css({'cursor': 'pointer'});

  $('#c4mspins').html(spins);
}

function decrementSpins() {
  if (spins > 2) {
    spins--;

    if (spins == 2) {
      $('#c4mcl').addClass('grayedout');
      $('#c4mcl').css({'cursor': ''});
    }

    $('#c4mspins').html(spins);
  }
}

function checkComplete() {
  for (var i = 1; i <= choices; i++) {
    if ($('#c4mct' + i).val() == '') {
      allchoices = false;
      break;
    }
    if (i == choices) allchoices = true;
  }

  if ($('#c4mtopic').val() == '' || !$("input[name='Type']:checked").val() || !allchoices) {
    $('#c4mstart').prop('disabled', true);
  }
  else {
    $('#c4mstart').prop('disabled', false);
  }
}

function startWheel() {
  if ($('input[name=Type]:checked').val() == 'more') {
    oneSpin = false;
    spins = parseInt($('#c4mspins').html());
  }

  $('#c4mmainmenu').css({opacity: 0});
  $('#c4mmainmenu').one('transitionend', function() {
    var smallerHeight = (($(window).height() - $('#headercontainer').height()) * 0.8) > $('#maincontent').width() ? $('#maincontent').width() : ($(window).height() - $('#headercontainer').height()) * 0.8;

    $('#c4mwheelcontainer').css({width: '100%', height: smallerHeight});
    $('#c4mwheelmenu').css({width: '100%', height: smallerHeight});

    $('#c4mchoicelist').css('height', $('#c4mwheelmenu').height() - $('#c4mquestion').height() - (parseInt($('#c4mquestion').css('padding-top')) * 2) - $('#c4mstandings').height() - (parseInt($('#c4mstandings').css('padding-top')) * 2) - ($('#c4mspin').height() * 2) - (parseInt($('#c4mspin').css('padding-top')) * 2));

    drawWheel(smallerHeight);

    $('#c4marrow').css('z-index', 1);
    $('#c4marrow').css({opacity: 1});
    $('#c4mwheelcontainer').css({opacity: 1});
    $('#c4mwheelcontainer').one('transitionend', function() {
      document.getElementById('c4mwheelcontainer').style.transition = 'all 3s ease-in-out';
      showWheelMenu();
    });
  });
}

function drawWheel(dim) {
  shuffleColors();

  var c = document.getElementById("c4mwheelcanvas");

  c.width = dim;
  c.height = dim;

  var ctx = c.getContext("2d");

  var radius = dim / 2;
  var cx = dim /2;
  var cy = dim / 2;

  var angle = 360;
  var options = choices;
  var start = 0;

  section = angle / options;
  var arclen = (section / 180) * Math.PI;

  var table = "<table style='border-collapse: collapse;'><tr style='border-bottom: 1px solid #007146;'><td id='tcolor' class='regulartext' style='padding: 0px 10px;'>Color</td><td id='tname' class='regulartext' style='padding: 0px 10px;'>Name</td><td id='tpoints' class='regulartext' style='padding: 0px 10px;'>Points</td></tr>";

  for (var  i = 0; i < options; i++) {
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.arc(cx, cy, radius, start, start +  arclen);
    ctx.lineTo(cx,cy);

    ctx.fillStyle = 'rgba(' + colors[i] + ',1)';
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    start += arclen;

    var rowborder = i < (options - 1) ? " style='border-bottom: 1px solid #007146;'" : "";

    var currchoice = $('#c4mct' + (i + 1)).val();
    currchoice = (currchoice.includes('<') || currchoice.includes('&lt;')) ? $(currchoice).text() : currchoice;
    table += "<tr" + rowborder + "><td style='text-align: center; padding: 0px 10px;'><div style='display: inline-block; background: " + ctx.fillStyle + "; width: 20px; height: 20px;'></td><td id='opt" + (i + 1) + "' class='regulartext' style='padding: 0px 10px;'>" + currchoice + "</td><td class='regulartext' style='padding: 0px 10px;'><div id='op" + (i + 1) + "' style='text-align: right;'>0</div></td></tr>";
  }
  table += '</table>';

  question = $('#c4mtopic').val();
  question = (question.includes('<') || question.includes('&lt;')) ? $(question).text() : question;
  $('#c4mquestion').html('Question: ' + question);
  $('#c4mchoicelist').html(table);

  $('#tname').css('width',   $('#c4mchoicelist').width() - $('#tcolor').width() - (parseInt($('#tcolor').css('padding-right')) * 2) - $('#tpoints').width() - (parseInt($('#tpoints').css('padding-right')) * 2));
}

function showWheelMenu() {
  $('#c4mwheelmenu').css('z-index', 2);
  $('#c4mwheelmenu').css({opacity: 1});
}

function spinWheel() {
  $('#c4mwheelmenu').css({opacity: 0});
  $('#c4mwheelmenu').one('transitionend', function() {
    $('#c4mwheelmenu').css('z-index', -1);
    var degrees = 0;
    while (true) {
      degrees = Math.round(Math.random() * 37) * 1000 + (Math.round(Math.random() * 5) * 2 + 1);
      if (degrees != prevdeg) {
        prevdeg = degrees;
        break;
      }
      else console.log('angles repeated');
    }

    var travel = degrees % 360;
    var sector = travel < 270 ? 270 - travel : 360 - (travel - 270);
    var opt = sector / section;
    var rnd = Math.round(opt);
    var option = (opt % 1 > 0 && opt % 1 < 0.5) ? rnd + 1 : rnd;

    document.getElementById('c4mwheelcontainer').style.transform = 'rotate(' + degrees + 'deg)';

    setTimeout(function() {
      var points = parseInt($('#op' + option).html());
      points++;

      if (oneSpin) showWinner(option);
      else {
        if (points == spins) showWinner(option);
      }

      $('#op' + option).html(points);
      showWheelMenu();
    }, 3000);
  });
}

function showWinner(option) {
  $('#c4mwq').html(question);
  $('#c4mwc').html($('#opt' + option).html());
  $('#c4mwinner').css({'z-index': 99, opacity: 1});
  document.getElementById('cover').style.visibility = 'visible';
}

function restart() {
  window.location.reload();
}

function shuffleColors() {
  for (let i = colors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [colors[i], colors[j]] = [colors[j], colors[i]];
  }
}
/*eslint-enable */
