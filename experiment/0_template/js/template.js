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
      $("textarea").val("");

      $("#audio_src_ogg").attr("src", 'audio/'+ stim.audio + '.ogg');
      $("#audio_src_wav").attr("src", 'audio/'+ stim.audio + '.wav');
      

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

      
      //this.sentences = ["Speaker 2 agrees with Speaker 1","Speaker 2 disagrees with Speaker 1","Speaker 2 likes the " + this.stim.topic,"Speaker 2 dislikes the " + this.stim.topic,"Speaker 2 is happy","Speaker 2 is unhappy"];
      //this.sentences = _.shuffle([["Speaker 2 disagrees with Speaker 1","Speaker 2 agrees with Speaker 1"],["Speaker 2 dislikes the " + this.stim.topic, "Speaker 2 likes the " + this.stim.topic],["Speaker 2 is unhappy", "Speaker 2 is happy"]]);

      this.sentences = [["disagrees with Speaker 1","agrees with Speaker 1", "agree"],["dislikes the " + this.stim.topic, "likes the " + this.stim.topic, "like"],["is unhappy", "is happy", "happy"],["is unfriendly", "is friendly", "friendly"]];
      this.n_sliders = this.sentences.length;
      this.shuffled_sentences = exp.shuffled_sentences;
      $(".slider_row").remove();
      for (var i=0; i<this.n_sliders; i++) {
        var sentence_left = this.sentences[this.shuffled_sentences[i]][0];
        var sentence_right = this.sentences[this.shuffled_sentences[i]][1];
        $("#multi_slider_table").append('<tr class="slider_row"><td class="slider_target_left" id="sentence_left' + i + '">' + sentence_left + '</td><td colspan="2"><div id="slider' + i + '" class="slider"><td class="slider_target_right" id="sentence_right' + i + '">' + sentence_right + '</td>-------[ ]--------</div></td></tr>');
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
        if ($("#slider" + i).slider("option", "value") < -0.1) {
          $("#error_percept").show();
          return;
        } else {
          this.responses.push([$("#slider" + i).slider("option", "value"), this.sentences[i][2]]);
        }
      }

      // var text_field = $("#story-input").val();

      this.open_answer = $("#other_percept").val();
      this.responses.push([this.open_answer, "open_answer"]);

      this.log_responses();
      _stream.apply(this);

    },

    log_responses : function() {

      var resp = {
          "filler": this.stim.filler,
          "topic" : this.stim.topic,
          "stimulus": this.stim.audio,
          "not_paid_attention": this.not_paid_attention,
          "pre_check_response": this.pre_check_response,
          "time": (new Date()) - this.trial_start,
          "num_plays": $("#audio_player").data("num-plays")
        }

      for (var i = 0; i < this.responses.length; i++) {
        var x = this.responses[i];
        resp[x[1]] = x[0];
      }

      exp.data_trials.push(resp);
    }

  });




  slides.hit_info =  slide({
    name : "hit_info",
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.hit_data = {
        audio_input : $("#audio_input").val(),
        speaker_impressions : $("#speaker_impressions").val(),
        enjoyment : $("#enjoyment").val(),
        asses : $('input[name="assess"]:checked').val(),
        comments : $("#comments").val(),
        problems: $("#problems").val(),
        fairprice: $("#fairprice").val()
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.subj_info =  slide({
    name : "subj_info",
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.subj_data = {
        language : $("#language").val(),
        age : $("#age").val(),
        gender : $("#gender").val(),
        enthnicity : $("#enthnicity").val(),
        education : $("#education").val()
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
          "hit_information" : exp.hit_data,
          "subject_information" : exp.subj_data,
          "time_in_minutes" : (Date.now() - exp.startT)/60000
      };
      setTimeout(function() {turk.submit(exp.data);}, 1000);
    }
  });

  return slides;
}

  function makeStim(i) {
    var topics = ["cake","scarf","restaurant","ice cream","movie","theatre","documentary","smoothie","song","museum","coffee","book","hat","salad","soup","painting", "laptop","cell phone","car","cat","dog","bird","sweater","bag","musical","watch","chair","table"];
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
  exp.shuffled_sentences = _.shuffle([0, 1, 2, 3]);
  console.log(exp.audio_stims[0].audio);
  var observed_topics = [];
  var observed_pos = 0;
  var observed_neg = 0;
  for (j = 0; j< exp.audio_stims.length; j++) {
    // console.log("inside for loop");
    // console.log(exp.audio_stims[j]);
    var topic = exp.audio_stims[j].topic;
    var valence = exp.audio_stims[j].valence;
    if (valence == "pos" & observed_pos == 3) //equal pos and neg stims
       continue;
    if (valence == "neg" & observed_neg == 3) //equal pos and neg stims
       continue;
    if (observed_topics.indexOf(topic) > -1)
      continue;
    if (valence == "pos") //equal pos and neg stims
       observed_pos += 1;
    if (valence == "neg") //equal pos and neg stims
       observed_neg += 1;


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
  exp.structure=["i0", "instructions", "trial", 'hit_info', 'subj_info', 'thanks'];

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



  exp.go(); //show first slide
}
