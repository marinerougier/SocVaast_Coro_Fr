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
        "<p>Cette étude n'est pas compatible avec votre moteur de recherche.</p>" +
        "<p>Essayez de nouveau avec un moteur de recherche compatible (p. ex. Google Chrome ou Firefox).</p>",
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
  var prolificID = jsPsych.data.getURLVariable("prolificID");
  if(prolificID == null) {prolificID = "999";}
  var jspsych_id  = jsPsych.data.getURLVariable("jspsych_id");
  if(jspsych_id == null) {jspsych_id = "999";}

  // Preload images
  var preloadimages = [];

  // connection status ---------------------------------------------------------------------
  // This section ensure that we don't lose data. Anytime the 
  // client is disconnected, an alert appears onscreen
  var connectedRef = firebase.database().ref(".info/connected");
  var connection   = firebase.database().ref("VAAST_3appuis_EC/" + jspsych_id + "/")
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

var vaast_condition_approach = jsPsych.randomization.sampleWithoutReplacement(["approach_blue", "approach_yellow"], 1)[0];var ColorGroup   = jsPsych.randomization.sampleWithoutReplacement(["G1Y", "G1B"], 1)[0];

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
      "stimuli/Face19_B.png",
      "stimuli/Face28_B.png",
      "stimuli/Face55_B.png",
      "stimuli/Face95_B.png",
      "stimuli/Face104_B.png",
      "stimuli/Face115_B.png",
      "stimuli/Face119_B.png",
      "stimuli/Face142_B.png",
      "stimuli/Face10_J.png",
      "stimuli/Face16_J.png",
      "stimuli/Face17_J.png",
      "stimuli/Face45_J.png",
      "stimuli/Face85_J.png",
      "stimuli/Face103_J.png",
      "stimuli/Face116_J.png",
      "stimuli/Face132_J.png",
      "stimuli/Face19_J.png",
      "stimuli/Face28_J.png",
      "stimuli/Face55_J.png",
      "stimuli/Face95_J.png",
      "stimuli/Face104_J.png",
      "stimuli/Face115_J.png",
      "stimuli/Face119_J.png",
      "stimuli/Face142_J.png",
      "stimuli/Face10_B.png",
      "stimuli/Face16_B.png",
      "stimuli/Face17_B.png",
      "stimuli/Face45_B.png",
      "stimuli/Face85_B.png",
      "stimuli/Face103_B.png",
      "stimuli/Face116_B.png",
      "stimuli/Face119_B_Example.png",
      "stimuli/Face95_J_Example.png"
  ];

 preloadimages.push(faces);

// VAAST --------------------------------------------------------------------------------
// VAAST variables ----------------------------------------------------------------------
// On duplique chacune des variable pour correspondre au bloc 1 et au bloc 2 !

var movement_blue_1    = undefined;
var movement_yellow_1    = undefined;
var group_to_approach_1 = undefined;
var group_to_avoid_1    = undefined;
var movement_blue_2    = undefined;
var movement_yellow_2    = undefined;
var group_to_approach_2 = undefined;
var group_to_avoid_2    = undefined;


switch(vaast_condition_approach) {
  case "approach_blue":
    movement_blue_1    = "approach";
    movement_yellow_1    = "avoidance";
    group_to_approach_1 = "bleu";
    group_to_avoid_1    = "jaune";
    movement_blue_2    = "avoidance";
    movement_yellow_2    = "approach";
    group_to_approach_2 = "jaune";
    group_to_avoid_2    = "bleu";
    break;

  case "approach_yellow":
    movement_blue_1    = "avoidance";
    movement_yellow_1    = "approach";
    group_to_approach_1 = "jaune";
    group_to_avoid_1    = "bleu";
    movement_blue_2    = "approach";
    movement_yellow_2    = "avoidance";
    group_to_approach_2 = "bleu";
    group_to_avoid_2    = "jaune";
    break;
}



// VAAST stimuli ------------------------------------------------------------------------
// vaast image stimuli ------------------------------------------------------------------

var vaast_stim_training_G1Y = [
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "bleu", stimulus: "stimuli/Face19_B.png"},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "bleu", stimulus: "stimuli/Face19_B.png"},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2,  group: "jaune",  stimulus: "stimuli/Face10_J.png"},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2,  group: "jaune",  stimulus: "stimuli/Face10_J.png"}
]

var vaast_stim_G1Y = [
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "bleu", stimulus: 'stimuli/Face19_B.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "bleu", stimulus: 'stimuli/Face28_B.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "bleu", stimulus: 'stimuli/Face55_B.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "bleu", stimulus: 'stimuli/Face95_B.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "bleu", stimulus: 'stimuli/Face104_B.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "bleu", stimulus: 'stimuli/Face115_B.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "bleu", stimulus: 'stimuli/Face119_B.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "bleu", stimulus: 'stimuli/Face142_B.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2, group: "jaune",  stimulus: 'stimuli/Face10_J.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2, group: "jaune",  stimulus: 'stimuli/Face16_J.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2, group: "jaune",  stimulus: 'stimuli/Face17_J.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2, group: "jaune",  stimulus: 'stimuli/Face45_J.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2, group: "jaune",  stimulus: 'stimuli/Face85_J.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2, group: "jaune",  stimulus: 'stimuli/Face103_J.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2, group: "jaune",  stimulus: 'stimuli/Face116_J.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2, group: "jaune",  stimulus: 'stimuli/Face132_J.png'},

];

var vaast_stim_training_G1B = [
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2, group: "jaune", stimulus: "stimuli/Face10_J.png"},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2, group: "jaune", stimulus: "stimuli/Face10_J.png"},
  {movement_1: movement_blue_1, movement_2: movement_blue_2,  group: "bleu",  stimulus: "stimuli/Face19_B.png"},
  {movement_1: movement_blue_1, movement_2: movement_blue_2,  group: "bleu",  stimulus: "stimuli/Face19_B.png"}
]

var vaast_stim_G1B = [
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2, group: "jaune", stimulus: 'stimuli/Face19_J.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2, group: "jaune", stimulus: 'stimuli/Face28_J.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2, group: "jaune", stimulus: 'stimuli/Face55_J.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2, group: "jaune", stimulus: 'stimuli/Face95_J.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2, group: "jaune", stimulus: 'stimuli/Face104_J.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2, group: "jaune", stimulus: 'stimuli/Face115_J.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2, group: "jaune", stimulus: 'stimuli/Face119_J.png'},
  {movement_1: movement_yellow_1, movement_2: movement_yellow_2, group: "jaune", stimulus: 'stimuli/Face142_J.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "bleu",  stimulus: 'stimuli/Face10_B.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "bleu",  stimulus: 'stimuli/Face16_B.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "bleu",  stimulus: 'stimuli/Face17_B.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "bleu",  stimulus: 'stimuli/Face45_B.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "bleu",  stimulus: 'stimuli/Face85_B.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "bleu",  stimulus: 'stimuli/Face103_B.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "bleu",  stimulus: 'stimuli/Face116_B.png'},
  {movement_1: movement_blue_1, movement_2: movement_blue_2, group: "bleu",  stimulus: 'stimuli/Face132_B.png'},

];


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
        .ref("participant_id_3appuis_EC/")
        .push()
        .set({jspsych_id: jspsych_id,
               prolificID: prolificID,
               ApproachedColor: vaast_condition_approach,
               ColorGroup: ColorGroup,
               timestamp: firebase.database.ServerValue.TIMESTAMP})
  }

// vaast trial --------------------------------------------------------------------------
  var saving_vaast_trial = function(){
    database
      .ref("vaast_trial_3appuis_EC/").
      push()
        .set({jspsych_id: jspsych_id,
          prolificID: prolificID,
          ApproachedColor: vaast_condition_approach,
          ColorGroup: ColorGroup,
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          vaast_trial_data: jsPsych.data.get().last(4).json()})
  }


// demographic logging ------------------------------------------------------------------

  var saving_browser_events = function(completion) {
    database
     .ref("browser_event_3appuis_EC/")
     .push()
     .set({jspsych_id: jspsych_id,
      prolificID: prolificID,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      ApproachedColor: vaast_condition_approach,
      ColorGroup: ColorGroup,
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
      "<h1 class ='custom-title'> Bienvenue </h1>" +
      "<ul class='instructions'>" +
      "Dans cette étude, vous devrez <b>compléter une tâche de catégorisation</b>. Notez que nous " +
      "n'enregistrerons aucune donnée permettant de vous identifier et que vous pouvez quitter l'expérience " +
      "à tout moment. A la fin de l'expérience, vous serez rétribué.e conformément à ce qui a été annoncé. " +
      "<b>Si vous commencez cette étude, cela signifie que vous donnez votre consentement éclairé pour celle-ci. </b>" +
      "<br>" + 
      "<br>" +
      "<p class = 'continue-instructions'>Press <strong>space</strong> to start the study.</p>",
    choices: [32]
  };


// Switching to fullscreen --------------------------------------------------------------
var fullscreen_trial = {
  type: 'fullscreen',
  message:  'Pour commencer cette étude, merci de vous mettre en mode plein écran. </br></br>',
  button_label: 'Passer au plein écran',
  fullscreen_mode: true
}


// VAAST --------------------------------------------------------------------------------

var vaast_instructions_1 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'>Tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Dans cette tâche, un peu comme dans un jeu vidéo, vous " +
    "serez dans un environnement dans lequel vous pourrez avancer ou reculer." +
   "<p class='instructions'> L'environnement dans lequel vous pourrez vous déplacer est présenté ci-dessous.</p>" +
    "<br>" +
    "<img src = 'media/vaast-background.png'>" +
    "<br>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
  choices: [32]
};

var vaast_instructions_2 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'>Tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Une série de visages va apparaître dans cet environnement. Ces visages peuvent soit faire partie du groupe des bleu soit du groupe des jaunes. " +
    "Voici deux exemples de visages qui vous seront présentés :</p>" +
    "<br>" +
    "<img src = 'stimuli/Face119_B_Example.png'>" +
    "                              " +
    "<img src = 'stimuli/Face95_J_Example.png'>" +
    "<br>" +
    "<br>" +
    "<p class='instructions'>Comme vous pouvez le constater, ces visages ont été délibérément floutés afin de conserver leur anonymat. </p>"+
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
  choices: [32]
};

var vaast_instructions_conflit = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'>Tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Il est très important de noter que vous ne faites pas partie du groupe des bleu ou des jaunes. "+
    "Vous, au contraire, faites partie du groupe des verts. Il se trouve que le groupe des verts est en conflit avec le groupe des bleu et le groupe des jaunes. "+
    "</p>" +
    "<br>" +
    "<img src = 'stimuli/Face119_B_Example.png'>" +
    "                              " +
    "<img src = 'stimuli/Face95_J_Example.png'>" +
    "<br>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
  choices: [32]
};

var vaast_instructions_2_bis = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'>Tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Votre tâche consistera à catégoriser ces visages (en avancant ou en reculant) sur la base de leur groupe " +
    "(bleu ou jaune). Vous pourrez vous déplacer dans l'environnement en utlisant les touches suivantes de votre clavier :"+
    "<br>" +
    "<br>" +
    "<img src = 'media/touches_Fr.png'>" +
    "<br>" +
    "<br>" +
    "Des instructions plus spécifiques vont suivre.</p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
  choices: [32]
};

var vaast_instructions_3 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'>Tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Au début de chaque essai, vous verrez le symbole 'O'. " +
    "Ce symbole indique que vous devez appuyer sur la touche <b>DEPART</b> (la <b>touche H</b>) pour commencer l'essai. </p>" +
    "<p class='instructions'>Vous allez alors voir apparaître au centre de l'écran une croix de fixation (+), suivie d'un visage. </p>" +
    "<p class='instructions'>En fonction du groupe d'appartenance de ce visage, votre tâche sera d'avancer ou de reculer en appuyant <b>trois fois</b>, aussi vite que possible, " +
    "la touche <b>AVANCER</b> (la <b>touche Y</b>) ou la touche <b>RECULER</b> (la <b>touche N</b>). Après ces trois appuis, le visage disparaîtra et vous devrez "+
    "appuyer de nouveau sur la touche DEPART (la touche H). " +
    "<p class='instructions'>Merci d'utiliser uniquement l'index de votre main dominante pour toutes ces actions. </p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
  choices: [32]
};


var vaast_instructions_4 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche du Jeu Vidéo - Partie 1 </h1>" +
    "<p class='instructions'>Dans cette première partie, vous devez : " +
    "<ul class='instructions'>" +
    "<li>" +
    "<strong>ALLER VERS les visages appartenant au groupe " + group_to_approach_1 + "</strong></li>" +
    "<strong>en appuyant sur la touche AVANCER (touche Y) </strong>" +
    "</li>" +
    "<p class='instructions'> </p>" +
    "<li>" + 
    "<strong>VOUS ELOIGNER des visages appartenant au groupe " + group_to_avoid_1 + "</strong></li>" +
    "<strong>en appuyant sur la touche RECULER (touche N)</strong>" +
    "</li>" + 
    "</ul>" +
    "<p class='instructions'>Merci de lire attentivement et de mémoriser ces instructions. </p>" +
    "<p class='instructions'><strong>Aussi, notez qu'il est EXTREMEMENT IMPORTANT d'essayer de répondre le plus rapidement et le plus exactement possible. </strong>" +
    "Une croix rouge apparaîtra en cas de réponse incorrecte. </p>" +
    "<br>" +
    "<p class ='instructions'>Vous allez maintenant commencer par une courte phase d'entrainement.</p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>entrée</strong> pour" +
    " continuer.</p>",
  choices: [13]
};

var vaast_instructions_5 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche du Jeu Vidéo - Partie 1 </h1>" +
    "<p class='instructions'>L'entrainement est maintenant terminé. </p>" +
    "<p class='instructions'>N'oubliez pas que vous devez :</p>" +
    "<ul class='instructions'>" +
    "<li>" +
    "<strong>ALLER VERS les visages appartenant au groupe " + group_to_approach_1 + "</strong></li>" +
    "<strong>en appuyant sur la touche AVANCER (touche Y) </strong>" +
    "</li>" +
    "<p class='instructions'> </p>" +
    "<li>" + 
    "<strong>VOUS ELOIGNER des visages appartenant au groupe " + group_to_avoid_1 + "</strong></li>" +
    "<strong>en appuyant sur la touche RECULER (touche N)</strong>" +
    "</li>" + 
    "</ul>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
  choices: [32]
};

var vaast_instructions_6 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche du Jeu Vidéo - Partie 2 </h1>" +
    "<p class='instructions'>Dans cette deuxième partie, les instructions changent. Vous devez maintenant : " +
    "<ul class='instructions'>" +
    "<li>" +
    "<strong>ALLER VERS les visages appartenant au groupe " + group_to_approach_2 + "</strong></li>" +
    "<strong>en appuyant sur la touche AVANCER (touche Y) </strong>" +
    "</li>" +
    "<p class='instructions'> </p>" +
    "<li>" + 
    "<strong>VOUS ELOIGNER des visages appartenant au groupe " + group_to_avoid_2 + "</strong></li>" +
    "<strong>en appuyant sur la touche RECULER (touche N)</strong>" +
    "</li>" + 
    "</ul>" +
    "<p class='instructions'>Merci de lire attentivement et de mémoriser ces instructions. </p>" +
    "<p class='instructions'><strong>Aussi, notez qu'il est EXTREMEMENT IMPORTANT d'essayer de répondre le plus rapidement et le plus exactement possible. </strong>" +
    "Une croix rouge apparaîtra en cas de réponse incorrecte. </p>" +
    "<br>" +
    "<p class ='instructions'>Vous allez maintenant commencer par une courte phase d'entrainement.</p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>entrée</strong> pour" +
    " continuer.</p>",
  choices: [13]
};

var vaast_instructions_7 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche du Jeu Vidéo - Partie 2 </h1>" +
    "<p class='instructions'>L'entrainement est maintenant terminé. </p>" +
    "<p class='instructions'>N'oubliez pas que vous devez :</p>" +
    "<ul class='instructions'>" +
    "<li>" +
    "<strong>ALLER VERS les visages appartenant au groupe " + group_to_approach_2 + "</strong></li>" +
    "<strong>en appuyant sur la touche AVANCER (touche Y) </strong>" +
    "</li>" +
    "<p class='instructions'> </p>" +
    "<li>" + 
    "<strong>VOUS ELOIGNER des visages appartenant au groupe " + group_to_avoid_2 + "</strong></li>" +
    "<strong>en appuyant sur la touche RECULER (touche N)</strong>" +
    "</li>" + 
    "</ul>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
  choices: [32]
};

var vaast_instructions_end = {
  type: "html-keyboard-response",
  stimulus:
    "La tâche du Jeu Vidéo est terminée." +
    "<br>" +
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
  position: 3,
  background_images: background,
  font_sizes:  stim_sizes,
  approach_key: "h",
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

var vaast_first_step_training_1 = {
  type: 'vaast-image',
  stimulus: jsPsych.timelineVariable('stimulus'),
  position: 3,
  background_images: background,
  font_sizes:  image_sizes,
  approach_key: "y",
  avoidance_key: "n",
  stim_movement: jsPsych.timelineVariable('movement_1'),
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: false,
  display_feedback: true,
  feedback_duration: 500, 
  response_ends_trial: true
}

var vaast_second_step_1 = {
  type: 'vaast-image',
  stimulus: jsPsych.timelineVariable('stimulus'),
  position: next_position_training,
  background_images: background,
  font_sizes:  image_sizes,
  approach_key: "y",
  avoidance_key: "n",
  stim_movement: jsPsych.timelineVariable('movement_1'),
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: false,
  display_feedback: true,
  feedback_duration: 500, 
  response_ends_trial: true
}

var vaast_second_step_training_1 = {
  chunk_type: "if",
  timeline: [vaast_second_step_1],
  conditional_function: function(){
    var data = jsPsych.data.getLastTrialData().values()[0];
    return data.correct;
  }
}

var vaast_third_step_1 = {
  type: 'vaast-image',
  stimulus: jsPsych.timelineVariable('stimulus'),
  position: next_position_training,
  background_images: background,
  font_sizes:  image_sizes,
  approach_key: "y",
  avoidance_key: "n",
  stim_movement: jsPsych.timelineVariable('movement_1'),
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: false,
  display_feedback: true,
  feedback_duration: 500, 
  response_ends_trial: true
}

var vaast_third_step_training_1 = {
  chunk_type: "if",
  timeline: [vaast_third_step_1],
  conditional_function: function(){
    var data = jsPsych.data.getLastTrialData().values()[0];
    return data.correct;
  }
}

var vaast_fourth_step_1 = {
  type: 'vaast-image',
  position: next_position_training,
  stimulus: jsPsych.timelineVariable('stimulus'),
  background_images: background,
  font_sizes:  image_sizes,
  stim_movement: jsPsych.timelineVariable('movement_1'),
  response_ends_trial: false,
  trial_duration: 650
}

var vaast_fourth_step_training_1 = {
  chunk_type: "if",
  timeline: [vaast_fourth_step_1],
  conditional_function: function(){
    var data = jsPsych.data.getLastTrialData().values()[0];
    return data.correct;
  }
}

var vaast_first_step_training_2 = {
  type: 'vaast-image',
  stimulus: jsPsych.timelineVariable('stimulus'),
  position: 3,
  background_images: background,
  font_sizes:  image_sizes,
  approach_key: "y",
  avoidance_key: "n",
  stim_movement: jsPsych.timelineVariable('movement_2'),
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: false,
  display_feedback: true,
  feedback_duration: 500, 
  response_ends_trial: true
}

var vaast_second_step_2 = {
  type: 'vaast-image',
  stimulus: jsPsych.timelineVariable('stimulus'),
  position: next_position_training,
  background_images: background,
  font_sizes:  image_sizes,
  approach_key: "y",
  avoidance_key: "n",
  stim_movement: jsPsych.timelineVariable('movement_2'),
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: false,
  display_feedback: true,
  feedback_duration: 500, 
  response_ends_trial: true
}

var vaast_second_step_training_2 = {
  chunk_type: "if",
  timeline: [vaast_second_step_2],
  conditional_function: function(){
    var data = jsPsych.data.getLastTrialData().values()[0];
    return data.correct;
  }
}

var vaast_third_step_2 = {
  type: 'vaast-image',
  stimulus: jsPsych.timelineVariable('stimulus'),
  position: next_position_training,
  background_images: background,
  font_sizes:  image_sizes,
  approach_key: "y",
  avoidance_key: "n",
  stim_movement: jsPsych.timelineVariable('movement_2'),
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: false,
  display_feedback: true,
  feedback_duration: 500, 
  response_ends_trial: true
}

var vaast_third_step_training_2 = {
  chunk_type: "if",
  timeline: [vaast_third_step_2],
  conditional_function: function(){
    var data = jsPsych.data.getLastTrialData().values()[0];
    return data.correct;
  }
}

var vaast_fourth_step_2 = {
  type: 'vaast-image',
  position: next_position_training,
  stimulus: jsPsych.timelineVariable('stimulus'),
  background_images: background,
  font_sizes:  image_sizes,
  stim_movement: jsPsych.timelineVariable('movement_2'),
  response_ends_trial: false,
  trial_duration: 650
}

var vaast_fourth_step_training_2 = {
  chunk_type: "if",
  timeline: [vaast_fourth_step_2],
  conditional_function: function(){
    var data = jsPsych.data.getLastTrialData().values()[0];
    return data.correct;
  }
}



// VAAST training block -----------------------------------------------------------------

var vaast_training_block_1_G1Y = {
  timeline: [
    vaast_start,
    vaast_fixation,
    vaast_first_step_training_1,
    vaast_second_step_training_1,
    vaast_third_step_training_1,
    vaast_fourth_step_training_1,
    save_vaast_trial
  ],
  timeline_variables: vaast_stim_training_G1Y,
  repetitions: 1, //here, put 12 for 192 trials
  randomize_order: true,
  data: {
    phase:    "training",
    stimulus: jsPsych.timelineVariable('stimulus'),
    movement: jsPsych.timelineVariable('movement_1'),
    group:   jsPsych.timelineVariable('group'),
  }
};

var vaast_test_block_1_G1Y = {
  timeline: [
    vaast_start,
    vaast_fixation,
    vaast_first_step_training_1,
    vaast_second_step_training_1,
    vaast_third_step_training_1,
    vaast_fourth_step_training_1,
    save_vaast_trial
  ],
  timeline_variables: vaast_stim_G1Y,
  repetitions: 1, //here, put 12 for 192 trials
  randomize_order: true,
  data: {
    phase:    "test",
    stimulus: jsPsych.timelineVariable('stimulus'),
    movement: jsPsych.timelineVariable('movement_1'),
    group:   jsPsych.timelineVariable('group'),
  }
};

var vaast_training_block_2_G1Y = {
  timeline: [
    vaast_start,
    vaast_fixation,
    vaast_first_step_training_2,
    vaast_second_step_training_2,
    vaast_third_step_training_2,
    vaast_fourth_step_training_2,
    save_vaast_trial
  ],
  timeline_variables: vaast_stim_training_G1Y,
  repetitions: 1, //here, put 12 for 192 trials
  randomize_order: true,
  data: {
    phase:    "training",
    stimulus: jsPsych.timelineVariable('stimulus'),
    movement: jsPsych.timelineVariable('movement_2'),
    group:   jsPsych.timelineVariable('group'),
  }
};

var vaast_test_block_2_G1Y = {
  timeline: [
    vaast_start,
    vaast_fixation,
    vaast_first_step_training_2,
    vaast_second_step_training_2,
    vaast_third_step_training_2,
    vaast_fourth_step_training_2,
    save_vaast_trial
  ],
  timeline_variables: vaast_stim_G1Y,
  repetitions: 1, //here, put 12 for 192 trials
  randomize_order: true,
  data: {
    phase:    "test",
    stimulus: jsPsych.timelineVariable('stimulus'),
    movement: jsPsych.timelineVariable('movement_2'),
    group:   jsPsych.timelineVariable('group'),
  }
};


var vaast_training_block_1_G1B = {
  timeline: [
    vaast_start,
    vaast_fixation,
    vaast_first_step_training_1,
    vaast_second_step_training_1,
    vaast_third_step_training_1,
    vaast_fourth_step_training_1,
    save_vaast_trial
  ],
  timeline_variables: vaast_stim_training_G1B,
  repetitions: 1, //here, put 12 for 192 trials
  randomize_order: true,
  data: {
    phase:    "training",
    stimulus: jsPsych.timelineVariable('stimulus'),
    movement: jsPsych.timelineVariable('movement_1'),
    group:   jsPsych.timelineVariable('group'),
  }
};

var vaast_test_block_1_G1B = {
  timeline: [
    vaast_start,
    vaast_fixation,
    vaast_first_step_training_1,
    vaast_second_step_training_1,
    vaast_third_step_training_1,
    vaast_fourth_step_training_1,
    save_vaast_trial
  ],
  timeline_variables: vaast_stim_G1B,
  repetitions: 1, //here, put 12 for 192 trials
  randomize_order: true,
  data: {
    phase:    "test",
    stimulus: jsPsych.timelineVariable('stimulus'),
    movement: jsPsych.timelineVariable('movement_1'),
    group:   jsPsych.timelineVariable('group'),
  }
};

var vaast_training_block_2_G1B = {
  timeline: [
    vaast_start,
    vaast_fixation,
    vaast_first_step_training_2,
    vaast_second_step_training_2,
    vaast_third_step_training_2,
    vaast_fourth_step_training_2,
    save_vaast_trial
  ],
  timeline_variables: vaast_stim_training_G1B,
  repetitions: 1, //here, put 12 for 192 trials
  randomize_order: true,
  data: {
    phase:    "training",
    stimulus: jsPsych.timelineVariable('stimulus'),
    movement: jsPsych.timelineVariable('movement_2'),
    group:   jsPsych.timelineVariable('group'),
  }
};

var vaast_test_block_2_G1B = {
  timeline: [
    vaast_start,
    vaast_fixation,
    vaast_first_step_training_2,
    vaast_second_step_training_2,
    vaast_third_step_training_2,
    vaast_fourth_step_training_2,
    save_vaast_trial
  ],
  timeline_variables: vaast_stim_G1B,
  repetitions: 1, //here, put 12 for 192 trials
  randomize_order: true,
  data: {
    phase:    "test",
    stimulus: jsPsych.timelineVariable('stimulus'),
    movement: jsPsych.timelineVariable('movement_2'),
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
        fullscreen_trial,
			  hiding_cursor);

// prolific verification
timeline.push(save_id);

switch(ColorGroup) {
  case "G1Y":
    timeline.push(vaast_instructions_1,
                  vaast_instructions_2,
                  vaast_instructions_conflit,
                  vaast_instructions_2_bis,
                  vaast_instructions_3, 
                  vaast_instructions_4,
                  //vaast_training_block_1_G1Y,
                  vaast_instructions_5,
                  //vaast_test_block_1_G1Y,
                  vaast_instructions_6,
                  //vaast_training_block_2_G1Y,
                  vaast_instructions_7,
                  //vaast_test_block_2_G1Y,
                  vaast_instructions_end);
    break;
  case "G1B":
    timeline.push(vaast_instructions_1,
                  vaast_instructions_2,
                  vaast_instructions_conflit,
                  vaast_instructions_2_bis,
                  vaast_instructions_3, 
                  vaast_instructions_4,
                  //vaast_training_block_1_G1B,
                  vaast_instructions_5,
                 // vaast_test_block_1_G1B,
                  vaast_instructions_6,
                 // vaast_training_block_2_G1B,
                  vaast_instructions_7,
                  //vaast_test_block_2_G1B,
                  vaast_instructions_end);
    break;
}

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
        window.location.href = "https://www.google.be/?jspsych_id=" + jspsych_id + "&prolificID=" + 
        prolificID + "&vaast_condition_approach=" + vaast_condition_approach + "&ColorGroup=" + ColorGroup;
    }
  });
}


