/*---- EDITABLE BLOCKS ----*/

/*Start with a single contenteditable p (editable block)*/


/*Enter key creates a new editable block.  Each separate block has a .bbuilder-edit class */


/*Shift+Enter creates a (visible) <br> element within current editable block*/

/*List items*/
$(document).on('click', 'li', function() {
	$(this).parent('ul').attr('contenteditable', 'false');
	$(this).attr('contenteditable', 'true').focus();
});



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

Carrot characters (< >) get converted to <span class="ct">&lt;</span> and <span class="ct">&gt;</span> while in HTML view. New carrot characters that are typed or pasted in are also converted.  When returning to visual edit mode, those <span class="ct"> elements are convereted back to real carrot characters.

Similarly, special characters get converted to a full code visual: (e.g. &amp; becomes &amp;amp;). 

Full HTML view strips all contenteditable attributes, and then wraps all editable blocks in <pre><code contenteditable="true"> and only strips them back out when Full HTML view is toggled off.  Again, widget blocks are excluded from this.*/