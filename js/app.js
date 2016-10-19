/**
 * @name Makeaclickablemap Clickable map widget script
 * @author Tamas Hajdu <tamas.hajdu.mapping@gmail.com>
 * @copyright Tamas Hajdu 2016
 * @version 1.0.2
 * @requires library:jQuery, library:raphael.js, library:qTip.js
 * @description This script implements a clickable map functionality
 *  where each region or point can be customized using various settings, like fillColor, hoverColor etc.
 *  and example can be found below, that would give you an overview of the settings one can use to customize the map
 */
var makeaClickableMap = (function(window,$){
	var _self = {
	    "configSrc": "js/config.json",
		"settings": {
		    "interaction": {
			    "container": "map"
			}
		}
	};
	
	function _init(domContainer){
	    if(typeof domContainer !== 'undefined'){
		    /*Cool, domContainer is not empty. Lets check what it is*/
			switch(true){
			    case (domContainer instanceof jQuery):
				    _self.settings.interaction.container = domContainer.get(0);
				break;
				case (domContainer instanceof HTMLElement):
				    _self.settings.interaction.container = domContainer;
				break;
				case (typeof domContainer === "string"):
				    _self.settings.interaction.container = domContainer;
				break;
			}
		}
	    $.getJSON(_self.configSrc, _startDrawing);
	}
	
	function _startDrawing(data){
		_self.settings = $.extend({}, _self.settings, data);
        /*Append an object named "map" to the main settings object*/
        /*This will hold our Raphael map and all its thingies*/
        _self.settings = $.extend({}, _self.settings, {map: {glow: false, stroketypes:{'solid': '', 'dashed':'- ', 'none':''}}});
        _createMap();	    
	}
	
	function _createMap(){
		/*Set up the map into a container specified*/
		_self.settings.map.canvas = new Raphael(_self.settings.interaction.container, "100%", "100%");
        _self.settings.map.canvas.safari();
        _self.settings.map.canvas.setViewBox(0, 0, _self.settings.size.width, _self.settings.size.height, true);
        _populateMap();	
	}
	
	function _setBackground(){
        if(_self.settings.background.transparent){
            if(_self.settings.interaction.container instanceof jQuery){
			    _self.settings.interaction.container.addClass('transparent');
			}
			else
			{
			    if(typeof _self.settings.interaction.container === "string"){
				    $("#" + _self.settings.interaction.container).addClass('transparent');
				}
				else
				{
				    $(_self.settings.interaction.container).addClass('transparent');
				}				
			}	
        }
        else
        {
            if(_self.settings.interaction.container instanceof jQuery){
			    _self.settings.interaction.container.removeClass('transparent').css({'background-color': _self.settings.background.fill});
			}
			else
			{
			    if(typeof _self.settings.interaction.container === "string"){
				    $("#" + _self.settings.interaction.container).removeClass('transparent').css({'background-color': _self.settings.background.fill});
				}
                else
                {
				    $(_self.settings.interaction.container).removeClass('transparent').css({'background-color': _self.settings.background.fill});
                }						    
			}			          
        }	
	}
	
	function _populateMap(arg){
        
        if (typeof arg !== 'undefined') { 
		    _self._config = arg; 
		}
		
        /*Set the background of the map*/
        _setBackground();

		if(typeof _self._config !== 'undefined'){
			for(i=0;i<_self.settings.content.length;i++){
				var current = _self.settings.content[i];

				var result = _self._config.filter(function( obj ) {
						return obj.name == current["name"];
				});			
				
				if(typeof result[0] !== 'undefined'){
					if(result[0]["name"] === current["name"] ){
						current = $.extend({}, current, result[0]);
						_self.settings.content[i] = $.extend({}, current);
					}
				}
			}	
        }

        /*Loop through the areas and apply necessary settings*/
        for(i=0;i<_self.settings.content.length;i++){
            var current = _self.settings.content[i];
			
            /*Create a Raphael path from svg path provided and appeand to the current object*/
            
			if(typeof current["area"] === "undefined"){
			    current["area"] = _self.settings.map.canvas.path(current.svg);
            }
			
            /*Also store the DOM representation of the area*/
            if(typeof current["areadom"] === "undefined"){
			    current["areadom"] = current.area[0];
			}
            
            /*Create the labels*/
            if(current.label.active){
                if(typeof current["rlabel"] === "undefined"){
				    current["rlabel"] = _self.settings.map.canvas.text(current.label.posx, current.label.posy, current.label.text);
				}
            }
            
			
            /*Assign fill and stroke styles to the area*/
            _assignStyle("area", current);
            

            /*Handle events like mouseover, touchstart etc.*/
            _handleEvents(current);
        }
		
		for(i=0;i<_self.settings.frames.length;i++){
            var currentFrame = _self.settings.frames[i];
			currentFrame["area"] = _self.settings.map.canvas.path(currentFrame.svg);
			_assignStyle("frame", currentFrame);
		}
        _self.settings.map.canvas.renderfix();	
	}
	
	function _assignStyle(type, current){
		switch(type){
		    case "area":          
                current["area"].attr({"fill": current.fill, "stroke": current.strokefill, "stroke-width": current.strokewidth, "stroke-dasharray": _self.settings.map.stroketypes[current.stroketype], "stroke-linejoin":"round", "fill-rule": "evenodd"});				

                if(current.hasOwnProperty('rlabel')){
                   current["rlabel"].attr({"font-size": current.label.size, "fill": current.label.fill}); 
                }
        
		        //Apply style 'inactive' if the area is marked inactive
                if(!current.active){
                    current["area"].attr({'fill': current['inactivefill']});
                }			
			break;
			case "frame":
			    current["area"].attr({"fill-opacity": 0});
			break;
		}	
	}
	
	function _areaHovered(current){
        if(!current['active']){return;}

        for(i=0;i<_self.settings.content.length;i++){
            if(_self.settings.content[i]["name"] != current["name"]){
                _self.settings.content[i]['area'].toBack();
            }
        }
        if(typeof current["area"] !== "undefined"){
		    current['area'].attr({cursor: "pointer"});
		}
        if(typeof current["rlabel"] !== "undefined"){		
		    current['rlabel'].attr({cursor: "pointer"});
		}	
        
        if(current["glow"]){
            if(!_self.settings.map.glow){
                _self.settings.map.glow = current['area'].glow({color: current.strokefill, width: 10});
                current['area'].animate({fill: current.hoveredfill}, 300);
            }
        }
        else
        {
            current['area'].animate({fill: current.hoveredfill, "stroke-width": current["stroke-hoveredwidth"]}, 300);
        }
        if(current.hasOwnProperty('rlabel')){
            current['rlabel'].animate({'fill': current.label.hoveredfill});
        }	    
	}
	
	function _areaLeft(current){
        if(!current['active']){return;}
        current['area'].animate({"fill": current.fill, "stroke-width": current["strokewidth"]}, 300);
		
        if(_self.settings.map.glow){
            _self.settings.map.glow.remove();
            _self.settings.map.glow = false;
        }
        if(current.hasOwnProperty('rlabel')){
            current['rlabel'].animate({'fill': current.label.fill});
        }	
	}
	
	function _followUrl(urlobj){
        if(urlobj.openinnew){
            window.open(urlobj.text);
        }
        else
        {
             window.top.location =  urlobj.text;
        }	
	}
	
	function _handleEvents(current){
        current['area'].mouseover(function(){
            (function(a){
                _areaHovered(a);  
            })(current);
        });
        current['area'].mouseout(function(){
            (function(a){
                _areaLeft(a);
            })(current);
        });
        current['area'].touchstart(function(){
            (function(a){
                _areaHovered(a);
            })(current);
        });
        current['area'].touchend(function(){
            (function(a){
                _areaLeft(a);
            })(current);
        });    
        current['area'].click(function(){
            (function(a){
                if(a.url.text != ''){
                    _followURL(a.url);
                }
            })(current);
        });
        
        if(current.hasOwnProperty('rlabel')){
            current['rlabel'].mouseover(function(){
                (function(a){
                    _areaHovered(a);
                })(current);
            });
            current['rlabel'].mouseout(function(){
                (function(a){
                    _areaLeft(a);
                })(current);
            });
        }
        
        //Display tooltip if set to active    
        if(current.tooltip.active){
            $(current['area'][0]).qtip({
                content:current.tooltip.text,
                position: {
                    target: 'mouse',
                    adjust: { x: 20, y: 20 },
                    viewport: $(window)
                },
                style: {
                    classes: 'qtip-bootstrap',
                    tip:{
                        corner: false
                    }
                }
            });
        }	
	}
	
	return {
	    initialize: _init,
		draw: _populateMap
	}
	
})(window, jQuery);