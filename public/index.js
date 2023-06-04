const output = document.getElementById('output');
const image = document.getElementById('imaged');
const mode = document.getElementById('mode');

var langs = [
    [ 
        'English',  
        ['en-AU', 'Australia'],
        ['en-CA', 'Canada'],
        ['en-IN', 'India'],
        ['en-NZ', 'New Zealand'],
        ['en-ZA', 'South Africa'],
        ['en-GB', 'United Kingdom'],
        ['en-US', 'United States']
    ]
];
select_language.options[0] = new Option(langs[0][0], 0);
select_language.selectedIndex = 0;
updateCountry();
select_dialect.selectedIndex = 2;
showInfo('info_start');
function updateCountry() {
  for (const i = 0; i < select_dialect.options.length; i++)
    select_dialect.remove(i);
  const list = langs[select_language.selectedIndex];
  for (var i = 1; i < list.length; i++) {
    select_dialect.options.add(new Option(list[i][1], list[i][0]));
  }
  select_language.style.visibility =  'hidden';
  select_dialect.style.visibility =  'hidden';
}
//The above code is for selecting langauge and dialect.
//Selected language as English and dialect as India and hidden both selection

var final_transcript = '';
var recognizing = false;
var stopRecognition;
var start_timestamp;

//Hiding start button and throwing message when we have older browser versions which is unsupported.
if (!('webkitSpeechRecognition' in window)) {
    start_button.style.visibility = 'hidden';
    showInfo('info_upgrade');
} else {
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;

  //starting with audio to text recognition
  recognition.onstart = function() {
    recognizing = true;
    showInfo('info_speak_now');
  };

  //stopping recognition process while having errors.
  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      showInfo('info_no_speech');
      stopRecognition = true;
    }
    if (event.error == 'audio-capture') {
      showInfo('info_no_microphone');
      stopRecognition = true;
    }
    if (event.error == 'not-allowed') {
      showInfo('info_denied');
      stopRecognition = true;
    }
  };

  //Last stage of audio to text conversion process.
  recognition.onend = function() {
    recognizing = false; //stoping recognization if exists
    startButton();
  };

  //Last before stage of audio to text conversion process.
  recognition.onresult = async function(event) {
    //categorizing and appending result to final and interim_transcript whenever we get a result
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      }
    }
  
    if(final_transcript.length > 1){
      const AI = await axios.post("https://ai-girlfriend-check.onrender.com/get-ai-response", { question : final_transcript});
      const AIResponse = AI.data;
      const options = {
        method: 'POST',
        url: 'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM?optimize_streaming_latency=0',
        headers: {
          accept: 'audio/mpeg', // Set the expected response type to audio/mpeg
          'content-type': 'application/json', // Set the content type to application/json
          'xi-api-key': '0842af91b8fb0fce61a7f8781b26e9eb', // Set the API key in the headers
        },
        data: {
          text: AIResponse, // Pass in the inputText as the text to be converted to speech.
        },
        responseType: 'arraybuffer', // Set the responseType to arraybuffer to receive binary data as response.
      };
      //console.log('1');
      // Send the API request using Axios and wait for the response.
      const speechDetails = await axios.request(options);
      //console.log('2', speechDetails);
      // Return the binary audio data received from the API response.
      const data = speechDetails.data;

      const blob = new Blob([data], { type: 'audio/mpeg' });
      // Create a URL for the blob object
      const url = URL.createObjectURL(blob);
      var sound      = document.createElement('audio');
      sound.autoplay = true;
      sound.id       = 'audio-player';
      sound.controls = 'autoplay';
      sound.src      = url;
      sound.type     = 'audio/mpeg';
      sound.style.visibility = 'hidden';
      output.appendChild(sound);
    }
    if (final_transcript) {
      showButtons('inline-block');
    }
  };
}


//converting two lines gap to paragraph
function linebreak(s) {
    const two_line = /\n\n/g;
    const one_line = /\n/g;
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}



//on clicking start button we handle here
function startButton(event) {
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = '';
  recognition.lang = select_dialect.value;
  recognition.start();
  stopRecognition = false;
  final_span.innerHTML = '';
  showInfo('info_allow');
  showButtons('none');
}

function stopButton(event) {
    stopRecognition = true;
    recognition.stop();
    recognition.abort();
    window.location.reload();
}

//Used for showing all error messages
function showInfo(s) {
  if (s) {
    for (var child = info.firstChild; child; child = child.nextSibling) {
      if (child.style) {
        child.style.display = child.id == s ? 'inline' : 'none';
      }
    }
    info.style.visibility = 'visible';
  } else {
    info.style.visibility = 'hidden';
  }
}
var current_style;
function showButtons(style) {
  if (style == current_style) {
    return;
  }
  current_style = style;
}


function handleModeSelect(event) {
  image.src = `${mode.value}.png`;
}
