/*jshint browser:true, indent:2, laxcomma:true, jquery:true, devel:true */

$(function () {
 
  
  var _createTable = function (data) {
    var $table = $('#table').show();
    
    Object.keys(data).forEach(function (ctx) {
      $('<tr><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td></tr>'.format(ctx, data[ctx].original, data[ctx].translated, data[ctx].fuzzy)).appendTo($table);
    });
    
  };
  
  
  var _handleFileSelect = function (evt) {
    var file = evt.target.files[0];

    if (!file || file.length > 500 * 1000 || file.type !== 'application/json' || file.name.indexOf('.json') === -1) {
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
  
});


