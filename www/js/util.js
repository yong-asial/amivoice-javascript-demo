var Util= function() {
	// public オブジェクト
	var util_ = {
		// public プロパティ
    buffer: '',
    bufferEnding: undefined,
		// public メソッド
    sanitize: sanitize_,
    append: append_,
  };

  function sanitize_(s) {
    return s.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/'/g, '&apos;')
            .replace(/"/g, '&quot;');
  }

  function append_(item) {
    if (item.length == 0) {
      return;
    }
    if (item == "<->") {
      return;
    }
    var itemState = 0;
    for (var i = 0; i < item.length; i++) {
      var c = item.charCodeAt(i);
      if (itemState == 0) {
        if (c == 0x005F) {
          break;
        } else
        if (c == 0x4E00 || c == 0x4E8C || c == 0x4E09 || c == 0x56DB || c == 0x4E94 || c == 0x516D || c == 0x4E03 || c == 0x516B || c == 0x4E5D) { // '一'～'九'
          itemState = 1;
        } else
        if (c == 0x5341) { // '十'
          itemState = 2;
        } else
        if (c == 0x767E) { // '百'
          itemState = 4;
        } else
        if (c == 0x5343) { // '千'
          itemState = 8;
        } else {
          break;
        }
      } else {
        if (c == 0x005F) {
          item = item.substr(0, i) + item.substr(i + 1);
          break;
        } else
        if (c == 0x4E00 || c == 0x4E8C || c == 0x4E09 || c == 0x56DB || c == 0x4E94 || c == 0x516D || c == 0x4E03 || c == 0x516B || c == 0x4E5D) { // '一'～'九'
          if ((itemState & 1) != 0) {
            break;
          } else {
            itemState |= 1;
          }
        } else
        if (c == 0x5341) { // '十'
          if ((itemState & 2) != 0) {
            break;
          } else {
            itemState |= 2;
            itemState &= ~1;
          }
        } else
        if (c == 0x767E) { // '百'
          if ((itemState & 6) != 0) {
            break;
          } else {
            itemState |= 4;
            itemState &= ~1;
          }
        } else
        if (c == 0x5343) { // '千'
          if ((itemState & 14) != 0) {
            break;
          } else {
            itemState |= 8;
            itemState &= ~1;
          }
        } else {
          break;
        }
      }
    }
    item = item.replace(/_/g, " ");
    var itemBeginningChar = item.charCodeAt(0);
    var itemEndingChar = (item.length > 1) ? item.charCodeAt(item.length - 1) : 0;
    if (util_.bufferEnding == 0) {
      var itemBeginning;
      var c = itemBeginningChar;
      if (c == 0x0020) {
        itemBeginning = 0;
      } else
      if (c == 0x0021
       || c == 0x002C
       || c == 0x002E
       || c == 0x003A
       || c == 0x003B
       || c == 0x003F) {
        itemBeginning = 5;
      } else
      if (c == 0x3001
       || c == 0x3002
       || c == 0xFF01
       || c == 0xFF0C
       || c == 0xFF0E
       || c == 0xFF1A
       || c == 0xFF1B
       || c == 0xFF1F) {
        itemBeginning = 6;
      } else {
        itemBeginning = 7;
      }
      if (itemBeginning == 0
       || itemBeginning == 5
       || itemBeginning == 6) {
        if (util_.buffer.length > 0) {
          util_.buffer = util_.buffer.substr(0, util_.buffer.length - 1);
        }
      }
    } else {
      var itemBeginning;
      var c = itemBeginningChar;
      if (c == 0x0020) {
        itemBeginning = 0;
      } else
      if (c >= 0x0041 && c <= 0x005A
       || c >= 0x0061 && c <= 0x007A
       || c >= 0x0100 && c <= 0x0DFF
       || c >= 0x0E60 && c <= 0x01FF) {
        itemBeginning = 1;
      } else
      if (c >= 0xFF21 && c <= 0xFF3A
       || c >= 0xFF41 && c <= 0xFF5A) {
        itemBeginning = 2;
      } else
      if (c >= 0x0030 && c <= 0x0039) {
        itemBeginning = (util_.bufferEnding == 8 && itemEndingChar == 0) ? 8 : 3;
      } else
      if (c >= 0xFF10 && c <= 0xFF19) {
        itemBeginning = (util_.bufferEnding == 9 && itemEndingChar == 0) ? 9 : 4;
      } else
      if (c == 0x0021
       || c == 0x002C
       || c == 0x002E
       || c == 0x003A
       || c == 0x003B
       || c == 0x003F) {
        itemBeginning = 5;
      } else
      if (c == 0x3001
       || c == 0x3002
       || c == 0xFF01
       || c == 0xFF0C
       || c == 0xFF0E
       || c == 0xFF1A
       || c == 0xFF1B
       || c == 0xFF1F) {
        itemBeginning = 6;
      } else {
        itemBeginning = 7;
      }
      if (itemBeginning == 1 || util_.bufferEnding == 1 && (itemBeginning == 2
                                                   || itemBeginning == 3
                                                   || itemBeginning == 4
                                                   || itemBeginning == 7)
                             || util_.bufferEnding == 2 && (itemBeginning == 2)
                             || util_.bufferEnding == 3 && (itemBeginning == 3
                                                   || itemBeginning == 4)
                             || util_.bufferEnding == 4 && (itemBeginning == 3
                                                   || itemBeginning == 4)
                             || util_.bufferEnding == 5 && (itemBeginning == 2
                                                   || itemBeginning == 3
                                                   || itemBeginning == 4
                                                   || itemBeginning == 7)
                             || util_.bufferEnding == 8 && (itemBeginning == 3
                                                   || itemBeginning == 4)
                             || util_.bufferEnding == 9 && (itemBeginning == 3
                                                   || itemBeginning == 4)) {
        util_.buffer += " ";
      }
    }
    util_.buffer += item;
    c = (itemEndingChar == 0) ? itemBeginningChar : itemEndingChar;
    if (c == 0x0020) {
      util_.bufferEnding = 0;
    } else
    if (c >= 0x0041 && c <= 0x005A
     || c >= 0x0061 && c <= 0x007A
     || c >= 0x0100 && c <= 0x0DFF
     || c >= 0x0E60 && c <= 0x01FF) {
      util_.bufferEnding = 1;
    } else
    if (c >= 0xFF21 && c <= 0xFF3A
     || c >= 0xFF41 && c <= 0xFF5A) {
      util_.bufferEnding = 2;
    } else
    if (c >= 0x0030 && c <= 0x0039) {
      util_.bufferEnding = (itemEndingChar == 0) ? 8 : 3;
    } else
    if (c >= 0xFF10 && c <= 0xFF19) {
      util_.bufferEnding = (itemEndingChar == 0) ? 9 : 4;
    } else
    if (c == 0x0021
     || c == 0x002C
     || c == 0x002E
     || c == 0x003A
     || c == 0x003B
     || c == 0x003F) {
      util_.bufferEnding = 5;
    } else
    if (c == 0x3001
     || c == 0x3002
     || c == 0xFF01
     || c == 0xFF0C
     || c == 0xFF0E
     || c == 0xFF1A
     || c == 0xFF1B
     || c == 0xFF1F) {
      util_.bufferEnding = 6;
    } else {
      util_.bufferEnding = 7;
    }
  }
  
  return util_;
}();