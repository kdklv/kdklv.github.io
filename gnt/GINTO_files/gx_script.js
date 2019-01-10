// VARIABLEN
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––

var cur_wght = 150;
var cur_wdth = 100;
var cur_ital = 0;

var min_wght = 0;
var min_wdth = 100;
var min_ital = 0;

var max_wght = 200;
var max_wdth = 200;
var max_ital = 100;

if (window.innerHeight < window.innerWidth) {
    var max_words = 90;
} else {
    var max_words = 55;
}
        
var bg_img = false;
        
var content = [
    "Gucci",
    "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz",
    "Z-Ro  Tay Dizm  Chali 2na TeeCee4800  Jayo Felony Flii Stylz YFN Lucci Vakill Nu Jerzey  Devil  MadeinTYO Cap 1  Uncle Murda  SwizZz One Be Lo  Smif-N-Wessun Royce da 5'9&#34;  Soopafly Keak Da Sneak  Slim Thug Ma$e  Neef Buck  Kurupt",
    "№ 0123456789 ❶❷❸❹❺❻❼❽❾❿ ①②③④⑤⑥⑦⑧⑨⑩ ½⅓⅔¼¾ ⁰¹²³⁴⁵⁶⁷⁸⁹",
    "〈〉【】{}[]「」《》()〔〕『』",
    "▲▶▼◀ △▷▽◁ ↑↗→↘↓↙←↖ ↤↥↦↧↰↱↲↳",
    ".,:;!¡?¿@&#%‰<br> $¢€₿£¥©®℗™℮<br> 〈〉【】{}[]「」《》()〔〕『』",
    "Oh ₿¥<br> Gucci"
];
        
var tool_prev;
var tool = 6;
var num_words;
var num_letters;
var audioContent;
var step = 2;
var trans = '0s';
 
var gintoIsMobile = window.matchMedia("only screen and (max-width: 767px)");



// START
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––

document.getElementById('input_wght').value = cur_wght;
document.getElementById('input_wdth').value = cur_wdth;
document.getElementById('input_italic').value = cur_ital;
        
update_all();
change_content(0);
check_mobile();
if (gintoIsMobile.matches) {
    document.getElementById("tool_6_radio").checked = true;
    change_tool(6);
}

$("#variable input[name='tool']").change(function(){
    tool_prev = tool;
    tool = this.value;
    change_tool(tool);
});
$( "#main_txt" ).keydown(function(e) {
    update_size();
    check_charcount(max_words, e, this);
    if (e.keyCode === 13) {
      document.execCommand('insertHTML', false, '<br><br>');
      return false;
    }
});
$('#main_txt')[0].addEventListener("paste", function(e) {
    e.preventDefault();
    var text = e.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, text);
});

window.addEventListener("resize", resizeThrottler, false);

var resizeTimeout;
function resizeThrottler() {
    if ( !resizeTimeout ) {
        resizeTimeout = setTimeout(function() {
            resizeTimeout = null;
            check_mobile();
        }, 66);
    }
}





// GENERAL FUNCTIONS
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––

function update_ginto(obj,nth,wght,wdth,ital) {
    var span = $($(obj)[nth]);
    if (wght <= 100) {
        span.removeClass();
        span.addClass('ginto1');
    } else if (wght > 100 && wght <= 150){
        span.removeClass();
        span.addClass('ginto2');
    } else if (wght > 150 && wdth == 200) {
        span.removeClass();
        span.addClass('ginto3');
    }
    span.css('font-variation-settings','"wght"' + wght + ', "wdth"' + wdth + ', "ital"' + ital );
}

function update_all() {
    update_ginto($('#main_txt'),0,cur_wght,cur_wdth,cur_ital); 
    for (var i = 0 ; i < $('.update span').length; i++) {
        update_ginto($('.update span'),i,cur_wght,cur_wdth,cur_ital); 
    }
    update_slider();
    update_name();
    update_size();
    update_background();
}

   

function change_tool(this_tool) {
    tool = this_tool;

    if (tool_prev == 2 || tool_prev == 3 || tool_prev == 4 || tool_prev == 5 || tool_prev == 6) {
        $("#main_txt").css('font-size','').css('line-height','').css('white-space','');
        change_content(0);
    }

    if (tool_prev == 2) {
        try{
           audioContent.close();
        }catch(e){
           console.log("YO",e)
        }
    }
    if (tool_prev == 3) {
        document.removeEventListener("mousemove", mousemove_gradient);
    }
    
    if (tool_prev == 5) {
        try{
           clearInterval(random_interval);
        }catch(e){
           console.log("YO",e)
        }
    }
    
    if (tool_prev == 6) {
        try{
           window.removeEventListener("devicemotion", tool_mobile);
        }catch(e){
           console.log("YO",e)
        }
        try{
           document.removeEventListener("mousemove", mousemove_gradient);
        }catch(e){
           console.log("YO",e)
        }
    }

    if (this_tool == 1) {
        $('#tool_1, #ginto_font_name, #change_content').css('display','');
        $('#main_txt')[0].setAttribute("contenteditable", true);
    } else {
        $('#tool_1, #ginto_font_name, #change_content').css('display','none');
        $('#main_txt')[0].setAttribute("contenteditable", false);
    }

    if (this_tool == 2) {

        change_content(2);
//        $('#visualizer').css('display','');

        var max_pieces = 10;
        if (num_letters <= max_pieces) {
            $("#main_txt").lettering();
            $('#main_txt span').addClass('ginto1');
        } else if (num_letters > max_pieces && num_words <= max_pieces && num_letters <= 30) {
            $("#main_txt").lettering('words');
            $('#main_txt span').addClass('ginto1');
        } else {
            change_content(7);
            $("#main_txt").lettering();
            $('#main_txt span').addClass('ginto1');
        }
        tool_mic();

    } else {
        $('#visualizer').css('display','none');
    }

    if (this_tool == 3) {

        change_content(2);
        $("#main_txt")[0].innerHTML = "<p>Z-Ro  Tay Dizm  Chali 2na</p><p>TeeCee4800  Jayo Felony</p><p>Flii Stylz YFN Lucci Vakill</p><p>Nu Jerzey  Devil  MadeinTYO</p><p>Cap 1  Uncle Murda  SwizZz</p><p>One Be Lo  Smif-N-Wessun</p><p>Royce da 5'9&#34;  Soopafly</p><p>Keak Da Sneak  Slim Thug</p><p>Ma$e  Neef Buck  Kurupt</p>";
        $("#main_txt").css('font-size','5vw').css('white-space','nowrap');
        $("#main_txt p").css('margin','0').css('height','5vw');
        $("#main_txt p").lettering('words');
        $('#main_txt span').addClass('ginto1');
        tool_gradient();

    } else {

    }

    if (this_tool == 4) {

        change_content(0);

        $('#main_txt').lettering();
        $('#main_txt span').each(function(){
            $(this).css('font-variation-settings','"wght"' + 200 + ', "ital"' + cur_ital ).css('transition',trans);
            $(this).addClass("ginto_wght");
            this.addEventListener("mouseenter", hoverFnk, false);  
            this.addEventListener("mouseout", hoverout, false);  
        })
        
    } else {

    }
    
    
    if (this_tool == 5) {

        if (gintoIsMobile.matches) {
            
            var max_pieces = 10;
            if (num_letters <= max_pieces) {
                $("#main_txt").lettering();
            } else {
                $("#main_txt").lettering('words');
            }
            tool_random_time();
        } else {
            change_content(2);
            $("#main_txt")[0].innerHTML = "<p>Z-Ro  Tay Dizm  Chali 2na</p><p>TeeCee4800  Jayo Felony</p><p>Flii Stylz YFN Lucci Vakill</p><p>Nu Jerzey  Devil  MadeinTYO</p><p>Cap 1  Uncle Murda  SwizZz</p><p>One Be Lo  Smif-N-Wessun</p><p>Royce da 5'9&#34;  Soopafly</p><p>Keak Da Sneak  Slim Thug</p><p>Ma$e  Neef Buck  Kurupt</p>";
            $("#main_txt").css('font-size','5vw').css('white-space','nowrap');
            $("#main_txt p").css('margin','0').css('height','5vw');
            $("#main_txt p").lettering('words');
            tool_random();
            $('#main_txt span').each(function(){
                this.addEventListener("mouseenter", tool_random_hover, false);  
            })
        }
            
        
    } else {

    }
    

    if (this_tool == 6) {

        $('#main_txt')[0].innerHTML = "<span>Gucci</span><br><span>Gucci</span><br><span>Gucci</span><br><span>Gucci</span><br><span>Gucci</span><br><span>Gucci</span>"
        $("#main_txt").css('font-size','4.2rem').css('line-height','3.7rem').css('white-space','nowrap');
        $('#main_txt span').addClass("ginto1");

        if(window.DeviceMotionEvent){
            window.addEventListener("devicemotion", tool_mobile, false);
        }

    } else {

    }
}
        



function change_content(val) {
    $('#main_txt')[0].innerHTML = content[val];
    update_size();
}
function change_background(obj) {
    if (bg_img) {
        bg_img = false;
        obj.innerHTML = "&#x1f62c;";
    } else {
        bg_img = true;
        obj.innerHTML = "&#x1f636;";
    }
    update_background();
}
function update_background() {
    if (bg_img) {
        $("#variable").css('color','#ffffff');
        $(".text_container").css('background-image','url(gx/grillz.jpg)');
        $("#main_txt").css('mix-blend-mode','difference');
        $("input").addClass('white');
    } else {
        $("#variable").css('color','');
        $(".text_container").css('background-image','')
        $("#main_txt").css('mix-blend-mode','');
        $("input").removeClass('white');
    }
}

function check_charcount(max_words, e, el) {   
    if(e.which != 8 && !e.metaKey && $(el).text().length > max_words) {
       e.preventDefault();
    }
}
        

function update_size() {
    var $quote = $("#main_txt");

    num_words = $quote.text().split(" ").length;
    num_letters = $quote.text().split(" ").join("").length;

    if (window.innerHeight < window.innerWidth) {
        if ((num_letters >= 0) && (num_letters < 7)) {
            var size = 22;
        }
        else if ((num_letters >= 7) && (num_letters < 15)) {
            var size = 15;
        }
        else if ((num_letters >= 15) && (num_letters < 20)) {
            var size = 13;
        }
        else if ((num_letters >= 20) && (num_letters < 25)) {
            var size = 11;
        }
        else if ((num_letters >= 25) && (num_letters < 30)) {
            var size = 9;
        }
        else if ((num_letters >= 30) && (num_letters < 40)) {
            var size = 8;
        }
        else {
            var size = 7;
        }
    } else {
        if ((num_letters >= 0) && (num_letters < 10)) {
            var size = 20;
        }
        else if ((num_letters >= 10) && (num_letters < 20)) {
            var size = 17;
        }
        else if ((num_letters >= 20) && (num_letters < 30)) {
            var size = 15;
        }
        else {
            var size = 13;
        }
    }

    var fontsize = size + "vw";
    var lineheight = (size * 1.05) + "vw";
    $quote.css("font-size", fontsize);
    $quote.css("line-height", lineheight);
};


function check_mobile() {
    gintoIsMobile = window.matchMedia("only screen and (max-width: 767px)");
    if (gintoIsMobile.matches) {
        $('#tool_3_radio').parent().css('display','none');
        $('#tool_4_radio').parent().css('display','none');
        $('#tool_6_radio').parent().css('display','');
    } else {
        $('#tool_3_radio').parent().css('display','');
        $('#tool_4_radio').parent().css('display','');
        $('#tool_6_radio').parent().css('display','');
    }
}







// TOOLS
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––

// Slider
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––

function var_wght(myValue){
    cur_wght = myValue;
    update_all();
}
function var_wdth(myValue){
    cur_wdth = myValue;
    update_all();
}
function var_ital(myValue){
    cur_ital = myValue;
    update_all();
}
function update_slider() {
    if (cur_wght > 150 && cur_wdth == 200) {
        disableWdth();
    } else {
        enableWdth();
    }
    if (cur_wdth == 200) {
        increaseWght();
    } else {
        decreaseWght();
    }
}
function disableWdth() {
    document.getElementById('input_wdth').disabled = true;
    $('#input_wdth').addClass('disabled');
}
function enableWdth() {
    document.getElementById('input_wdth').disabled = false;
    $('#input_wdth').removeClass('disabled');
}
function increaseWght() {
    $('#input_wght').removeClass('short');
    document.getElementById('input_wght').max = 200;
}
function decreaseWght() {
    $('#input_wght').addClass('short');
    document.getElementById('input_wght').max = 150;
}
function update_name() {
    if (cur_wght <= 30) {
        var name_wght = "Hairline";
    } else if (cur_wght <= 60 && cur_wght > 30) {
        var name_wght = "Thin";
    } else if (cur_wght <= 80 && cur_wght > 60) {
        var name_wght = "Light";
    } else if (cur_wght <= 100 && cur_wght > 80) {
        var name_wght = "Regular";
    } else if (cur_wght <= 125 && cur_wght > 100) {
        var name_wght = "Medium";
    } else if (cur_wght <= 150 && cur_wght > 125) {
        var name_wght = "Bold";
    } else if (cur_wght <= 175 && cur_wght > 150) {
        var name_wght = "Black";
    } else if (cur_wght <= 200 && cur_wght > 175) {
        var name_wght = "Ultra";
    }             
    if (cur_wdth == 100) {
        var name_wdth = "Normal";
    } else if (cur_wdth == 200) {
        var name_wdth = "Nord";
    } else {
        var name_wdth = getBruch((cur_wdth - 100)) + " Nord";
    }
    if (cur_ital == 0) {
        var name_ital = "";
    } else if (cur_ital == 100) {
        var name_ital = "Italic";
    } else {
        var name_ital = getBruch(cur_ital) + " Italic";
    }

    $('#ginto_font_name span')[0].innerHTML = "Gucci " + name_wght + " " + name_wdth + " " + name_ital;
    $('#ginto_font_name span')[1].innerHTML = "Gucci " + cur_wght + " " + cur_wdth + " " + cur_ital;
}

function getBruch(perc) {
    var all_bruch = ["¼", "⅓", "½", "⅔", "¾"];
    var steps = [0,25,33.3333333,50,66.6666666,75,100]
    if (perc <= (steps[1] + (steps[2] - steps[1]) / 2)) {
        var bruch = all_bruch[0];
    } else if (perc <= (steps[2] + (steps[3] - steps[2]) / 2) && perc > (steps[1] + (steps[2] - steps[1]) / 2)) {
        var bruch = all_bruch[1];
    } else if (perc <= (steps[3] + (steps[4] - steps[3]) / 2) && perc > (steps[2] + (steps[3] - steps[2]) / 2)) {
        var bruch = all_bruch[2];
    } else if (perc <= (steps[4] + (steps[5] - steps[4]) / 2) && perc > (steps[3] + (steps[4] - steps[3]) / 2)) {
        var bruch = all_bruch[3];
    } else {
        var bruch = all_bruch[4];
    }
    return bruch;
}
   


// Mic
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––
        
function tool_mic() {
    "use strict";
    var paths = document.getElementsByTagName('path');
    var visualizer = document.getElementById('visualizer');
    var mask = visualizer.getElementById('mask');
    var path;
    var report = 0;

    var soundAllowed = function (stream) {

        window.persistAudioStream = stream;

        audioContent = new AudioContext();
        var audioStream = audioContent.createMediaStreamSource( stream );
        var analyser = audioContent.createAnalyser();
        audioStream.connect(analyser);
        analyser.fftSize = 1024;

        var frequencyArray = new Uint8Array(analyser.frequencyBinCount);
        visualizer.setAttribute('viewBox', '0 0 255 255');

        for (var i = 0 ; i < 255; i++) {
            path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            mask.appendChild(path);
        }
        var doDraw = function () {
            requestAnimationFrame(doDraw);
            analyser.getByteFrequencyData(frequencyArray);
            var adjustedLength;

            //SVG
            for (var i = 0 ; i < 255; i++) {
                adjustedLength = Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 5);
                paths[i].setAttribute('d', 'M '+ (i) +',255 l 0,-' + adjustedLength);
            }

            //TEXT
            if (tool == 2) {
                for (var i = 0 ; i < $('#main_txt span').length; i++) {

                    var wght = frequencyArray[i+5]*1.2;
                    var wdth = cur_wdth;
                    var ital = cur_ital;

                    update_ginto($('#main_txt span'),i,wght,wdth,ital); 
                }
            }
        }
        doDraw();
    }
    var soundNotAllowed = function (error) {
        console.log(error);
    }
    navigator.getUserMedia({audio:true}, soundAllowed, soundNotAllowed);
};
        
        
        
        
        
        

        
        
        
// Gradient
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––        

function tool_gradient() {
    document.addEventListener("mousemove", mousemove_gradient);
}

var gradient_timeout;
function mousemove_gradient(e) {
    if ( !gradient_timeout ) {
        gradient_timeout = setTimeout(function() {
            gradient_timeout = null;
            var mouseX = e.clientX;
            var mouseY = e.clientY;

            for (i = 0; i < $('#main_txt span').length; i++) { 
                styleLetterNumber(i,mouseX,mouseY);
            }
        }, 66);
    }
}
        
function styleLetterNumber(numbr,mx,my) {

    var allLetters = $('#main_txt span');
    var span = $(allLetters[numbr])

    var posX = span.offset().left + (span.width() / 2);
    var posY = span.offset().top + (span.height() / 2);


    var distX = Math.abs(mx - posX);
    var distY = Math.abs(my - posY);
    var dist = Math.sqrt((distX * distX) + (distY * distY));

    var wght = (dist / 800) * 200
    var wdth = 200;
    var ital = cur_ital;


    update_ginto(span,0,wght,wdth,ital);
}

        

        
        
        
        
        
        
        
        
        
        
// Hover
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––        

var hvrinterval = 0;

function hoverFnk() {

    var obj = $(this);

    var newweight = obj.css('font-variation-settings').split(' ')[1].split(',')[0];
    var dir = 'back';

    hvrinterval = setInterval(function(){
        if (newweight <= min_wght) {
            dir = 'for';
        } else if (newweight >= max_wght) {
            dir = 'back';
        }

        if (dir == 'for') {
            newweight = newweight+step;
        } else if (dir == 'back') {
            newweight = newweight-step;
        }

        if (newweight < max_wght && newweight > min_wght) {
//            update_ginto(this,0,newweight,200,cur_ital);
            obj.css('font-variation-settings','"wght"' + newweight + ', "ital"' + cur_ital );
        } 

        if (newweight <= min_wght) {
//            update_ginto(this,0,(min_wght + 1),200,cur_ital);
            obj.css('font-variation-settings','"wght"' + (min_wght + 1) + ', "ital"' + cur_ital );
        } else if (newweight >= max_wght) {
//            update_ginto(this,0,(min_wght - 1),200,cur_ital);
            obj.css('font-variation-settings','"wght"' + (max_wght - 1) + ', "ital"' + cur_ital );
        }

    }, 20);
}
function hoverout() {
    clearInterval(hvrinterval);
}
        
        
        


        
// Random
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––    

var random_interval = 0;

function tool_random() {
    
    for (var i = 0 ; i < $('#main_txt span').length; i++) {
        var wght = Math.floor(Math.random() * max_wght) + min_wght;
        var wdth = Math.floor(Math.random() * max_wdth) + min_wdth;
        var ital = Math.floor(Math.random() * max_ital) + min_ital;
        update_ginto($('#main_txt span'),i,wght,wdth,ital); 
    }
}


function tool_random_hover() {
    
    var obj = $(this);

    var wght = Math.floor(Math.random() * max_wght) + min_wght;
    var wdth = Math.floor(Math.random() * max_wdth) + min_wdth;
    var ital = Math.floor(Math.random() * max_ital) + min_ital;

    update_ginto(obj,0,wght,wdth,ital); 
}

function tool_random_time() {
    random_interval = setInterval(function(){
        tool_random();
    },500);
}



        
// Mobile
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––        

function tool_mobile(event){

    var max_x = 5.5;
    var max_y = 10;

    var angleX = event.accelerationIncludingGravity.x;
    if (angleX < 0) {
        cur_ital = (Math.abs(event.accelerationIncludingGravity.x) / max_x) * max_ital;
    } else {
        cur_ital = 0;
    }

    function update_span(nth) {

        var angleY = event.accelerationIncludingGravity.y;
        var mult = (nth - Math.floor($('#main_txt span').length / 2)) / Math.ceil($('#main_txt span').length / 2);
        var nth_wght = ((-Math.abs(angleY) + (max_y / 2)) / (max_y / 2)) * (max_wght / 2) * mult + (max_wght / 2);

        update_ginto('#main_txt span',nth,nth_wght,200,cur_ital);
    }

    for (var i = 0 ; i < $('#main_txt span').length; i++) {
        update_span(i);
    }

}

        
        
        
        
        
        
        
        
        
        
        
        

