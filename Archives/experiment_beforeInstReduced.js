/// LICENCE -----------------------------------------------------------------------------
//
// Copyright 2018 - Cédric Batailler
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this
// software and associated documentation files (the "Software"), to deal in the Software
// without restriction, including without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to the following
// conditions:
//
// The above copyright notice and this permission notice shall be included in all copies
// or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
// CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
// OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// OVERVIEW -----------------------------------------------------------------------------
//
// TODO:
//
//
// adress : https://marinerougier.github.io/SocVaast_Coro/index.html
// 
// dirty hack to lock scrolling ---------------------------------------------------------
// note that jquery needs to be loaded.
$('body').css({'overflow':'hidden'});
  $(document).bind('scroll',function () { 
       window.scrollTo(0,0); 
  });

// safari & ie exclusion ----------------------------------------------------------------
var is_safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
var is_ie = /*@cc_on!@*/false || !!document.documentMode;

var is_compatible = !(is_safari || is_ie);


if(!is_compatible) {

    var safari_exclusion = {
        type: "html-keyboard-response",
        stimulus:
        "<p>Sorry, this study is not compatible with your browser.</p>" +
        "<p>Please try again with a compatible browser (e.g., Chrome or Firefox).</p>",
        choices: jsPsych.NO_KEYS
    };

    var timeline_safari = [];

    timeline_safari.push(safari_exclusion);
    jsPsych.init({timeline: timeline_safari});

}

// firebase initialization ---------------------------------------------------------------
  var firebase_config = {
    apiKey: "AIzaSyBwDr8n-RNCbBOk1lKIxw7AFgslXGcnQzM",
    databaseURL: "https://marineexpe.firebaseio.com/"
  };

  firebase.initializeApp(firebase_config);
  var database = firebase.database();

  // prolific variables
  var jspsych_id  = jsPsych.data.getURLVariable("jspsych_id");
   if(jspsych_id == null) {jspsych_id = "999";}
  
  // Preload images
  var preloadimages = [];

  // connection status ---------------------------------------------------------------------
  // This section ensure that we don't lose data. Anytime the 
  // client is disconnected, an alert appears onscreen
  var connectedRef = firebase.database().ref(".info/connected");
  var connection   = firebase.database().ref("VAAST_corona/" + jspsych_id + "/")
  var dialog = undefined;
  var first_connection = true;

  connectedRef.on("value", function(snap) {
    if (snap.val() === true) {
      connection
        .push()
        .set({status: "connection",
              timestamp: firebase.database.ServerValue.TIMESTAMP})

      connection
        .push()
        .onDisconnect()
        .set({status: "disconnection",
              timestamp: firebase.database.ServerValue.TIMESTAMP})

    if(!first_connection) {
      dialog.modal('hide');
    }
    first_connection = false;
    } else {
      if(!first_connection) {
      dialog = bootbox.dialog({
          title: 'Connection lost',
          message: '<p><i class="fa fa-spin fa-spinner"></i> Please wait while we try to reconnect.</p>',
          closeButton: false
          });
    }
    }
  });

  // Preload images in the VAAST 
  var stim_vaast = [
      "stimuli/pair1_female.png",
      "stimuli/pair1_male_v2.png",
      "stimuli/pair2_female.png",
      "stimuli/pair2_male.png",
      "stimuli/pair3_female.png",
      "stimuli/pair3_male.png",
      "stimuli/pair4_female.png",
      "stimuli/pair4_male.png",
      "stimuli/Pflanze1.png",
      "stimuli/Pflanze2.png",
      "stimuli/Pflanze3.png",
      "stimuli/Pflanze4.png",
      "stimuli/Pflanze5.png",
      "stimuli/Pflanze6.jpg",
      "stimuli/Pflanze7.jpg",
      "stimuli/Pflanze8.jpg"
  ];

 //preloadimages.push(stim_vaast);
jsPsych.pluginAPI.preloadImages(stim_vaast);

    // counter variables
  var vaast_trial_n    = 1;
  var browser_events_n = 1;

// Variable input -----------------------------------------------------------------------
// Variable used to define experimental condition.

var vaast_first_block = jsPsych.randomization.sampleWithoutReplacement(["approach_human", "approach_plant"], 1)[0];

 // cursor helper functions
var hide_cursor = function() {
	document.querySelector('head').insertAdjacentHTML('beforeend', '<style id="cursor-toggle"> html { cursor: none; } </style>');
}
var show_cursor = function() {
	document.querySelector('#cursor-toggle').remove();
}

var hiding_cursor = {
    type: 'call-function',
    func: hide_cursor
}

var showing_cursor = {
    type: 'call-function',
    func: show_cursor
}

// VAAST --------------------------------------------------------------------------------
// VAAST variables ----------------------------------------------------------------------
// On duplique chacune des variable pour correspondre au bloc 1 et au bloc 2 !

var movement_human_1    = undefined;
var movement_plant_1    = undefined;
var group_to_approach_1 = undefined;
var group_to_avoid_1    = undefined;
var movement_human_2    = undefined;
var movement_plant_2    = undefined;
var group_to_approach_2 = undefined;
var group_to_avoid_2    = undefined;
var movement_human_3    = undefined;
var movement_plant_3    = undefined;
var group_to_approach_3 = undefined;
var group_to_avoid_3    = undefined;
var movement_human_4    = undefined;
var movement_plant_4    = undefined;
var group_to_approach_4 = undefined;
var group_to_avoid_4    = undefined;

switch(vaast_first_block) {
  case "approach_human":
    movement_human_1    = "approach";
    movement_plant_1    = "avoidance";
    group_to_approach_1 = "persons";
    group_to_avoid_1    = "plants";
    movement_human_2    = "avoidance";
    movement_plant_2    = "approach";
    group_to_approach_2 = "plants";
    group_to_avoid_2    = "persons";
    movement_human_3    = "approach";
    movement_plant_3    = "avoidance";
    group_to_approach_3 = "persons";
    group_to_avoid_3    = "plants";
    movement_human_4    = "avoidance";
    movement_plant_4    = "approach";
    group_to_approach_4 = "plants";
    group_to_avoid_4    = "persons";
    break;

  case "approach_plant":
    movement_human_1    = "avoidance";
    movement_plant_1    = "approach";
    group_to_approach_1 = "plants";
    group_to_avoid_1    = "persons";
    movement_human_2    = "approach";
    movement_plant_2    = "avoidance";
    group_to_approach_2 = "persons";
    group_to_avoid_2    = "plants";
    movement_human_3    = "avoidance";
    movement_plant_3    = "approach";
    group_to_approach_3 = "plants";
    group_to_avoid_3    = "persons";
    movement_human_4    = "approach";
    movement_plant_4    = "avoidance";
    group_to_approach_4 = "persons";
    group_to_avoid_4    = "plants";
    break;
}

// VAAST stimuli ------------------------------------------------------------------------
// vaast image stimuli ------------------------------------------------------------------
// Ici, on ajoute un nouveau mouvement, en fonction du bloc de la vaast on appellera soit
// movement_1 ou movement_2.


var vaast_stim_training = [];

var vaast_stim = [
  {movement_1: movement_human_1, movement_2: movement_human_2,  movement_3: movement_human_3, movement_4: movement_human_4, group: "human",  stimulus: "stimuli/pair1_female.png"},
  //{movement_1: movement_human_1, movement_2: movement_human_2,  movement_3: movement_human_3, movement_4: movement_human_4, group: "human",  stimulus: "stimuli/pair1_male_v2.png"},
  //{movement_1: movement_human_1, movement_2: movement_human_2,  movement_3: movement_human_3, movement_4: movement_human_4, group: "human",  stimulus: "stimuli/pair2_female.png"},
  //{movement_1: movement_human_1, movement_2: movement_human_2,  movement_3: movement_human_3, movement_4: movement_human_4, group: "human",  stimulus: "stimuli/pair2_male.png"},
  //{movement_1: movement_human_1, movement_2: movement_human_2,  movement_3: movement_human_3, movement_4: movement_human_4, group: "human",  stimulus: "stimuli/pair3_female.png"},
  //{movement_1: movement_human_1, movement_2: movement_human_2,  movement_3: movement_human_3, movement_4: movement_human_4, group: "human",  stimulus: "stimuli/pair3_male.png"},
  //{movement_1: movement_human_1, movement_2: movement_human_2,  movement_3: movement_human_3, movement_4: movement_human_4, group: "human",  stimulus: "stimuli/pair4_female.png"},
  //{movement_1: movement_human_1, movement_2: movement_human_2,  movement_3: movement_human_3, movement_4: movement_human_4, group: "human",  stimulus: "stimuli/pair4_male.png"},
  //{movement_1: movement_plant_1, movement_2: movement_plant_2,  movement_3: movement_plant_3, movement_4: movement_plant_4, group: "plant",  stimulus: "stimuli/Pflanze1.png"},
 // {movement_1: movement_plant_1, movement_2: movement_plant_2,  movement_3: movement_plant_3, movement_4: movement_plant_4, group: "plant",  stimulus: "stimuli/Pflanze2.png"},
 // {movement_1: movement_plant_1, movement_2: movement_plant_2,  movement_3: movement_plant_3, movement_4: movement_plant_4, group: "plant",  stimulus: "stimuli/Pflanze3.png"},
 // {movement_1: movement_plant_1, movement_2: movement_plant_2,  movement_3: movement_plant_3, movement_4: movement_plant_4, group: "plant",  stimulus: "stimuli/Pflanze4.png"},
 // {movement_1: movement_plant_1, movement_2: movement_plant_2,  movement_3: movement_plant_3, movement_4: movement_plant_4, group: "plant",  stimulus: "stimuli/Pflanze5.png"},
 // {movement_1: movement_plant_1, movement_2: movement_plant_2,  movement_3: movement_plant_3, movement_4: movement_plant_4, group: "plant",  stimulus: "stimuli/Pflanze6.png"},
 // {movement_1: movement_plant_1, movement_2: movement_plant_2,  movement_3: movement_plant_3, movement_4: movement_plant_4, group: "plant",  stimulus: "stimuli/Pflanze7.png"},
  {movement_1: movement_plant_1, movement_2: movement_plant_2,  movement_3: movement_plant_3, movement_4: movement_plant_4, group: "plant",  stimulus: "stimuli/Pflanze8.png"}
];

var vaast_stim_human = _.sampleSize(_.filter(vaast_stim, { 'group': 'human'}), 1); //here, put 4
var vaast_stim_plant = _.sampleSize(_.filter(vaast_stim, { 'group': 'plant'}), 1); // here, put 4

vaast_stim_training.push(vaast_stim_human);
vaast_stim_training.push(vaast_stim_plant);
vaast_stim_training = _.flattenDeep(vaast_stim_training);

// vaast background images --------------------------------------------------------------,

var background = [
    "background/3.jpg",
    "background/4.jpg",
    "background/5.jpg",
    "background/6.jpg"
];


// vaast stimuli sizes -------------------------------------------------------------------

//var stim_sizes = [
//    34,
//    38,
//    42,
//    46,
//    52,
//    60,
//    70
//  ];

var stim_sizes = [
    26,
    32,
    40,
    46,
    56,
    66,
    76
  ];

  var resize_factor = 5;
  var image_sizes = stim_sizes.map(function(x) { return x * resize_factor; });

// Helper functions ---------------------------------------------------------------------
// next_position():
// Compute next position as function of current position and correct movement. Because
// participant have to press the correct response key, it always shows the correct
// position.
var next_position_training = function(){
  var current_position = jsPsych.data.getLastTrialData().values()[0].position;
  var current_movement = jsPsych.data.getLastTrialData().values()[0].movement;
  var position = current_position;

  if(current_movement == "approach") {
    position = position + 1;
  }

  if(current_movement == "avoidance") {
    position = position -1;
  }

  return(position)
}

var next_position = function(){
  var current_position = jsPsych.data.getLastTrialData().values()[0].position;
  var last_keypress = jsPsych.data.getLastTrialData().values()[0].key_press;

  var approach_key = jsPsych.pluginAPI.convertKeyCharacterToKeyCode('uparrow');
  var avoidance_key = jsPsych.pluginAPI.convertKeyCharacterToKeyCode('downarrow');

  var position = current_position;

  if(last_keypress == approach_key) {
    position = position + 1;
  }

  if(last_keypress == avoidance_key) {
    position = position -1;
  }

  return(position)
}

// Saving blocks ------------------------------------------------------------------------
// Every function here send the data to keen.io. Because data sent is different according
// to trial type, there are differents function definition.

// init ---------------------------------------------------------------------------------
  var saving_id = function(){
     database
        .ref("participant_id_corona/")
        .push()
        .set({jspsych_id: jspsych_id,
               vaast_first_block: vaast_first_block,
               timestamp: firebase.database.ServerValue.TIMESTAMP})
  }

// vaast trial --------------------------------------------------------------------------
  var saving_vaast_trial = function(){
    database
      .ref("vaast_trial_corona/").
      push()
        .set({jspsych_id: jspsych_id,
          vaast_first_block: vaast_first_block,
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          vaast_trial_data: jsPsych.data.get().last(3).json()})
  }


// demographic logging ------------------------------------------------------------------

  var saving_browser_events = function(completion) {
    database
     .ref("browser_event_corona/")
     .push()
     .set({jspsych_id: jspsych_id,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      vaast_first_block: vaast_first_block,
      completion: completion,
      event_data: jsPsych.data.getInteractionData().json()})
  }

  
  var saving_extra = function() {
    database
     .ref("extra_info_corona/")
     .push()
     .set({jspsych_id: jspsych_id,
         timestamp: firebase.database.ServerValue.TIMESTAMP,
          vaast_first_block: vaast_first_block,
         extra_data: jsPsych.data.get().last(7).json(),
        })
  }


// saving blocks ------------------------------------------------------------------------
var save_id = {
    type: 'call-function',
    func: saving_id
}

var save_vaast_trial = {
    type: 'call-function',
    func: saving_vaast_trial
}

var save_extra = {
    type: 'call-function',
    func: saving_extra
}


// EXPERIMENT ---------------------------------------------------------------------------

// Switching to fullscreen --------------------------------------------------------------
  var fullscreen_trial = {
    type: 'fullscreen',
    message:  '<p>To take part in this study, your browser needs to be set to fullscreen.</p>',
    button_label: 'Switch to fullscreen',
    fullscreen_mode: true
  }

  // initial instructions -----------------------------------------------------------------
  var welcome = {
    type: "html-button-response",
    stimulus:
      "<p class='instructions'><center>" +
      "<img src = 'media/UHH.jpg'>" +
      "<img src = 'media/UCL.jpg'>" +
      "<img src = 'media/UR.png'>" +
      "<br><b>SIC-Project (Social Interaction during the Corona-Crisis)</b>" + 
      "</center></p>" +
      "<p class='instructions'>Thank you for taking part in this study. <b>With your participation, you make a valuable contribution to scientific research on social " +
      "consequences of the corona crisis. </b></p>" +
      "<p class='instructions'>During this study, you will be asked to complete a simple video game task. By clicking below to start the study, you recognize that you know:</p>" +
        "<ul class='instructions'>" +
          "<li>You can stop your participation at any time </li>" +
          "<li>You can contact our team for any questions or dissatisfaction related to your " +
          "participation: EMAIL ADRESS.</li>" +
          "<li>The data collected will be strictly confidential and will only be accessible to researchers.</li>" +
          "<li>We do not record any data that allows to personally identify you. We do not record your IP address.</li>" +
        "</ul>" +
      "<p class='instructions'>By clicking on the \"I confirm\" button, you give your free and informed consent to participate " +
      "in this research.</p>",
    choices: ['I confirm']
  };

  var welcome_2 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Before you start...<br><br></h1>" +
          "<li>Minimize any potential distractor (close other computer programs, silence your cell phone, etc.) </li>" +
          "<li>Disable your ad-blocking software, because ad-blocking softwares interfere with data collection</li>" +
        "</ul><br><br>" +
    "<p class = 'continue-instructions'>Press <strong>space</strong> to" +
    " continue.</p>",
  choices: [32]
};

// VAAST --------------------------------------------------------------------------------
var vaast_instructions_1 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Video Game task</h1>" +
    "<p class='instructions'>In this task, just like in a video game, you " +
    "will find yourself within the environment presented below." +
   "<p class='instructions'> You will be able to move forward and backward" +
    " using keys on your keyboard.</p>" +
    "<br>" +
    "<img src = 'media/vaast-background.png'>" +
    "<br>" +
    "<br>" +
    "<p class = 'continue-instructions'>Press <strong>space</strong> to" +
    " continue.</p>",
  choices: [32]
};


 var vaast_instructions_2 = {
    type: "html-keyboard-response",
    stimulus:
      "<h1 class ='custom-title'>Video Game task </h1>" +
      "<p class='instructions'>Items (drawings of plants or persons) will appear in the corridor. </p>" +
      "<p class='instructions'> Your task is to move toward or away from the items as a function of their category " +
      "(more specific instructions following). To do so, use the upward and downward arrow keys on your keyboard: </p>" +
      "<p class='instructions'><center>" +
        "<img src = 'media/keyboard-vaastt.png'>" +
      "</center></p>" +
      "<p class = 'continue-instructions'>Press <strong>space</strong> to continue.</p>",
    choices: [32]
  };

var vaast_instructions_3 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Video Game task </h1>" +
    "<p class='instructions'>At the beginning of each trial, you will see a fixation cross (+) in the center of the screen followed by an item (a plant or a person).</p>" +
    "<p class='instructions'>Your task is to move toward or away by pressing the <b>MOVE TOWARD key</b> (the <b>upward arrow key</b>) " +
    "or the <b>MOVE AWAY key</b> (the <b>downward arrow key</b>) as fast as possible." +
    "<p class='instructions'>For all of these actions, please only use the index finger of your dominant hand.</p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Press <strong>space</strong> to" +
    " continue.</p>",
  choices: [32]
};

var vaast_instructions_4 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Video Game task - Section 1</h1>" +
    "<p class='instructions'>In this section, you have to: " +
    "<ul class='instructions'>" +
    "<li><strong>Approach (move toward) " + group_to_approach_1 + " by pressing the upward arrow key </strong></li>" +
    "<strong>  </strong>" +
    "<li><strong>Avoid (move away from) " + group_to_avoid_1 + " by pressing the downward arrow key </strong></li>" +
    "<strong> </strong>" +
    "</ul>" +
    "<p class='instructions'>It is very important to remember which action you will " +
    "have to perform for each category. You need this information to complete the " +
    "task successfully.</p>" +
    "<strong> Also, it is EXTREMELY IMPORTANT that you try to respond as fast and as correctly as possible. </strong>." +
    "<p class ='instructions'>Note that if your response is false, you will have to start again the trial and make the correct action. " +
    "<br>" +
    "<p class = 'continue-instructions'>Press <strong>space</strong> to" +
    " continue.</p>",
  choices: [32]
};



var vaast_instructions_5 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Video Game task - Section 2</h1>" +
    "<p class='instructions'>In this section, you have to: " +
    "<ul class='instructions'>" +
    "<li><strong>Approach (move toward) " + group_to_approach_2 + " by pressing the upward arrow key </strong></li>" +
    "<strong>  </strong>" +
    "<li><strong>Avoid (move away from) " + group_to_avoid_2 + " by pressing the downward arrow key </strong></li>" +
    "<strong> </strong>" +
    "</ul>" +
    "<p class='instructions'>It is very important to remember which action you will " +
    "have to perform for each category. You need this information to complete the " +
    "task successfully.</p>" +
    "<strong> Also, it is EXTREMELY IMPORTANT that you try to respond as fast and as correctly as possible. </strong>." +
    "<p class ='instructions'>Note that if your response is false, you will have to start again the trial and make the correct action. " +
    "<br>" +
    "<p class = 'continue-instructions'>Press <strong>space</strong> to" +
    " continue.</p>",
  choices: [32]
};


var vaast_instructions_6 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Video Game task - Section 3</h1>" +
    "<p class='instructions'>In this section, as in Section 1, you have to: " +
    "<ul class='instructions'>" +
    "<li><strong>Approach (move toward) " + group_to_approach_3 + " by pressing the upward arrow key </strong></li>" +
    "<strong>  </strong>" +
    "<li><strong>Avoid (move away from) " + group_to_avoid_3 + " by pressing the downward arrow key </strong></li>" +
    "<strong> </strong>" +
    "</ul>" +
    "<p class='instructions'>It is very important to remember which action you will " +
    "have to perform for each category. You need this information to complete the " +
    "task successfully.</p>" +
    "<strong> Also, it is EXTREMELY IMPORTANT that you try to respond as fast and as correctly as possible. </strong>." +
    "<p class ='instructions'>Note that if your response is false, you will have to start again the trial and make the correct action. " +
    "<br>" +
    "<p class = 'continue-instructions'>Press <strong>space</strong> to" +
    " continue.</p>",
  choices: [32]
};



var vaast_instructions_7 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Video Game task - Section 4</h1>" +
    "<p class='instructions'>In this section, as in Section 2, you have to: " +
    "<ul class='instructions'>" +
    "<li><strong>Approach (move toward) " + group_to_approach_4 + " by pressing the upward arrow key </strong></li>" +
    "<strong>  </strong>" +
    "<li><strong>Avoid (move away from) " + group_to_avoid_4 + " by pressing the downward arrow key </strong></li>" +
    "<strong> </strong>" +
    "</ul>" +
    "<p class='instructions'>It is very important to remember which action you will " +
    "have to perform for each category. You need this information to complete the " +
    "task successfully.</p>" +
    "<strong> Also, it is EXTREMELY IMPORTANT that you try to respond as fast and as correctly as possible. </strong>." +
    "<p class ='instructions'>Note that if your response is false, you will have to start again the trial and make the correct action. " +
    "<br>" +
    "<p class = 'continue-instructions'>Press <strong>space</strong> to" +
    " continue.</p>",
  choices: [32]
};




// Creating a trial ---------------------------------------------------------------------
// Note: vaast_start trial is a dirty hack which uses a regular vaast trial. The correct
// movement is approach and the key corresponding to approach is "h", thus making the
// participant press "h" to start the trial. 

// Ici encore tout est dupliqué pour correspondre aux deux blocs de la vaast, les trials
// et les procédures, training compris.

var vaast_start = {
  type: 'vaast-text',
  stimulus: "o",
  position: 2,
  background_images: background,
  font_sizes:  stim_sizes,
  approach_key: "uparrow",
  stim_movement: "approach",
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: true,
  display_feedback: true,
  response_ends_trial: true
}

var vaast_fixation = {
  type: 'vaast-fixation',
  fixation: "+",
  font_size:  46,
  position: 2,
  background_images: background
}

var vaast_first_step_training_1 = {
  type: 'vaast-image',
  stimulus: jsPsych.timelineVariable('stimulus'),
  position: 2,
  background_images: background,
  font_sizes:  image_sizes,
  approach_key: "uparrow",
  avoidance_key: "downarrow",
  stim_movement: jsPsych.timelineVariable('movement_1'),
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: true,
  display_feedback: true,
  response_ends_trial: true
}

var vaast_second_step_training_1 = {
  type: 'vaast-image',
  position: next_position_training,
  stimulus: jsPsych.timelineVariable('stimulus'),
  background_images: background,
  font_sizes:  image_sizes,
  stim_movement: jsPsych.timelineVariable('movement_1'),
  response_ends_trial: false,
  trial_duration: 650
}

var vaast_first_step_training_2 = {
  type: 'vaast-image',
  stimulus: jsPsych.timelineVariable('stimulus'),
  position: 2,
  background_images: background,
  font_sizes:  image_sizes,
  approach_key: "uparrow",
  avoidance_key: "downarrow",
  stim_movement: jsPsych.timelineVariable('movement_2'),
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: true,
  display_feedback: true,
  response_ends_trial: true
}

var vaast_second_step_training_2 = {
  type: 'vaast-image',
  position: next_position_training,
  stimulus: jsPsych.timelineVariable('stimulus'),
  background_images: background,
  font_sizes:  image_sizes,
  stim_movement: jsPsych.timelineVariable('movement_2'),
  response_ends_trial: false,
  trial_duration: 650
}

var vaast_first_step_training_3 = {
  type: 'vaast-image',
  stimulus: jsPsych.timelineVariable('stimulus'),
  position: 2,
  background_images: background,
  font_sizes:  image_sizes,
  approach_key: "uparrow",
  avoidance_key: "downarrow",
  stim_movement: jsPsych.timelineVariable('movement_3'),
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: true,
  display_feedback: true,
  response_ends_trial: true
}

var vaast_second_step_training_3 = {
  type: 'vaast-image',
  position: next_position_training,
  stimulus: jsPsych.timelineVariable('stimulus'),
  background_images: background,
  font_sizes:  image_sizes,
  stim_movement: jsPsych.timelineVariable('movement_3'),
  response_ends_trial: false,
  trial_duration: 650
}

var vaast_first_step_training_4 = {
  type: 'vaast-image',
  stimulus: jsPsych.timelineVariable('stimulus'),
  position: 2,
  background_images: background,
  font_sizes:  image_sizes,
  approach_key: "uparrow",
  avoidance_key: "downarrow",
  stim_movement: jsPsych.timelineVariable('movement_4'),
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: true,
  display_feedback: true,
  response_ends_trial: true
}

var vaast_second_step_training_4 = {
  type: 'vaast-image',
  position: next_position_training,
  stimulus: jsPsych.timelineVariable('stimulus'),
  background_images: background,
  font_sizes:  image_sizes,
  stim_movement: jsPsych.timelineVariable('movement_4'),
  response_ends_trial: false,
  trial_duration: 650
}

// VAAST training block -----------------------------------------------------------------

var vaast_training_block_1 = {
  timeline: [
    //vaast_start,
    vaast_fixation,
    vaast_first_step_training_1,
    vaast_second_step_training_1,
    save_vaast_trial
  ],
  timeline_variables: vaast_stim_training,
  repetitions: 1, //here, put 2
  randomize_order: true,
  data: {
    phase:    "training",
    stimulus: jsPsych.timelineVariable('stimulus'),
    movement: jsPsych.timelineVariable('movement_1'),
    group:   jsPsych.timelineVariable('group'),
  }
};

var vaast_test_block_1 = {
  timeline: [
    //vaast_start,
    vaast_fixation,
    vaast_first_step_training_1,
    vaast_second_step_training_1,
    save_vaast_trial
  ],
  timeline_variables: vaast_stim,
  repetitions: 1,  //here, put 2
  randomize_order: true,
  data: {
    phase:    "test",
    stimulus: jsPsych.timelineVariable('stimulus'),
    movement: jsPsych.timelineVariable('movement_1'),
    group:   jsPsych.timelineVariable('group'),
  }
};

var vaast_training_block_2 = {
  timeline: [
    //vaast_start,
    vaast_fixation,
    vaast_first_step_training_2,
    vaast_second_step_training_2,
    save_vaast_trial
  ],
  timeline_variables: vaast_stim_training,
  repetitions: 1,  //here, put 2
  randomize_order: true,
  data: {
    phase:    "training",
    stimulus: jsPsych.timelineVariable('stimulus'),
    movement: jsPsych.timelineVariable('movement_2'),
    group:    jsPsych.timelineVariable('group'),
  }
};

var vaast_test_block_2 = {
  timeline: [
    //vaast_start,
    vaast_fixation,
    vaast_first_step_training_2,
    vaast_second_step_training_2,
    save_vaast_trial
  ],
  timeline_variables: vaast_stim,
  repetitions: 1,  //here, put 2
  randomize_order: true,
  data: {
    phase:    "test",
    stimulus: jsPsych.timelineVariable('stimulus'),
    movement: jsPsych.timelineVariable('movement_2'),
    group:    jsPsych.timelineVariable('group'),
  }
};

var vaast_test_block_3 = {
  timeline: [
    //vaast_start,
    vaast_fixation,
    vaast_first_step_training_3,
    vaast_second_step_training_3,
    save_vaast_trial
  ],
  timeline_variables: vaast_stim,
  repetitions: 1,  //here, put 2
  randomize_order: true,
  data: {
    phase:    "test",
    stimulus: jsPsych.timelineVariable('stimulus'),
    movement: jsPsych.timelineVariable('movement_3'),
    group:    jsPsych.timelineVariable('group'),
  }
};

var vaast_test_block_4 = {
  timeline: [
    //vaast_start,
    vaast_fixation,
    vaast_first_step_training_4,
    vaast_second_step_training_4,
    save_vaast_trial
  ],
  timeline_variables: vaast_stim,
  repetitions: 1,  //here, put 2
  randomize_order: true,
  data: {
    phase:    "test",
    stimulus: jsPsych.timelineVariable('stimulus'),
    movement: jsPsych.timelineVariable('movement_4'),
    group:    jsPsych.timelineVariable('group'),
  }
};

// end fullscreen -----------------------------------------------------------------------

var fullscreen_trial_exit = {
  type: 'fullscreen',
  fullscreen_mode: false
}

  // demographics + questions -------------------------------------------------------------

  var extra_information = {
    type: 'html-keyboard-response',
    stimulus:
      "<p class='instructions'>The study is almost finished. Now, you have to answer a few questions.</p>" +
      "<p class='continue-instructions'>Press <strong>space</strong> to continue.</p>",
    choices: [32]
  };


  var extra_information_2 = {
    timeline: [{
      type: 'survey-text',
      questions: [{prompt: "What is your age?"}],
      button_label: "Submit",
    }],
    loop_function: function(data) {
      var extra_information_2 = data.values()[0].responses;
      var extra_information_2 = JSON.parse(extra_information_2).Q0;
      if (extra_information_2 == "") {
        alert("Please enter you age!");
        return true;
      }
    },
    on_finish: function(data) {
      jsPsych.data.addProperties({
        extra_information_2: JSON.parse(data.responses)["Q0"],
      });
    }
  }

  var extra_information_3 = {
    type: 'survey-multi-choice',
    questions: [{prompt: "What is your gender?", options: ["&nbspMale", "&nbspFemale", "&nbspOther"], required: true, horizontal: true}],
    button_label: "Submit"
  }

  var extra_information_4 = {
    type: 'survey-multi-choice',
    questions: [{prompt: "How well do you speak english?",
                 options: ["&nbspFluently", "&nbspVery good", "&nbspGood", "&nbspAverage", "&nbspBad", "&nbspVery bad"],
                 required: true, horizontal: false}],
    button_label: "Submit"
  }

  var extra_information_5 = {
    type: 'survey-multi-choice',
    questions: [{prompt: "What is your socioeconomic status?",
                 options: ["&nbspVery low", "&nbspLow", "&nbspMedium", "&nbspHigh", "&nbspVery high"],
                 required: true, horizontal: false}],
    button_label: "Submit"
  }

  var extra_information_6 = {
    type: 'survey-multi-choice',
    questions: [{prompt: "What is your highest level of education?",
                 options: ["&nbspDid not complete high school", "&nbspHigh school/GED", "&nbspSome college", "&nbspBachelor's degree", "&nbspMaster's degree", "&nbspAdvanced graduate work or Ph.D."],
                 required: true, horizontal: false}],
    button_label: "Submit"
  }

  var extra_information_7 = {
    type: 'survey-text',
    questions: [{prompt: "Do you have any remarks about this study? [Optional]"}],
    button_label: "Submit"
  }

  // end insctruction ---------------------------------------------------------------------

  var ending = {
    type: "html-keyboard-response",
    stimulus:
      "<p class='instructions'>You are now finished with this study.<p>" +
      "<p class='instructions'>In this study, we were interested in the measure of " +
      "approach and avoidance tendencies. Specifically, we aim at testing whether the coronavirus lock down " +
      "influences people's tendencies to approach other persons (comparatively to plants). Indeed, one could expect that habituation to avoid others </p>" +
      "<p class='instructions'>become automatized in our tendencies. On the contrary, people might become highly motivated to " +
      "approach others because they feel lonely. </p>" +
      "<p class='instructions'>For more information to this topic, please email " +
      "marine.rougier@uclouvain.be</p>" +
      "<p class = 'continue-instructions'>Press <strong>space</strong> to VALIDATE your participation.</p>",
    choices: [32]
  };

// procedure ----------------------------------------------------------------------------
// Initialize timeline ------------------------------------------------------------------

var timeline = [];

// fullscreen
timeline.push(
              fullscreen_trial,
              welcome,
              welcome_2,
			        hiding_cursor);

// prolific verification
timeline.push(save_id);

timeline.push(vaast_instructions_1,
              vaast_instructions_2,
              vaast_instructions_3, 
              vaast_instructions_4,
              vaast_training_block_1,
              vaast_test_block_1,
              vaast_instructions_5,
              vaast_training_block_2,
              vaast_test_block_2,
              vaast_instructions_6,
              vaast_test_block_3,
              vaast_instructions_7,
              vaast_test_block_4);

timeline.push(showing_cursor,
              fullscreen_trial_exit);

timeline.push(extra_information,
              extra_information_2,
              extra_information_3,
              extra_information_4,
              extra_information_5,
              extra_information_6,
              extra_information_7,
              save_extra);

// ending
  timeline.push(ending);

// Launch experiment --------------------------------------------------------------------
// preloading ---------------------------------------------------------------------------
// Preloading. For some reason, it appears auto-preloading fails, so using it manually.
// In principle, it should have ended when participants starts VAAST procedure (which)
// contains most of the image that have to be pre-loaded.
var loading_gif               = ["media/loading.gif"]
var vaast_instructions_images = ["media/vaast-background.png", "media/keyboard-vaastt.png"];
var vaast_bg_filename         = background;

jsPsych.pluginAPI.preloadImages(loading_gif);
jsPsych.pluginAPI.preloadImages(vaast_instructions_images);
jsPsych.pluginAPI.preloadImages(vaast_bg_filename);

// timeline initiaization ---------------------------------------------------------------

if(is_compatible) {
  jsPsych.init({
      timeline: timeline,
      on_interaction_data_update: function() {
        saving_browser_events(completion = false);
      },
    on_finish: function() {
        saving_browser_events(completion = true);
        jsPsych.data.addProperties({
        vaast_first_block: vaast_first_block,
        });
        window.location.href = "https://google.com";
    }
  });
}


