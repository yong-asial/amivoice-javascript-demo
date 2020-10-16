(function() {

  // Start Getting APP Key
  function issueStarted() {
    resumePauseButton.disabled = true;
  }

  // End Getting APP
  function issueEnded(token) {
    resumePauseButton.disabled = false;
    if (token) {
      Wrp.feedDataResume();
    } else {
      alert("Could not get ワンタイムAppKey");
    }
  }

  // 音声認識サーバへの接続処理が開始した時に呼び出されます。
  function connectStarted() {
    resumePauseButton.disabled = true;
  }

  // 音声認識サーバからの切断処理が完了した時に呼び出されます。
  function disconnectEnded() {
    resumePauseButton.innerHTML = "録音の開始";
    resumePauseButton.disabled = false;
    resumePauseButton.classList.remove("sending");
  }

  // 音声認識サーバへの音声データの供給開始処理が完了した時に呼び出されます。
  function feedDataResumeEnded() {
    resumePauseButton.innerHTML = "<br><br>音声データの録音中...<br><br><span class=\"supplement\">クリック → 録音の停止</span>";
    resumePauseButton.disabled = false;
    resumePauseButton.classList.add("sending");
  }

  // 音声認識サーバへの音声データの供給終了処理が開始した時に呼び出されます。
  function feedDataPauseStarted() {
    resumePauseButton.disabled = true;
  }

  // 認識処理が開始された時に呼び出されます。
  function resultCreated() {
    this.recognitionResultText.innerHTML = "...";
  }

  // 認識処理が確定した時に呼び出されます。
  function resultFinalized(result) {
    try {
      var json = JSON.parse(result);
      Util.buffer = (json.text) ? Util.sanitize(json.text) : (json.code != 'o' && json.message) ? "<font color=\"gray\">(" + json.message + ")</font>" : "<font color=\"gray\">(なし)</font>";
    } catch (e) {
      if (result.indexOf("\x01") == -1) {
        Util.buffer = (result) ? Util.sanitize(result) : "<font color=\"gray\">(なし)</font>";
      } else {
        var fields = result.split("\x01");
        var fields0 = fields[0].split("|");
        Util.buffer = "";
        Util.bufferEnding = 0;
        var i, j;
        for (i = 0; i < fields0.length; i++) {
          var written = fields0[i];
          if ((j = written.indexOf(" ")) != -1) {
            written = written.slice(0, j);
          }
          if ((j = written.indexOf(":")) != -1) {
            written = written.slice(0, j);
          }
          if ((j = written.indexOf("\x03")) != -1) {
            written = written.slice(0, j);
          }
          Util.append(written);
        }
        Util.buffer = (Util.buffer) ? Util.sanitize(Util.buffer) : "<font color=\"gray\">(なし)</font>";
      }
    }
    this.recognitionResultText.innerHTML = Util.buffer;
  }

  // メッセージの出力が要求された時に呼び出されます。
  function TRACE(message) {
    // Deal with some error
    if (message.indexOf("ERROR: can't start feeding data to WebSocket server") >= 0) {
      alert('Could not connect to Websocket Server. Please review your credential or user plan!');
      resumePauseButton.disabled = false;
    }
    // output log to console.log
    console.log(message);
  }

  // 画面要素の取得
  var issuerURL = document.getElementById("issuerURL");
  var sid = document.getElementById("sid");
  var spw = document.getElementById("spw");
  var epi = document.getElementById("epi");
  var grammarFileNames =document.getElementsByClassName("grammarFileNames");
  var recognitionResultText =document.getElementsByClassName("recognitionResultText");

  // Default Value
  epi.value = 60000; // 1 minute

  // 画面要素の初期化
  issuerURL.value = "https://acp-api.amivoice.com/issue_service_authorization";
  serverURL.value = "wss://acp-api.amivoice.com/v1/nolog/";
  grammarFileNames[0].value = Wrp.grammarFileNames;
  authorization.value = Wrp.authorization;

  // 音声認識ライブラリのプロパティ要素の設定
  Wrp.serverURLElement = serverURL;
  Wrp.grammarFileNamesElement = grammarFileNames[0];
  Wrp.authorizationElement = authorization;
  Wrp.issuerURLElement = issuerURL;
  Wrp.sidElement = sid;
  Wrp.spwElement = spw;
  Wrp.epiElement = epi;
  Wrp.name = "";
  Wrp.recognitionResultText = recognitionResultText[0];

  // 音声認識ライブラリのイベントハンドラの設定
  Wrp.issueStarted = issueStarted;
  Wrp.issueEnded = issueEnded;
  Wrp.connectStarted = connectStarted;
  Wrp.disconnectEnded = disconnectEnded;
  Wrp.feedDataResumeEnded = feedDataResumeEnded;
  Wrp.feedDataPauseStarted = feedDataPauseStarted;
  Wrp.resultCreated = resultCreated;
  Wrp.resultFinalized = resultFinalized;
  Wrp.TRACE = TRACE;

  // 音声認識ライブラリ／録音ライブラリのメソッドの画面要素への登録
  resumePauseButton.onclick = function() {
    if (Wrp.isActive()) {
      Wrp.feedDataPause();
    } else {
      // Check user id and password
      if (!sid.value || !spw.value) {
        alert("Please input サービス ID and サービスパスワード");
      }
      // Getting the APP One-Time Token, then start recording and feeding after got the token
      Wrp.issue();
    }
  };

  version.innerHTML = Wrp.version;
})();
