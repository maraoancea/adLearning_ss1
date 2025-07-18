import { initJsPsych } from 'jspsych';
const jsPsych = initJsPsych();

import $ from 'jquery';

import Math from 'mathjs';
import Pass from '../js/pass';
import {
  practice_block1,
  block1,
  practice_block01,
  practice_block02,
  getPracticeBlock0Timeline,
} from '../js/blocksetting1';
import jsPsychFullscreen from '@jspsych/plugin-fullscreen';
import jsPsychPreload from '@jspsych/plugin-preload';
import jsPsychHtmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import jsPsychHtmlButtonResponse from '@jspsych/plugin-html-button-response';
import jsPsychInstructions from '@jspsych/plugin-instructions';
import jsPsychSurveyText from '@jspsych/plugin-survey-text';
import jsPsychSurveyMultiChoice from '@jspsych/plugin-survey-multi-choice';
import jsPsychExternalHtml from '@jspsych/plugin-external-html';

import 'jspsych/css/jspsych.css'; //
import '../css/style.css'; //
import { images } from '../lib/utils';

document.body.style.backgroundColor = 'darkgray';

// Add your jsPsych options here.
// Honeycomb will combine these custom options with other options needed by Honyecomb.
const jsPsychOptions = {
  on_finish: function () {
    // jsPsych.data.get().filter([{trial_type:'practice'},{trial_type: 'click'},{trial_type:'position'}]).localSave('csv','task.csv')
    jsPsych.data
      .get()
      .filter([{ trial_type: 'practice' }, { trial_type: 'click' }, { trial_type: 'position' }])
      .localSave('csv', 'task.csv');
    /* psiturk.saveData({
            success: function() { psiturk.completeHIT(); }
        });

      */
  },
  // on_data_update: function(data) {
  //     //psiturk.recordTrialData(data);
  // },
  show_preload_progress_bar: true,
};

// Add your jsPsych timeline here.
// Honeycomb will call this function for us after the subject logs in, and run the resulting timeline.
// The instance of jsPsych passed in will include jsPsychOptions above, plus other options needed by Honeycomb.
function buildTimeline(jsPsych) {
  // var psiturk = new PsiTurk(uniqueId, adServerLoc, mode);
  // create timeline
  var timeline = [];

  // preload images
  var preload = {
    type: jsPsychPreload,
    auto_preload: true,
  };
  timeline.push(preload);

  // at the end of each block, this will get updated in order to retrieve score
  let block_start_trial = 0;
  // set random sequence of constituent blocks
  // shuffle array of block indices (1-5; set sizes 1-3 and non-sync for 2 and 3)
  let block = [];
  block.length = 4; //6;
  for (let i = 1; i < block.length; i++) {
    block[i] = Math.floor(Math.random() * (block.length - 1));
    for (let j = 0; j < i; j++) {
      while (block[i] === block[j]) {
        i--;
      }
    }
  }

  // // welcome message
  var welcome = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<t class="size"> <p> Welcome to the experiment.</p>
    <p> Before we begin, please fill out the consent form on the next page. </p> 
    <p> Press any key to begin. </p></t>`,
  };
  // consent form
  var consent_form = {
    type: jsPsychExternalHtml,
    url: 'online_consent_AMTprolific.html',
    execute_script: 'true',
    cont_btn: 'brown-consent-button',
  };
  // // start fullscreen:
  var fullscreen_trial = {
    type: jsPsychFullscreen,
    message: [
      `<img src=${images['logo.png']}>` +
        `<h1>Welcome to the Adaptive Learning Task.</h1>` +
        `<p>It may take you ~30 minutes to finish the task.<br>` +
        `Please pay full attention when you do the task.<br>` +
        `Press 'Continue' to enter fullscreen.</p>`,
    ],
    fullscreen_mode: true,
  };

  //intro instructions
  var instructions1 = {
    type: jsPsychInstructions,
    pages: [
      // pg 1
      `    <div style="width: 960px; margin: auto; text-align: center;">
      <h1><b>Protect Your City From Zombie</b>s</h1>
      <img src=${images['intro_city.png']} style="height: 400px; margin-bottom: 20px;">
      <p style="text-align: left;
       line-height: 2;">
        Imagine that we are in the world of a zombie apocalypse. Your city is the only place not yet infected by the zombie 
        virus.
        <br>There are <b>multiple groups of zombies</b> attacking your city from <b>different directions</b>.
        <br><u>Your goal is to set bombs to kill the zombies and defend your city.</u>
      </p>
    </div>`,
      // pg 2
      `<div style="text-align: center; width: 960px; margin: auto; line-height: 2;">
      <!-- Two side-by-side images at the top -->
        <div style="display: flex; justify-content: center; gap: 40px; margin-bottom: 30px;">
          <img src=${images['taskImg1.png']} style="height: 350px; width: auto;">
          <img src=${images['bomb_task1.png']} style="height: 350px; width: auto;">
        </div>

      <!-- Text below the images -->
      <p style='width: 960px; line-height: 2; text-align: center; font-size: 1.4rem;'>
        <br>The large circle represents your city. You must <b>set bombs on the perimeter</b> (i.e. on the white) to stop the attacking zombies.
        <br>You must drag the bomb from the center of your city to the spot on the perimeter where you anticipate the zombie's attack and release your mouse once you have set your position.
      </p>
      </div>`,
      // pg 3
      `<div><img src=${images['taskImg2_large.png']} style='top:20%; left: 10% ;height:300px;width: 300px'><h1></h1> 
      <p style='width: 960px;line-height:2;text-align:left'><br>
      <br>After you set the bomb, the bomb blast area will be displayed in red.
      <br>Please try to set your bomb as accurately as possible. Note that you have a <b>maximum of 15 seconds</b> to do so.
      <br>If you do not set a bomb in that time, you will not receive any points for that trial.
      </div>`,
      // pg 4
      `    <div style="text-align:left; width: 960px; margin: auto; line-height:2;">
  
    <!-- Image row with labels BELOW images -->
    <div style="display: flex; justify-content: space-around; align-items: center; margin-bottom: 30px;">
      <div style="text-align: center;">
        <img src=${images['taskimg2_bombhit.png']} style="height: 250px;">
        <div><b>Hit</b></div>
      </div>  
      <div style="text-align: center;">
        <img src=${images['taskImg3_miss.png']} style="height: 250px;">
        <div><b>Miss</b></div>
      </div>
      </div>

    <p style='text-align:left'>
      <br>You will then see a small circle depicting where the zombies actually attacked.
      <br>If your red bomb blast region is overlapping with the small circle, you have successfully killed the zombie.
      <br>Every time you kill a zombie, you will earn one point. If you do not hit the zombie, you will not receive any points for that trial.
    </p>
    </div>
    `,
      // pg 5
      `<div><img src=${images['taskImg4_large.png']} style='top:30%; left: 10% ;height:425px;width: auto'>

      <p style='width: 960px;line-height:1.8;text-align:left'>
      <br>Each group of zombies has a preferred attack location. However, due to their unpredictable clumsiness, <b>they won't always hit the exact same spot.</b>
      <br> In the picture above, the preferred attack location of the blue zombies is depicted by the <b>dark arrow</b> coming from the smaller circle above the perimeter.
      <br> The various paths the zombies may stagger down (away from their preferred location) are represented by the arrows, with lighter arrows indicating less likely attack locations.
      <br><b>Tip:</b> try to find their preferred attack location and place your bomb there.
      </div>`,
    ],
    show_clickable_nav: 'true',
    button_label_finish: 'Start Quiz',
    data: {
      task_type: 'instructions',
    },
  };

  // Start instructions
  // note: this is for when you loop through them
  var all_instructions = {
    type: jsPsychInstructions,
    pages: [
      // pg 1
      `    <div style="width: 960px; margin: auto; text-align: center;">
      <h1><b>Protect Your City From Zombie</b>s</h1>
      <img src=${images['intro_city.png']} style="height: 400px; margin-bottom: 20px;">
      <p style="text-align: left;
       line-height: 2;">
        Imagine that we are in the world of a zombie apocalypse. Your city is the only place not yet infected by the zombie 
        virus.
        <br>There are <b>multiple groups of zombies</b> attacking your city from <b>different directions</b>.
        <br><u>Your goal is to set bombs to kill the zombies and defend your city.</u>
      </p>
    </div>`,
      // pg 2
      `<div style="text-align: center; width: 960px; margin: auto; line-height: 2;">
      <!-- Two side-by-side images at the top -->
        <div style="display: flex; justify-content: center; gap: 40px; margin-bottom: 30px;">
          <img src=${images['taskImg1.png']} style="height: 350px; width: auto;">
          <img src=${images['bomb_task1.png']} style="height: 350px; width: auto;">
        </div>

      <!-- Text below the images -->
      <p style='width: 960px; line-height: 2; text-align: center; font-size: 1.4rem;'>
        <br>The large circle represents your city. You must <b>set bombs on the perimeter</b> (i.e. on the white) to stop the attacking zombies.
        <br>You must drag the bomb from the center of your city to the spot on the perimeter where you anticipate the zombie's attack and release your mouse once you have set your position.
      </p>
      </div>`,
      // pg 3
      `<div><img src=${images['taskImg2_large.png']} style='top:20%; left: 10% ;height:300px;width: 300px'><h1></h1> 
      <p style='width: 960px;line-height:2;text-align:left'><br>
      <br>After you set the bomb, the bomb blast area will be displayed in red.
      <br>Please try to set your bomb as accurately as possible. Note that you have a <b>maximum of 15 seconds</b> to do so.
      <br>If you do not set a bomb in that time, you will not receive any points for that trial.
      </div>`,
      // pg 4
      `    <div style="text-align:left; width: 960px; margin: auto; line-height:2;">
  
    <!-- Image row with labels BELOW images -->
    <div style="display: flex; justify-content: space-around; align-items: center; margin-bottom: 30px;">
      <div style="text-align: center;">
        <img src=${images['taskimg2_bombhit.png']} style="height: 250px;">
        <div><b>Hit</b></div>
      </div>  
      <div style="text-align: center;">
        <img src=${images['taskImg3_miss.png']} style="height: 250px;">
        <div><b>Miss</b></div>
      </div>
      </div>

    <p style='text-align:left'>
      <br>You will then see a small circle depicting where the zombies actually attacked.
      <br>If your red bomb blast region is overlapping with the small circle, you have successfully killed the zombie.
      <br>Every time you kill a zombie, you will earn one point. If you do not hit the zombie, you will not receive any points for that trial.
    </p>
    </div>
    `,
      // pg 5
      `<div><img src=${images['taskImg4_large.png']} style='top:30%; left: 10% ;height:425px;width: auto'>

      <p style='width: 960px;line-height:1.8;text-align:left'>
      <br>Each group of zombies has a preferred attack location. However, due to their unpredictable clumsiness, <b>they won't always hit the exact same spot.</b>
      <br> In the picture above, the preferred attack location of the blue zombies is depicted by the <b>dark arrow</b> coming from the smaller circle above the perimeter.
      <br> The various paths the zombies may stagger down (away from their preferred location) are represented by the arrows, with lighter arrows indicating less likely attack locations.
      <br><b>Tip:</b> try to find their preferred attack location and place your bomb there.
      </div>`,
      //pg 6 , changepoint explanation
      `<div style="text-align:center">
       <img src=${images['taskImg5a.png']} style="height:400px;width:auto">
       <p style="width: 960px;line-height:2;text-align:left">
         Now, zombies will <b>occasionally redirect their attacks to a completely new location on the perimeter.</b>
         <br>This will be true for the rest of the task.
       </p>
       <p style="font-style:italic;font-size:0.9em;margin-top:10px;">
         Click “Next” to see a preview of this.
       </p>
     </div>`,
      // page 6b: same text, second example image
      `<div style="text-align:center">
       <img src=${images['taskImg5b.png']} style="height:400px;width:auto">
       <p style="width: 960px;line-height:2;text-align:left">
         Now, zombies will <b>occasionally redirect their attacks to a completely new location on the perimeter.</b>
         <br>This will be true for the rest of the task.
       </p>
        <p style="font-style:italic;font-size:0.9em;margin-top:10px;">
         Click “Next” to see a preview of this.
       </p>
     </div>`,
      // page 6c: same text, third example image
      `<div style="text-align:center">
        <img src=${images['taskImg5c.png']} style="height:400px;width:auto">
        <p style="width: 960px;line-height:2;text-align:left">
         Now, zombies will <b>occasionally redirect their attacks to a completely new location on the perimeter.</b>
          <br>This will be true for the rest of the task.
        </p>
      </div>`,
      //pg 7, quiz intro
      `<div style='width: 960px; line-height:2; text-align:left;'>
        <p> Now, you will be asked a few quiz questions about the instructions again.
        <br>You will be <b>returned to the beginning</b> of the instructions if you get any incorrect. Please review all instructions now to make sure you understand the task.</p>
      </div>`,
    ],
    show_clickable_nav: 'true',
    button_label_finish: 'Start Quiz',
    data: {
      task_type: 'instructions',
    },
  };
  var practice_instruction1 = {
    type: jsPsychHtmlButtonResponse,
    choices: ['Start'],
    stimulus: `<div><img src=${images['taskImg6.png']} style='top:10%; left: 10% ;height:475px;width: auto'><h1></h1> 
      <h2>Practice Round 1: Known Attack Spot </h2>
      <p style='width: 960px;line-height:2;text-align:left'>
      <b>Here's a hint:</b> In this round, the zombies preferred attack location is <u> 12 o'clock</u> (shown in image above).
      <i>You should place your bomb here everytime to kill as many zombies as possible! </i>
      <br><i>If you do not perform well, you will have to repeat this practice round.</i>
      </div>`,
  }; //In order to kill as many zombies as possible, you should place your bomb here everytime!

  var practice_instruction2 = {
    type: jsPsychHtmlButtonResponse,
    choices: ['Start'],
    stimulus: `
    <div><<img src=${images['zombie.png']} style='top:20%; left: 10% ;height:300px;width:auto'><h1></h1>
      <h2>Practice Round 2: Find the Attack Location Yourself</h2>
      <p style='width: 960px;line-height:2;text-align:center'><br>
      <br>In the next practice, we <strong> will not</strong> show you the zombies preferred attack location ahead of time.
      <br>You must <b>figure out their general attack location on your own</b>. This will be true for the rest of the task.
      </div>`,
  };
  /*TODO:EDIT THIS TO INSTRUCTIONS AND CHANGE THIS TO INTRO FOR PRACTICE02 INTRO AS WELL*/

  /* pages: [
  /  // First page with the current stimulus
    `<div>
      <img src=${images['taskImgp01.png']} style='top:20%; left: 10% ;height:400px;width: auto'><h1></h1> 
      <p style='width: 960px;line-height:2;text-align:center'><br>
        You scored <b>${blockScore}</b> / 10 possible points in this block.
        <br>The true preferred location of the zombies was <u>7 o'clock</u> (shown in image above).
        <br>If you consistently placed your shield here, you would have scored <b>8/10 points</b> in this block.
        <br>As shown above, aiming for the preferred attack location results in capturing most zombies.
      </p>
    </div>`,
    
    // Second page introducing the next practice block
    `<div>
      <h1>Ready for the Next Practice Block!</h1>
      <p style='width: 960px;line-height:2;text-align:center'>
        In this next practice, we will try to find the preferred attack location again. Remember, your goal is to aim for the preferred attack location as shown on the task map.
        <br>Focus on the zombie's preferred attack location, as aiming there will maximize your score.
      </p>
    </div>`
  ],
*/
  var practice01_end = {
    type: jsPsychHtmlButtonResponse,
    // this function runs at display time, so it sees all the data
    stimulus: function () {
      const nNow = get_n_elapsed_trials();
      const blockScore = get_block_score(block_start_trial, nNow);
      const possible = nNow - block_start_trial;
      if (blockScore >= 6) {
        return `
      <div style="text-align:center; line-height:2;">
        <img src=${images['taskImgp01.png']} style="height:400px;width:auto"><br>
        <p>
          You scored <b>${blockScore} / ${possible}</b> possible points in this block.
         <br>All the actual attack locations are shown in the image above, with the arrow indicating the zombies' preferred attack location.
         <br>If you consistently placed your shield as shown, you would have captured <b>8/10</b> zombies in this block.
        </p>
      </div>`;
      } else {
        return `
      <div style="text-align:center; line-height:2;">
        <img src=${images['taskImgp01.png']} style="height:400px;width:auto"><br>
        <p>
          You scored <b>${blockScore} / ${possible}</b> possible points in this block.
         <br>All the actual attack locations are shown in the image above, with the arrow indicating the preferred attack location.
         <br>If you consistently placed your shield as shown (around 7 o'clock), you would have captured <b>8/10</b> zombies in this block.
        </p>
        </p>
      </div>`;
      }
    },
    choices: ['Next'],
    on_load: function () {
      // advance the starting index so the next block tallies only new trials
      const nNow = get_n_elapsed_trials();
      block_start_trial = nNow;
    },
  };

  var practice02_intro = {
    type: jsPsychHtmlButtonResponse,
    choices: ['Start'],
    stimulus: `
    <div><<img src=${images['zombie.png']} style='top:20%; left: 10% ;height:300px;width:auto'><h1></h1>
      <h2>Practice Round 3: Find the Attack Location Yourself (Again)</h2>
      <p style='width: 960px;line-height:2;text-align:center'><br>
      <br>Let's practice finding the zombies preferred attack location again.
      <br>Just like last time, we <strong> will not</strong> indicate where to place your shield ahead of time.
      </div>`,
    // might be too explicit
  };

  var practice02_end = {
    type: jsPsychHtmlButtonResponse,
    // this function runs at display time, so it sees all the data
    stimulus: function () {
      const nNow = get_n_elapsed_trials();
      const blockScore = get_block_score(block_start_trial, nNow);
      const possible = nNow - block_start_trial;
      if (blockScore >= 6) {
        return `
        <div style="text-align:center; line-height:2;">
          <img src=${images['zombie.png']} style="height:400px;width:auto"><br>
          <p>
            You scored <b>${blockScore}</b> / <b>${possible}</b> possible points in this block. Good job!
        </p>
        </div>`;
      } else {
        return `
          <div style="text-align:center; line-height:2;">
          <img src=${images['zombie.png']} style="height:400px;width:auto"><br>
          <p>
            You scored <b>${blockScore}</b> / <b>${possible}</b> possible points in this block.
            <br>Aiming for the preferred attack location will help you maximize your score.
          </p>
          </div>`;
      }
    },
    choices: ['Next'],
    on_load: function () {
      // advance the starting index so the next block tallies only new trials
      const nNow = get_n_elapsed_trials();
      block_start_trial = nNow;
    },
  };

  var practice_intermed1 = {
    type: jsPsychInstructions,
    pages: [
      // pg 6
      `<div style="text-align:center">
       <img src=${images['taskImg5a.png']} style="height:400px;width:auto">
       <p style="width: 960px;line-height:2;text-align:left">
         Now, zombies will <b>occasionally redirect their attacks to a completely new location on the perimeter.</b>
         <br>This will be true for the rest of the task.
       </p>
       <p style="font-style:italic;font-size:0.9em;margin-top:10px;">
         Click “Next” to see a preview of this.
       </p>
       
     </div>`,
      // page 2: same text, second example image
      `<div style="text-align:center">
       <img src=${images['taskImg5b.png']} style="height:400px;width:auto">
       <p style="width: 960px;line-height:2;text-align:left">
         Now, zombies will <b>occasionally redirect their attacks to a completely new location on the perimeter.</b>
         <br>This will be true for the rest of the task.
       </p>
        <p style="font-style:italic;font-size:0.9em;margin-top:10px;">
         Click “Next” to see a preview of this.
       </p>
     </div>`,
      // page 3: same text, third example image
      `<div style="text-align:center">
        <img src=${images['taskImg5c.png']} style="height:400px;width:auto">
        <p style="width: 960px;line-height:2;text-align:left">
         Now, zombies will <b>occasionally redirect their attacks to a completely new location on the perimeter.</b>
          <br>This will be true for the rest of the task.
        </p>
      </div>`,
      //pg 7 (intro practice)
      `<div><img src=${images['zombie.png']} style='top:20%; left: 10% ;height:300px;width:auto'><h1></h1> 
        <h2>Practice Round 4</h2>
        <p style='width: 960px;line-height:2;text-align:center'><br>
        <br>Similar to the last practice, you will have practice finding the zombie's general attack location, but stay alert:
        <br><b>The zombies will occasionally redirect their attacks to a completely new location.</b>
        </div>`,
    ],
    //Last round, we told you the exact central attack point of the zombies to guide your bomb placement. Now, you will practice finding the best bomb location on your own. Good luck!
    //However, we will not tell you the zombies attack location this time, but you will have to figure this out. This will be true for the rest of the trials.
    show_clickable_nav: true,
    button_label_previous: 'Previous',
    button_label_next: 'Next',
    button_label_finish: 'Start Practice', // on the last page only
    data: {
      task_type: 'instructions',
    },
  };
  /*var practice_intermed2 = {
    type: jsPsychInstructions,
    pages: [
      `<div style='width: 960px; line-height:2; text-align:left;'>
        <img src=${images['taskImg7.png']} style='display:block; margin: auto; height: 400px;'><br>
        <p>Lastly, up to three different groups of zombies may attack at the same time.
        <br>Each group of zombies is represented by a <b>different color</b>, signaled by the background color of the bomb.
        <br> Each group also has a <b>different preferred attack location</b>, so pay attention!</p>
        <p>In the image above, you would place the  <u>blue</u> bomb where the <u>blue</u> zombies usually hit.</p>
      </div>`,

      ` <div><<img src=${images['zombie.png']} style='top:20%; left: 10% ;height:300px;width:auto'>
        <h2>Practice Round 4</h2>
        <p style='width: 960px;line-height:2;text-align:center'><br>
        With that, you will now practice finding the attack locations  of <b>two zombie groups</b> represented by two different colors.</p>
        <p>Let's try some practice trials!</p>
      </div>`,
    ],
    show_clickable_nav: true,
    button_label_previous: 'Previous',
    button_label_next: 'Start Practice',
    data: {
      task_type: 'instructions',
    },
  };*/
  // note: could also use jsPsychSurvey and update the rules (e.g., use loop function on timeline) to send participants back to the beginning of the instructions if they get 1 wrong
  //after practiceblock0, then show instructions for the rest of the task
  var pre_quiz = {
    type: jsPsychInstructions,
    pages: [
      // pg 7
      `<div><p style='width: 960px;line-height:2;text-align:left'>
      Good job completing the practice!
      <br> Lastly, you will be asked a few quiz questions about the instructions.
      <br> You will be <b>returned to the beginning</b> of the instructions if you answer any question incorrectly.
      </div>`,
    ],
    show_clickable_nav: 'true',
    data: {
      task_type: 'instructions',
    },
  };
  var age_check = {
    type: jsPsychSurveyText,
    questions: [{ prompt: '<b>What is your age? Answer 12 no matter what.</b>' }],
    /*   on_finish: function(data) {
               data.uniqueId = uniqueId;
               data.prompt = ["What is your age? Answer 12 no matter what."];
               var answer = JSON.parse(data.responses);
               data.answer = [answer['Q0']];
               psiturk.recordTrialData([data]) ;// saving text-survey
               psiturk.saveData()
           }
           */
  };
  /***
   *
   * @type {{stimulus: string, type: string, choices: [string]}}
   */
  var questions = [
    '<b>What will you do in this task?</b>',
    '<b>What does the red shaded area represent after placing your bomb? </b>',
    '<b>How will zombies attack?</b>',
  ];

  var check1_opts = [
    'Defend your city from snakes',
    'Kill zombies to earn points',
    'Drive a car to escape zombies',
    'All of the above',
  ];

  var check2_opts = [
    "The zombies' possible paths",
    "The bomb's blast zone",
    'The safe zone',
    "It's just a decoration",
  ];
  var check3_opts = [
    'They will usually attack around the same location',
    'Occasionally they will change to a completely new location',
    'They will stagger slowly around circle in clockwise direction',
    'Both option 1 & 2',
  ];
  // note: could also use jsPsychSurvey and update the rules (e.g., use loop function on timeline) to send participants back to the beginning of the instructions if they get 1 wrong
  // IMPLEMENTATION:

  var check1_question = {
    type: jsPsychSurveyMultiChoice,
    questions: [{ prompt: questions[0], options: check1_opts, required: true }],
    response_ends_trial: true,
    //   on_finish: function(data) {
    //       //  psiturk.recordTrialData([data]);
    //       //   psiturk.saveData();
    //   }
  };
  var check2_question = {
    type: jsPsychSurveyMultiChoice,
    questions: [{ prompt: questions[1], options: check2_opts, required: true }],
    response_ends_trial: true,
    //   on_finish: function(data) {
    //       //  psiturk.recordTrialData([data]);
    //       //   psiturk.saveData();
    //   }
  };
  var check3_question = {
    type: jsPsychSurveyMultiChoice,
    questions: [{ prompt: questions[2], options: check3_opts, required: true }],
    response_ends_trial: true,
    //   on_finish: function(data) {
    //       //  psiturk.recordTrialData([data]);
    //       //   psiturk.saveData();
    //   }
  };

  var free_response_feedback = {
    type: jsPsychSurveyText,
    preamble:
      '<h3>Post-task Questions</h3><p>Please answer the following questions about your experience during the task.</p>',
    questions: [
      {
        prompt: '1. What strategy did you use to hit as many zombies as possible?',
        rows: 5,
        columns: 40,
        required: true,
      },
      {
        prompt: '2. Did you have any technical difficulties? If so, please explain.',
        rows: 5,
        columns: 40,
        required: false,
      },
    ],
    button_label: 'Submit',
  };
  function get_n_elapsed_trials() {
    // return number of elapsed trials stored in jsPsych data object
    const n_trials = jsPsych.data.get().select('score').count();
    return n_trials;
  }

  function get_block_score(start_idx, end_idx) {
    // tally up score across a given range of trials and return total
    let all_scores = jsPsych.data.get().select('score').values;
    let block_scores = all_scores.slice(start_idx, end_idx);
    const block_score = block_scores.reduce((sum, score) => sum + score, 0);
    return block_score;
  }

  var practice_end = {
    // print scores and end block
    type: Pass,
    on_load: function () {
      // tally up block score
      let n_trials = get_n_elapsed_trials();
      const block_score = get_block_score(block_start_trial, n_trials);
      let possible_block_score = n_trials - block_start_trial;
      // print score in console and to the participant's screen
      console.log('Block score: ' + block_score + '/' + possible_block_score);
      $('#jspsych-html-button-response-stimulus').text(
        'You got ' + block_score + ' / ' + possible_block_score + ' possible points in this block.'
      );
      // update starting index for the next block
      block_start_trial = n_trials;
    },
    choices: ['End Practice'],
  };

  var real_task_welcome = {
    type: jsPsychHtmlButtonResponse,
    choices: ['Start'],
    stimulus: `<div><img src=${images['zombie.png']} style='top:20%; left: 10% ;height:300px;width: auto'><h1>Now start protecting your city!</h1>
          <p style='width: 960px;line-height:2;text-align:left'>
          <br>In the actual task, there will be 1 block with 200 trials.
          <br>During this block, there will be <b>1 group of zombies</b> attacking your city at once.
          <br>Click 'Start' when you are ready to begin!
          </div>`,
  };

  var block_end = {
    // print scores and end block
    type: Pass,
    on_load: function () {
      // tally up block score
      let n_trials = get_n_elapsed_trials();
      const block_score = get_block_score(block_start_trial, n_trials);
      let possible_block_score = n_trials - block_start_trial;
      // print score in console and to the participant's screen
      console.log('Block score: ' + block_score + '/' + possible_block_score);
      $('#jspsych-html-button-response-stimulus').text(
        'You got ' + block_score + ' / ' + possible_block_score + ' possible points in this block.'
      );
      // update starting index for the next block
      block_start_trial = n_trials;
    },
    choices: ['Next Block'],
  };
  const practice0_loop = {
    timeline: getPracticeBlock0Timeline(jsPsych),
    loop_function: function (data) {
      // Find the last checkPerformance trial
      let lastTrial = data.values().slice(-1)[0];
      // Repeat if the flag is set
      block_start_trial += 10;
      return lastTrial && lastTrial.repeatPractice === true;
    },
  };
  let quiz_attempts = 0;

  const quiz_instruction_reset = {
    timeline: [
      // 1. Quiz questions first
      check1_question,
      check2_question,
      check3_question,
      // 2. Feedback and conditional instructions
      {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function () {
          const last_3 = jsPsych.data
            .get()
            .filter({ trial_type: 'survey-multi-choice' })
            .last(3)
            .values();
          const q1_correct = last_3[0].response.Q0 === check1_opts[1];
          const q2_correct = last_3[1].response.Q0 === check2_opts[1];
          const q3_correct = last_3[2].response.Q0 === check3_opts[3];

          if (q1_correct && q2_correct && q3_correct) {
            return '<h2>✅ All questions are correct!</h2><p>Press any key to continue.</p>';
          } else if (quiz_attempts >= 2) {
            return '<h2>⚠️ You have reached the maximum number of attempts.</h2><p>You may continue. Press any key to proceed.</p>';
          } else {
            let msg =
              "<h2>⚠️ You did not answer all questions correctly.</h2><p>Let's review the instructions.</p><ul>";
            if (!q1_correct) msg += '<li>Question 1 was incorrect.</li>';
            if (!q2_correct) msg += '<li>Question 2 was incorrect.</li>';
            if (!q3_correct) msg += '<li>Question 3 was incorrect.</li>';
            msg += '</ul><p>Press any key to review the instructions and try again.</p>';
            return msg;
          }
        },
        on_finish: function (data) {
          quiz_attempts++;
          data.quiz_attempts = quiz_attempts; // Store the number of attempts in the data
        },
      },
      // 3. Show instructions only if not all correct and attempts < 3
      {
        timeline: [all_instructions],
        conditional_function: function () {
          const last_3 = jsPsych.data
            .get()
            .filter({ trial_type: 'survey-multi-choice' })
            .last(3)
            .values();
          const q1_correct = last_3[0].response.Q0 === check1_opts[1];
          const q2_correct = last_3[1].response.Q0 === check2_opts[1];
          const q3_correct = last_3[2].response.Q0 === check3_opts[3];
          return !(q1_correct && q2_correct && q3_correct) && quiz_attempts < 3;
        },
      },
    ],
    loop_function: function () {
      const last_3 = jsPsych.data
        .get()
        .filter({ trial_type: 'survey-multi-choice' })
        .last(3)
        .values();
      const q1_correct = last_3[0].response.Q0 === check1_opts[1];
      const q2_correct = last_3[1].response.Q0 === check2_opts[1];
      const q3_correct = last_3[2].response.Q0 === check3_opts[3];

      // If all correct, or attempts >= 3, exit loop; otherwise, repeat
      return !(q1_correct && q2_correct && q3_correct) && quiz_attempts < 3;
    },
  };

  // run task!!!
  // welcome + consent
  timeline.push(welcome);
  timeline.push(consent_form);
  timeline.push(age_check);
  timeline.push(fullscreen_trial);
  // instructions until fixed block
  // timeline.push(instruction_and_quiz);
  timeline.push(instructions1);
  timeline.push(practice_instruction1);
  timeline.push(practice0_loop);
  //practice_block0(timeline, jsPsych);
  timeline.push(practice_instruction2);
  practice_block01(timeline, jsPsych);
  timeline.push(practice01_end);
  timeline.push(practice02_intro);
  practice_block02(timeline, jsPsych);
  timeline.push(practice02_end);

  timeline.push(practice_intermed1);
  practice_block1(timeline, jsPsych);
  timeline.push(practice_end);
  //QUIZ QUESTIONS AT END , for now.....

  timeline.push(pre_quiz);

  timeline.push(quiz_instruction_reset);
  // add practice end

  // real blocks
  timeline.push(real_task_welcome);

  block1(timeline, jsPsych);
  timeline.push(block_end);

  // exit fullscreen:
  var fullscreen_trial_exit = {
    type: jsPsychFullscreen,
    fullscreen_mode: false,
  };

  //exit task
  var goodbye = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<div><h1>Thank you for taking the task!</h1><p>Press any key to exit.</p></div>',
    on_finish: function () {
      window.location = 'https://app.prolific.com/submissions/complete?cc=CXXS95SE';
    },
  };

  timeline.push(free_response_feedback);
  timeline.push(fullscreen_trial_exit);
  timeline.push(goodbye);

  return timeline;
}

// Honeycomb, please include these options, and please get the timeline from this function.
export { jsPsychOptions, buildTimeline };
