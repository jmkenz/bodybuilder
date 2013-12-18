/*---- EDITABLE BLOCKS ----*/

/*Start with a single contenteditable p (editable block)*/


/*Enter key creates a new editable block.  Each separate block has a .bbuilder-edit class */
/*Shift+Enter creates a (visible) <br> element within current editable block*/


/* http://jsfiddle.net/timdown/jwvha/527/ */
function pasteHtmlAtCaret(html) {
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
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
            var firstNode = frag.firstChild;
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if ( (sel = document.selection) && sel.type != "Control") {
        // IE < 9
        var originalRange = sel.createRange();
        originalRange.collapse(true);
        sel.createRange().pasteHTML(html);
    }
}


$('.bbuilder-content').on('keypress', '.bbuilder-edit', function(event) {
	
	if (event.keyCode == 13 && event.shiftKey) {
		/*Perhaps use https://code.google.com/p/rangy/ for this*/
		event.preventDefault();
		pasteHtmlAtCaret('<br><br>');

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


