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

  // id variables
  var id  = jsPsych.data.getURLVariable("id");
  id = id == null ? jsPsych.randomization.randomID(15) : id; // assign random id if not provided in URL

  // Preload images
  var preloadimages = [];

  // connection status ---------------------------------------------------------------------
  // This section ensure that we don't lose data. Anytime the 
  // client is disconnected, an alert appears onscreen
  var connectedRef = firebase.database().ref(".info/connected");
  var connection   = firebase.database().ref("VAAST_3appuis_EC/" + id + "/")
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

    // counter variables
  var vaast_trial_n    = 1;
  var browser_events_n = 1;

// Variable input -----------------------------------------------------------------------
// Variable used to define experimental condition : approached color and group associated with the color

var vaast_condition_approach = jsPsych.randomization.sampleWithoutReplacement(["approach_blue", "approach_yellow"], 1)[0];

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

// Preload images in the VAAST 
// Preload faces
  var faces = [
      "stimuli/n1_bm027_Blue.png",
      "stimuli/n1_bm027_Yellow.png",
      "stimuli/n1_bm044_Blue.png",
      "stimuli/n1_bm044_Yellow.png",
      "stimuli/n1_bm221_Blue.png",
      "stimuli/n1_bm221_Yellow.png",
      "stimuli/n1_bm222_Blue.png",
      "stimuli/n1_bm222_Yellow.png",
      "stimuli/n2_BM208_Blue.png",
      "stimuli/n2_BM208_Yellow.png",
      "stimuli/n2_BM218_Blue.png",
      "stimuli/n2_BM218_Yellow.png",
      "stimuli/n2_BM228_Blue.png",
      "stimuli/n2_BM228_Yellow.png",
      "stimuli/n2_BM239_Blue.png",
      "stimuli/n2_BM239_Yellow.png",
      "stimuli/n3_BM002_Blue.png",
      "stimuli/n3_BM002_Yellow.png",
      "stimuli/n3_BM009_Blue.png",
      "stimuli/n3_BM009_Yellow.png",
      "stimuli/n3_BM011_Blue.png",
      "stimuli/n3_BM011_Yellow.png",
      "stimuli/n3_BM214_Blue.png",
      "stimuli/n3_BM214_Yellow.png",
      "stimuli/n4_BM039_Blue.png",
      "stimuli/n4_BM039_Yellow.png",
      "stimuli/n4_BM045_Blue.png",
      "stimuli/n4_BM045_Yellow.png",
      "stimuli/n4_BM210_Blue.png",
      "stimuli/n4_BM210_Yellow.png",
      "stimuli/n4_BM251_Blue.png",
      "stimuli/n4_BM251_Yellow.png"
  ];

 preloadimages.push(faces);

// VAAST --------------------------------------------------------------------------------
// VAAST variables ----------------------------------------------------------------------
// On duplique chacune des variable pour correspondre au bloc 1 et au bloc 2 !

var movement_blue    = undefined;
var movement_yellow    = undefined;
var group_to_approach = undefined;
var group_to_avoid    = undefined;


switch(vaast_condition_approach) {
  case "approach_blue":
    movement_blue    = "approach";
    movement_yellow    = "avoidance";
    group_to_approach = "blue";
    group_to_avoid    = "yellow";
    break;

  case "approach_yellow":
    movement_blue    = "avoidance";
    movement_yellow    = "approach";
    group_to_approach = "yellow";
    group_to_avoid    = "blue";
    break;
}



// VAAST stimuli ------------------------------------------------------------------------
// vaast image stimuli ------------------------------------------------------------------

 var vaast_stim_training = [];

 var vaast_stim = [
        { movement: movement_blue, group: "blue", level: "n1", stimulus: 'stimuli/n1_bm027_Blue.png' },
        { movement: movement_blue, group: "blue", level: "n1", stimulus: 'stimuli/n1_bm044_Blue.png' },
        { movement: movement_blue, group: "blue", level: "n1", stimulus: 'stimuli/n1_bm221_Blue.png' },
        { movement: movement_blue, group: "blue", level: "n1", stimulus: 'stimuli/n1_bm222_Blue.png' },
        { movement: movement_blue, group: "blue", level: "n2", stimulus: 'stimuli/n2_BM208_Blue.png' },
        { movement: movement_blue, group: "blue", level: "n2", stimulus: 'stimuli/n2_BM218_Blue.png' },
        { movement: movement_blue, group: "blue", level: "n2", stimulus: 'stimuli/n2_BM228_Blue.png' },
        { movement: movement_blue, group: "blue", level: "n2", stimulus: 'stimuli/n2_BM239_Blue.png' },
        { movement: movement_blue, group: "blue", level: "n3", stimulus: 'stimuli/n3_BM002_Blue.png' },
        { movement: movement_blue, group: "blue", level: "n3", stimulus: 'stimuli/n3_BM009_Blue.png' },
        { movement: movement_blue, group: "blue", level: "n3", stimulus: 'stimuli/n3_BM011_Blue.png' },
        { movement: movement_blue, group: "blue", level: "n3", stimulus: 'stimuli/n3_BM214_Blue.png' },
        { movement: movement_blue, group: "blue", level: "n4", stimulus: 'stimuli/n4_BM039_Blue.png' },
        { movement: movement_blue, group: "blue", level: "n4", stimulus: 'stimuli/n4_BM045_Blue.png' },
        { movement: movement_blue, group: "blue", level: "n4", stimulus: 'stimuli/n4_BM210_Blue.png' },
        { movement: movement_blue, group: "blue", level: "n4", stimulus: 'stimuli/n4_BM251_Blue.png' },
        { movement: movement_yellow, group: "yellow", level: "n1", stimulus: 'stimuli/n1_bm027_Yellow.png' },
        { movement: movement_yellow, group: "yellow", level: "n1", stimulus: 'stimuli/n1_bm044_Yellow.png' },
        { movement: movement_yellow, group: "yellow", level: "n1", stimulus: 'stimuli/n1_bm221_Yellow.png' },
        { movement: movement_yellow, group: "yellow", level: "n1", stimulus: 'stimuli/n1_bm222_Yellow.png' },
        { movement: movement_yellow, group: "yellow", level: "n2", stimulus: 'stimuli/n2_BM208_Yellow.png' },
        { movement: movement_yellow, group: "yellow", level: "n2", stimulus: 'stimuli/n2_BM218_Yellow.png' },
        { movement: movement_yellow, group: "yellow", level: "n2", stimulus: 'stimuli/n2_BM228_Yellow.png' },
        { movement: movement_yellow, group: "yellow", level: "n2", stimulus: 'stimuli/n2_BM239_Yellow.png' },
        { movement: movement_yellow, group: "yellow", level: "n3", stimulus: 'stimuli/n3_BM002_Yellow.png' },
        { movement: movement_yellow, group: "yellow", level: "n3", stimulus: 'stimuli/n3_BM009_Yellow.png' },
        { movement: movement_yellow, group: "yellow", level: "n3", stimulus: 'stimuli/n3_BM011_Yellow.png' },
        { movement: movement_yellow, group: "yellow", level: "n3", stimulus: 'stimuli/n3_BM214_Yellow.png' },
        { movement: movement_yellow, group: "yellow", level: "n4", stimulus: 'stimuli/n4_BM039_Yellow.png' },
        { movement: movement_yellow, group: "yellow", level: "n4", stimulus: 'stimuli/n4_BM045_Yellow.png' },
        { movement: movement_yellow, group: "yellow", level: "n4", stimulus: 'stimuli/n4_BM210_Yellow.png' },
        { movement: movement_yellow, group: "yellow", level: "n4", stimulus: 'stimuli/n4_BM251_Yellow.png' },
    ];


    vaast_stim_training.push(_.sampleSize(_.filter(vaast_stim, { 'group': 'blue' }), 3));
    vaast_stim_training.push(_.sampleSize(_.filter(vaast_stim, { 'group': 'yellow' }), 3));
    vaast_stim_training = _.flattenDeep(vaast_stim_training);


// vaast background images --------------------------------------------------------------,

var background = [
    "background/1.jpg",
    "background/2.jpg",
    "background/3.jpg",
    "background/4.jpg",
    "background/5.jpg",
    "background/6.jpg",
    "background/7.jpg"
];


// vaast stimuli sizes -------------------------------------------------------------------

 var stim_sizes = [
    34,
    38,
    42,
    46,
    52,
    60,
    70
  ];

  var resize_factor = 7;
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

  var approach_key = jsPsych.pluginAPI.convertKeyCharacterToKeyCode('y');
  var avoidance_key = jsPsych.pluginAPI.convertKeyCharacterToKeyCode('n');

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
        .ref("participant_id_Black/")
        .push()
        .set({id: id,
               ApproachedColor: vaast_condition_approach,
               timestamp: firebase.database.ServerValue.TIMESTAMP})
  }

// vaast trial --------------------------------------------------------------------------
  var saving_vaast_trial = function(){
    database
      .ref("vaast_trial_Black/").
      push()
        .set({id: id,
          ApproachedColor: vaast_condition_approach,
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          vaast_trial_data: jsPsych.data.get().last(4).json()})
  }


// demographic logging ------------------------------------------------------------------

  var saving_browser_events = function(completion) {
    database
     .ref("browser_event_Black/")
     .push()
     .set({id: id,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      ApproachedColor: vaast_condition_approach,
      completion: completion,
      event_data: jsPsych.data.getInteractionData().json()})
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

// EXPERIMENT ---------------------------------------------------------------------------

// initial instructions -----------------------------------------------------------------
  var welcome = {
    type: "html-keyboard-response",
    stimulus:
      "<h1 class ='custom-title'> Welcome </h1>" +
      "<ul class='instructions'>" +
      "In this study, you will have to <b>complete two tasks</b>. Note that we " +
      "will not collect any personally identifying information and that you can leave the experiment " +
      "at any moment. If you complete the experiment until the end, you will be retributed as stated on Prolific. " +
      "<b>If you decide to start this study, it means that you give your free and informed consent to participate. </b>" +
      "<br>" + 
      "<br>" +
      "Because we rely on third party services to gather data, ad-blocking " +
      "software might interfere with data collection. Therefore, please  " +
      "disable your ad-blocking software during this study. " +
      "<b>If we are unable to record your data, we will not be able to reward you for " +
      "your participation</b>. " +
      "If you have any question related to this research, please " +
      "e-mail marine.rougier@uclouvain.be. </ul>" +
      "<br>" +
      "<p class = 'continue-instructions'>Press <strong>space</strong> to start the study.</p>",
    choices: [32]
  };


// Switching to fullscreen --------------------------------------------------------------
var fullscreen_trial = {
  type: 'fullscreen',
  message:  'To start the study, please switch to fullscreen </br></br>',
  button_label: 'Switch to fullscreen',
  fullscreen_mode: true
}


// VAAST --------------------------------------------------------------------------------

var Gene_Instr = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Study on face categorization</h1>" +
    "<br>" +
    "<p class='instructions'> We are interested in the way people categorize " +
    "others and, more specifically, their faces. </p>" +
   "<p class='instructions'>In this study, you will have to " +
    "perform two categorization tasks: " +
    "<br>" +
    "- The Video Game task (approx. 15 min)" + 
    "<br>" +
    "- The Categorization task (approx. 15 min)</p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Press <strong>space</strong> to" +
    " continue.</p>",
  choices: [32]
};

var vaast_instructions_1 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Task 1: Video Game task</h1>" +
    "<p class='instructions'>In this task, just like in a video game, you " +
    "will find yourself in the environment presented below." +
   "<p class='instructions'> Your will be able to move forward and backward" +
    " using keys on your keyboard.</p>" +
    "<br>" +
    "<img src = 'media/vaast-background.png'>" +
    "<br>" +
    "<p class = 'continue-instructions'>Press <strong>space</strong> to" +
    " continue.</p>",
  choices: [32]
};

var vaast_instructions_2 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Task 1: Video Game task</h1>" +
    "<p class='instructions'>The faces that you saw previously (see examples below) will be displayed in this environment. </p>" +
    "<br>" +
    "<img src = 'stimuli/n2_BM239_Blue_example.png'>" +
    "                              " +
    "<img src = 'stimuli/n3_BM214_Yellow_example.png'>" +
    "<br>" +
    "<br>" +
    "<p class='instructions'>Your task will be to categorize these faces (by moving forward or backward) as fast as possible. " +
    "Specifically, you will have to categorize these faces based on their background color (i.e., blue or yellow). "+
    "More specific instructions will follow.</p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Press <strong>space</strong> to" +
    " continue.</p>",
  choices: [32]
};

var vaast_instructions_2_bis = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Task 1: Video Game task</h1>" +
    "<p class='instructions'>To move forward or backward, you will use the following keys of your keyboard:"+
    "<br>" +
    "<br>" +
    "<img src = 'media/keyboard-vaastt.png'>" +
    "<br>" +
    "<br></p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
  choices: [32]
};

var vaast_instructions_3 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Task 1: Video Game task</h1>" +
    "<p class='instructions'>At the beginning of each trial, you will see the 'O' symbol. " +
    "This symbol indicates that you have to press the START key (namely, the <b>D key</b>) to start the trial. </p>" +
    "<p class='instructions'>Then, you will see a fixation cross (+) at the center of the screen, followed by a face. </p>" +
    "<p class='instructions'>Depending on the background color of the face, your task is to move forward or backward by pressing <b>three times</b>, as fast as you can, " +
    "the MOVE FORWARD key (namely, the <b>E key</b>) or the MOVE BACKWARD key (namely, the <b>C key</b>). After these three key presses, the face will disappear and you will have to "+
    "press again the START key (D key). " +
    "<p class='instructions'>Please use only the index of your dominant hand for all these actions. </p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Press <strong>space</strong> to" +
    " continue.</p>",
  choices: [32]
};


var vaast_instructions_4 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Task 1: Video Game task</h1>" +
    "<p class='instructions'>More precisely, you will have to: " +
    "<ul class='instructions'>" +
    "<li><strong>APPROACH faces with a " + group_to_approach + " background </strong></li>" +
    "<strong>by pressing the MOVE FORWARD key (namely, the E key) </strong>" +
    "<br>" +
    "<br>" +
    "<li><strong>AVOID faces with a " + group_to_avoid + " background </strong></li>" +
    "<strong>by pressing the the MOVE BACKWARD key (namely, the C key)</strong>" +
    "</ul>" +
    "<p class='instructions'>Please read carefully and make sure that you memorize the instructions above. </p>" +
    "<p class='instructions'><strong>Also, note that is it EXTREMELY IMPORTANT that you try to be as fast and accurate as you can. </strong>" +
    "A red cross will appear if your response is incorrect. </p>" +
    "<br>" +
    "<br>" +
    "<p class = 'continue-instructions'>Press <strong>enter</strong> to " +
    "begin the training.</p>",
  choices: [13]
};


var vaast_instructions_end = {
  type: "html-keyboard-response",
  stimulus:
    "<p class='instructions'>The Video Game task (task 1) is completed. " +
    "Now, you have to perform the Categorization Task (task 2). </p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Press <strong>space</strong> to" +
    " begin Task 2.</p>",
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
  position: 3,
  background_images: background,
  font_sizes:  stim_sizes,
  approach_key: "d",
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
  position: 3,
  background_images: background
}

var vaast_first_step_training = {
  type: 'vaast-image',
  stimulus: jsPsych.timelineVariable('stimulus'),
  position: 3,
  background_images: background,
  font_sizes:  image_sizes,
  approach_key: "e",
  avoidance_key: "c",
  stim_movement: jsPsych.timelineVariable('movement'),
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: false,
  display_feedback: true,
  feedback_duration: 500, 
  response_ends_trial: true
}

var vaast_second_step = {
  type: 'vaast-image',
  stimulus: jsPsych.timelineVariable('stimulus'),
  position: next_position_training,
  background_images: background,
  font_sizes:  image_sizes,
  approach_key: "e",
  avoidance_key: "c",
  stim_movement: jsPsych.timelineVariable('movement'),
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: false,
  display_feedback: true,
  feedback_duration: 500, 
  response_ends_trial: true
}

var vaast_second_step_training = {
  chunk_type: "if",
  timeline: [vaast_second_step],
  conditional_function: function(){
    var data = jsPsych.data.getLastTrialData().values()[0];
    return data.correct;
  }
}

var vaast_third_step = {
  type: 'vaast-image',
  stimulus: jsPsych.timelineVariable('stimulus'),
  position: next_position_training,
  background_images: background,
  font_sizes:  image_sizes,
  approach_key: "e",
  avoidance_key: "c",
  stim_movement: jsPsych.timelineVariable('movement'),
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: false,
  display_feedback: true,
  feedback_duration: 500, 
  response_ends_trial: true
}

var vaast_third_step_training = {
  chunk_type: "if",
  timeline: [vaast_third_step],
  conditional_function: function(){
    var data = jsPsych.data.getLastTrialData().values()[0];
    return data.correct;
  }
}

var vaast_fourth_step = {
  type: 'vaast-image',
  position: next_position_training,
  stimulus: jsPsych.timelineVariable('stimulus'),
  background_images: background,
  font_sizes:  image_sizes,
  stim_movement: jsPsych.timelineVariable('movement'),
  response_ends_trial: false,
  trial_duration: 650
}

var vaast_fourth_step_training = {
  chunk_type: "if",
  timeline: [vaast_fourth_step],
  conditional_function: function(){
    var data = jsPsych.data.getLastTrialData().values()[0];
    return data.correct;
  }
}


// VAAST training block -----------------------------------------------------------------

var vaast_training = {
  timeline: [
    vaast_start,
    vaast_fixation,
    vaast_first_step_training,
    vaast_second_step_training,
    vaast_third_step_training,
    vaast_fourth_step_training,
    save_vaast_trial
  ],
  timeline_variables: vaast_stim_training,
  repetitions: 1, //here, put 12 for 192 trials
  randomize_order: true,
  data: {
    phase:    "training",
    stimulus: jsPsych.timelineVariable('stimulus'),
    movement: jsPsych.timelineVariable('movement'),
    group:   jsPsych.timelineVariable('group'),
  }
};

// end fullscreen -----------------------------------------------------------------------

var fullscreen_trial_exit = {
  type: 'fullscreen',
  fullscreen_mode: false
}


// procedure ----------------------------------------------------------------------------
// Initialize timeline ------------------------------------------------------------------

var timeline = [];

// fullscreen
timeline.push(
        welcome,
        fullscreen_trial,
			  hiding_cursor);

// prolific verification
timeline.push(save_id);

timeline.push(    Gene_Instr, 
                  vaast_instructions_1,
                  vaast_instructions_2,
                  vaast_instructions_2_bis,
                  vaast_instructions_3, 
                  vaast_instructions_4,
                  vaast_training,
                  vaast_instructions_end);

timeline.push(showing_cursor);

timeline.push(fullscreen_trial_exit);

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
https://marinerougier.github.io/Expe6_RC_3appuis/RCmarine2.html


if(is_compatible) {
  jsPsych.init({
      timeline: timeline,
      preload_images: preloadimages,
      max_load_time: 1000 * 500,
      exclusions: {
            min_width: 800,
            min_height: 600,
        },
      on_interaction_data_update: function() {
        saving_browser_events(completion = false);
      },
    on_finish: function() {
        saving_browser_events(completion = true);
	var redirectLink = "https://www.google.html";
        window.location.href = redirectLink + "?id=" + id;
    }
  });
}


