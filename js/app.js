/*jshint browser:true, indent:2, laxcomma:true, jquery:true, devel:true */

$(function () {
  var json;
  
  
  var _createTable = function (json) {
    var $table = $('#table').show();
  };
  
  
  var _handleFileSelect = function (evt) {
    var file = evt.target.files[0];

    if (!file || file.length > 500 * 1000 || file.type !== 'application/json' || file.name.indexOf('.json') === -1) {
      alert('I\'m sorry but the file format you have uploaded is not supported (or your browser is too old).');
      return;
    }
    
    var reader = new FileReader();
    reader.addEventListener('load', function (e) {
      try {
        json = JSON.parse(e.target.result);
      } catch (err) {
        alert('The file you uploaded is not valid (technical details: JSON decode error)');
        throw err;
      }
    });
    
    reader.readAsText(file);
  };

  
  $('#file')[0].addEventListener('change', _handleFileSelect, false);
  
});


