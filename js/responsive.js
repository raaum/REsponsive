/*
    REsponsive
    Copyright 2015 Greg Raaum
    by Greg Raaum <greg.raaum@yahoo.com>
    Requires: jQuery 2+, DataTables 1+, jQuery Simple Slider
*/

/**
  * @summary     REsponsive
  * @description Application for testing and demonstrating web design responsiveness
  * @version     1.0b
  * @file        frog.responsive.js
  * @author      Greg Raaum <greg.raaum@yahoo.com>
  * @contact     greg.raaum@yahoo.com
  * @copyright   Copyright 2015 Greg Raaum
*/

var url = 'http://www.leodislager.com', w = 550, h = 800,
    maxwidth = 1500, progress = 0, go = 0, stop = 1, interval = 0, degrees = 0;

// greg's algorithm for displaying appropriate # of table rows. it's magic.
var browserHeight = $(window).height(); 
var browserWidth = $(window).width();
var ar = (((browserHeight - 300) / 100) * 0.001) + 0.014;
var factor = browserHeight * ar;
var displayLength = Math.round( ((factor * 1) / 1) - 2 );  // -2 to make room for the <h1>

$(document).ready(function() {
  var table = $('#listings').DataTable( {
    "ajax": 'data/devices.json',
    "order": [[0, 'asc']],
    "pagingType": "simple_numbers",
    "displayLength": displayLength,
    "stateSave": false,
    "language": {
      "search": "_INPUT_",
      "lengthMenu": "",
      "zeroRecords": "No results",
      "info": "_PAGE_ of _PAGES_ pages",
      "infoEmpty": "No results",
      "infoFiltered": "(filtered from _MAX_)",
      "paginate": { "next": "&gt;", "previous": "&lt;" }
    },
    "info": false,
    "sort": true,
    "columns": [
        { "data": "device", "className": "dt-left" },
        { "data": "platform", "className": "dt-left" },
        { "data": "os", "className": "dt-left"  },
        { "data": "width", "className": "dt-center"  },
        { "data": "height", "className": "dt-center"  },
        { "data": "date", "className": "dt-center"  }
    ],
    "columnDefs": [
      {
        "render": function (data, type, row) { return data + 'x' + row.height; },
        "targets": [3]
      },
      { "targets": [1, 2, 4, 5 ], "visible": false }
    ],
    "dom": '<"top"f><"clear">rt<"clear"><"bottom"p><"clear">'
  });
  var tablesites = $('#examples').DataTable( {
    "ajax": 'data/sites.json',
    "order": [[0, 'asc']],
    "pagingType": "simple_numbers",
    "displayLength": displayLength,
    "language": {
      "search": "_INPUT_",
      "lengthMenu": "",
      "zeroRecords": "No results",
      "info": "_PAGE_ of _PAGES_ pages",
      "infoEmpty": "No results",
      "infoFiltered": "(filtered from _MAX_)",
      "paginate": { "next": "&gt;", "previous": "&lt;" }
    },
    "stateSave": false,
    "info": false,
    "sort": true,
    "search": true,
    "columns": [
        { "data": "name", "className": "dt-left" },
        { "data": "url", "className": "dt-left"  }
    ],
    "dom": '<"top"f><"clear">rt<"clear"><"bottom"p><"clear">'
  });
  $('#examples tbody').on('click', 'tr.odd, tr.even', function () {
    var tr = $(this).closest('tr');
    $('tr').removeClass('selected');
    tr.addClass('selected');
    var row = tablesites.row(tr);
    var d = row.data();
    var sitename = d.name;
    var siteurl = d.url;
    $('#website').attr('src', siteurl);
    $("#url, #output-url").val(siteurl);
  });
  $('#listings tbody').on('click', 'tr.odd, tr.even', function () {
    var tr = $(this).closest('tr');
    $('tr').removeClass('selected');
    tr.addClass('selected');
    var row = table.row(tr);
    var d = row.data();
    var w = d.width;
    var h = d.height;
    var device = d.device;
    $('#width').val(d.width);
    $('#height').val(d.height);
    $("#output-width").val(w);
    $('#output-height').val(h);
    $('#website').animate({'width': d.width + 'px', 'height': d.height + 'px'}, 700);
  });
  $('div#infopanel').drags();
});
$(function() {
  if (browserWidth && browserWidth < 1200) { 
    $("body").replaceWith('<h2 style="padding: 15px;">This site is built to run on a 20 inch or larger screen.</h2>');
  }
  var url = $('#url').val();
  $('#infowh').text('W: ' + w + ' H: ' + h);
  $('#infogridlines').text('25 PIXEL GRID');
  $('#infocrosshairs').text('X: 0 Y: 0');
  $('#infoopacity').text('100% OPACITY');
  $('#website').attr('src', url);
  $('#website').css({'width': w + 'px', 'height': h + 'px'});
  $("#output-url").val(url);
  $("#output-width").val(w);
  $('#output-height').val(h);
  $("#width, #height").change(function() { stop(); });
  
  $("#url").change(function() {
    var w = $('#width').val();
    var h = $('#height').val();
    var url = $('#url').val();
    $('#website').attr('src', url);
    $("#output-url").val(url);
    $("#output-width").val(w);
    $("#output-height").val(h);
  });
  $("#slider").bind("slider:changed", function(event, data) {
    var w = data.value;
    $('#width').val(w);
    stop();
  });
  $("#slider-height").bind("slider:changed", function (event, data) {
    var h = data.value;
    $('#height').val(h);
    stop();
  });
  $("#crosshairscheck").click(function(event) {
    if ($('#crosshairscheck').is(":checked")) {
      $('#crosshairscheck').prop('checked', true);
      $("#crosshairs, .ruler").show("slow");
      $('#rulercheck').prop('checked', true);
      $('div.viewport').css({'top':'113px','left':'21px'});
      $('div.devices, div.sites, div.export').css({'top':'113px'});
    }
    else {
      $("#crosshairs").hide();
      $('#crosshairscheck').prop('checked', false);
    }
  });
  $("#rulercheck").click(function(event) {
    if ($('#rulercheck').is(":checked")) {
      $(".ruler").show("slow");
      $('div.viewport').css({'top':'113px','left':'21px'});
      $('div.devices, div.sites, div.export').css({'top':'113px'});
    }
    else {
      $('#guidescheck').prop('checked', false);
      $(".ruler").removeClass("guides");
      $(".ruler").hide();
      $('div.viewport').css({'top':'91px','left':'0px'});
      $('div.devices, div.sites, div.export').css({'top':'91px'});
    }
  });
  $("#orientcheck").click(function(event) {
    var w = $('#height').val();
    var h = $('#width').val();
    $('#width').val(w);
    $('#height').val(h);
    $('#website').css({'width': w + 'px', 'height': h + 'px'});
  });
  $("#hidecheck").click(function(event) {
    if ($('#hidecheck').is(":checked")) {
      $("#devices, #sites, #export, .ruler, #infopanel, #crosshairs, #progress, #copy").hide();
      $(".header").hide();
      $(".header2").show();
      $('div.viewport').animate({'top':'0px','left':'0px' });
      $("div.viewport").removeClass("y x all");
      $("div.viewport").addClass("none");
      $('#sitescheck, #exportcheck, #devicescheck, #orientcheck, #guidescheck, #crosshairscheck').prop('checked', false);
      $("#sitescheck, #exportcheck, #devicescheck, #orientcheck, #guidescheck, #crosshairs").hide();
      $('div.viewport').css({'z-index': '1'});
      $('.header2').css({'z-index': '1000'});
    }
    else {
      $(".header2").hide();
      $(".header").show();
      $('#rulercheck').prop('checked', true);
      $(".ruler, #infopanel, #copy").show(); 
      $('#infopanel').css({'right': '42px'});
      $('#copy').css({'right': '-40px'});
      $('div.viewport').animate({'top':'113px','left':'21px'});
      $("div.viewport").removeClass("y x none");
      $("div.viewport").addClass("all");
    }
  });
  $("#guidescheck").click(function(event) {
    if ($('#guidescheck').is(":checked")) {
      $('#rulercheck').prop('checked', true);
      $(".ruler").show("slow");
      $('div.viewport').css({'top':'113px','left':'21px'});
      $('div.devices, div.sites, div.export').css({'top':'113px'});
      $(".ruler").addClass("guides");
    }
    else {
      $(".ruler").removeClass("guides");
    }
  });
  $("#exported").click(function(event) {
    $("#cancelexport, #exported").hide("slow");
  });
  $("#ycheck").click(function(event) {
    if ($('#ycheck').is(":checked")) {
      if ($('#xcheck').is(":checked")) {
        $("div.viewport").removeClass("x y none");
        $("div.viewport").addClass("all");
      }
      else {
        $("div.viewport").removeClass("x none all");
        $("div.viewport").addClass("y");
      }
    }
    else {
      if ($('#xcheck').is(":checked")) {
        $("div.viewport").removeClass("y none all");
        $("div.viewport").addClass("x");
      }
      else {
        $("div.viewport").removeClass("x y all");
        $("div.viewport").addClass("none");
      }
    }
  });
  $("#xcheck").click(function(event) {
    if ($('#xcheck').is(":checked")) {
      if ($('#ycheck').is(":checked")) {
        $("div.viewport").removeClass("x y none");
        $("div.viewport").addClass("all");
      }
      else {
        $("div.viewport").removeClass("y none all");
        $("div.viewport").addClass("x");
      }
    }
    else {
      if ($('#ycheck').is(":checked")) {
        $("div.viewport").removeClass("x none all");
        $("div.viewport").addClass("y");
      }
      else {
        $("div.viewport").removeClass("x y all");
        $("div.viewport").addClass("none");
      }
    }
  });
  $("#devicescheck").click(function(event) {
    if ($('#devicescheck').is(":checked")) {;
      $('#sitescheck, #exportcheck').prop('checked', false);
      $('div.sites, div.export').animate({'right': '-400px'}, 400, function() { $('div.sites, div.export').hide(); });
      $('#copy').animate({'right': '360px'}, 400);
      $('div.devices').show().animate({'right': '0px'}, 400);
      $('#infopanel').animate({'right': '442px'}, 400);
      $('input[type=search]').attr({'placeholder': 'search'});
      $('#devicescheck').prop('checked', true);
    }
    else {
      $('div.devices').animate({'right': '-400px'}, 400, function() { $('div.devices').hide(); });
      $('#infopanel, #copy').animate({'right': '42px'}, 400);
      $('#devicescheck').prop('checked', false);
    }
  });
  $("#sitescheck").click(function(event) {
    if ($('#sitescheck').is(":checked")) {
      $('#devicescheck, #exportcheck').prop('checked', false);
      $('div.devices, div.export').animate({'right': '-400px'}, 400, function() { $('div.devices, div.export').hide(); });
      $('#copy').animate({'right': '360px'}, 400);
      $('div.sites').show().animate({'right': '0px'}, 400);
      $('#infopanel').animate({'right': '442px'}, 400);
      $('input[type=search]').attr({'placeholder': 'search'});
      $('#sitescheck').prop('checked', true);
    }
    else {
      $('div.sites').animate({'right': '-400px'}, 500, function() { $('div.sites').hide(); });
      $('#infopanel, #copy').animate({'right': '42px'}, 400);
      $('#sitescheck').prop('checked', false);
    }
  });
  $("#exportcheck").click(function(event) {
    if ($('#exportcheck').is(":checked")) {
      $("#cancelexport, #exported").show();
      $('#sitescheck, #devicescheck').prop('checked', false);
      $('div.devices, div.sites').animate({'right': '-400px'}, 400, function() { $('div.devices, div.sites').hide(); });
      $('#copy').animate({'right': '360px'}, 400);
      $('div.export').show().animate({'right': '0px'}, 400);
      $('#infopanel').animate({'right': '442px'}, 400);
      $('#exportcheck').prop('checked', true);
    }
    else {
      $('div.export').animate({'right': '-400px'}, 400, function() { $('div.export').hide(); });
      $('#infopanel, #copy').animate({'right': '42px'}, 400);
      $('#exportcheck').prop('checked', false);
    }
  });
  $("#closeexport, #cancelexport").click(function(event) {
    $('div.export').animate({'right': '-400px'}, 400);
    $('#infopanel, #copy').animate({'right': '42px'}, 400);
    $("div.export").hide("slow");
    $('#exportcheck').prop('checked', false);
    stop();
  });
  $("#closesites").click(function(event) {
    $('div.sites').animate({'right': '-400px'}, 400);
    $('#infopanel, #copy').animate({'right': '42px'}, 400);
    $("div.sites").hide("slow");
    $('#sitescheck').prop('checked', false);
    stop();
  }); 
  $("#closedevices").click(function(event) {
    $('div.devices').animate({'right': '-400px'}, 400);
    $('#infopanel, #copy').animate({'right': '42px'}, 400);
    $("div.devices").hide("slow");
    $('#devicescheck').prop('checked', false);
    stop();
  }); 
  $("#gridlines").bind("slider:changed", function(event, data) {
    var tilesize = data.value;
    var gridsize = (tilesize / 2);
    var tilepos = (gridsize + 1) / 2;
    if (gridsize < 4) { tilesize = 0; gridsize = 0; }
    $('div.viewport').css({'background-size': tilesize + 'px ' + tilesize + 'px' });
    $('div.viewport').css({'background-position': tilepos + 'px ' + tilepos + 'px' });
    $('#infogridlines').text(gridsize + ' PIXEL GRID');
  });
  $("#opacity").bind("slider:changed", function(event, data) {
    opacity = data.value;
    $('#website').css({'opacity': opacity});
    $('#infoopacity').text(Math.round(opacity * 100) + '% OPACITY');
  });
  $('#width,#height,#pause').click(function(event) {
    event.preventDefault();
    stop();
  });
  $('#play').click(function(event) {
    event.preventDefault();
    $(".progress, #pause").show();
    $("#play").hide();
    go();
  }); 
  function go() {
    var count = 1;
    interval = setInterval(function() { autoplay() }, 5);

    function autoplay() {
      progress = Math.round((w / maxwidth) * 100);
      $('.progress').text(progress + '% of ' + maxwidth + ' pixels');
      if (w >= maxwidth) { w = 200; count+=1;}
      $('#website').css({'width': w + 'px'});
      $('#width').val(w);
      $('#height').val(h);
      $('#infowh').text('W: ' + w + ' H: ' + h);
      if (w < maxwidth) { w+=1; }
      if (count >= 5) { stop(); }
    };
  };
  function stop() {
    if (interval) {
      clearInterval(interval);
    }
    $('#website').css({'width': $('#width').val() + 'px', 'height': $('#height').val() + 'px'});
    var w = $('#width').val();
    var h = $('#height').val();
    var url = $('#url').val();
    $("#output-url").val(url);
    $("#output-width").val(w);
    $("#output-height").val(h);
    $(".progress, #pause").hide();
    $("#slider-height").simpleSlider("setValue", h);
    $("#slider").simpleSlider("setValue", w);
    $("#play").show();
    //$('.pixelwidth').text(w + ' x ' + h);
    $('#infowh').text('W: ' + w + ' H: ' + h);
  };
});

$(function(){
  $('.viewport').on('mousemove',function(e) {
    var crossy = (e.pageY - 113);
    var crossx = (e.pageX - 21);
    $('#infocrosshairs').text('X: ' + crossx + ' Y: ' + crossy);

    if ($('#crosshairscheck').is(":checked")) {
      var left = e.pageX;
      $('#cross-h').css('top', e.pageY);
      $('#cross-v').css('left', e.pageX);
      $('.crosshairs').css({'left': left + 30 + 'px', 'top': '-30px'});
      $('.crosshairs').text('X: ' + crossx + ' Y: ' + crossy);
    }
  });
});
/* make something draggable */
(function($) { $.fn.drags = function(opt) {
  opt = $.extend({handle:"",cursor:"move"}, opt);

  if(opt.handle === "") {
    var $el = this;
  }
  else {
    var $el = this.find(opt.handle);
  }
  return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
    if (opt.handle === "") {
      var $drag = $(this).addClass('draggable');
    }
    else {
      var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
    }
    var z_idx = $drag.css('z-index'),
        drg_h = $drag.outerHeight(), 
        drg_w = $drag.outerWidth(),
        pos_y = $drag.offset().top + drg_h - e.pageY,
        pos_x = $drag.offset().left + drg_w - e.pageX;

    $drag.css('z-index', 1000).parents().on("mousemove", function(e) {
      var movetop = e.pageY + pos_y - drg_h;
      var moveleft = e.pageX + pos_x - drg_w;

      if (movetop < 120) { movetop = 120; }
      else if (movetop > ($(document).height() - 135)) { movetop = $(document).height() - 135; }

      if (moveleft < 30) { moveleft = 30; }
      else if (moveleft > ($(document).width() - 140)) { moveleft = $(document).width() - 140; }
      
      $('.draggable').offset({ top:movetop, left:moveleft }).on("mouseup", function() {
          $(this).removeClass('draggable').css('z-index', z_idx);
      });
    });
    e.preventDefault(); // disable selection
    }).on("mouseup", function() {
      if(opt.handle === "") {
        $(this).removeClass('draggable');
      }
      else {
        $(this).removeClass('active-handle').parent().removeClass('draggable');
      }
    });
  }
})(jQuery);
