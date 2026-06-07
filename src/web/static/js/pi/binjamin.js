/**
 * Smart Bin — Binjamin Chat Module
 * Conversational AI personality with voice I/O and camera integration.
 */
var SB = window.SB || {};

SB.binjamin = (function () {
  var conversation = [];
  var isProcessing = false;
  var recognition = null;
  var isListening = false;
  var sendCamera = true;

  // ── Chat API ──

  async function send(text) {
    if (isProcessing) return;
    if (!text || !text.trim()) return;

    isProcessing = true;
    addMessage('user', text);
    setInputEnabled(false);
    showThinking(true);

    var imageB64 = null;
    if (sendCamera) {
      imageB64 = captureFrame();
    }

    try {
      var res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          image: imageB64,
          conversation: conversation,
        }),
      });

      var data = await res.json();
      if (data.error && !data.response) {
        addMessage('binjamin', '*brain fizzles* ' + data.error, []);
      } else {
        conversation = data.conversation || [];
        addMessage('binjamin', data.response || '...', data.tool_calls || []);

        // Execute emotes from tool calls
        if (data.tool_calls) {
          data.tool_calls.forEach(function (tc) {
            if (tc.name === 'play_emote' && tc.args && tc.args.emote && SB.fun) {
              SB.fun.play(tc.args.emote);
            }
          });
        }

        speak(data.response || '');
      }
    } catch (err) {
      addMessage('binjamin', '*connection lost* ' + err.message, []);
    } finally {
      isProcessing = false;
      setInputEnabled(true);
      showThinking(false);
    }
  }

  // ── Camera ──

  function captureFrame() {
    var img = document.getElementById('cam-stream');
    if (!img || img.naturalWidth === 0) return null;
    try {
      var c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      c.getContext('2d').drawImage(img, 0, 0);
      return c.toDataURL('image/jpeg', 0.7);
    } catch (e) {
      return null;
    }
  }

  // ── Messages ──

  function addMessage(role, text, toolCalls) {
    var feed = document.getElementById('chat-messages');
    if (!feed) return;

    // Remove empty state
    var empty = feed.querySelector('.chat-empty');
    if (empty) empty.remove();

    var el = document.createElement('div');
    el.className = 'chat-msg ' + role;

    // Parse emote markers in text: *action* → styled emote span
    var html = escapeHtml(text).replace(
      /\*([^*]+)\*/g,
      '<span class="chat-emote">*$1*</span>'
    );

    var content = '<div class="chat-msg-text">' + html + '</div>';

    // Show tool calls if any
    if (toolCalls && toolCalls.length > 0) {
      var tools = toolCalls.map(function (tc) {
        var label = tc.name;
        if (tc.name === 'play_emote' && tc.args && tc.args.emote) {
          label = tc.args.emote;
        } else if (tc.name === 'set_mood' && tc.args && tc.args.color) {
          label = 'mood: ' + tc.args.color;
        } else if (tc.name === 'move_head') {
          label = 'look';
        } else if (tc.name === 'sort_item' && tc.args && tc.args.category) {
          label = 'sort: ' + tc.args.category;
        }
        return '<span class="chat-tool-tag">' + escapeHtml(label) + '</span>';
      });
      content += '<div class="chat-tools">' + tools.join('') + '</div>';
    }

    var time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    content += '<div class="chat-msg-time">' + time + '</div>';

    el.innerHTML = content;
    feed.appendChild(el);
    feed.scrollTop = feed.scrollHeight;
  }

  function showThinking(show) {
    var el = document.getElementById('chat-thinking');
    if (!el) return;
    el.style.display = show ? 'flex' : 'none';
    if (show) {
      var feed = document.getElementById('chat-messages');
      if (feed) feed.scrollTop = feed.scrollHeight;
    }
  }

  function escapeHtml(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  // ── Input ──

  function setInputEnabled(enabled) {
    var input = document.getElementById('chat-input');
    var sendBtn = document.getElementById('chat-send');
    var micBtn = document.getElementById('chat-mic');
    if (input) input.disabled = !enabled;
    if (sendBtn) sendBtn.disabled = !enabled;
    if (micBtn) micBtn.disabled = !enabled;
  }

  function handleSubmit(e) {
    e.preventDefault();
    var input = document.getElementById('chat-input');
    if (!input) return;
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    send(text);
  }

  // ── Speech Recognition (STT) ──

  function initSpeechRecognition() {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      var micBtn = document.getElementById('chat-mic');
      if (micBtn) {
        micBtn.title = 'Speech recognition not supported in this browser';
        micBtn.style.opacity = '0.3';
        micBtn.style.cursor = 'not-allowed';
      }
      return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-AU';

    recognition.onresult = function (e) {
      var transcript = e.results[0][0].transcript;
      var input = document.getElementById('chat-input');
      if (input) input.value = '';
      send(transcript);
    };

    recognition.onerror = function (e) {
      if (e.error !== 'no-speech') {
        console.warn('[Binjamin] Speech error:', e.error);
      }
      stopListening();
    };

    recognition.onend = function () {
      stopListening();
    };
  }

  function toggleMic() {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
        isListening = true;
        var btn = document.getElementById('chat-mic');
        if (btn) btn.classList.add('listening');
        var label = document.getElementById('mic-label');
        if (label) label.textContent = 'Listening…';
      } catch (e) {
        console.warn('[Binjamin] Mic start failed:', e);
      }
    }
  }

  function stopListening() {
    isListening = false;
    var btn = document.getElementById('chat-mic');
    if (btn) btn.classList.remove('listening');
    var label = document.getElementById('mic-label');
    if (label) label.textContent = '';
  }

  // ── Speech Synthesis (TTS) ──

  function speak(text) {
    if (!window.speechSynthesis) return;
    if (!text) return;

    // Strip emote markers for speech
    var clean = text.replace(/\*[^*]+\*/g, '').trim();
    if (!clean) return;

    window.speechSynthesis.cancel();
    var utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;

    // Try to find an Australian or English voice
    var voices = window.speechSynthesis.getVoices();
    var preferred = voices.find(function (v) {
      return v.lang === 'en-AU' || v.lang.startsWith('en-AU');
    }) || voices.find(function (v) {
      return v.lang.startsWith('en-');
    });
    if (preferred) utterance.voice = preferred;

    window.speechSynthesis.speak(utterance);
  }

  // ── Drawer Toggle ──

  function toggleDrawer() {
    var drawer = document.getElementById('binjamin-drawer');
    var overlay = document.getElementById('binjamin-overlay');
    if (!drawer) return;
    var isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
    } else {
      drawer.classList.add('open');
      if (overlay) overlay.classList.add('open');
    }
  }

  // ── Init ──

  function init() {
    initSpeechRecognition();

    // Form submit
    var form = document.getElementById('chat-form');
    if (form) form.addEventListener('submit', handleSubmit);

    // Buttons
    var sendBtn = document.getElementById('chat-send');
    // Send button is type=submit inside the form, so form submit handles it

    var micBtn = document.getElementById('chat-mic');
    if (micBtn) micBtn.addEventListener('click', toggleMic);

    var toggleBtn = document.getElementById('btn-binjamin');
    if (toggleBtn) toggleBtn.addEventListener('click', toggleDrawer);

    var closeBtn = document.getElementById('btn-close-binjamin');
    if (closeBtn) closeBtn.addEventListener('click', toggleDrawer);

    var overlay = document.getElementById('binjamin-overlay');
    if (overlay) overlay.addEventListener('click', toggleDrawer);

    // Camera toggle
    var camToggle = document.getElementById('chat-camera-toggle');
    if (camToggle) {
      camToggle.addEventListener('change', function (e) {
        sendCamera = e.target.checked;
      });
    }

    // Enter in input
    var input = document.getElementById('chat-input');
    if (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSubmit(e);
        }
      });
    }

    console.log('[Binjamin] Chat initialized');
  }

  return {
    init: init,
    send: send,
    toggleDrawer: toggleDrawer,
    speak: speak,
  };
})();

window.SB = SB;
