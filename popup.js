// Check if the browser supports the SpeechRecognition API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US'; // Set the language to English (US)
  recognition.interimResults = true; // Show interim results as the user speaks
  recognition.maxAlternatives = 1; // Only get the most likely transcription

  // Function to start speech recognition after checking microphone permission
  function startRecognition() {
    // Request microphone access using getUserMedia
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function (stream) {
        // Microphone access granted, start recognition
        console.log('Microphone access granted');
        recognition.start(); // Start recognizing speech when mic button is clicked
      })
      .catch(function (error) {
        // Handle error if microphone access is denied
        console.error('Microphone access error:', error);
        alert('Please grant microphone access to use the speech-to-text feature.');
      });
  }

  // Handle the microphone button click to start speech recognition
  document.getElementById('micButton').addEventListener('click', function () {
    startRecognition(); // Ask for microphone permission and start recognition
    document.getElementById('inputSentence').value = ""; // Clear input field before starting
  });

  // Handle speech recognition results
  recognition.onresult = function (event) {
    const transcript = event.results[event.results.length - 1][0].transcript; // Get the last result
    document.getElementById('inputSentence').value = transcript; // Set the transcript in the input field
    console.log('Transcription: ', transcript); // Log the transcription
  };

  // Handle any errors during speech recognition
  recognition.onerror = function (event) {
    console.error('Speech recognition error:', event.error); // Log the error in the console
    switch (event.error) {
      case 'no-speech':
        alert('No speech detected. Please try speaking.');
        break;
      case 'audio-capture':
        alert('No microphone found. Please ensure a microphone is connected.');
        break;
      case 'not-allowed':
        alert('Microphone access is not allowed. Please enable microphone access in your browser.');
        break;
      default:
        alert('An unknown error occurred. Please try again.');
    }
  };

  // Handle when speech recognition ends (either successfully or due to an error)
  recognition.onend = function () {
    console.log('Speech recognition ended.');
  };
} else {
  alert('Your browser does not support speech recognition. Please use a compatible browser like Chrome or Edge.');
}


// Rephrase button logic (existing)
document.getElementById('rephraseButton').addEventListener('click', async function () {
  const sentence = document.getElementById('inputSentence').value;
  const tone = document.getElementById('toneSelect').value;

  if (!sentence) {
    alert('Please enter a sentence.');
    return;
  }

  // Build the instruction based on the tone selected
  let promptText = `Rephrase the following sentence in a `;

  switch (tone) {
    case 'professional':
      promptText += 'professional tone: ';
      break;
    case 'polite':
      promptText += 'polite tone: ';
      break;
    case 'romantic':
      promptText += 'romantic tone: ';
      break;
    case 'friendly':
      promptText += 'friendly tone: ';
      break;
    case 'assertive':
      promptText += 'assertive tone: ';
      break;
    case 'sympathetic':
      promptText += 'sympathetic tone: ';
      break;
    case 'casual':
      promptText += 'casual tone: ';
      break;
    case 'optimistic':
      promptText += 'optimistic tone: ';
      break;
    case 'direct':
      promptText += 'direct tone: ';
      break;
    case 'motivational':
      promptText += 'motivational tone: ';
      break;
    case 'empathetic':
      promptText += 'empathetic tone: ';
      break;
    case 'formal':
      promptText += 'formal tone: ';
      break;
    case 'inquisitive':
      promptText += 'inquisitive tone: ';
      break;
    case 'encouraging':
      promptText += 'encouraging tone: ';
      break;
    case 'reassuring':
      promptText += 'reassuring tone: ';
      break;
    default:
      promptText += 'neutral tone: ';
  }

  promptText += sentence;

  // Prepare the request payload for rephrasing
  const requestData = {
    contents: [
      {
        parts: [
          {
            text: promptText
          }
        ]
      }
    ]
  };

  // Construct the request URL with your API key
  const apiKey = 'YOUR-API-KEY'; // Replace with your actual Gemini API key
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('API Response:', data); // Log the entire response for debugging

      // Check if the response contains candidates and the content within it
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
        // Extract the rephrased sentence from the correct structure
        let rephrasedSentence = data.candidates[0].content.parts[0].text;

        // Check if the sentence is non-empty
        if (!rephrasedSentence) {
          alert('Error: Rephrased sentence is empty.');
          return;
        }

        console.log('Rephrased Sentence:', rephrasedSentence); // Log the rephrased sentence

        // Display the rephrased sentence in the output field
        document.getElementById('outputSentence').value = rephrasedSentence;

        // Enable the speaker button only after the rephrasing is complete
        document.getElementById('speakerButton').disabled = false;
      } else {
        alert('Error: The response format is incorrect or the content is missing.');
      }
    } else {
      alert('Error rephrasing sentence. Status: ' + response.status);
    }
  } catch (error) {
    console.error('Error:', error); // Log any network errors
    alert('Something went wrong. Check the console for details.');
  }
});

// Speaker button functionality to play the audio
document.getElementById('speakerButton').addEventListener('click', function () {
  const sentence = document.getElementById('outputSentence').value;

  if (!sentence) {
    alert('No sentence to speak.');
    return;
  }

  // Check if SpeechSynthesis is supported
  if ('speechSynthesis' in window) {
    // Create a new SpeechSynthesisUtterance (TTS request)
    const utterance = new SpeechSynthesisUtterance(sentence);

    // Optional: Set the properties for voice, rate, pitch, volume, etc.
    utterance.voice = speechSynthesis.getVoices().find(voice => voice.lang === 'en-US'); // Set language and voice
    utterance.rate = 1; // Speed of speech (1 is normal)
    utterance.pitch = 1; // Pitch of voice (1 is normal)
    utterance.volume = 1; // Volume (1 is maximum)

    // Speak the sentence
    speechSynthesis.speak(utterance);

    // Optionally, handle the end of speech event
    utterance.onend = function () {
      console.log('Speech has finished');
    };
  } else {
    alert('Text-to-Speech is not supported in your browser.');
  }
});

document.getElementById('copyButton').addEventListener('click', function () {
  const outputSentence = document.getElementById('outputSentence');

  // Select the content in the textarea
  outputSentence.select();
  outputSentence.setSelectionRange(0, 99999); // For mobile devices

  // Copy the selected text to clipboard
  document.execCommand('copy');
});
document.addEventListener('DOMContentLoaded', function () {
  const topRightButton = document.getElementById('right-button');
  
  // Get the sections for both states
  const inputSection = document.getElementById('inputSection');
  const outputSection = document.getElementById('outputSection');
  const buttonSection = document.getElementById('buttonSection');
  const toneSelection = document.getElementById('toneSelection'); // Tone Selection to hide

  const inputSection2 = document.getElementById('inputSection2');
  const outputSection2 = document.getElementById('outputSection2');
  const rephraseButton2 = document.getElementById('rephraseButton2');

  // Add event listener to the top-right button to toggle visibility
  topRightButton.addEventListener('click', function () {
    // Check if the first set of sections is visible
    if (inputSection.style.display === 'none') {
      // Show the first set of sections and hide the second set
      inputSection.style.display = 'block';
      outputSection.style.display = 'block';
      buttonSection.style.display = 'block';
      toneSelection.style.display = 'block'; // Show tone selection again when switching back to the first section

      inputSection2.style.display = 'none';
      outputSection2.style.display = 'none';
      rephraseButton2.style.display = 'none';
    } else {
      // Show the second set of sections and hide the first set
      inputSection.style.display = 'none';
      outputSection.style.display = 'none';
      buttonSection.style.display = 'none';
      toneSelection.style.display = 'none'; // Hide tone selection when switching to the second set of sections

      inputSection2.style.display = 'block';
      outputSection2.style.display = 'block';
      rephraseButton2.style.display = 'block';
    }
});
});
if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US'; // Set the language to English (US)
  recognition.interimResults = true; // Show interim results as the user speaks
  recognition.maxAlternatives = 1; // Only get the most likely transcription

  // Function to start speech recognition after checking microphone permission
  function startRecognition() {
    // Request microphone access using getUserMedia
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function (stream) {
        // Microphone access granted, start recognition
        console.log('Microphone access granted');
        recognition.start(); // Start recognizing speech when mic button is clicked
      })
      .catch(function (error) {
        // Handle error if microphone access is denied
        console.error('Microphone access error:', error);
        alert('Please grant microphone access to use the speech-to-text feature.');
      });
  }

  // Handle the microphone button click to start speech recognition
  document.getElementById('micButton2').addEventListener('click', function () {
    startRecognition(); // Ask for microphone permission and start recognition
    document.getElementById('inputSentence2').value = ""; // Clear input field before starting
  });

  // Handle speech recognition results
  recognition.onresult = function (event) {
    const transcript = event.results[event.results.length - 1][0].transcript; // Get the last result
    document.getElementById('inputSentence2').value = transcript; // Set the transcript in the input field
    console.log('Transcription: ', transcript); // Log the transcription
  };

  // Handle any errors during speech recognition
  recognition.onerror = function (event) {
    console.error('Speech recognition error:', event.error); // Log the error in the console
    switch (event.error) {
      case 'no-speech':
        alert('No speech detected. Please try speaking.');
        break;
      case 'audio-capture':
        alert('No microphone found. Please ensure a microphone is connected.');
        break;
      case 'not-allowed':
        alert('Microphone access is not allowed. Please enable microphone access in your browser.');
        break;
      default:
        alert('An unknown error occurred. Please try again.');
    }
  };

  // Handle when speech recognition ends (either successfully or due to an error)
  recognition.onend = function () {
    console.log('Speech recognition ended.');
  };
} else {
  alert('Your browser does not support speech recognition. Please use a compatible browser like Chrome or Edge.');
}
document.getElementById('rephraseButton2').addEventListener('click', async function () {
  const sentence = document.getElementById('inputSentence2').value;
  if (!sentence) {
    alert('Please enter a sentence.');
    return;
  }

  // Build the instruction based on the tone selected
  let promptText = sentence;

  // Prepare the request payload for rephrasing
  const requestData = {
    contents: [
      {
        parts: [
          {
            text: promptText
          }
        ]
      }
    ]
  };

  // Construct the request URL with your API key
  const apiKey = 'YOUR-API-KEY'; // Replace with your actual Gemini API key
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('API Response:', data); // Log the entire response for debugging

      // Check if the response contains candidates and the content within it
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
        // Extract the rephrased sentence from the correct structure
        let rephrasedSentence = data.candidates[0].content.parts[0].text;

        // Check if the sentence is non-empty
        if (!rephrasedSentence) {
          alert('Error: Rephrased sentence is empty.');
          return;
        }

        console.log('Rephrased Sentence:', rephrasedSentence); // Log the rephrased sentence

        // Display the rephrased sentence in the output field
        document.getElementById('outputSentence2').value = rephrasedSentence;

        // Enable the speaker button only after the rephrasing is complete
        document.getElementById('speakerButton2').disabled = false;
      } else {
        alert('Error: The response format is incorrect or the content is missing.');
      }
    } else {
      alert('Error rephrasing sentence. Status: ' + response.status);
    }
  } catch (error) {
    console.error('Error:', error); // Log any network errors
    alert('Something went wrong. Check the console for details.');
  }
});

