$(document).ready(function() {
	console.log("edsf");
$( "#startGame" ).submit(function( event ) {
 	alert("dsf");
  // Stop form from submitting normally
  event.preventDefault();
 
  // Get some values from elements on the page:
  var $form = $( this ),
    term = ($('#noUsers').val());
  // Send the data using post
  $.post( "/start/" + term, function(done) {alert(done)});
 
});
});