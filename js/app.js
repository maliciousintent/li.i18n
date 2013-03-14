/*jshint browser:true, indent:2, laxcomma:true, eqnull:true, jquery:true, devel:true */
/*global Downloadify */

$(function () {
  var $table = $('#table');
  
  
  // -~- Internals -~-
  
  var _createTable = function (data) {
    var tabindex = 100;
    
    $('.table-hidden').show();
    $table.find('tbody').html('');

    Object.keys(data).forEach(function (ctx) {
      var fuzzyChecked = (data[ctx].fuzzy === true) ? 'checked="checked"' : '';
      
      $(('<tr class="fuzzy-{3}">' + 
          '<td class="span1">{0}</td>' + 
          '<td class="span5"><p class="original">{1}</p></td>' + 
          '<td class="span5"><textarea tabindex="{5}" class="translation input-block-level" data-ctx="{0}" data-original="{1}" data-fuzzy="{3}">{2}</textarea></td>' + 
          '<td class="span1"><label class="checkbox"><input class="fuzzy-checkbox" type="checkbox" value="true" {4} /></label></td>' + 
         '</tr>').format(ctx.spacify().capitalize(true), data[ctx].original, data[ctx].translated, data[ctx].fuzzy, fuzzyChecked, tabindex)).appendTo($table.find('tbody'));
      tabindex++;
    });
    
    $('.translation', $table).on('change', function removeFuzzy(e) {
      var $check = $(e.target).parent('td').next().find('input[type="checkbox"]');
      if ($check.is(':checked')) {
        $check.trigger('click');
      }
    });
    
    $('input[type="checkbox"]', $table).on('change', function toggleFuzzy(e) {
      var $this = $(e.target);
      
      if ($this.is(':checked')) {
        $this.closest('tr').addClass('fuzzy-true');
      } else {
        $this.closest('tr').removeClass('fuzzy-true');
      }
    });

    $('html, body').animate({
      scrollTop: $('.fullbar.dark').position().top + $('.fullbar.dark').outerHeight() - $('.navbar.navbar-fixed-top').outerHeight() - 10
    }, 300);

    $('textarea', $table).autosize({
      append: '\n'
    });
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
  
  
  // -~- Event Listeners -~-
  
  $('#file')[0].addEventListener('change', _handleFileSelect, false);
  
  $('#browse').on('click', function () {
    document.getElementById('file').click();
    return false;
  });
  
  $('#saveBtn').on('click', function (e) {
    var $this = $(e.target);
    $this.attr('disabled', 'disabled');
    
    window.localStorage.setObject('trans', _getTable());
    
    setTimeout(function () {
      $this.removeAttr('disabled'); // Si, mi permetto di usare $this comunuqe!
    }, 2000);
  });
  
  
  // // Quick unfuzzy
  // $table.find('#fuzzyTh').on('click', function () {
  //   $table.find('.fuzzy-checkbox').each(function (i, e) {
  //     e = $(e);
  //     if (e.is(':checked')) {
  //       e.trigger('click');
  //     }
  //   });
  // });


  // -~- Downloadify -~-
  Downloadify.create('downloadBtn', {
    filename: function () {
      return 'translated.json';
    },
    data: function () { 
      return JSON.stringify(_getTable());
    },
    onComplete: function () { alert('Congratulations! Your file has been saved.'); },
    onCancel: function () { },
    onError: function () { alert('Sorry, we could not download your file. Try again.'); },
    swf: 'js/downloadify.swf',
    downloadImage: 'img/download.png',
    width: 100,
    height: 30,
    transparent: true,
    append: false
  });

  
  // -~- Save user's life -~-
  
  // Restore last save
  var saved = window.localStorage.getObject('trans');
  if (saved != null && !Object.equal(saved, {})) {
    if (confirm('Hey, there is an autosaved version of your work.\nDo you want to restore it?')) {
      _createTable(saved);
    } else {
      window.localStorage.setObject('trans', {});
    }
  }

  // Prevent "accidental" page refresh
  window.onbeforeunload = function () {
    return null; // @TODO: @FIXME: Uncomment - 'If you close this page all your changes will be lost. Continue?';
  };

  // Auto save every 10s
  (function autoSave() {
    if ($table.is(':visible')) {
      window.localStorage.setObject('trans', _getTable());
      $('#autoSaveDetails').html(new Date().toLocaleFormat());
    }
    
    setTimeout(autoSave, 10000);
  })();
  
});


