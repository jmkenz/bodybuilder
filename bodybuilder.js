/*BodyBuilder.js 0.03
What You See Is What You Mean Rich Text Editor
James McKenzie
github.com/jmkenz/bodybuilder
*/

/* INITIALIZE INSTANCES*/

/*Define toolbar*/
var btnTogSource = '<button class="tog-source">Toggle HTML</button>',
    btnIndentRight = '<button class="indent-right html-tool">Indent Right</button>';
    bbuilderToolbar = '<div class="bbuilder-toolbar">'
                        + btnTogSource
                        + btnIndentRight
                        + '</div>';

/*Initialize all instances*/
$('.bbuilder-instance').each(function() {
    $(this).prepend(bbuilderToolbar);

    /*Enable contenteditable*/
    $(this).find('.bbe').each(function() {
        $(this).attr('contenteditable', 'true');
    });

});


$('.tog-source').click(function() {
    
    var toolbarEl = $(this).parent('.bbuilder-toolbar'),
        contentArea = toolbarEl.siblings('.bbuilder-content').first();

    contentArea.children().not('.bbwidget').each(function(){
        $(this).toggleSource(contentArea);
    });

    toolbarEl.toggleClass('html-toolbar');
    contentArea.toggleClass('html-view');
   
   if(contentArea.hasClass('html-view')) {
     prettyPrint();
   } else {
    contentArea.find('.bbe').each(function(){
        $(this).attr('contenteditable', 'true');
    });
   }
});

$('.indent-right').click(function(){


    insertNodeAtRange('', '\t', 'end');
});




/*---- SELECTION / RANGE FUNCTIONS----*/

/*Rangy Functions
http://rangy.googlecode.com/svn/trunk/demos/core.html */
 function getFirstRange() {
    var sel = rangy.getSelection();
    return sel.rangeCount ? sel.getRangeAt(0) : null;
}

function insertNodeAtRange(elType, elContent, cursorPosition) {
    var range = getFirstRange();
    if (range) {
        if(elType) {
            var el = document.createElement(elType);
            if(elContent){
                el.appendChild(document.createTextNode(elContent));
            }
        } else {
            
            if(elContent){
                var el = document.createTextNode(elContent);
            } else {
                var el = document.createTextNode('-');
            }
        }
        
        range.insertNode(el);
        rangy.getSelection().setSingleRange(range);

        /*Move cursor to end of inserted node*/
        if(cursorPosition == 'end') {
            range.setStartAfter(el);
            range.setEndAfter(el); 
            sel = rangy.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
}

function cursorIndex() {
    return window.getSelection().getRangeAt(0).startOffset;
}


function getContainer(node) {
    while (node) {
        if (node.nodeType == 1) {
            return node;
        }
        node = node.parentNode;
    }
}

function extractContentsBeforeCaret() {
    var sel = rangy.getSelection();
    if (sel.rangeCount) {
        var selRange = sel.getRangeAt(0);
        var contEl = getContainer(selRange.startContainer);
        if (contEl) {
            var range = selRange.cloneRange();
            range.selectNodeContents(contEl);
            range.setEnd(selRange.startContainer, selRange.startOffset);
            

            xmlAsString =  new XMLSerializer().serializeToString(range.cloneContents());

            return xmlAsString; 
        }
    }
}

function extractContentsAfterCaret() {
    var sel = rangy.getSelection();
    if (sel.rangeCount) {
        var selRange = sel.getRangeAt(0);
        var contEl = getContainer(selRange.endContainer);
        if (contEl) {
            var range = selRange.cloneRange();
            range.selectNodeContents(contEl);
            range.setStart(selRange.endContainer, selRange.endOffset);
            

            xmlAsString =  new XMLSerializer().serializeToString(range.cloneContents());

            return xmlAsString; 
        }
    }
}



/* Paste HTML at caret 
http://jsfiddle.net/timdown/jwvha/527/ */
function pasteHtmlAtCaret(html, selectPastedContent) {
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // only relatively recently standardized and is not supported in
            // some browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(),
                node,
                lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
            var firstNode = frag.firstChild;
            range.insertNode(frag);
            
            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                if (selectPastedContent) {
                    range.setStartAfter(firstNode);
                } else {
                    range.collapse(true);
                }
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if ( (sel = document.selection) && sel.type != "Control") {
        // IE < 9
        var originalRange = sel.createRange();
        originalRange.collapse(true);
        sel.createRange().pasteHTML(html);
        if (selectPastedContent) {
            range = sel.createRange();
            range.setEndPoint("StartToStart", originalRange);
            range.select();
        }
    }
}


/* Move cursor/caret between content editable areas using arrow keys
Solution by Ryan King   --- Modified by James McKenzie to support <br> elements, and moving to uncles, nephews, and cousins
http://stackoverflow.com/questions/16194824/traversing-contenteditable-paragraphs-with-arrow-keys
http://jsfiddle.net/zQUhV/47/
*/
		var setSelectionByCharacterOffsets = null;
		// set cursor
		if (window.getSelection && document.createRange) {
			setSelectionByCharacterOffsets = function(containerEl, start, end) {
				var charIndex = 0, range = document.createRange();
				range.setStart(containerEl, 0);
				range.collapse(true);
				var nodeStack = [containerEl], node, foundStart = false, stop = false;

				while (!stop && (node = nodeStack.pop())) {
					if (node.nodeType == 3) {
						var nextCharIndex = charIndex + node.length;
						if (!foundStart && start >= charIndex && start <= nextCharIndex) {
							range.setStart(node, start - charIndex);
							foundStart = true;
						}
						if (foundStart && end >= charIndex && end <= nextCharIndex) {
							range.setEnd(node, end - charIndex);
							stop = true;
						}
						charIndex = nextCharIndex;
					} else {
						var i = node.childNodes.length;
						while (i--) {
							nodeStack.push(node.childNodes[i]);
						}
					}
				}

				var sel = window.getSelection();
				sel.removeAllRanges();
				sel.addRange(range);
			}
		} else if (document.selection) {
			setSelectionByCharacterOffsets = function(containerEl, start, end) {
				var textRange = document.body.createTextRange();
				textRange.moveToElementText(containerEl);
				textRange.collapse(true);
				textRange.moveEnd("character", end);
				textRange.moveStart("character", start);
				textRange.select();
			};
		}

		var setCaret = function(element, index) {
			setSelectionByCharacterOffsets(element, index, index);
		};

		
		// splits text into array of lines
		(function($) {
		$.fn.lines = function(){

            rawText = this.html().replace('<br>', ' ').replace('<br />', ' ').replace('<br/>', ' ');
            words = rawText.split(" "); //split text into each word
			lines = [];
			
			hiddenElement = this.clone(); //copies font settings and width
			hiddenElement.empty();//clear text
			hiddenElement.css("visibility", "hidden");
			
			jQuery('body').append(hiddenElement); // height doesn't exist until inserted into document
			
			hiddenElement.text('i'); //add character to get height
			height = hiddenElement.height();
			hiddenElement.empty();
			
			startIndex = -1; // quick fix for now - offset by one to get the line indexes working

			jQuery.each(words, function() {
			  lineText = hiddenElement.html(); // get text before new word appended
              
			  hiddenElement.html(lineText + " " + this);
				if(hiddenElement.height() > height) { // if new line
					lines.push({text: lineText, startIndex: startIndex, endIndex: (lineText.length + startIndex)}); // push lineText not hiddenElement.text() other wise each line will have 1 word too many
					startIndex = startIndex + lineText.length +1;
					hiddenElement.html(this); //first word of the next line
				}
		   });
			lines.push({text: hiddenElement.text(), startIndex: startIndex, endIndex: (hiddenElement.html().length + startIndex)}); // push last line
			hiddenElement.remove();
			lines[0].startIndex = 0; //quick fix for now - adjust first line index
			return lines;
		}
		})(jQuery);

		(function($) { // to save a bit of typing
			$.fn.lastLine = function() {
				return this.lines()[this.lines().length-1];
			}
		})(jQuery);

		function findLineViaCaret(textElement,caretIndex){
			jQuery.each(textElement.lines(), function() {
				if(this.startIndex <= caretIndex && this.endIndex >= caretIndex) {
					r = this;
					return false; // exits loop
				}
		   });
			return r;
		}

		function distanceToCaret(textElement,caretIndex){

			line = findLineViaCaret(textElement,caretIndex);
			if(line.startIndex == 0) { 
			 // +1 needed for substring to be correct but only first line?
				relativeIndex = caretIndex - line.startIndex +1;
			} else {
			  relativeIndex = caretIndex - line.startIndex;  
			}
			textToCaret = line.text.substring(0, relativeIndex);
			
			hiddenElement = textElement.clone(); //copies font settings and width
			hiddenElement.empty();//clear text
			hiddenElement.css("visibility", "hidden");
			hiddenElement.css("width", "auto"); //so width can be measured
			hiddenElement.css("display", "inline-block"); //so width can be measured

			jQuery('body').append(hiddenElement); // doesn't exist until inserted into document
			
			hiddenElement.text(textToCaret); //add to get width
			width = hiddenElement.width();
			hiddenElement.remove();
			
			return width;
		}

        function getCaretViaWidth(textElement, lineNo, width) {
			line = textElement.lines()[lineNo-1];
			 
			lineCharacters = line.text.replace(/^\s+|\s+$/g, '').split("");
			
			hiddenElement = textElement.clone(); //copies font settings and width
			hiddenElement.empty();//clear text
			hiddenElement.css("visibility", "hidden");
			hiddenElement.css("width", "auto"); //so width can be measured
			hiddenElement.css("display", "inline-block"); //so width can be measured
			
			jQuery('body').append(hiddenElement); // doesn't exist until inserted into document
			
			if(width == 0) { //if width is 0 index is at start
				caretIndex = line.startIndex;
			} else {// else loop through each character until width is reached
				hiddenElement.empty();
				jQuery.each(lineCharacters, function() {
					text = hiddenElement.text();
					prevWidth = hiddenElement.width();
					hiddenElement.text(text + this);
					elWidth = hiddenElement.width();
					caretIndex = hiddenElement.text().length + line.startIndex;
					if(hiddenElement.width() > width) {
						// check whether character after width or before width is closest
						if(Math.abs(width - prevWidth) < Math.abs(width - elWidth)) {
						   caretIndex = caretIndex -1; // move index back one if previous is closes
						}
						return false;
					}
				});
			}
			hiddenElement.remove();
			return caretIndex;
		}

        function goNextArea(current) {
            var next = null,
                nextSiblings = current.nextAll();

            if(nextSiblings.length > 0) {
                for (var i=0;i < nextSiblings.length;i++) {
                   
                    var self = $(nextSiblings[i]);
                    if(self.hasClass('bbe')){
                        next = self;
                        console.log('sibling');
                        i = nextSiblings.length; //exit loop
                    } else { //Search for nephews
                        var nephew = self.find('.bbe').first();
                        if(nephew.length > 0) {
                            console.log('nephew');
                            next = nephew;
                            i = nextSiblings.length; //exit loop
                        }
                    }
                }

            } else { //if have no next siblings, go up to parent and look for uncles and cousins
                var parents = current.parents();

                for (var i=0;i < parents.length;i++) {
                    var uncles = parents.nextAll();
                    for (var x=0;x < uncles.length;x++) {
                        var uncle = $(uncles[i]);
                        if(uncle.hasClass('bbe')){
                            console.log('uncle');
                            next = uncle;
                            x = uncles.length; //exit loop
                            i = parents.length; //exit loop
                        } else { //Search for cousins
                            var cousin = uncle.find('.bbe').first();
                            if(cousin.length > 0) {
                                console.log('cousin');
                                next = cousin;
                                x = uncles.length; //exit loop
                                i = parents.length; //exit loop
                            }
                        }
                    }
                }
            }

            if (next) {
                if(next.hasClass('bbe')){
                    getDistanceToCaret = distanceToCaret(current, cursorIndex());
                    caretPosition = getCaretViaWidth(next, 1, getDistanceToCaret);
                    next.focus();
                    setCaret(next.get(0), caretPosition);
                }
            } else {
                console.log('Nowhere to go');
            }
        }

        function goPrevArea(current, leftArrow) {
            var prev = null,
                prevSiblings = current.prevAll();

            if(prevSiblings.length > 0) {
                for (var i=0;i < prevSiblings.length;i++) {
                   
                    var self = $(prevSiblings[i]);
                    if(self.hasClass('bbe')){
                        prev = self;
                        console.log('sibling');
                        i = prevSiblings.length; //exit loop
                    } else { //Search for nephews
                        var nephew = self.find('.bbe').last();
                        if(nephew.length > 0) {
                            console.log('nephew');
                            prev = nephew;
                            i = prevSiblings.length; //exit loop
                        }
                    }
                }

            } else { //if have no next siblings, go up to parent and look for uncles and cousins
                var parents = current.parents();

                for (var i=0;i < parents.length;i++) {
                    var uncles = parents.prevAll();
                    for (var x=0;x < uncles.length;x++) {
                        var uncle = $(uncles[i]);
                        if(uncle.hasClass('bbe')){
                            console.log('uncle');
                            prev = uncle;
                            x = uncles.length; //exit loop
                            i = parents.length; //exit loop
                        } else { //Search for cousins
                            var cousin = uncle.find('.bbe').last();
                            if(cousin.length > 0) {
                                console.log('cousin');
                                prev = cousin;
                                x = uncles.length; //exit loop
                                i = parents.length; //exit loop
                            }
                        }
                    }
                }
            }

            if (prev) {
                if(prev.hasClass('bbe')){
                    if (leftArrow) {
                        prev.focus();
                        setCaret(prev.get(0), prev.text().length); 
                    } else {
                        getDistanceToCaret = distanceToCaret(current, cursorIndex());
                        lineNumber = prev.lines().length;
                        caretPosition = getCaretViaWidth(prev, lineNumber, getDistanceToCaret);
                        prev.focus();
                        setCaret(prev.get(0), caretPosition);
                    }
                }
            } else {
                console.log('Nowhere to go');
            }
        }

		// arrow key conditions
		$(document).on('keydown', '.bbe', function(e) {

            // If edit area contains <br> element somewhere before or after the cursorIndex, then allow default key behavior within the contenteditable area

            var breakAbove = false,
                breakBelow = false,
                textBeforeCaret = extractContentsBeforeCaret(),
                textAfterCaret = extractContentsAfterCaret(),
                current = $(this);


            if (textBeforeCaret.indexOf('<br') >= 0 || textAfterCaret.indexOf('<br') == 0) {  
                breakAbove = true;
            }

            if (textAfterCaret.indexOf('<br') > 0) {  
                breakBelow = true;
            }

            // Check to see if caret is on last line of an editable region containing <br> elements
            range = rangy.getSelection().getRangeAt(0);
            post_range = document.createRange();
            post_range.selectNodeContents(this);
            post_range.setStart(range.endContainer, range.endOffset);
            next_text = post_range.cloneContents();
            at_end = next_text.textContent.length === 0;    

			//if cursor on first line & up arrow key
			if(e.which == 38 && (cursorIndex() < $(this).lines()[0].text.length) && breakAbove !== true) {    
				e.preventDefault();
				goPrevArea(current, true);

			// if cursor on last line & down arrow
			} else if(e.which == 40 && ((cursorIndex() >= $(this).lastLine().startIndex && cursorIndex() <= ($(this).lastLine().startIndex + $(this).lastLine().text.length) && breakBelow !== true) || at_end == true)) {
				e.preventDefault();
                goNextArea(current);

			//if start of paragraph and left arrow
			} else if(e.which == 37 && cursorIndex() == 0 && breakAbove !== true) {
				e.preventDefault();
                goPrevArea(current, true);

			// if end of paragraph and right arrow
			} else if(e.which == 39 && cursorIndex() == $(this).text().length && breakBelow !== true) {
				e.preventDefault();
				goNextArea(current);
			};
		});



/*---- EDITABLE BLOCKS ----*/

/*Start with a single contenteditable p (editable block)*/


/* .bbe elements that receive focus get a .bbfocused class. */

$('.bbuilder-content').on('focus', '.bbe', function(event) {

    $('.bbfocused').each(function() {
        $(this).removeClass('bbfocused');
    });
    $(this).addClass('bbfocused');
});


/*Enter key creates a new editable block.  Each separate block has a .bbe class */
/*Shift+Enter creates a (visible) <br> element within current editable block*/


$('.bbuilder-content').on('keypress', '.bbe', function(event) {
	
	
    if(!$(this).hasClass('prettyprint')) { //Use default key behaviour in HTML view, but customize it for Design view
        if (event.keyCode == 13 && event.shiftKey) {
    		event.preventDefault();
            //insertNodeAtRange(null, '\u00a0', 'start'); //Only needed if caret doesn't drop down to new line. CSS on the <br> ensures that it does.
            insertNodeAtRange('br', '', 'end');
            
    	} else if ( event.keyCode == 13 ) {
    		event.preventDefault();
    		
            //Create an empty duplicate of currently focused element, and move focus to the new element
            var $dupElem = $(this).clone();
    		$dupElem.empty();
    		$(this).after($dupElem);
    		$(this).next().attr('contenteditable', 'true').focus();
    	}
    }

});







/*---- PASTING CONTENT ------*/
/*This will require some serious thought*/

/*---- ADDING CLASSES -----*/



/*---- WIDGETS -----*/

/*Widget blocks get a .bbwidget class, which don't become contenteditable areas. They also get a data-attribute specifying the name of the widget template xml file */


/*---- SAVING THE CONTENT TO A DATABASE -----*/
/*Upon form entry, takes each editable block, removes the .bbe class, plus the markup for each widget (which retain the .bbuilder-widget class on the parent, and the data-attributes on each piece of user-specified content), and then combines them all into a textarea input field for submission.*/


/*---- EDITING EXISTING CONTENT -----*/

/*Parsing the raw HTML back into the editing mode
	-Block-level HTML elements are given the .bbe class and get the contenteditable property
	.bbuilder-widget elements output their HTML but don't get the contenteditable property. Each element that contains user-specified values has a unique data-field-type value
	 that tells the widget's modal window to populate the appropriate input field with the right value.

		An element who's data-field-type is set to a nested rich text area only becomes contenteditable when viewed in the modal window.
*/



/*---- HTML VIEW -----*/
/*Isolated HTML view will surround the selected block with <code contenteditable="true"> tags, but not widget blocks. The markup in widgets stays protected. contenteditable and the bbe class will be stripped from the block's parent element. <code> is stripped back out when focus leaves the block, and the contenteditable attribute is moved back to the block's parent element.

carrot characters (< >) get converted to <span class="ct">&lt;</span> and <span class="ct">&gt;</span> while in HTML view. New carrot characters that are typed or pasted in are also converted.  When returning to visual edit mode, those <span class="ct"> elements are convereted back to real carrot characters.

Similarly, special characters get converted to a full code visual: (e.g. &amp; becomes &amp;amp;). 

Full HTML view strips all contenteditable attributes, and then wraps all editable blocks in <code contenteditable="true" class="bbe prettyprint lang-html"> and only strips them back out when Full HTML view is toggled off.  Again, widget blocks are excluded from this.

prettify.js is used to colorize the code. This will insert <span> tags throughout. These <spans> will need to be stripped out when exiting HTML view.

*/


(function( $ ){
	$.fn.toggleSource = function(contentArea) {
		
		if(contentArea.hasClass('html-view')) {
            

            var richContent = $(this).text().replace('&lt;', '<').replace('&gt;', '>');

            $(this).replaceWith(richContent);

        } else {
          
          $(this).removeAttr('contenteditable');
          $(this).find('.bbe').each(function(){
            $(this).removeAttr('contenteditable').removeClass('bbfocused');
          });

          var htmlContent = $(this).clone().wrap('<p>').parent().html().replace(/</g, '&lt;').replace(/>/g, '&gt;');

		  $(this).replaceWith('<code contenteditable="true" class="bbe prettyprint lang-html">'+htmlContent+'</code>');
        }
		
	}; 
})( jQuery );




