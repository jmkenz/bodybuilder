BodyBuilder
===========

**A rich text editor that’s tired of messing around**  
What You See Is What You *Mean* rich text editor

Key Features
------------

-   Visualize and select any HTML element (or any of its parent tags)

-   Attach multiple developer-specified CSS classes to any element (instead of
    generating inline styles)

-   Wrap multiple elements in a new container, in order to apply classes or
    attributes to that container

-   Create multiple columns without tables or shortcodes (responsive grid)

-   Specify multiple image sources for each image (responsive images)

-   Configure and insert widgets directly into the content, while keeping the
    widget markup protected

-   Add developer-specified *aria* and *data* attributes to any element

-   Edit HTML directly on single elements / containers at a time, in an isolated
    way

-   Edit HTML with the benefit of tab formatting and color coding

**So far, BodyBuilder is only an idea.** I'm looking for other developers to
help solidify the design and to help with programming. This could either start
as a standalone editor, or be a branch or plugin for an existing editor. If you
have advanced JavaScript skills or simply want to suggest improvements, please
get in touch and help make this a reality for the web development community!

Detailed Functionality
----------------------

### Toggle to visualize all elements as blocks. Cleanly visualize the borders of all containers, including empty containers that can cause unwanted vertical space.

-   Clicking into some text will reveal the entire markup hierarchy and make
    each parent easily selectable. The author can then highlight a piece of text
    to modify, or, select a parent element as a whole.

-   A toggle button is available to show all elements in the current container
    as distinct, selectable objects. Blocks within blocks within blocks. Blocks
    on top of and under other blocks. Every element is turned into a
    click-to-select block with comfortable amounts of padding and margins
    keeping everything separate.

-   \<br\> elements will be revealed as visual blocks as well

### Directly select any element in order to add classes or other attributes to that element

-   It’s often difficult in current RTEs to select the right element. For
    example, if you target the \<ul\> by highlighting all the list items, you’ll
    often actually be modifying all of the \<li\> elements within, individually.
    If you target the \<a\>, sometimes you actually modify the parent \<p\>.

-   BodyBuilder will allow the author to clearly select the element at the right
    level in the markup hierarchy, in order to modify that specific element’s
    attributes or apply formatting

    -   Select a \<span\>, or the parent \<a\>, or the grandparent \<p\>

    -   Select a \<p\> or the parent \<div\>, or the grandparent \<aside\>

    -   Select an \<li\> or the parent \<ul\>

    -   Select a \<th\>, or parent \<tr\>, or grandparent \<thead\>, or
        great-grandparent \<table\>

    -   Etc.

### Wrap multiple elements inside a single new container element of any sort

-   Instead of adding repetitive styles/classes to many individual elements, add
    classes to a parent container

### Configure HTML attributes on any element (including aria attributes, and custom data attributes)

-   Multiple css classes selected from a categorized list, or typed into a field

-   ID typed into a field

-   Allow developers to provide pre-defined lists of classes and attributes for
    authors to select from

-   Custom attributes created as key-value pairs, typed into repeating fields
    (created with ‘+’ button)

-   Keys can be predefined in a drop down

-   Values can be predefined in a drop down (populated based on Key selected)

-   For links: href, target, tab-index, title, onclick

### Create responsive multi-column layouts using default or developer-specified CSS grid classes

-   Author selects number of columns

-   System generates a row container \<div\>, and \<div\> elements within for
    each column

-   System adds developer-defined classes to the row container \<div\> (e.g.
    ‘row’) and column \<div\>s (e.g. ‘col’)

-   Author selects classes to add to each column \<div\>

-   Multiple classes can be added to each, for cases where there are multiple
    grids in play, each targeting different viewport ranges.  (e.g. ‘m-1o2
    d-1of3’)

### Pasted content contains no inline styles. It retains only the following as markup: 

-   Bold or italic text

-   Super and sub scripts

-   Line breaks

-   Horizontal rules

-   Paragraphs

-   Lists

-   Table markup

-   Hyperlinks

### Add widgets into the content

-   Widgets are complex markup patterns with editable fields, whose markup is
    protected from corruption, even in HTML view

-   Widgets are created with a simple developer API

-   Each widget provides a developer-defined form that shows in a modal window

-   This form allows the author to configure the widget by filling in text
    fields, selecting from a drop down, clicking a radio button or checkbox,
    selecting a file

-   Text area fields can be simple text areas, or another BodyBuilder instance

    -   This allows for widgets within widgets

-   Widgets consist of the form and the output markup

-   A library of widgets is available online for public contributions

-   Output markup is protected. It can’t be edited even in HTML view

-   **Example:** For an expanding block of text, the end-user would be given a
    modal window where they define the expander link, and the hidden content
    that gets expanded. The hidden content is defined in a nested instance of
    BodyBuilder, so it can be comprised of anything. The widget then puts the
    pieces together with the appropriate markup and inserts the result into the
    content.

-   Other widget examples:

    -   Responsive image set

    -   Specific heading/content combo

    -   Specific image/content combo

    -   Accordion

    -   Slider

    -   Etc.

### Integrating responsive images

-   Now that responsive images are becoming the norm, inserting a simple \<img\>
    tag isn't going to cut it anymore in many cases. Responsive images often
    require multiple image sources for the browser to choose from depending on
    pixel density and viewport width.

-   The BodyBuilder approach to images relies on the power of widgets. Any
    responsive images solution can be integrated as a custom widget that
    generates the exact markup pattern the developer wants to use. If a true
    responsive images standard emerges, this can be built into BodyBuilder as a
    standard widget.

-   The end user would specify one or more images and some alt text, and the
    widget would generate the necessary markup.  This markup pattern could then
    be wrapped in a link to turn it into an image link. Or it could be wrapped
    in a \<div\> that has classes applied to float it to the left, and ensure a
    width of 33%, for example.

### Create data tables with appropriate markup

-   \<thead\> and \<th\> elements

-   ‘headers’ attributes that reference \<th\> IDs (auto-generated)

### Avoid cursor traps

-   Simple to add a new element underneath a table or any other container

### Better HTML views

-   Isolated HTML editing of individual elements and their descendents, without
    disrupting any surrounding markup

-   Full HTML view shows colour-coded and indented code

EXISTING EDITORS OFFERING INSPIRATION
-------------------------------------

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

RELEVANT ARTICLES
-----------------

-   [http://www.standards-schmandards.com/2006/wysiwym/][8]

[8]: <http://www.standards-schmandards.com/2006/wysiwym/>

-   [http://www.xstandard.com/en/articles/wysiwyg-editors-and-bad-markup/][9]

[9]: <http://www.xstandard.com/en/articles/wysiwyg-editors-and-bad-markup/>
