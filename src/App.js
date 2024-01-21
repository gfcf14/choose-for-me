import { Fragment } from 'react';
import $ from 'jquery';
import { contract, expand, pointer, GreenDreamSmall } from './assets';
import './App.css';

var choices = 2;
var spins = 2;

var allchoices = true;

var oneSpin = true;

var colors = new Array('131,0,0', '216,0,0', '247,198,210', '153,101,22','239,143,0', '249,211,158', '127,121,0', '251,221,0', '247,240,189', '198,239,0', '29,184,0', '178,249,179', '20,127,126', '125,253,247', '1,6,138', '66,121,221', '115,6,165', '222,187,247', '211,37,238', '183,180,173');

var section, prevdeg = 0;

var question = '';

function App() {
  function checkComplete() {
    for (var i = 1; i <= choices; i++) {
      if ($('#c4mct' + i).val() === '') {
        allchoices = false;
        break;
      }
      if (i === choices) allchoices = true;
    }

    if ($('#c4mtopic').val() === '' || !$("input[name='Type']:checked").val() || !allchoices) {
      $('#c4mstart').prop('disabled', true);
    }
    else {
      $('#c4mstart').prop('disabled', false);
    }
  }

  function decrementChoices() {
    if (choices > 2) {
      var childtoremove = '#c4mc' + choices;
      choices--;

      if (choices < 20) {
        $('#c4madd').removeClass('grayedout');
        $('#c4madd').css({'cursor': 'pointer'});
      }

      if (choices === 2) {
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

      if (spins === 2) {
        $('#c4mcl').addClass('grayedout');
        $('#c4mcl').css({'cursor': ''});
      }

      $('#c4mspins').html(spins);
    }
  }

   function incrementChoices() {
    if (choices < 20) {
      var lastchild = '#c4mc' + choices;
      choices++;

      if (choices > 2) {
        $('#c4mrem').removeClass('grayedout');
        $('#c4mrem').css({'cursor': 'pointer'});
      }

      if (choices === 20) {
        $('#c4madd').addClass('grayedout');
        $('#c4madd').css({'cursor': ''});
      }

      $('#c4mchoicenum').html(choices);

      var childChoice = "<div id='c4mc" + choices + "'>" +
                          "<table className='w100p'>" +
                            "<tr>" +
                              "<td className='regulartext dreamgreen w20p'>" +
                                "Choice #" + choices + ":" +
                              "</td>" +
                              "<td className='w80p'>" +
                              "<input id='c4mct" + choices + "' type='text' className='w100p' style='border-radius: 5px;'>" +
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

  function startWheel() {
    if ($('input[name=Type]:checked').val() === 'more') {
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
        if (degrees !== prevdeg) {
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
          if (points === spins) showWinner(option);
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

  $(window).on('load', function() {
    $('#c4mstart').on('click', () => startWheel());
    $('#c4mspin').on('click', () => spinWheel());
    $('#c4magain').on('click', () => restart());
  });

  return (
    <Fragment>
      <div id='cover'></div>
      <div id='c4mwinner' className='popup w80p center'>
        <div id='c4mwq' className='regulartext white w100p pad5v'></div>
        <br />
        <div id='c4mwc' className='regulartext white w100p pad5v'></div>
        <br />
        <button id='c4magain' className='popbtn w90p'>
          AGAIN?
        </button>
      </div>
      <div id='appcontent'>
        <div id='headercontainer' className='largebottomspace'>
          <div id='homeimg'><a href='/'><img src={GreenDreamSmall} alt='' /></a></div>
          <div id='apptitle'>CHOOSE FOR ME</div>
        </div>
        <div id='c4marrow' className='inactivesection w100p center' style={{left: 0}}>
          <img src={pointer} alt='' />
        </div>
        <div id='c4mwheelmenu' className='inactivesection center bgnaturalgreen' style={{border: '3px solid #00ff00', borderRadius: '20px'}}>
          <div id='c4mquestion' className='regulartext white w100p pad5v'>
            Question:
          </div>
          <div id='c4mstandings' className='regulartext white nolinebreak left w90p pad5v'>
            Standings:
          </div>
          <div className='bottomspaced'>
            <div id='c4mchoicelist' className='nolinebreak bgwhite onlyYoverflow w90p'></div>
          </div>

          <button id='c4mspin' className='popbtn w90p'>
            SPIN!!!
          </button>
        </div>
        <div id='c4m' className='inactivesection w100p center' style={{left: 0}}>
          <img src={pointer} alt='' />
        </div>
        <div id='c4mwheelcontainer' className='inactivesection'>
          <canvas id='c4mwheelcanvas'></canvas>
        </div>
        <div id='c4mmainmenu' className='bottomspaced' style={{opacity: '1', transition: 'opacity 1s'}}>
          <div className='regulartext dreamgreen left'>
            Welcome! What should we choose on?
          </div>
          <input id='c4mtopic' type='text' onChange={() => checkComplete()} onKeyPress={() => checkComplete()} className='w100p' style={{borderRadius: '5px'}} placeholder='Enter your question' />
          <br /><br />
          <div className='w100p hiddenoverflow'>
            <div className='fright'>
              <img id='c4mrem' src={contract} className='grayedout' onClick={() => decrementChoices()} alt='' />
              <div className='nolinebreak regulartext dreamgreen' id='c4mchoicenum'>
                2
              </div>
              <img id='c4madd' src={expand} className='handlink' onClick={() => incrementChoices()} alt='' />
            </div>
            <div className='regulartext dreamgreen left'>
              How many choices?
            </div>
          </div>
          <br />
          <div className='w100p hiddenoverflow'>
            <div id='c4mchoices' className='fright w80p'>
              <div id='c4mc1'>
                <table className='w100p'>
                  <tbody>
                    <tr>
                      <td className='regulartext dreamgreen w20p'>
                        Choice #1:
                      </td>
                      <td className='w80p'>
                        <input id='c4mct1' type='text' onChange={() => checkComplete()} onKeyPress={() => checkComplete()} className='w100p' style={{borderRadius: '5px'}} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div id='c4mc2'>
                <table className='w100p'>
                  <tbody>
                    <tr>
                      <td className='regulartext dreamgreen w20p'>
                        Choice #2:
                      </td>
                      <td className='w80p'>
                        <input id='c4mct2' type='text' onChange={() => checkComplete()} onKeyPress={() => checkComplete()} className='w100p' style={{borderRadius: '5px'}} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className='regulartext dreamgreen left'>
              Please write:
            </div>
          </div>
          <br />
          <div className='w100p'>
            <div className='fright left'>
              <input id='c4mt1' type='radio' onChange={() => checkComplete()} name='Type' value='once' />First Spin
              <br />
              <input id='c4mt2' type='radio' onChange={() => checkComplete()} name='Type' value='more' />First to
              <img id='c4mcl' src={contract} className='grayedout' onClick={() => decrementSpins()} alt='' />
              <div className='nolinebreak regulartext dreamgreen' id='c4mspins'>
                2
              </div>
              <img id='c4mcm' src={expand} className='handlink' onClick={() => incrementSpins()} alt='' />
            </div>
            <div className='regulartext dreamgreen left'>
              Decision type:
            </div>
          </div>
          <br /><br />
          <button id='c4mstart' className='popbtn' disabled='disabled'>
            START
          </button>
        </div>
      </div>
      <div id='statsbar'></div>
    </Fragment>
  );
}

export default App;
