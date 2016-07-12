/*! grunt-grunticon Stylesheet Loader - v2.1.6 | https://github.com/filamentgroup/grunticon | (c) 2015 Scott Jehl, Filament Group, Inc. | MIT license. */

var loadCSS = require('loadCSS');
var onloadCSS = require('onloadCSS');

function loadClasses(){
  document.documentElement.className = document.documentElement.className.replace( /(?:^|\s)icons-loading(?!\S)/ , '' );
  document.documentElement.className += ' icons-loaded';
}

var grunticon = function grunticon( css, callback ){
  "use strict";

  function onload(){
    embedCallback()
    callback && callback()
    grunticon.loaded = true
    loadClasses()
  }

  if( css && css.length == 1 ){
    grunticon.method = "svg";
    grunticon.href = css[0];
    onloadCSS( loadCSS( grunticon.href ), onload );
    return;
  }

  // expects a css array with 3 items representing CSS paths to datasvg, datapng, urlpng
  if( !css || css.length !== 3 ){
    return;
  }

  var navigator = window.navigator;
  var document = window.document;
  var Image = window.Image;

  // Thanks Modernizr & Erik Dahlstrom
  var svg = !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect && !!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1") && !(window.opera && navigator.userAgent.indexOf('Chrome') === -1) && navigator.userAgent.indexOf('Series40') === -1;

  var img = new Image();

  img.onerror = function(){
    grunticon.method = "png";
    grunticon.href = css[2];
    loadCSS( css[2] );
  };

  img.onload = function(){
    var data = img.width === 1 && img.height === 1,
      href = css[ data && svg ? 0 : data ? 1 : 2 ];

    if( data && svg ){
      grunticon.method = "svg";
    } else if( data ){
      grunticon.method = "datapng";
    } else {
      grunticon.method = "png";
    }

    grunticon.href = href;
    onloadCSS( loadCSS( href ), onload);
  };

  img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
  document.documentElement.className += " icons-init";
};


var selectorPlaceholder = "icon:";
var onload_svg_queue = [];

grunticon.icons = {};

grunticon.onloadSvg = function onloadSvg(callback){
  if (grunticon.svgLoaded)
    callback()
  else
    onload_queue.push(callback)
}

var ready = function( fn ){
  // If DOM is already ready at exec time, depends on the browser.
  // From: https://github.com/mobify/mobifyjs/blob/526841be5509e28fc949038021799e4223479f8d/src/capture.js#L128
  if ( document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
    fn();
  } else {
    var created = false;
    document.addEventListener( "readystatechange", function() {
      if (!created) {
        created = true;
        fn();
      }
    }, false);
  }
};

var getCSS = function( href ){
  return window.document.querySelector( 'link[href$="'+ href +'"]' );
};

// this function can rip the svg markup from the css so we can embed it anywhere
var getIcons = function(stylesheet){
  // get grunticon stylesheet by its href
  var svgss,
    rules, cssText,
    iconClass, iconSVGEncoded, iconSVGRaw;

  svgss = stylesheet.sheet;

  if( !svgss ){ return; }

  rules = svgss.cssRules ? svgss.cssRules : svgss.rules;
  for( var i = 0; i < rules.length; i++ ){
    cssText = rules[ i ].cssText;
    //iconClass = selectorPlaceholder + rules[ i ].selectorText;
    iconClass = rules[ i ].selectorText.replace('.icon-','');
    iconSVGEncoded = cssText.split( ");" )[ 0 ].match( /US\-ASCII\,([^"']+)/ );
    if( iconSVGEncoded && iconSVGEncoded[ 1 ] ){
      iconSVGRaw = decodeURIComponent( iconSVGEncoded[ 1 ] );
      grunticon.icons[ iconClass ] = iconSVGRaw;

    }
  }
};

var embedCallback = function(){
  if( grunticon.method !== "svg" ){
    grunticon.svgLoaded = true
    return;
  }
  ready(function(){
    getIcons( getCSS( grunticon.href ) );
    grunticon.svgLoaded = true
    for(var i = 0; i < onload_svg_queue.length; i++){
      onload_svg_queue[i]()
    }
  });
};



function styleLoader(href, onload){
  onloadCSS( loadCSS( href ), onload );
}

global.IconsLoader = grunticon
global.loadCSS = loadCSS
global.onloadCSS = onloadCSS

if (global.IconsLoaderStyles)
  grunticon(global.IconsLoaderStyles)
