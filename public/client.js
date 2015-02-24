function loadTemplate(name, cb) {
    $.get('templates/' + name + '.html', function(data) {
        cb(data);
    });
}

function getPlaceImage(mission, players) {
    switch (mission) {
        case 1:
            return players < 8 ? "2" : "3";
        case 2:
            return players < 8 ? "3" : "4";
        case 3:
            if (players == 5) return "2";
            return players < 8 ? "3" : "4";
        case 4:
            if (players == 7) return "4_star";
            return players < 7 ? "3" : "5_star";
        case 5:
            if (players == 5) return "3";
            return players < 8 ? "4" : "5";
    }
}

function drawBoard(players) {
    loadTemplate("board", function(template) {
        $("#main").html(template);

        $("#board").css({width:"1280px"});
        $(".place-container").each(function(i) {
            var imageName = getPlaceImage(i+1, players);
            var className = 'place-count';
            if (imageName.length > 1) // it's a star
                className += ' place-count-star';
            $(this).prepend("<img class='" + className + "' src='images/board_" + imageName + ".png'>");
        });
        $('img').on('dragstart', function(){return false;});
    });
}

$(document).ready(function() {

   $("#new-game").click(function() {
       drawBoard(10);
   });

});
