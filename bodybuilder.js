/*---- EDITABLE BLOCKS ----*/

/*Start with a single contentEditable p (editable block)*/


/*Enter key creates a new editable block.  Each separate block has a .bbuilder-edit class */


/*Shift+Enter creates a (visible) <br> element within current editable block*/


/*---- ADDING CLASSES -----*/



/*---- WIDGETS -----*/

/*Widget blocks get a .bbuilder-widget class, which don't become contentEditable areas. They also get a data-attribute specifying the name of the widget template xml file */


/*---- SAVING THE CONTENT TO A DATABASE -----*/
/*Upon form entry, takes each editable block, removes the .bbuilder-edit class, plus the markup for each widget (which retain the .bbuilder-widget class on the parent, and the data-attributes on each piece of user-specified content), and then combines them all into a textarea input field for submission.*/


/*---- EDITING EXISTING CONTENT -----*/

/*Parsing the raw HTML back into the editing mode
	-Block-level HTML elements are given the .bbuilder-edit class and get the contentEditable property
	.bbuilder-widget elements output their HTML but don't get the contentEditable property. Each element that contains user-specified values has a unique data-field-type value
	 that tells the widget's modal window to populate the appropriate input field with the right value.

		An element who's data-field-type is set to a nested rich text area only becomes contentEditable when viewed in the modal window.
*/

/*---- HTML VIEW -----*/
/*Isolated HTML view will surround the selected block with <pre><code> tags, but not widget blocks. The markup in widgets stays protected. <pre<code> is stripped back out when
focus leaves the block

Full HTML view wraps all editable blocks in <pre><code> and only strips them back out when Full HTML view is toggled off.*/