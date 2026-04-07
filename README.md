# Frontend Lorika
This project is the frontend for the Lorika website.
<br/>
A platform that show products in 3D and sells them.

## Project's stack
The project is made with __Astro Js for the ssg__, __Sanity for the cms__, __Shopify API to handle payment__ with no need for back-end.
<br/>

## Features
- Static generation of pages
- Content handling from Sanity
- Payment handling from Shopify API
- 3D Interactions with some elements in the website's pages using __ThreeJs__
- Multi language i18n
- Accessibility meta data
- light-theme css features from selected colors

## Tips
- To read this repo Better I advise using Better Comments by aaron bond and Comment Anchors by ExodiusStudios on VSCodium or Visual Studio Code to have colors and an index of code sections in the plugin tab.

## Maintenance
- The commits will start with words that explains the purpose of the commits, if the commit have more then one purpose use & to add more then one purpose or use only the major purpose if the other modification are of lesser importance
    - __START__: creation of repository.
    - __FEAT__: feature added to the repository.
    - __STYLE__: added graphic enanchement.
    - __FIX__: fixed something in the repository.
    - __DOCS__: added comments, doc files or renamed variables to be more explicative.
    - __RFCT__: refactored the structure of code.
    - __RNM__: renamed files.
    - __RM__: removed comments or files.
    - __TEST__: added tests to the repo.
- I hope I'll be able to maintain what I said in the previous point.

## Features lifecycle
### Main color spread
As per feature, along the website there are some color pickers, _when clicked, they change the main color
of the website __highlighted elements__._
<br/>
To do so the colors are handled with css vars inside __public/css/globals/vars.css__ and a component to do the toggle was made: __ColorPicker.astro__.

#### Initialization
At the start of every page the function __loadColorHighlight__ is called, this is done inside the __PageContainer__ layout.
<br/>
The function check inside the localstorage if a previous highlight color key was saved, if not, it just uses the default color key (orange).
<br/>
Then it applies the __value__ of the color var to __--highlight-color__ inside the css, doing so will spread the color to the elements that uses it.
<br/> 
Then it checks if the color is light, if so, it darkens the white texts and icons that have the light color as background (the opposite for dark colors).

#### Color picker
After __loadColorHighlight__ is called, we call __initColorPickers__, this function gets the current active highlight color key from the localstorage
and then applies an active class to the color labels html elements that have a data set called __data-color-css-var-key__ with a value that match the 
key.
<br/>
After applying the active class it adds a click event listener that gets the new active color key from the data set of the color label and then:
- removes the active class from every color label
- apply active to all the color labels that have a data set that match the key
- updates the localstorage highlight color key
- updates the color of the texts and icons that haves light texts to be darken with light backgrounds (the opposite for dark colors).
