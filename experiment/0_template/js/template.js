function make_slides(f) {
  var   slides = {};

  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
     }
  });

  slides.instructions = slide({
    name : "instructions",
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.trial = slide({
    name : "trial",
    present: exp.all_stims,
 
    // PRESENT THE SLIDE
    present_handle: function(stim) {
      this.trial_start = new Date();
      this.stim = stim;
      this.type = stim.title;
      this.not_paid_attention = false;
      $("#audio_player").data("num-plays", 0);

      console.log("Trial: " + stim.audio);
      $("#error_audio").hide();
      $("#attention_check").hide();
      $("#done_check").hide();
      $("#error_check").hide();
      $("#perception").hide();
      $("#done_percept").hide();
      $("#error_percept").hide();
      $("#attention_check").data("dont-show", false);
      $("input[type=radio]").attr("checked", null);

      $("#audio_src_mp3").attr("src", 'audio/'+ stim.audio + '.mp3');
      $("#audio_src_ogg").attr("src", 'audio/'+ stim.audio + '.wav');
      

      $("#audio_player").load();
      $("#audio_player").trigger("play");


      

      $("#radio_label_1").text(this.stim.topics[0]);
      $("#radio_label_2").text(this.stim.topics[1]);
      $("#radio_label_3").text(this.stim.topics[2]);
      $("#radio_label_4").text(this.stim.topics[3]);
      $("#radio_label_5").text(this.stim.topics[4]);
      $("#radio_label_6").text(this.stim.topics[5]);


      $("#radio_1").val(this.stim.topics[0]);
      $("#radio_2").val(this.stim.topics[1]);
      $("#radio_3").val(this.stim.topics[2]);
      $("#radio_4").val(this.stim.topics[3]);
      $("#radio_5").val(this.stim.topics[4]);
      $("#radio_6").val(this.stim.topics[5]);

      
      this.n_sliders = 6;
      this.sentences = ["Speaker 2 agrees with Speaker 1","Speaker 2 disagrees with Speaker 1","Speaker 2 likes the " + this.stim.topic,"Speaker 2 dislikes the " + this.stim.topic,"Speaker 2 is happy","Speaker 2 is unhappy"];
      $(".slider_row").remove();
      for (var i=0; i<this.n_sliders; i++) {
        var sentence = this.sentences[i];
        $("#multi_slider_table").append('<tr class="slider_row"><td class="slider_target" id="sentence' + i + '">' + sentence + '</td><td colspan="2"><div id="slider' + i + '" class="slider">-------[ ]--------</div></td></tr>');
        utils.match_row_height("#multi_slider_table", ".slider_target");
      }

      this.init_sliders(this.sentences);
      exp.sliderPost = [];


    },

   


    init_sliders : function(sentence_types) {
      for (var i=0; i<sentence_types.length; i++) {
        var sentence_type = sentence_types[i];
        utils.make_slider("#slider" + i, this.make_slider_callback(i));
      }
    },

    make_slider_callback : function(i) {
      return function(event, ui) {
        exp.sliderPost[i] = ui.value;

      };
    },
    

    // //FIRST BUTTON
    // button_audio : function() {     
    //   $("#attention_check").show();
    //   $("#done_check").show();
    //   $("#done_audio").hide();
    // },

    // //SECOND BUTTON: CHECK THAT THEY SELECT THE CORRECT ATTENTION CHECK ANSWER
    button_check : function() {
      // function check_check(){
      var checked_radio  = $('input[name="audio"]:checked');

      //this.response  = true;
      if (checked_radio == undefined  || checked_radio.val() != this.stim.topic) {
     //if (this.response == false) {
        $("#error_check").show();
        if (checked_radio.val() != this.stim.topic) {
          this.not_paid_attention = true;
        }
      } else { 
        this.pre_check_response = checked_radio.val();
        $("#perception").show();
        $("#done_percept").show();
        $("#done_check").hide();
        $("#error_check").hide();
        $("#attention_check").hide();
        $("#attention_check").data("dont-show", true);
        
      };
    },

    // //THIRD BUTTON: CHECK THAT THEY MOVED ALL SLIDERS
    button_percept : function() {
      // function check_percept(){
        // this.response = $('input[name="audio"]:checked').val();
      
      this.responses = [];


      for (var i = 0; i < this.n_sliders; i++) {
        if ($("#slider" + i).slider("option", "value") < 0) {
          $("#error_percept").show();
          return;
        } else {
          this.responses.push($("#slider" + i).slider("option", "value"));
        }
      }

      this.log_responses();
      _stream.apply(this);

    },

    log_responses : function() {

      exp.data_trials.push({
          "filler": this.stim.filler,
          "topic" : this.stim.topic,
          "stimulus": this.stim.audio,
          "not_paid_attention": this.not_paid_attention,
          "pre_check_response": this.pre_check_response,
          "responses": this.responses.join(","),
          "time": (new Date()) - this.trial_start,
          "num_plays": $("#audio_player").data("num-plays")
        });
    }

  });















    //  $(".err").hide();
    //  this.stim = stim;
    //  console.log(stim.item);
    //  $(".display_condition").html("XYZ Put audio stim here");
    //},

    // SET THE SLIDE    
      // $(document).ready(function() {
    //   $(".error_audio").hide();
    //   $(".attention_check").hide();
    //   $(".perception").hide();
    //   $(".done_trial").hide();
    //   $(".done_audio").click(check_audio);
    //   loadNextAudio();
    // // });



    // THIS DOES THE SAME AS check_audio, RIGHT?
    //
    //button : function() {
    //  this.response = $('input[name="audio"]:checked').val();
    //  if (this.response == undefined) {
    //    $(".err").show();
    //  } else {
    //    this.log_responses();
    //    _stream.apply(this);}
    //},

    // ATTENTION CHECK
    // slides.check = slide({
    //   name : "attention_check",

    //   present_handle: function() {
    //   //$(".err").hide();
    //   //this.stim = stim;
    //   //console.log(stim.item);
    //   //$(".display_condition").html("");
    //   },
    //   button : function() {
    //   this.response = $('input[name="audio"]:checked').val();
    //   if (this.response == undefined) {
    //     $(".err").show();
    //   } else {
    //     this.log_responses();
    //     _stream.apply(this);}
    //   },

      // SECOND BUTTON: CHECK THEY CORRECLTY ANSWERED THE CHECK QUESTION
      // function check_check(){
      //   this.response = $('XYZ').val();
      //   if (this.response == false) {
      //      $(".error_check").show()
      //   } else { $("#percpetion").show()
      //      $(".done_check").hide();
      //      $(".error_check").hide()
      //   }
      // }
    // },

    // slides.experiment = slide({
    //   name : "experiment",
      
    //   this.sentence_types = _.shuffle(["emotion", "stance", "align"]);
    //   var sentences = {
    //     "emotion": "Speaker 2 is " + stim.property,
    //     "stance": "Speaker 2 " + stim.property + " the " + stim.type,
    //     "align": "Speaker 2 " + stim.property + " with Speaker 1."},
      
    //   this.n_sliders = this.sentence_types.length;
    //   $(".slider_row").remove();
    //   for (var i=0; i<this.n_sliders; i++) {
    //     var sentence_type = this.sentence_types[i];
    //     var sentence = sentences[sentence_type];
    //     $("#multi_slider_table").append('<tr class="slider_row"><td class="slider_target" id="sentence' + i + '">' + sentence + '</td><td colspan="2"><div id="slider' + i + '" class="slider">-------[ ]--------</div></td></tr>');
    //     utils.match_row_height("#multi_slider_table", ".slider_target");
    //   }
    // THIRD BUTTON: CHECK THEY MOVED ALL SLIDERS
      // function check_percept(){
      //   this.response = $('XYZ').val();
      //   if (this.response == false) {
      //      $(".error_percept").show()
      //   } else { $(".done_trial").show()
      //      $(".done_percept").hide();
      //      $(".error_percept").hide()
      //   }
      // }

    //   this.init_sliders(this.sentence_types);
    //   exp.sliderPost = [];
    // },

    // button : function() {
    //   if (exp.sliderPost.length < this.n_sliders) {
    //     $(".err").show();
    //   } else {
    //     this.log_responses();
    //     _stream.apply(this); //use _stream.apply(this); if and only if there is "present" data.
    //   }
    // },

    

    // init_sliders : function(sentence_types) {
    //   for (var i=0; i<sentence_types.length; i++) {
    //     var sentence_type = sentence_types[i];
    //     utils.make_slider("#slider" + i, this.make_slider_callback(i));
    //   }
    // },
    // make_slider_callback : function(i) {
    //   return function(event, ui) {
    //     exp.sliderPost[i] = ui.value;
    //   };
    // },
    // log_responses : function() {
    //   for (var i=0; i<this.sentence_types.length; i++) {
    //     var sentence_type = this.sentence_types[i];
    //     exp.data_trials.push({
    //       "trial_type" : "multi_slider",
    //       "sentence_type" : sentence_type,
    //       "response" : exp.sliderPost[i]
    //     });
    //   }
    // }
  // });

  slides.subj_info =  slide({
    name : "subj_info",
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.subj_data = {
        language : $("#language").val(),
        enjoyment : $("#enjoyment").val(),
        asses : $('input[name="assess"]:checked').val(),
        age : $("#age").val(),
        gender : $("#gender").val(),
        education : $("#education").val(),
        comments : $("#comments").val(),
        problems: $("#problems").val(),
        fairprice: $("#fairprice").val()
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.thanks = slide({
    name : "thanks",
    start : function() {
      exp.data= {
          "trials" : exp.data_trials,
          "system" : exp.system,
          "condition" : exp.condition,
          "subject_information" : exp.subj_data,
          "time_in_minutes" : (Date.now() - exp.startT)/60000
      };
      setTimeout(function() {turk.submit(exp.data);}, 1000);
    }
  });

  return slides;
}

  function makeStim(i) {
    var topics = ["cake","documentary","movie","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    var stim = i;
    var idx = topics.indexOf(stim.topic);
    topics.splice(idx, 1);
    console.log("topics after removing actual topic");
    console.log(topics);
    stim.topics = _.shuffle(_.shuffle(topics).slice(0,5).concat([stim.topic]));
    exp.all_stims.push(stim);
  }

/// init ///
function init() {
   exp.all_stims = [];

  exp.data_trials = [];
  exp.audio_stims = _.shuffle(audio); //can randomize between subject conditions here
  // exp.percpet_stims = _.shuffle(percept);
  console.log(exp.audio_stims[0].audio);
  var observed_topics = [];
  for (j = 0; j< exp.audio_stims.length; j++) {
    // console.log("inside for loop");
    // console.log(exp.audio_stims[j]);
    var topic = exp.audio_stims[j].topic;
    if (observed_topics.indexOf(topic) > -1)
      continue;
    observed_topics.push(topic);
    makeStim(exp.audio_stims[j]);
  }
  console.log(exp.all_stims);
 
  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };
  //blocks of the experiment:
  exp.structure=["i0", "instructions", "trial", 'subj_info', 'thanks'];

  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
                    //relies on structure and slides being defined

  $('.slide').hide(); //hide everything



  //make sure turkers have accepted HIT (or you're not in mturk)
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {$("#mustaccept").show();});
      exp.go();
    }
  });

  $("#audio_player").bind("ended", function () {
        if (! $("#attention_check").data("dont-show")) {
          $("#attention_check").show();
          $("#done_check").show();
        }
        $("#audio_player").data("num-plays", $("#audio_player").data("num-plays") + 1);

      });

//gets the right audio file for the trial
// function getAudioFile(elem) {
//   var audio_name = 'audio/wavs/' + exp.audio_stims + '.wav';
//   return audio_name;
// }

  exp.go(); //show first slide
}
