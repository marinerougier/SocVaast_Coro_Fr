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
      "stimuli/Gruppe1.png",
      "stimuli/Gruppe2.png",
      "stimuli/Gruppe3.png",
      "stimuli/Gruppe4.png",
      "stimuli/Gruppe5.png",
      "stimuli/Gruppe6.png",
      "stimuli/Gruppe7.png",
      "stimuli/Gruppe8.png",
      "stimuli/pair1_female.png",
      "stimuli/pair1_male.png",
      "stimuli/pair2_female.png",
      "stimuli/pair2_male.png",
      "stimuli/pair3_female.png",
      "stimuli/pair3_male.png",
      "stimuli/pair4_female.png",
      "stimuli/pair4_male.png",
      "stimuli/PGruppe1.png",
      "stimuli/PGruppe2.png",
      "stimuli/PGruppe3.png",
      "stimuli/PGruppe4.png",
      "stimuli/PGruppe5.png",
      "stimuli/PGruppe6.png",
      "stimuli/PGruppe7.png",
      "stimuli/PGruppe8.png",
      "stimuli/Pflanze1.png",
      "stimuli/Pflanze2.png",
      "stimuli/Pflanze3.png",
      "stimuli/Pflanze4.png",
      "stimuli/Pflanze5.png",
      "stimuli/Pflanze6.png",
      "stimuli/Pflanze7.png",
      "stimuli/Pflanze8.png"
  ];

 preloadimages.push(stim_vaast);
//jsPsych.pluginAPI.preloadImages(stim_vaast);

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
var group_to_approach_1_en = undefined;
var group_to_avoid_1_en    = undefined;
var group_to_approach_1_fr = undefined;
var group_to_avoid_1_fr    = undefined;
var movement_human_2    = undefined;
var movement_plant_2    = undefined;
var group_to_approach_2_en = undefined;
var group_to_avoid_2_en    = undefined;
var group_to_approach_2_fr = undefined;
var group_to_avoid_2_fr    = undefined;
var movement_human_3    = undefined;
var movement_plant_3    = undefined;
var group_to_approach_3_en = undefined;
var group_to_avoid_3_en    = undefined;
var group_to_approach_3_fr = undefined;
var group_to_avoid_3_fr    = undefined;
var movement_human_4    = undefined;
var movement_plant_4    = undefined;
var group_to_approach_4_en = undefined;
var group_to_avoid_4_en    = undefined;
var group_to_approach_4_fr = undefined;
var group_to_avoid_4_fr    = undefined;

// Feedback variables - set after every trial, displayed in the feedback pages
var FeedbackMeanReactionTime = undefined;
var FeedbackNumberOfWrongResponses = undefined;
var FeedbackNumberOfCorrectResponses = undefined;

function updateFeedback(numberOfTrials) {
  // Update the global Feedback variables - call this function after every trial
  var responses = jsPsych.data.get().filter([{'key_press': 38}, {'key_press': 40}]);
  // due to the experiment setup, on_finish is also called when no key presses have happend yet.
  // naturally, we need to ignore these cases
  if (responses.values().length < numberOfTrials) {
    return
  }
  FeedbackMeanReactionTime = responses.last(numberOfTrials).select('rt').mean();
  FeedbackNumberOfWrongResponses = responses.last(numberOfTrials).filter({'correct': false}).count();
  FeedbackNumberOfCorrectResponses = responses.last(numberOfTrials).filter({'correct': true}).count();
}

switch(vaast_first_block) {
  case "approach_human":
    movement_human_1    = "approach";
    movement_plant_1    = "avoidance";
    group_to_approach_1_en = "persons";
    group_to_avoid_1_en    = "plants";
    group_to_approach_1_fr = "personnes";
    group_to_avoid_1_fr    = "plantes";
    movement_human_2    = "avoidance";
    movement_plant_2    = "approach";
    group_to_approach_2_en = "plants";
    group_to_avoid_2_en    = "persons";
    group_to_approach_2_fr = "plantes";
    group_to_avoid_2_fr    = "personnes";
    movement_human_3    = "approach";
    movement_plant_3    = "avoidance";
    group_to_approach_3_en = "persons";
    group_to_avoid_3_en    = "plants";
    group_to_approach_3_fr = "personnes";
    group_to_avoid_3_fr    = "plantes";
    movement_human_4    = "avoidance";
    movement_plant_4    = "approach";
    group_to_approach_4_en = "plants";
    group_to_avoid_4_en    = "persons";
    group_to_approach_4_fr = "plantes";
    group_to_avoid_4_fr    = "personnes";
    break;

  case "approach_plant":
    movement_human_1    = "avoidance";
    movement_plant_1    = "approach";
    group_to_approach_1_en = "plants";
    group_to_avoid_1_en    = "persons";
    group_to_approach_1_fr = "plantes";
    group_to_avoid_1_fr    = "personnes";
    movement_human_2    = "approach";
    movement_plant_2    = "avoidance";
    group_to_approach_2_en = "persons";
    group_to_avoid_2_en    = "plants";
    group_to_approach_2_fr = "personnes";
    group_to_avoid_2_fr    = "plantes";
    movement_human_3    = "avoidance";
    movement_plant_3    = "approach";
    group_to_approach_3_en = "plants";
    group_to_avoid_3_en    = "persons";
    group_to_approach_3_fr = "plantes";
    group_to_avoid_3_fr    = "personnes";
    movement_human_4    = "approach";
    movement_plant_4    = "avoidance";
    group_to_approach_4_en = "persons";
    group_to_avoid_4_en    = "plants";
    group_to_approach_4_fr = "personnes";
    group_to_avoid_4_fr    = "plantes";
    break;
}

// VAAST stimuli ------------------------------------------------------------------------
// vaast image stimuli ------------------------------------------------------------------
// Ici, on ajoute un nouveau mouvement, en fonction du bloc de la vaast on appellera soit
// movement_1 ou movement_2.
  var stim_vaast = [
      "stimuli/Gruppe1.png",
      "stimuli/Gruppe2.png",
      "stimuli/Gruppe3.png",
      "stimuli/Gruppe4.png",
      "stimuli/Gruppe5.png",
      "stimuli/Gruppe6.png",
      "stimuli/Gruppe7.png",
      "stimuli/Gruppe8.png",
      "stimuli/pair1_female.png",
      "stimuli/pair1_male.png",
      "stimuli/pair2_female.png",
      "stimuli/pair2_male.png",
      "stimuli/pair3_female.png",
      "stimuli/pair3_male.png",
      "stimuli/pair4_female.png",
      "stimuli/pair4_male.png",
      "stimuli/PGruppe1.png",
      "stimuli/PGruppe2.png",
      "stimuli/PGruppe3.png",
      "stimuli/PGruppe4.png",
      "stimuli/PGruppe5.png",
      "stimuli/PGruppe6.png",
      "stimuli/PGruppe7.png",
      "stimuli/PGruppe8.png",
      "stimuli/Pflanze1.png",
      "stimuli/Pflanze2.png",
      "stimuli/Pflanze3.png",
      "stimuli/Pflanze4.png",
      "stimuli/Pflanze5.png",
      "stimuli/Pflanze6.png",
      "stimuli/Pflanze7.png",
      "stimuli/Pflanze8.png"
  ];


var vaast_stim_training = [];

var vaast_stim = [
  {movement_1: movement_human_1, movement_2: movement_human_2,  movement_3: movement_human_3, movement_4: movement_human_4, group: "human",  stimulus: "stimuli/Gruppe1.png"},
  {movement_1: movement_human_1, movement_2: movement_human_2,  movement_3: movement_human_3, movement_4: movement_human_4, group: "human",  stimulus: "stimuli/Gruppe2.png"},
  {movement_1: movement_human_1, movement_2: movement_human_2,  movement_3: movement_human_3, movement_4: movement_human_4, group: "human",  stimulus: "stimuli/Gruppe3.png"},
  {movement_1: movement_human_1, movement_2: movement_human_2,  movement_3: movement_human_3, movement_4: movement_human_4, group: "human",  stimulus: "stimuli/Gruppe4.png"},
  {movement_1: movement_human_1, movement_2: movement_human_2,  movement_3: movement_human_3, movement_4: movement_human_4, group: "human",  stimulus: "stimuli/Gruppe5.png"},
  {movement_1: movement_human_1, movement_2: movement_human_2,  movement_3: movement_human_3, movement_4: movement_human_4, group: "human",  stimulus: "stimuli/Gruppe6.png"},
  {movement_1: movement_human_1, movement_2: movement_human_2,  movement_3: movement_human_3, movement_4: movement_human_4, group: "human",  stimulus: "stimuli/Gruppe7.png"},
  {movement_1: movement_human_1, movement_2: movement_human_2,  movement_3: movement_human_3, movement_4: movement_human_4, group: "human",  stimulus: "stimuli/Gruppe8.png"},
  {movement_1: movement_human_1, movement_2: movement_human_2,  movement_3: movement_human_3, movement_4: movement_human_4, group: "human",  stimulus: "stimuli/pair1_female.png"},
  {movement_1: movement_human_1, movement_2: movement_human_2,  movement_3: movement_human_3, movement_4: movement_human_4, group: "human",  stimulus: "stimuli/pair1_male.png"},
  {movement_1: movement_human_1, movement_2: movement_human_2,  movement_3: movement_human_3, movement_4: movement_human_4, group: "human",  stimulus: "stimuli/pair2_female.png"},
  {movement_1: movement_human_1, movement_2: movement_human_2,  movement_3: movement_human_3, movement_4: movement_human_4, group: "human",  stimulus: "stimuli/pair2_male.png"},
  {movement_1: movement_human_1, movement_2: movement_human_2,  movement_3: movement_human_3, movement_4: movement_human_4, group: "human",  stimulus: "stimuli/pair3_female.png"},
  {movement_1: movement_human_1, movement_2: movement_human_2,  movement_3: movement_human_3, movement_4: movement_human_4, group: "human",  stimulus: "stimuli/pair3_male.png"},
  {movement_1: movement_human_1, movement_2: movement_human_2,  movement_3: movement_human_3, movement_4: movement_human_4, group: "human",  stimulus: "stimuli/pair4_female.png"},
  {movement_1: movement_human_1, movement_2: movement_human_2,  movement_3: movement_human_3, movement_4: movement_human_4, group: "human",  stimulus: "stimuli/pair4_male.png"},
  {movement_1: movement_plant_1, movement_2: movement_plant_2,  movement_3: movement_plant_3, movement_4: movement_plant_4, group: "plant",  stimulus: "stimuli/PGruppe1.png"},
  {movement_1: movement_plant_1, movement_2: movement_plant_2,  movement_3: movement_plant_3, movement_4: movement_plant_4, group: "plant",  stimulus: "stimuli/PGruppe2.png"},
  {movement_1: movement_plant_1, movement_2: movement_plant_2,  movement_3: movement_plant_3, movement_4: movement_plant_4, group: "plant",  stimulus: "stimuli/PGruppe3.png"},
  {movement_1: movement_plant_1, movement_2: movement_plant_2,  movement_3: movement_plant_3, movement_4: movement_plant_4, group: "plant",  stimulus: "stimuli/PGruppe4.png"},
  {movement_1: movement_plant_1, movement_2: movement_plant_2,  movement_3: movement_plant_3, movement_4: movement_plant_4, group: "plant",  stimulus: "stimuli/PGruppe5.png"},
  {movement_1: movement_plant_1, movement_2: movement_plant_2,  movement_3: movement_plant_3, movement_4: movement_plant_4, group: "plant",  stimulus: "stimuli/PGruppe6.png"},
  {movement_1: movement_plant_1, movement_2: movement_plant_2,  movement_3: movement_plant_3, movement_4: movement_plant_4, group: "plant",  stimulus: "stimuli/PGruppe7.png"},
  {movement_1: movement_plant_1, movement_2: movement_plant_2,  movement_3: movement_plant_3, movement_4: movement_plant_4, group: "plant",  stimulus: "stimuli/PGruppe8.png"},
  {movement_1: movement_plant_1, movement_2: movement_plant_2,  movement_3: movement_plant_3, movement_4: movement_plant_4, group: "plant",  stimulus: "stimuli/Pflanze1.png"},
  {movement_1: movement_plant_1, movement_2: movement_plant_2,  movement_3: movement_plant_3, movement_4: movement_plant_4, group: "plant",  stimulus: "stimuli/Pflanze2.png"},
  {movement_1: movement_plant_1, movement_2: movement_plant_2,  movement_3: movement_plant_3, movement_4: movement_plant_4, group: "plant",  stimulus: "stimuli/Pflanze3.png"},
  {movement_1: movement_plant_1, movement_2: movement_plant_2,  movement_3: movement_plant_3, movement_4: movement_plant_4, group: "plant",  stimulus: "stimuli/Pflanze4.png"},
  {movement_1: movement_plant_1, movement_2: movement_plant_2,  movement_3: movement_plant_3, movement_4: movement_plant_4, group: "plant",  stimulus: "stimuli/Pflanze5.png"},
  {movement_1: movement_plant_1, movement_2: movement_plant_2,  movement_3: movement_plant_3, movement_4: movement_plant_4, group: "plant",  stimulus: "stimuli/Pflanze6.png"},
  {movement_1: movement_plant_1, movement_2: movement_plant_2,  movement_3: movement_plant_3, movement_4: movement_plant_4, group: "plant",  stimulus: "stimuli/Pflanze7.png"},
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

  var resize_factor = 12;
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


  // Sampling function ----------------------------------------------------------------
  var sample_n = function(list, n) {
    list = jsPsych.randomization.sampleWithReplacement(list, n);
    list = jsPsych.randomization.shuffleNoRepeats(list);

    return (list);
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

  var language = {
    type: "html-button-response",
    stimulus: "<p class='instructions'><center>Please choose a language:</p></center>",
    choices: ['English', 'Français'],
  };

  var language_2 = function(){
    var data = jsPsych.data.getLastTrialData().values()[0].button_pressed;

    if(data == 0) {
      language_2 = "English";
    }

    if(data == 1) {
      language_2 = "Français";
    }

    return(language_2)
  }


  // initial instructions -----------------------------------------------------------------
  var welcome_en = {
    type: "html-button-response",
    stimulus:
      "<p class='instructions'><center>" +
      "<img src = 'media/UHH.png'>" +
      "<img src = 'media/UCL.jpg'>" +
      "<img src = 'media/UR.png'>" +
      "<br><b>SCC-Project (Social Contact during the Corona-crisis)</b>" + 
      "</center></p>" +
      "<p class='instructions'>Thank you for taking part in this study: <b>You make a valuable contribution to scientific research on social " +
      "consequences of the corona crisis. </b></p>" +
      "<p class='instructions'>During this study, you will be asked to complete a simple video game task. By clicking below to start the study, you recognize that you know:</p>" +
        "<ul class='instructions'>" +
          "<li>You can stop your participation at any time </li>" +
          "<li>You can contact our team for any questions or dissatisfaction related to your " +
          "participation: EMAIL ADRESS.</li>" +
          "<li>The data collected will be strictly confidential and will only be accessible to researchers.</li>" +
          "<li>We do not record any data that allows to personally identify you. We do not record your IP address.</li>" +
        "</ul>" ,
    choices: ['I confirm that I give my free and informed consent to participate']
  };

  var welcome_fr = {
    type: "html-button-response",
    stimulus:
      "<p class='instructions'><center>" +
      "<img src = 'media/UHH.png'>" +
      "<img src = 'media/UCL.jpg'>" +
      "<img src = 'media/UR.png'>" +
      "<br><b>Projet CSC (Contact Social durant la crise du Coronavirus)</b>" + 
      "</center></p>" +
      "<p class='instructions'>Merci de prendre part à cette étude : <b>Vous apportez une précieuse contribution à la recherche " +
      "sur les conséquences sociales de la crise du coronavirus. </b></p>" +
      "<p class='instructions'>Dans cette étude, vous devrez compléter une tâche simple de jeu vidéo. En cliquant ci-dessous, vous reconnaissez avoir connaissance que :</p>" +
        "<ul class='instructions'>" +
          "<li>Vous pouvez stopper votre participation à tout moment. </li>" +
          "<li>Vous pouvez contacter notre équipe pour n'importe quelle question ou insatisfaction reliée à votre participation" +
          ": EMAIL ADRESS.</li>" +
          "<li>Les données collectées seront strictement confidentielles et uniquement accessibles par des chercheurs.</li>" +
          "<li>Nous n'enregistrerons aucune données permettant de vous identifier personnellement. Nous n'enregistrerons pas votre adresse IP.</li>" +
        "</ul>" ,
    choices: ['Je confirme que je donne mon consentement éclairé pour participer']
  };

// Switching to fullscreen --------------------------------------------------------------
  var fullscreen_trial_en = {
    type: 'fullscreen',
    message:  '<p><b>Before you start...</b></p>' + 
          '<li>Minimize any potential distractor (close other computer programs, silence your cell phone, etc.). </li>'+
          '<li>Disable your ad-blocking software, because ad-blocking softwares interfere with data collection. <br><br></li>'+
          '<p>To take part in this study, your browser needs to be set to fullscreen.<br></p>',
    button_label: 'Switch to fullscreen',
    fullscreen_mode: false //true
  }

  var fullscreen_trial_fr = {
    type: 'fullscreen',
    message:  '<p><b>Avant de commencer...</b></p>' + 
          '<li>Minimisez toute distraction potentielle (fermez les autres programmes informatiques, mettez votre téléphone en silencieux, etc.) </li>'+
          '<li>Désactivez votre logiciel de blocage des publicités : ce genre de logiciel peut interférer avec la récolte des données. <br><br></li>'+
          '<p>Pour participer à cette étude, votre navigateur doit être mis en mode plein écran.<br></p>',
    button_label: 'Passer au mode plein écran',
    fullscreen_mode: true
  }

// VAAST --------------------------------------------------------------------------------
var vaast_instructions_1_en = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Video Game task</h1>" +
    "<p class='instructions'>In this task, just like in a video game, you will find yourself within the corridor presented below.</p> " +
   "<p class='instructions'> Drawings of items (representing a person or a plant) will appear in the corridor. </p>" +
    "<br>" +
    "<img src = 'media/vaast-background.png'>" +
    "<br>" +
    "<br>" +
    "<p class = 'continue-instructions'>Press <strong>space</strong> to" +
    " continue.</p>",
  choices: [32]
};

var vaast_instructions_1_fr = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Dans cette tâche, un peu comme dans un jeu vidéo, vous vous trouverez dans le couloir présenté ci-dessous. </p> " +
   "<p class='instructions'> Des dessins représentant soit une personne soit une plante apparaîtront dans ce couloir. </p>" +
    "<br>" +
    "<img src = 'media/vaast-background.png'>" +
    "<br>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
  choices: [32]
};

 var vaast_instructions_2_en = {
    type: "html-keyboard-response",
    stimulus:
      "<h1 class ='custom-title'>Video Game task </h1>" +
      "<p class='instructions'> Your task is to move toward or away from the items as a function of their category " +
      "(more specific instructions following). To do so, use the upward and downward arrow keys on your keyboard: </p>" +
      "<p class='instructions'><center>" +
        "<img src = 'media/keyboard-vaastt_en.png'>" +
      "</center></p>" +
          "<br>" +
      "<p class = 'continue-instructions'>Press <strong>space</strong> to continue.</p>",
    choices: [32]
  };

 var vaast_instructions_2_fr = {
    type: "html-keyboard-response",
    stimulus:
      "<h1 class ='custom-title'> Tâche du Jeu Vidéo </h1>" +
      "<p class='instructions'> Votre tâche sera d'aller vers ces dessins ou de vous en éloigner en fonction de leur catégorie " +
      "(des instructions plus spécifiques vont suivre). Pour cela, utiliser les flèches haut/bas de votre clavier : </p>" +
      "<p class='instructions'><center>" +
        "<img src = 'media/keyboard-vaastt_fr.png'>" +
      "</center></p>" +
          "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
    choices: [32]
  };


var vaast_instructions_4_en = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Video Game task - Section 1/4</h1>" +
    "<p class='instructions'>In this section, you have to: " +
    "<ul class='instructions'>" +
    "<li><strong>Move toward " + group_to_approach_1_en + " by pressing the upward arrow key </strong></li>" +
    "<strong>  </strong>" +
    "<li><strong>Move away from " + group_to_avoid_1_en + " by pressing the downward arrow key </strong></li>" +
    "<strong> </strong>" +
    "</ul>" +
    "<strong> EXTREMELY IMPORTANT: respond as fast and as correctly as possible! <br><br></strong>" +
    "<p class ='instructions'>If you make an error, a red x appears (correct you answer with the other key). Use the index finger of your preferred hand to respond. " +
    "<br>" +
    "<p class = 'continue-instructions'>Press <strong>space</strong> to" +
    " continue.</p>",
  choices: [32]
};

var vaast_instructions_4_fr = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche du Jeu Vidéo - Section 1/4</h1>" +
    "<p class='instructions'>Dans cette section, vous devez : " +
    "<ul class='instructions'>" +
    "<li><strong>Aller vers les " + group_to_approach_1_fr + " en appuyant sur la flèche du haut </strong></li>" +
    "<strong>  </strong>" +
    "<li><strong>Vous éloigner des " + group_to_avoid_1_fr + " en appuyant sur la flèche du bas </strong></li>" +
    "<strong> </strong>" +
    "</ul>" +
    "<strong> EXTRÊMEMENT IMPORTANT : répondez aussi rapidement et correctement que possible ! <br><br></strong>" +
    "<p class ='instructions'>Si vous faites une erreur, un X rouge apparaîtra (corrigez votre réponse avec l'autre touche). Utilisez l'index de votre main préférée pour répondre. " +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
  choices: [32]
};


var vaast_instructions_5_en = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Video Game task - Section 2/4</h1>" +
    "<p class='instructions'>Warning! Instructions are changing. Now, you have to: " +
    "<ul class='instructions'>" +
    "<li><strong>Move toward " + group_to_approach_2_en + " by pressing the upward arrow key </strong></li>" +
    "<strong>  </strong>" +
    "<li><strong>Move away from " + group_to_avoid_2_en + " by pressing the downward arrow key </strong></li>" +
    "<strong> </strong>" +
    "</ul>" +
    "<strong> EXTREMELY IMPORTANT: respond as fast and as correctly as possible! <br><br></strong>" +
    "<br>" +
    "<p class = 'continue-instructions'>Press <strong>space</strong> to" +
    " continue.</p>",
  choices: [32]
};

var vaast_instructions_5_fr = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche du Jeu Vidéo - Section 2/4</h1>" +
    "<p class='instructions'>Attention ! Les instructions changent. Maintenant, vous devez : " +
    "<ul class='instructions'>" +
    "<li><strong>Aller vers les " + group_to_approach_2_fr + " en appuyant sur la flèche du haut </strong></li>" +
    "<strong>  </strong>" +
    "<li><strong>Vous éloigner des " + group_to_avoid_2_fr + " en appuyant sur la flèche du bas </strong></li>" +
    "<strong> </strong>" +
    "</ul>" +
    "<strong> EXTRÊMEMENT IMPORTANT : répondez aussi rapidement et correctement que possible ! <br><br></strong>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
  choices: [32]
};

var vaast_instructions_6_en = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Video Game task - Section 3/4</h1>" +
    "<p class='instructions'>Warning! Instructions are changing. Now, you have to: " +
    "<ul class='instructions'>" +
    "<li><strong>Move toward " + group_to_approach_3_en + " by pressing the upward arrow key </strong></li>" +
    "<strong>  </strong>" +
    "<li><strong>Move away from " + group_to_avoid_3_en + " by pressing the downward arrow key </strong></li>" +
    "<strong> </strong>" +
    "</ul>" +
    "<strong> EXTREMELY IMPORTANT: respond as fast and as correctly as possible! <br><br></strong>" +
    "<br>" +
    "<p class = 'continue-instructions'>Press <strong>space</strong> to" +
    " continue.</p>",
  choices: [32]
};

var vaast_instructions_6_fr = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche du Jeu Vidéo - Section 3/4</h1>" +
    "<p class='instructions'>Attention ! Les instructions changent. Maintenant, vous devez : " +
    "<ul class='instructions'>" +
    "<li><strong>Aller vers les " + group_to_approach_3_fr + " en appuyant sur la flèche du haut </strong></li>" +
    "<strong>  </strong>" +
    "<li><strong>Vous éloigner des " + group_to_avoid_3_fr + " en appuyant sur la flèche du bas </strong></li>" +
    "<strong> </strong>" +
    "</ul>" +
    "<strong> EXTRÊMEMENT IMPORTANT : répondez aussi rapidement et correctement que possible ! <br><br></strong>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
  choices: [32]
};



var vaast_instructions_7_en = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Video Game task - Section 4/4</h1>" +
    "<p class='instructions'>Warning! Instructions are changing. Now, you have to: " +
    "<ul class='instructions'>" +
    "<li><strong>Move toward " + group_to_approach_4_en + " by pressing the upward arrow key </strong></li>" +
    "<strong>  </strong>" +
    "<li><strong>Move away from " + group_to_avoid_4_en + " by pressing the downward arrow key </strong></li>" +
    "<strong> </strong>" +
    "</ul>" +
    "<strong> EXTREMELY IMPORTANT: respond as fast and as correctly as possible! <br><br></strong>" +
    "<br>" +
    "<p class = 'continue-instructions'>Press <strong>space</strong> to" +
    " continue.</p>",
  choices: [32]
};


var vaast_instructions_7_fr = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche du Jeu Vidéo - Section 4/4</h1>" +
    "<p class='instructions'>Attention ! Les instructions changent. Maintenant, vous devez : " +
    "<ul class='instructions'>" +
    "<li><strong>Aller vers les " + group_to_approach_4_fr + " en appuyant sur la flèche du haut </strong></li>" +
    "<strong>  </strong>" +
    "<li><strong>Vous éloigner des " + group_to_avoid_4_fr + " en appuyant sur la flèche du bas </strong></li>" +
    "<strong> </strong>" +
    "</ul>" +
    "<strong> EXTRÊMEMENT IMPORTANT : répondez aussi rapidement et correctement que possible ! <br><br></strong>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
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
var NUMBEROFREPETITIONS_TRAINING_BLOCK_1 = 1;
var vaast_training_block_1 = {
  timeline: [
    //vaast_start,
    vaast_fixation,
    vaast_first_step_training_1,
    vaast_second_step_training_1,
    save_vaast_trial
  ],
  timeline_variables: vaast_stim_training,
  repetitions: NUMBEROFREPETITIONS_TRAINING_BLOCK_1, //here, put 2
  randomize_order: true,
  data: {
    phase:    "training",
    stimulus: jsPsych.timelineVariable('stimulus'),
    movement: jsPsych.timelineVariable('movement_1'),
    group:   jsPsych.timelineVariable('group'),
  },
  // Note: you need to multiply by 2, because there are two examples for every repetition
  on_finish: function(data) { updateFeedback(2 * NUMBEROFREPETITIONS_TRAINING_BLOCK_1); }
};

var NUMBEROFREPETITIONS_TEST_BLOCK_1 = 1;
var vaast_test_block_1 = {
  timeline: [
    //vaast_start,
    vaast_fixation,
    vaast_first_step_training_1,
    vaast_second_step_training_1,
    save_vaast_trial
  ],
  timeline_variables: sample_n(vaast_stim, 2),
  //repetitions: NUMBEROFREPETITIONS_TEST_BLOCK_1,  //here, put 2
  randomize_order: true,
  data: {
    phase:    "test",
    stimulus: jsPsych.timelineVariable('stimulus'),
    movement: jsPsych.timelineVariable('movement_1'),
    group:   jsPsych.timelineVariable('group'),
  },
  // I'm not sure, I'm using NUMBEROFREPETITIONS_TEST_BLOCK_1 correctly here, but I'm sure you can verify.
  on_finish: function(data) { updateFeedback(2 * NUMBEROFREPETITIONS_TEST_BLOCK_1); }
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
  timeline_variables: sample_n(vaast_stim, 2),
  //repetitions: 1,  //here, put 2
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
  timeline_variables: sample_n(vaast_stim, 2),
  //repetitions: 1,  //here, put 2
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
  timeline_variables: sample_n(vaast_stim, 2),
  //repetitions: 1,  //here, put 2
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

  var extra_information_en = {
    type: 'html-keyboard-response',
    stimulus:
      "<p class='instructions'>The study is almost finished. Now, you have to answer a few questions.</p>" +
      "<p class='continue-instructions'>Press <strong>space</strong> to continue.</p>",
    choices: [32]
  };

  var extra_information_fr = {
    type: 'html-keyboard-response',
    stimulus:
      "<p class='instructions'>Cette étude est presque terminée. Vous allez maintenant devoir répondre à quelques questions.</p>" +
      "<p class='continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer.</p>",
    choices: [32]
  };


  var extra_information_2_en = {
    timeline: [{
      type: 'survey-text',
      questions: [{prompt: "What is your age?"}],
      button_label: "OK",
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
 
 var extra_information_2_fr = {
    timeline: [{
      type: 'survey-text',
      questions: [{prompt: "Quel est votre âge ?"}],
      button_label: "OK",
    }],
    loop_function: function(data) {
      var extra_information_2 = data.values()[0].responses;
      var extra_information_2 = JSON.parse(extra_information_2).Q0;
      if (extra_information_2 == "") {
        alert("Veuillez indiquer votre âge !");
        return true;
      }
    },
    on_finish: function(data) {
      jsPsych.data.addProperties({
        extra_information_2: JSON.parse(data.responses)["Q0"],
      });
    }
  }


  var extra_information_3_en = {
    type: 'survey-multi-choice',
    questions: [{prompt: "What is your gender?", options: ["&nbspMale", "&nbspFemale", "&nbspOther"], required: true, horizontal: true}],
    button_label: "OK"
  }

  var extra_information_3_fr = {
    type: 'survey-multi-choice',
    questions: [{prompt: "Quel est votre genre ?", options: ["&nbspHomme", "&nbspFemme", "&nbspAutre"], required: true, horizontal: true}],
    button_label: "OK"
  }


  var extra_information_4_en = {
    type: 'survey-multi-choice',
    questions: [{prompt: "How well do you speak english?",
                 options: ["&nbspFluently", "&nbspVery good", "&nbspGood", "&nbspAverage", "&nbspBad", "&nbspVery bad"],
                 required: true, horizontal: false}],
    button_label: "OK"
  }

  var extra_information_4_fr = {
    type: 'survey-multi-choice',
    questions: [{prompt: "Dans quelle mesure parlez-vous bien français ?",
                 options: ["&nbspLangue maternelle", "&nbspTrès bien", "&nbspBien", "&nbspMoyennement", "&nbspMal", "&nbspTrès mal"],
                 required: true, horizontal: false}],
    button_label: "OK"
  }

  var extra_information_5_en = {
    type: 'survey-multi-choice',
    questions: [{prompt: "What is your socioeconomic status?",
                 options: ["&nbspVery low", "&nbspLow", "&nbspMedium", "&nbspHigh", "&nbspVery high"],
                 required: true, horizontal: false}],
    button_label: "OK"
  }

  var extra_information_5_fr = {
    type: 'survey-multi-choice',
    questions: [{prompt: "Quel est votre statut socio-économique ?",
                 options: ["&nbspTrès bas", "&nbspBas", "&nbspMoyen", "&nbspHaut", "&nbspTrès haut"],
                 required: true, horizontal: false}],
    button_label: "OK"
  }

  var extra_information_6_en = {
    type: 'survey-multi-choice',
    questions: [{prompt: "What is your highest level of education?",
                 options: ["&nbspDid not complete high school", "&nbspHigh school/GED", "&nbspSome college", "&nbspBachelor's degree", "&nbspMaster's degree", "&nbspAdvanced graduate work or Ph.D."],
                 required: true, horizontal: false}],
    button_label: "OK"
  }

  var extra_information_6_fr = {
    type: 'survey-multi-choice',
    questions: [{prompt: "Quel est votre niveau d'études ?",
                 options: ["&nbspEn dessous du baccalauréat", "&nbspBaccalauréat (obtenu)", "&nbspEn dessous de la licence universitaire", "&nbspLicence universitaire (obtenue)", "&nbspMaster (obtenu)", "&nbspDoctorat (obtenu)"],
                 required: true, horizontal: false}],
    button_label: "OK"
  }

  var extra_information_7_en = {
    type: 'survey-text',
    questions: [{prompt: "Do you have any remarks about this study? [Optional]"}],
    button_label: "OK"
  }

  var extra_information_7_fr = {
    type: 'survey-text',
    questions: [{prompt: "Avez-vous des remarques concernant cette étude ? [Optionnel]"}],
    button_label: "OK"
  }


  // end insctruction ---------------------------------------------------------------------

  var ending_en = {
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

  var ending_fr = {
    type: "html-keyboard-response",
    stimulus:
      "<p class='instructions'>Vous avez terminé cette étude.<p>" +
      "<p class='instructions'>Dans cette étude, notre but était de mesurer les " +
      "tendances comportementales d'approche et d'évitement. Spécifiquement, nous voulons tester si le confinement dû au coronavirus " +
      "influence les tendances comportementales d'approche envers autrui (en comparaison aux plantes). Effectivement, on pourrait s'attendre à ce que l'habitude que nous prenons à éviter autrui </p>" +
      "<p class='instructions'>devienne automatique et s'ancre dans nos tendances comportementales. Au contraire, une autre possibilité est que les personnes deviennent très motivées " +
      "à approcher autrui parce qu'elles se sentent seules. </p>" +
      "<p class='instructions'>Pour plus d'informations à ce sujet, envoyez-nous un email : " +
      "marine.rougier@uclouvain.be</p>" +
      "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour VALIDER votre participation.</p>",
    choices: [32]
  };

  var feedback_en = {
    type: "html-keyboard-response",
    on_load: function() {
      document.getElementById('FeedbackMeanReactionTime').innerHTML = FeedbackMeanReactionTime;
      document.getElementById('FeedbackNumberOfCorrectRespones').innerHTML = FeedbackNumberOfCorrectResponses;
      document.getElementById('FeedbackNumberOfTotalRespones').innerHTML = FeedbackNumberOfCorrectResponses + FeedbackNumberOfWrongResponses;
    },
    stimulus:
      "<p class='instructions'>" + 
      "Mean Reaction Time: <span id='FeedbackMeanReactionTime'></span> milli seconds" +
      "</p><p class='instructions'>" +
      "You reacted <span id='FeedbackNumberOfCorrectRespones'></span> of " +
      "<span id='FeedbackNumberOfTotalRespones'></span> times correctly." +
      "</p>" +
      "<p class = 'continue-instructions'>Press <strong>space</strong> to continue</p>",
    choices: [32]
  };

// procedure ----------------------------------------------------------------------------
// Initialize timeline ------------------------------------------------------------------

var timeline = [];

// fullscreen
//timeline.push(language,
//              language_2);

// prolific verification
timeline.push(save_id);


timeline.push(

  welcome_en,
  fullscreen_trial_en,
  hiding_cursor,
  vaast_instructions_1_en,
  vaast_instructions_2_en,
  vaast_instructions_4_en,
  vaast_training_block_1,
  feedback_en,
  vaast_test_block_1,
  feedback_en,
  /*
  vaast_instructions_5_en,
  vaast_training_block_2,
  vaast_test_block_2,
  vaast_instructions_6_en,
  vaast_test_block_3,
  vaast_instructions_7_en,
  vaast_test_block_4,
  showing_cursor,
  fullscreen_trial_exit,
  extra_information_en,
  extra_information_2_en,
  extra_information_3_en,
  extra_information_4_en,
  extra_information_5_en,
  extra_information_6_en,
  extra_information_7_en,
  save_extra,
  */
  ending_en
);

// Launch experiment --------------------------------------------------------------------
// preloading ---------------------------------------------------------------------------
// Preloading. For some reason, it appears auto-preloading fails, so using it manually.
// In principle, it should have ended when participants starts VAAST procedure (which)
// contains most of the image that have to be pre-loaded.
var loading_gif               = ["media/loading.gif"]
var vaast_instructions_images = ["media/UHH.png",
                                 "media/UCL.jpg",
                                 "media/UR.png",
                                 "media/vaast-background.png", 
                                 "media/keyboard-vaastt_en.png", 
                                 "media/keyboard-vaastt_fr.png"];
var vaast_bg_filename         = background;

jsPsych.pluginAPI.preloadImages(loading_gif);
jsPsych.pluginAPI.preloadImages(vaast_instructions_images);
jsPsych.pluginAPI.preloadImages(vaast_bg_filename);

// timeline initiaization ---------------------------------------------------------------

if(is_compatible) {
  jsPsych.init({
    timeline: timeline,
    preload_images: preloadimages,
    max_load_time: 1000 * 500,
    exclusions: {
      min_width: 800,
      min_height: 600,
    },
    on_interaction_data_update: function () {
      saving_browser_events(completion = false);
    },
    on_finish: function() {
        saving_browser_events(completion = true);
        jsPsych.data.addProperties({
        vaast_first_block: vaast_first_block,
        });
        //window.location.href = "https://google.com";
    }
  });
}


