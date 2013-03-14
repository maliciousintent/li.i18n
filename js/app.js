/*jshint browser:true, indent:2, laxcomma:true, eqnull:true, jquery:true, devel:true */

$(function () {
  var $table = $('#table').show();
  
  document.getElementById('browse').addEventListener('click', function () {
    document.getElementById('file').click();
    return false;
  });

  var _createTable = function (data) {
    Object.keys(data).forEach(function (ctx) {
      $(('<tr>' + 
          '<td class="span2"><strong>{0}</strong></td>' + 
          '<td class="span4"><textarea readonly="readonly" class="input-block-level">{1}</textarea></td>' + 
          '<td class="span4"><textarea class="translation input-block-level" data-ctx="{0}" data-original="{1}" data-fuzzy="{3}">{2}</textarea></td>' + 
          '<td class="span2"><input id="fuz-{4}" type="checkbox" value="{3}" /> <label for="fuz-{4}">Fuzzy</label></td>' + 
         '</tr>').format(ctx, data[ctx].original, data[ctx].translated, data[ctx].fuzzy, parseInt(Math.random() * 10000, 10))).appendTo($table);
    });
  };
  
  
  var _getTable = function () {
    var translations = {};
    
    $table.find('.translation[data-ctx]').each(function (index, item) {
      var $item = $(item);
      translations[$item.attr('data-ctx')] = {
        original: $item.attr('data-original'),
        translated: $item.val(),
        fuzzy: $item.attr('data-fuzzy') == 'true'
      };
    });
    
    return translations;
  };
  
  
  var _handleFileSelect = function (evt) {
    var file = evt.target.files[0];

    if (!file || file.length > 4000 * 1000 || file.name.indexOf('.json') === -1) {
      alert('I\'m sorry but the file format you have uploaded is not supported (or your browser is too old).');
      return;
    }
    
    var reader = new FileReader();
    reader.addEventListener('load', function (e) {
      var json;
      
      try {
        json = JSON.parse(e.target.result);
        _createTable(json);
      } catch (err) {
        alert('The file you uploaded is not valid (technical details: JSON decode error)');
        throw err;
      }
    });
    
    reader.readAsText(file);
  };

  $('#file')[0].addEventListener('change', _handleFileSelect, false);
  

  // Restore last save
  var saved = window.localStorage.getObject('trans');
  if (saved != null && saved != {}) {
    if (confirm('There is an autosaved version of your work.\nDo you want to restore it?')) {
      _createTable(saved);
    } else {
      window.localStorage.setObject('trans', {});
    }
  }


  // Auto save
  (function autoSave() {
    if ($table.is(':visible')) {
      window.localStorage.setObject('trans', _getTable());
    }
    
    setTimeout(autoSave, 60000);
  })();
  
});


