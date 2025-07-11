import { initJsPsych } from 'jspsych';
const jsPsych = initJsPsych();

import $ from 'jquery';
import Math from 'mathjs';
// js-template but does not wokr
import Click from './prediction';
import Blank from './blank';
import Position from './outcome';
import jsPsychHtmlButtonResponse from '@jspsych/plugin-html-button-response';

import { images } from '../lib/utils';

// design
const n_TrialPerBlock = 200; // number of trials per block
const n_TrialPractice = 25; // FIX THIS !11
const n_SamePosition = 7;
const n_MaxJitter = 4; // 7-11, avg of 9
const rtDeadline = 15000;
// colorblind-friendly colors from Seaborn: ['#0173b2', '#de8f05', '#029e73', '#d55e00', '#cc78bc', '#ca9161', '#fbafe4', '#949494', '#ece133', '#56b4e9']
const all_colors = ['#0173b2', '#de8f05', '#029e73', '#cc78bc', '#000000', '#ece133']; // doesn't include practice block colors

//Generate Jitter
function GenerateJitter(TrialPerBlock, MaxJitter) {
  let jitters = [];
  jitters.length = TrialPerBlock + 1;
  for (let t = 0; t < TrialPerBlock; t++) {
    jitters[t] = Math.floor(Math.random() * (MaxJitter + 1));
  }
  return jitters;
}

// shuffle all colors (even across blocks)
const colors = jsPsych.randomization.shuffle(all_colors);

//colors for practice block
//let colorP0 = '#0173b2'; // same color as shown in instructions
// for practice block 0
let colorP01 = '#ca9161'; // color chosen so not as same as main blocks
// for practice block 01, 02.. lets change 02's colors

let colorP02 = ' #fbafe4';
let colorP1 = '#56b4e9'; //for big practice block 1
//let colorP2 = colorsP2;
//for (let h = 0; h < n_TrialPractice; h++) {
//let colorRepeat = jsPsych.randomization.shuffle(colorsP2);
//colorP2 = colorP2.concat(colorRepeat);
//}

// colors for block 1
let color1 = colors[0]; // note: all trials have the same color

// colors for block 2
//const colors2 = colors.slice(1, 3);
// const colors2 = ["#ffa4f1","#b0ff64"];
///let color2 = colors2;
//let n_trialsPerColor = Math.ceil(n_TrialPerBlock / 2);
//for (let h = 0; h < n_trialsPerColor; h++) {
//h<100
//  let colorRepeat = jsPsych.randomization.shuffle(colors2);
//     let a = color2.slice(color2.length-2); // a: first color
//     if (colorRepeat.toString() !== a.toString() && colorRepeat[0] !== color2[color2.length-1]){
//
//           color2 = color2.concat(colorRepeat)
//     }  else h--;
// color2 = color2.concat(colorRepeat);
//}

// colors for block 3
/*
const colors3 = colors.slice(3, 6);
n_trialsPerColor = Math.ceil(n_TrialPerBlock / 3);
let color3 = colors3;
for (let h = 0; h < n_trialsPerColor; h++) {
  let colorRepeat = jsPsych.randomization.shuffle(colors3);
  let b = color3.slice(color3.length - 3);
  if (colorRepeat.toString() !== b.toString() && colorRepeat[0] !== color3[color3.length - 1]) {
    color3 = color3.concat(colorRepeat);
  } else h--;
}
*/
//define normal distribution functions
let spareRandom = null;
function normalRandom() {
  let val, u, v, s, mul;

  if (spareRandom !== null) {
    val = spareRandom;
    spareRandom = null;
  } else {
    do {
      u = Math.random() * 2 - 1;
      v = Math.random() * 2 - 1;

      s = u * u + v * v;
    } while (s === 0 || s >= 1);

    mul = Math.sqrt((-2 * Math.log(s)) / s);

    val = u * mul;
    spareRandom = v * mul;
  }
  return val;
}
function normalRandomScaled(mean, stddev) {
  let r = normalRandom();

  r = r * stddev + mean;
  return r;
}
// make pseudo random position
const numsPrac1_1 = angle_array();
const nums1 = angle_array();

function angle_array() {
  let nums = [];
  nums.length = n_TrialPerBlock + 1;
  for (let i = 1; i < nums.length; i++) {
    nums[i] = Math.floor(Math.random() * 359);
    for (let j = 0; j < i; j++) {
      while (nums[i] === nums[j]) {
        i--;
      }
    }
  }
  return nums;
}

// evaluate performance (cumulative across non-practice blocks)
function assessPerformance(prediction, outcome) {
  let pred_err = prediction - outcome;
  // convert to NaN to prevent unexpected math operations
  if (prediction == null) {
    pred_err = NaN;
  }
  // min distance around the circle in degrees
  let pred_err_min = Math.min(Math.mod(pred_err, 360), Math.mod(-pred_err, 360));
  let hit = 0;
  if (pred_err_min <= 25) {
    console.log('hit');
    hit = 1;
    //jsPsych.data.addDataToLastTrial({ score });
  } else {
    console.log('miss');
  }
  console.log(prediction, outcome);
  return hit;
}

/***
 *define blocks
 ***/

/***
 *practice block n < n_TrialPractice + 1
 */
/*
function practice_block0(timeline, jsPsych) {
  let n_TrialPractice1 = 10;
  let trial_type_label = 'practice';
  let updateThreshold = 15; // if they are updating more than this, they are not doing well
  let minUpdateCount = 7; // number of trials that must be below updateThreshold
  let updates = [];
  let predictions = [];
  let outcomes = [267.18, 294.64, 234.72, 284.13, 267.62, 274.55, 264.57, 261.07, 297.36, 290.45];
  let totalScore = 0;

  for (let n = 1; n < n_TrialPractice1 + 1; n++) {
    const colorStyleP = colorP0;
    let prediction;
    let outcome;
    let mean;
    let score;
    //ENSURE THERE ARE examples of highly noisy outcomes
    //even though they are aiming in the right place, will not catch every zombie
    outcome = outcomes[n - 1];
    mean = 270;
    console.log(colorStyleP);
    console.log(mean);
    console.log(outcome);
    var make_prediction = {
      type: Click,
      on_load: function () {
        $('#counter').text(n_TrialPractice1 + 1 - n);
        $('#center-circle').css('background-color', colorStyleP);
        $('#circle').on('click', function (event) {
          if (event.target == this) {
            $('#center-circle').css('background-color', '#A9A9A9');
          }
        });
        if ($('#arrow').length === 0) {
          $('body').append('<div id="arrow"></div>');
        }
        if ($('#arrow-tail').length === 0) {
          $('body').append('<div id="arrow-tail"></div>');
        }
        $('#arrow').css('border-top-color', colorStyleP);
        $('#arrow-tail').css('background-color', colorStyleP);
      },
      on_finish: function () {
        let pred_idx = jsPsych.data.get().select('prediction').count();
        prediction = jsPsych.data.get().select('prediction').values[pred_idx - 1];
        predictions.push(prediction);
      },
    };

    var blank = {
      type: Blank,
      on_load: function () {
        $('#counter').text(n_TrialPractice1 + 1 - n);
      },
    };

    var observe_outcome = {
      type: Position,
      data: { type: trial_type_label },
      on_load: function () {
        $('#shield').toggle(true);
        $('#picker').css('transform', 'rotate(' + prediction + 'deg)');
        $('#shield').css('transform', 'rotate(' + (prediction + 25) + 'deg) skewX(-40deg)');
        $('#counter').text(n_TrialPractice1 + 1 - n);
        $('#picker-circle').css('background-color', colorStyleP);
        $('#pickerOutcome').css('transform', 'rotate(' + outcome + 'deg)');
      },
      on_finish: function (data) {
        data.outcome = outcome;
        data.mean = mean;
        data.color = colorStyleP;
        score = assessPerformance(prediction, outcome);
        // Store updated totalScore back into jsPsych.data
        data.score = score;
        totalScore += score;
        outcomes[n - 1] = outcome; // store outcomes for later
        if (n > 1) {
          let update = Math.abs(predictions[n - 1] - predictions[n - 2]);
          update = Math.min(Math.abs(update), 360 - Math.abs(update));
          updates.push(update);
          console.log('update between predictions', update);
          // or do I want to do actual update
        }
      },
    };
    var practice = {
      timeline: [make_prediction, blank, observe_outcome],
    };
    timeline.push(practice);
  }
  var checkPerformance = {
    type: jsPsychHtmlButtonResponse,
    stimulus: function () {
      $('#arrow').remove();
      $('#arrow-tail').remove();
      let sufficientUpdates = updates.filter((u) => u <= updateThreshold).length;
      console.log('updates', updates);
      if (sufficientUpdates >= minUpdateCount) {
        return `<div style= "line-height:1.75;">
        <p>Great job! You got ${totalScore} out of 10 possible points in this block.</p>
        <p style = "text-align: center;">
        <br>If you place the shield at 12 o'clock every trial, you could hit <b> 8 out of 10 zombies </b>.
        <br>The zombies stagger around their target area unpredictably, so <u>it is not possible to hit every zombie</u>.
        <br> You can proceed to the next practice.</p></div>`;
      } else {
        return `<div><p>Sorry, you did not place your shield at the ideal spot to capture as many zombies as possible.</p>
        <p>Remember, the zombies preferred attack location is represented by the arrow. </p>
        <p>Please try again.</p></div>`;
      }
    },
    choices: function () {
      let sufficientUpdates = updates.filter((u) => u <= updateThreshold).length;
      return sufficientUpdates >= minUpdateCount ? ['Continue'] : ['Try Again'];
    },
    on_finish: function (data) {
      //let totalScore = jsPsych.data.get().last(1).values()[0].totalScore;
      $('#arrow').remove();
      $('#arrow-tail').remove();

      let sufficientUpdates = updates.filter((u) => u <= updateThreshold).length;
      console.log('sufficientUpdates', sufficientUpdates);
      data.repeatPractice = sufficientUpdates < minUpdateCount;
      data.instructionAttempts += data.repeatPractice ? 1 : 0;
      updates = []; // reset updates for next practice block'
      predictions = []; // reset predictions for next practice block
      totalScore = 0;
    },
  };
  timeline.push(checkPerformance);
}*/

//FOR PRACTICE BLOCK 0 LOOPING
/*
function getPracticeBlock0Timeline(jsPsych) {
  let timeline = [];
  practice_block0(timeline, jsPsych);
  return timeline;
}
*/
/***
 *practice block n < n_TrialPractice + 1
 */
function practice_block01(timeline) {
  let n_TrialPractice1 = 10;
  let trial_type_label = 'practice';
  let outcomes = [136.55, 128.93, 96.25, 109.07, 112.44, 164.57, 140.82, 134.58, 114.81, 147.85];

  //jsPsych.data.addDataToLastTrial({ totalScore: 0 });  // Initialize totalScore at the start
  for (let n = 1; n < n_TrialPractice1 + 1; n++) {
    const colorStyleP = colorP01; // same color as pblock 1.. sus?
    let prediction;
    let outcome;
    let mean;
    let score;
    // no changepoint logic here
    mean = 120; //Math.floor(Math.random() * 360);
    outcome = outcomes[n - 1]; //Math.floor(Math.random() * 360);
    console.log(colorStyleP);
    console.log(mean);
    console.log(outcome);
 /*   var make_prediction = {
      type: Click,
      on_load: function () {
        $('#counter').text(n_TrialPractice1 + 1 - n);
        $('#center-circle').css('background-color', colorStyleP);
        $('#circle').on('click', function (event) {
          if (event.target == this) {
            $('#center-circle').css('background-color', '#A9A9A9');
          }
        });
      },
      on_finish: function () {
        let pred_idx = jsPsych.data.get().select('prediction').count();
        prediction = jsPsych.data.get().select('prediction').values[pred_idx - 1];
      },
    };

    var blank = {
      type: Blank,
      on_load: function () {
        $('#counter').text(n_TrialPractice1 + 1 - n);
      },
    };
*/
    var observe_outcome = {
      type: Position,
      data: { type: trial_type_label},
      outcomes: outcomes,
      on_load: function () {
        $('#shield').toggle(true);
        $('#picker').css('transform', 'rotate(' + 120 + 'deg)');
        $('#shield').css('transform', 'rotate(' + (120 + 30) + 'deg) skewX(-30deg)');
        $('#counter').text(n_TrialPractice1 + 1 - n);
        $('#picker-circle').css('background-color', '#ca9161');
        $('#pickerOutcome').css('transform', 'rotate(' + outcome + 'deg)');
      },
      on_finish: function (data) {
        data.outcome = outcome;
        data.mean = mean;
        data.color = colorStyleP;
        score = assessPerformance(prediction, outcome);
        data.score = score;
      },
    };
    var practice = {
      timeline: [observe_outcome],
    };
    timeline.push(practice);
  }
}

/***
 *practice block n < n_TrialPractice + 1
 */
function practice_block02(timeline, jsPsych) {
  let n_TrialPractice2 = 10;
  let trial_type_label = 'practice';

  //jsPsych.data.addDataToLastTrial({ totalScore: 0 });  // Initialize totalScore at the start

  for (let n = 1; n < n_TrialPractice2 + 1; n++) {
    //let n = 1;
    const colorStyleP = colorP02;
    var x1;
    let prediction;
    let outcome;
    let mean;

    x1 = 75; // this generates the random number 1 -359
    outcome = Math.mod(normalRandomScaled(x1, 20), 360); //x1 = mean, 20 = stdev
    mean = x1;
    console.log(colorStyleP);
    console.log(mean);
    // console.log(c1);
    // console.log(jitters_1[c1]);
    console.log(outcome);

    var make_prediction = {
      type: Click,
      on_load: function () {
        $('#counter').text(n_TrialPractice2 + 1 - n);
        $('#center-circle').css('background-color', colorStyleP);
        $('#circle').on('click', function (event) {
          if (event.target == this) {
            $('#center-circle').css('background-color', '#A9A9A9');
          }
        });
      },
      on_finish: function () {
        let pred_idx = jsPsych.data.get().select('prediction').count();
        prediction = jsPsych.data.get().select('prediction').values[pred_idx - 1];
      },
    };

    var blank = {
      type: Blank,
      on_load: function () {
        $('#counter').text(n_TrialPractice2 + 1 - n);
      },
    };

    var observe_outcome = {
      type: Position,
      data: { type: trial_type_label },
      on_load: function () {
        $('#shield').toggle(true);
        $('#picker').css('transform', 'rotate(' + prediction + 'deg)');
        $('#shield').css('transform', 'rotate(' + (prediction + 25) + 'deg) skewX(-40deg)');
        $('#counter').text(n_TrialPractice2 + 1 - n);
        $('#picker-circle').css('background-color', colorStyleP);
        $('#pickerOutcome').css('transform', 'rotate(' + outcome + 'deg)');
      },
      on_finish: function (data) {
        data.outcome = outcome;
        data.mean = mean;
        data.color = colorStyleP;
        data.score = assessPerformance(prediction, outcome);
      },
    };
    var practice = {
      timeline: [make_prediction, blank, observe_outcome],
    };
    timeline.push(practice);
  }
}

function practice_block1(timeline, jsPsych) {
  let counterP_1 = 0;
  let c1 = 0;
  let jitters_1 = GenerateJitter(n_TrialPractice, n_MaxJitter);
  let trial_type_label = 'practice';

  for (let n = 1; n < n_TrialPractice + 1; n++) {
    //let n = 1;
    const colorStyleP = colorP1;
    var x1;
    let prediction;
    let outcome;
    let mean;
    counterP_1++;
    if (counterP_1 <= n_SamePosition + jitters_1[c1]) {
      // counterP_1 = counterP_1;
    }
    if (counterP_1 > n_SamePosition + jitters_1[c1]) {
      counterP_1 = Math.mod(counterP_1, n_SamePosition + jitters_1[c1]);
      c1++;
    }
    if (counterP_1 === 1) {
      x1 = numsPrac1_1[n]; // this generates the random number 1 -359
    }
    if (counterP_1 !== 1) {
      // x1 = x1
    }
    outcome = Math.mod(normalRandomScaled(x1, 20), 360); //x1 = mean, 20 = stdev
    mean = x1;
    console.log(colorStyleP);
    console.log(mean);
    console.log(c1);
    console.log(jitters_1[c1]);
    console.log(outcome);

    var make_prediction = {
      type: Click,
      on_load: function () {
        $('#counter').text(n_TrialPractice + 1 - n);
        $('#center-circle').css('background-color', colorStyleP);
        $('#circle').on('click', function (event) {
          if (event.target == this) {
            $('#center-circle').css('background-color', '#A9A9A9');
          }
        });
      },
      on_finish: function () {
        let pred_idx = jsPsych.data.get().select('prediction').count();
        prediction = jsPsych.data.get().select('prediction').values[pred_idx - 1];
      },
    };

    var blank = {
      type: Blank,
      on_load: function () {
        $('#counter').text(n_TrialPractice + 1 - n);
      },
    };

    var observe_outcome = {
      type: Position,
      data: { type: trial_type_label },
      on_load: function () {
        $('#shield').toggle(true);
        $('#picker').css('transform', 'rotate(' + prediction + 'deg)');
        $('#shield').css('transform', 'rotate(' + (prediction + 25) + 'deg) skewX(-40deg)');
        $('#counter').text(n_TrialPractice + 1 - n);
        $('#picker-circle').css('background-color', colorStyleP);
        $('#pickerOutcome').css('transform', 'rotate(' + outcome + 'deg)');
      },
      on_finish: function (data) {
        data.outcome = outcome;
        data.mean = mean;
        data.color = colorStyleP;
        data.score = assessPerformance(prediction, outcome);
      },
    };
    var practice = {
      timeline: [make_prediction, blank, observe_outcome],
    };
    timeline.push(practice);
  }
}

/*****
1color block n < n_TrialPerBlock + 1
 *****/
function block1(timeline, jsPsych) {
  var block1_intro = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<div><img src=${images['zombie.png']} style='top:20%; left: 10% ;height:300px;width: auto'><p>In this block, you will face one group of zombies.</p></div>`,
    choices: ['Start'],
  };
  timeline.push(block1_intro);

  let counter1 = 0;
  let jitters = GenerateJitter(n_TrialPerBlock, n_MaxJitter);
  let trial_type_label = 'block1';
  let c = 0;
  for (let n = 1; n < n_TrialPerBlock + 1; n++) {
    const colorStyle = color1;
    counter1++;
    var x;
    let prediction;
    if (counter1 <= n_SamePosition + jitters[c]) {
      // counter1 = counter1;
    } else if (counter1 > n_SamePosition + jitters[c]) {
      counter1 = Math.mod(counter1, n_SamePosition + jitters[c]);
      c++;
    }
    if (counter1 === 1) {
      x = nums1[n];
    }
    //   if (counter1 !== 1) {
    //     continue;
    //   }
    const outcome = Math.mod(normalRandomScaled(x, 20), 360);
    const mean = x;

    //   console.log(mean);
    //   console.log(jitters[c]);

    var make_prediction = {
      type: Click,
      on_load: function () {
        $('#counter').text(n_TrialPerBlock + 1 - n);
        $('#center-circle').css('background-color', colorStyle);
        $('#bomb').on('mousedown', function (event) {
          if (event.currentTarget == this) {
            $('#center-circle').css('background-color', '#A9A9A9');
          }
        });
      },
      on_finish: function () {
        let pred_idx = jsPsych.data.get().select('prediction').count();
        prediction = jsPsych.data.get().select('prediction').values[pred_idx - 1];
      },
    };

    var blank = {
      type: Blank,
      on_load: function () {
        $('#counter').text(n_TrialPerBlock + 1 - n);
      },
    };

    var observe_outcome = {
      type: Position,
      data: { type: trial_type_label },
      on_load: function () {
        $('#shield').toggle(true);
        $('#picker').css('transform', 'rotate(' + prediction + 'deg)');
        $('#shield').css('transform', 'rotate(' + (prediction + 25) + 'deg) skewX(-40deg)');
        $('#counter').text(n_TrialPerBlock + 1 - n);
        $('#picker-circle').css('background-color', colorStyle);
        $('#pickerOutcome').css('transform', 'rotate(' + outcome + 'deg)');
      },
      on_finish: function (data) {
        data.outcome = outcome;
        data.mean = mean;
        data.color = colorStyle;
        data.score = assessPerformance(prediction, outcome);
      },
    };
    var block1 = {
      timeline: [make_prediction, blank, observe_outcome],
    };
    timeline.push(block1);
  }
}

export {
  practice_block01,
  practice_block02,
  practice_block1,
  block1,
  rtDeadline,
};