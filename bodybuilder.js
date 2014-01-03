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
Solution by Ryan King   --- can't currently handle <br> line breaks though.
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

		function cursorIndex() {
			return window.getSelection().getRangeAt(0).startOffset;
		}

		// splits text into array of lines
		(function($) {
		$.fn.lines = function(){
			words = this.text().split(" "); //split text into each word
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
			  lineText = hiddenElement.text(); // get text before new word appended
			  hiddenElement.text(lineText + " " + this);
				if(hiddenElement.height() > height) { // if new line
					lines.push({text: lineText, startIndex: startIndex, endIndex: (lineText.length + startIndex)}); // push lineText not hiddenElement.text() other wise each line will have 1 word too many
					startIndex = startIndex + lineText.length +1;
					hiddenElement.text(this); //first word of the next line
				}
		   });
			lines.push({text: hiddenElement.text(), startIndex: startIndex, endIndex: (hiddenElement.text().length + startIndex)}); // push last line
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

		// arrow key conditions
		$(document).on('keydown', '.bbuilder-edit', function(e) {
			//if cursor on first line & up arrow key
			if(e.which == 38 && (cursorIndex() < $(this).lines()[0].text.length)) { 
				e.preventDefault();
				if ($(this).prev().is('.bbuilder-edit')) {
					prev = $(this).prev('.bbuilder-edit');
					getDistanceToCaret = distanceToCaret($(this), cursorIndex());
					lineNumber = prev.lines().length;
					caretPosition = getCaretViaWidth(prev, lineNumber, getDistanceToCaret);
					prev.focus();
					setCaret(prev.get(0), caretPosition);
				}
			// if cursor on last line & down arrow
			} else if(e.which == 40 && cursorIndex() >= $(this).lastLine().startIndex && cursorIndex() <= ($(this).lastLine().startIndex + $(this).lastLine().text.length)) {
				e.preventDefault();
				if ($(this).next().is('.bbuilder-edit')) {
					next = $(this).next('.bbuilder-edit');
					getDistanceToCaret = distanceToCaret($(this), cursorIndex());
					caretPosition = getCaretViaWidth(next, 1, getDistanceToCaret);
					next.focus();
					setCaret(next.get(0), caretPosition);
				}
				//if start of paragraph and left arrow
			} else if(e.which == 37 && cursorIndex() == 0) {
				e.preventDefault();
				if ($(this).prev().is('.bbuilder-edit')) {
					prev = $(this).prev('.bbuilder-edit');
					prev.focus();
					setCaret(prev.get(0), prev.text().length); 
				}
				// if end of paragraph and right arrow
			} else if(e.which == 39 && cursorIndex() == $(this).text().length) {
				e.preventDefault();
				if ($(this).next().is('.bbuilder-edit')) {
					$(this).next('.bbuilder-edit').focus();
				}
			};
		});



/*---- EDITABLE BLOCKS ----*/

/*Start with a single contenteditable p (editable block)*/


/*Enter key creates a new editable block.  Each separate block has a .bbuilder-edit class */
/*Shift+Enter creates a (visible) <br> element within current editable block*/


$('.bbuilder-content').on('keypress', '.bbuilder-edit', function(event) {
	
	if (event.keyCode == 13 && event.shiftKey) {
		/*Perhaps use https://code.google.com/p/rangy/ for this*/
		event.preventDefault();
		/*pasteHtmlAtCaret('<br>&nbsp;', false); /*Need a way to delete the &nbsp; we just inserted*/
       
        insertNodeAtRange(null, '\u00a0', 'start');
        insertNodeAtRange('br', '', 'end');
        
	} else if ( event.keyCode == 13 ) {
		event.preventDefault();
		var $dupElem = $(this).clone();
		$dupElem.empty();
		$(this).after($dupElem);
		$(this).next().click();
	}

});






/*List items*/
$('.bbuilder-content').on('click', 'li', function() {
	$(this).parent('ul').attr('contenteditable', 'false');
	$(this).attr('contenteditable', 'true').focus();
});






/*---- PASTING CONTENT ------*/
/*This will require some serious thought*/

/*---- ADDING CLASSES -----*/



/*---- WIDGETS -----*/

/*Widget blocks get a .bbuilder-widget class, which don't become contenteditable areas. They also get a data-attribute specifying the name of the widget template xml file */


/*---- SAVING THE CONTENT TO A DATABASE -----*/
/*Upon form entry, takes each editable block, removes the .bbuilder-edit class, plus the markup for each widget (which retain the .bbuilder-widget class on the parent, and the data-attributes on each piece of user-specified content), and then combines them all into a textarea input field for submission.*/


/*---- EDITING EXISTING CONTENT -----*/

/*Parsing the raw HTML back into the editing mode
	-Block-level HTML elements are given the .bbuilder-edit class and get the contenteditable property
	.bbuilder-widget elements output their HTML but don't get the contenteditable property. Each element that contains user-specified values has a unique data-field-type value
	 that tells the widget's modal window to populate the appropriate input field with the right value.

		An element who's data-field-type is set to a nested rich text area only becomes contenteditable when viewed in the modal window.
*/

/*---- HTML VIEW -----*/
/*Isolated HTML view will surround the selected block with <pre><code contenteditable="true"> tags, but not widget blocks. The markup in widgets stays protected. contenteditable and the bbuilder-edit class will be stripped from the block's parent element. <pre><code> is stripped back out when focus leaves the block, and the contenteditable attribute is moved back to the block's parent element.

carrot characters (< >) get converted to <span class="ct">&lt;</span> and <span class="ct">&gt;</span> while in HTML view. New carrot characters that are typed or pasted in are also converted.  When returning to visual edit mode, those <span class="ct"> elements are convereted back to real carrot characters.

Similarly, special characters get converted to a full code visual: (e.g. &amp; becomes &amp;amp;). 

Full HTML view strips all contenteditable attributes, and then wraps all editable blocks in <pre><code contenteditable="true" class="bbuilder-edit prettyprint lang-html"> and only strips them back out when Full HTML view is toggled off.  Again, widget blocks are excluded from this.

prettify.js is used to colorize the code. This will insert <span> tags throughout. These <spans> will need to be stripped out when exiting HTML view.

*/


(function( $ ){
	$.fn.viewSource = function() {
		
		var htmlContent = $(this).clone().wrap('<p>').parent().html().replace(/</g, '&lt;').replace(/>/g, '&gt;').replace('contenteditable="true"', '').replace('contenteditable="false"', '');

		$(this).replaceWith('<pre><code contenteditable="true" class="bbuilder-edit prettyprint lang-html">'+htmlContent+'</code></pre>');
		
	}; 
})( jQuery );

$('.view-source').click(function() {
	$(this).siblings('.bbuilder-content').first().find('.bbuilder-edit').each(function(){
		$(this).viewSource();
	});
	prettyPrint();
});


