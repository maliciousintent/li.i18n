/*jshint browser:true, indent:2, laxcomma:true, eqnull:true, jquery:true, devel:true */

$(function () {
  var $table = $('#table');
  
  document.getElementById('browse').addEventListener('click', function () {
    document.getElementById('file').click();
    return false;
  });

  var _createTable = function (data) {
    $table.show().find('tbody').html('');

    Object.keys(data).forEach(function (ctx) {
      $(('<tr class="fuzzy-{3}">' + 
          '<td class="span1">{0}</td>' + 
          '<td class="span5"><textarea readonly="readonly" class="input-block-level">{1}</textarea></td>' + 
          '<td class="span5"><textarea class="translation input-block-level" data-ctx="{0}" data-original="{1}" data-fuzzy="{3}">{2}</textarea></td>' + 
          '<td class="span1"><label class="checkbox"><input type="checkbox" value="{3}" /></label></td>' + 
         '</tr>').format(ctx.spacify().capitalize(true), data[ctx].original, data[ctx].translated, data[ctx].fuzzy)).appendTo($table.find('tbody'));
    });

    $('html, body').animate({
      scrollTop: $('.fullbar.dark').position().top + $('.fullbar.dark').outerHeight() - $('.navbar.navbar-fixed-top').outerHeight() - 10
    }, 300);

    $('textarea', $table).autosize({
      append: '\n'
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


