import $ from 'jquery';
import { ParameterType } from 'jspsych';
// var Position = (function (jspsych) {
// //   "use strict";

const info = {
  name: 'Position',
  // give a description what the plugin does:
  description: '',
  // define the parameters:
  parameters: {
    response_ends_trial: {
      type: ParameterType.BOOL,
      pretty_name: 'Response ends trial',
      default: true,
      description: 'If true, trial will end when subject makes a response.',
    },
    outcomes: {
    type: ParameterType.KEY,
    pretty_name: 'Outcomes',
    default: [],
    description: 'Array of outcome angles to display all at once.'
  },
    trial_duration: {
      type: ParameterType.INT,
      pretty_name: 'Fixation duration',
      default: 1000,
      description: 'How long the trial is (in milliseconds).',
    },
  },
};

class Position {
  constructor(jsPsych) {
    this.jsPsych = jsPsych;
  }
  
  trial(display_element, trial) {
    // Build HTML scaffold
    let html = '<div id="circle">';
    html += '<div id="shield"></div>';
    html += '<div id="circle-in"></div>';
    html += '<div id="picker"><div id="picker-prediction"><div id="h"></div><div id="v"></div></div></div>';

    // Append one pickerOutcome per angle
    trial.outcomes.forEach(angle => {
      html += `
        <div id="pickerOutcome" style="transform:rotate(${angle}deg)">
          <div id="picker-circle" 
          style="
          background-color: rgba(202,145,97,0.85);  /* 50% opacity */
          border: 1px solid black;  "></div>
        </div>
      `;
    });



    html += '</div><div id="counter"></div>';
    display_element.innerHTML = html;

    $('#h').toggle(true);
    $('#v').toggle(true);

    // Optionally set a timeout to end the trial automatically
    if (trial.trial_duration !== null && trial.trial_duration > 0) {
      this.jsPsych.pluginAPI.setTimeout(() => {
        finishTrial();
      }, trial.trial_duration);
    }

    // Listen for keypress to end trial (if enabled)
    let keyboardListener;
    if (trial.response_ends_trial) {
      keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: () => finishTrial(),
        valid_responses: 'ALL',
        persist: false
      });
    }

    // Function to clean up and finish the trial
    const finishTrial = () => {
      if (keyboardListener) {
        this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }
      this.jsPsych.pluginAPI.clearAllTimeouts();
      display_element.innerHTML = '';
      this.jsPsych.finishTrial();
    };
  }
}



Position.info = info;

//   return Position;
// })();

export default Position;