BodyBuilder
===========

**A rich text editor that’s tired of messing around**

Object-oriented WYSIWY**M **(What You See Is What You *Mean*) rich text editor



Existing RTEs often generate markup that is less-than-ideal, rely too heavily on
inline styles that are disjointed from the website's stylesheets, and are
generally rather finicky for the end user.

**BodyBuilder's aims are the following:**

-   Be a modern RTE that uses a website's custom CSS classes instead of inline
    styles to manage the appearance of all content inside a rich text field

-   Make it easier to add modern attributes to any element, including *aria*
    attributes and *data* attributes

-   Include a robust widget API that allows end users to configure and insert
    complex markup patterns that remain protected from accidental corruption,
    even in HTML view

    -   E.g. For an expanding block of text, the end-user would be given a modal
        window where they define the expander link, and the hidden content that
        gets expanded. The widget then puts those pieces together with the
        appropriate markup and inserts the result into the content.

-   Make it easier to create responsive multi-column layouts without tables

Anyone who's tried these things with existing RTEs has likely had trouble doing
the following without going into the raw HTML view:

-   Trouble selecting the right element / HTML tag, on which to apply classes or
    other attributes

-   Trouble applying more than one class to any given element

-   Trouble wrapping multiple elements in a new container in order to apply
    classes or attributes to that container

-   Trouble creating and visualizing multiple columns without tables

**So far, BodyBuilder is only an idea.** I'm looking for other developers to
help solidify the functional requirements and to help with programming. If you
have advanced JavaScript skills or simply want to suggest improvements, please
get in touch and help make this a reality for the web development community!



FUNCTIONAL OBJECTIVES
---------------------

-   Wrap multiple elements inside a single new container element of any sort

-   Visualize the borders of all containers, including empty containers that can
    cause unwanted vertical space

-   Directly select any element and add multiple CSS classes to that element

    -   Avoids adding styles/classes to many individual elements, when it is
        more effective to add those properties to a single parent container

-   Configure HTML attributes on any element (including aria attributes, and
    custom data attributes)

-   Allow developers to provide pre-defined lists of classes and attributes for
    authors to select from

-   Create responsive multi-column layouts using default or developer-specified
    CSS grid classes

-   Manage indenting with classes instead of the \<blockquote\> element, by
    default

-   Add widgets into the content (complex markup patterns with editable fields,
    whose markup is protected from corruption, even in HTML view), created with
    a simple developer API

-   Create data tables with appropriate markup, including \<thead\> and \<th\>
    elements, and ‘headers’ attributes that reference \<th\> IDs
    (auto-generated)

-   Generate completely raw markup when pasting in content (No inline styles
    created when pasting in content)

-   Avoid cursor traps by making it simple to add a new element underneath a
    table or any other container

-   Isolated HTML editing of individual elements and their descendents, without
    disrupting any surrounding markup

-   Full HTML view shows colour-coded and indented code

CREATING ELEMENTS
-----------------

-   ‘Enter key’ creates a new <p> by default

-   Easy to select the \<p\> and change it into any other block level element

    -   If it is changed to an \<ol\> or \<ul\>, then each line within is set as
        an \<li\>

        -   2 subsequent empty list items moves cursor outside of the \<ul\>

    -   If it is changed to a \<table\>, \<video\>, or \<audio\>, then a dialog
        box appears to set up the element’s properties

-   Shift+Enter, and a \<br\> toolbar button, create \<br\> line break elements

-   An \<hr\> toolbar button creates \<hr\> horizontal rule elements

-   Highlighted text can be wrapped with any inline element (e.g. \<span\>,
    \<date\>)

-   Pasted content will retain only the following: Bold or italic text, line
    breaks, paragraphs, Lists, basic table markup, hyperlinks

### Select multiple elements and wrap them in a new parent container (<div>, <aside>, etc.)

-   Highlighting multiple elements will often modify each of them individually -
    what if we want to create a container and modify that instead? BodyBuilder
    makes it easy.

TARGETING THE RIGHT ELEMENT
---------------------------

### Selecting specific HTML elements to modify attributes

-   It’s often difficult in current RTEs to select the right element. For
    example, if you target the <ul> by highlighting all the list items, you’ll
    often actually be modifying all of the <li> elements within, individually.
    If you target the <a>, sometimes you actually modify the parent <p>.

-   BodyBuilder will allow the author to clearly select the element at the right
    level in the markup hierarchy, in order to modify that specific element’s
    attributes or apply formatting

    -   Select a \<span\>, or the parent \<a\>, or the grandparent \<p\>

    -   Select a \<p\> or the parent \<div\>, or the grandparent \<aside\>

    -   Select an \<li\> or the parent \<ul\>

    -   Select a \<th\>, or parent \<tr\>, or grandparent \<thead\>, or
        great-grandparent \<table\>

    -   Etc.

### Show/Hide containers

-   Clicking into some text will reveal the entire markup hierarchy and make
    each parent easily selectable. The author can then highlight a piece of text
    to modify, or, select a parent element as a whole.

-   A toggle button is available to show all elements in the current container
    as distinct, selectable objects. Blocks within blocks within blocks. Blocks
    on top of and under other blocks. Every element is turned into a
    click-to-select block with comfortable amounts of padding and margins
    keeping everything separate.

    -   \<br\> elements will be revealed as visual blocks as well

MODIFYING ELEMENTS
------------------

### Add/Edit attributes for any element

-   Multiple css classes selected from a categorized list, or typed into a field

-   ID typed into a field

-   Custom attributes created as key-value pairs, typed into repeating fields
    (created with ‘+’ button)

-   Keys can be predefined in a drop down

-   Values can be predefined in a drop down (populated based on Key selected)

-   For links: href, target, tab-index, title, onclick

### Add/Edit inline styles for any object

-   CSS property selected from a drop down list, and the value is typed in

-   Available styles can be developer-specified

-   Additional properties added as needed (repeating fields ‘+’ button)

CREATING RESPONSIVE LAYOUTS
---------------------------

### A responsive column generator that uses the website’s CSS grid system

-   Author selects number of columns

-   System generates a row container \<div\>, and \<div\> elements within for
    each column

-   System adds developer-defined classes to the row container <div> (e.g.
    ‘row’) and column <div>s (e.g. ‘col’).

-   Author selects classes to add to each column \<div\>.

-   Multiple classes can be added to each, for cases where there are multiple
    grids in play, each targeting different viewport ranges.  (e.g. ‘m-1o2
    d-1of3’)

INSERTING PROTECTED MARKUP PATTERNS (WIDGETS)
---------------------------------------------

-   Each widget provides a developer-defined form that shows in a modal window

-   This form allows the author to configure the widget by filling in text
    fields, selecting from a drop down, clicking a radio button or checkbox,
    selecting a file.

-   Text area fields can be simple text areas, or another BodyBuilder instance.

-   This allows for widgets within widgets.

-   Widgets consist of the form and the output markup, and a library of widgets
    is available online for public contributions.

-   Output markup is protected. It can’t be edited even in HTML view.

-   Widget examples: Twisty links / Expandable areas, Specific heading/content
    combo, or image/content combo, Accordion, Slider

BEST EXISTING EDITORS
---------------------

-   [http://xopus.com/demo/rich-text][1]

[1]: <http://xopus.com/demo/rich-text>

-   [http://xstandard.com/][2]

[2]: <http://xstandard.com/>

-   [http://files.wymeditor.org/wymeditor-1.0.0b2/examples/][3]

[3]: <http://files.wymeditor.org/wymeditor-1.0.0b2/examples/>

-   [http://wrapbootstrap.com/preview/WB0DFT966][4]

[4]: <http://wrapbootstrap.com/preview/WB0DFT966>

-   [http://www.innovastudio.com/default.aspx][5]

[5]: <http://www.innovastudio.com/default.aspx>

-   [http://demo.wpbakery.com/vc/#!][6]

[6]: <http://demo.wpbakery.com/vc/#!>

-   [http://www.elegantthemes.com/gallery/elegant-builder/][7]

[7]: <http://www.elegantthemes.com/gallery/elegant-builder/>

ARTICLES
--------

-   http://www.standards-schmandards.com/2006/wysiwym/

-   http://www.xstandard.com/en/articles/wysiwyg-editors-and-bad-markup/
