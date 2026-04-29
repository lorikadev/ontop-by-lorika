# Frontend Ontop by Lorika
This project is the frontend for the Lorika website.
<br/>
A platform that show products in 3D and sells them.

## Project's stack
The project is made with __Astro Js for the ssg__, __Sanity for the cms__, __Shopify to handle payment__ with no need for back-end.
<br/>
As the projects is made with Astro, a bit knowledge of it is needed (https://docs.astro.build/en/getting-started/), this project uses Astro mainly as a bundler to make page building dynamic but with a static result for performance, this means that the reader doesn't need to know too much of Astro.

## Features
- Static generation of pages
- Choosen color highlight
- Content handling from Sanity
- Multi language i18n
- Payment handling from Shopify
- Accessibility meta data and wcs conformity
- 3D Interactions with some elements in the website's pages using __ThreeJs__
- On scroll animations

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
### Static generation of pages
This is handled by Astro, take in mind that all the written code should work when the static page is generate, behaviour that need to follow astro's way of importing code or placing data inside component's input to avoid crash on build.

### Main color spread
As per feature, along the website there are some color pickers, when clicked, they change the main color
of the website's __highlighted elements__._
<br/>
To do so the colors are handled with css vars inside __public/css/globals/vars.css__ and a component to do the toggle was made: __ColorPicker.astro__.

#### Initialization
At the start of every page the function __loadColorHighlight__ is called (this is done inside the __PageContainer__ layout).
<br/>
The function check inside the localstorage if a previous highlight color key was saved (key is '--highlight-color', saved in const.ts file), if not, it loads some default data.
<br/>
After the initialization the color pickers are initialized by __initColorPickers__:
- the active color get hightlighted inside the colorpicker
- all the color buttons get a click event attached

#### The colorpicker functionality
The event attached to the color buttons load the selected color's css key from the attribute __color-css-var-key__ into the local storage, then it sets it's value (the actual hex color) to the var that the highlighted elements use to change color in the :root of the __variables.css__ file.
<br/>
The value of the color's hex is looked inside the var that have the same key as the value of the attribute __color-css-var-key__ of the button. 
<br/>
After the localStorage and css's root update it sends an event signed with __changedHighlightColor__, this is used inside the 3D render of the hero in the home page to apply the effects.
<br/>
At the end of everything, __applyColorCorrections__ is fired, this function do some adjustment to color of texts and svg of the highlighted elements when the choosen color is light and the normal white color would be impossibile to be seen.

### Content handling from Sanity
The contents of the pages, when possible, is delivered from Sanity, this includes the texts (including html somewhere, where it made sense for future content's update).
<br/>
The content gets injected in the content component using an interface that follows the schema generate from sanity studio content's type.
<br/>
To change the content of a page you need to go to sanity and check there.

__NOTES__
The html parts get sanitized with the cleanHtml function that can be found in __clean-html.ts__.

### Multi language i18n
The content components (located in /src/content/) represent the layout of a page and sanity injects the content (video, images, text/html).
<br/>
To allow for multilanguage without duplicating the pages, the content components get wrapped inside the actual page files (_located in /src/pages/_) which are divided by language in the paths
<br/>
(for example, for the index, we have _/src/pages/__en__/index.astro_ and _/src/pages/__it__/index.astro_) and then in the frontmatter of the wrapper, the content of the page get pulled from sanity, filtering it by language.
<br/>
During development this happens in real time, during build it only happens when astro creates the static pages.

### Payment handling from Shopify
The checkout is made from the shop page of Shopify, as such, the link of the shop take the user to the Shopify page, there, Shopify handles it all.

### Accessibility meta data and wcs conformity
The accessibility meta data are loaded from sanity and applied into the html and the
html structure was developer as best as possible to respect both the ui, the wcs's standard and performance.
<br/>
The pagespeed's lighthouse should give high accessibility scores if tested: https://pagespeed.web.dev/

### 3D Interactions with some elements in the website's pages using __ThreeJs__
There are 2 main 3D interactions in the website, the first is the sold product and the second is an interactive globe.
<br/>
For performance reasons both the renders get deactivated when the user is far from the view but get restarted when near them (even if not in view to avoid stutters).
<br/>
Both 3D interaction's script can be found in __/src/scripts/pages/home/__ as 
__hero-eyeglass-interaction.ts__ and __world-interaction.ts__

#### The Product interactions
The product is made of the pieces: __the eyeglasses__ and __the cover__.

The scene starts with the eyeglass sliding into the view and the cover appearing as a fade in in opacity, while doing so the highlighted color wash in. After the color appeared the whole thing rotates into place.

The scene should be interactable in a way that the user can move the product around and change it's color from the colorpicker.

__NOTES__
- The animations are all handled with gsap's timelines.
- The color change trigger comes from listening to the changedHighlightColor and then looking in the localStorage and variables.css to handle the new color.
- The color change is handle in a way that the scene is non blocking for the user: if they keep spam-changing the color the animation's are not interrupted or restarted but the target color (the new color that washes in) just get replaced, __this is intentional__.
- There is no garbage disposal as the scene is rendered inside a static page and is not really dynamic in asset's loads, be aware of it if you change the website into a web app.
- The product swiping by the user is handled with OrbitControls, the threejs's plugin.

Inside __hero-eyeglass-interaction.ts__ you will find the code commented to understand what goes on but the logic flows as:

- when dom is ready it initialize the renderer and listen for resize to adjust the view
- the camera, orbitControl, lights and env map are loaded
- the product 3d object is loaded from the function __createHeroEyeglassEntity__ which do all the initial setup and return the ref to the object (which is a group)
- starts the intro timeline (it get's updated in the render loop which is not started yet)
- start listening to the changedHighlightColor event
- an IntersectionObserver is made to check if the user is actually seeing the scene, if so the animation starts (when the scene is not being see the animation won't fire, but when started and going out of view it will stop, check inside the observer logic)

The wash in effect is handled by 3 main params, __the current color__, __the target color__ and a __progress__ percentage, those params are modified from the scripts with gsap's timeline (the one called that has been called update) and then used by the shaders you can find in __'/src/scripts/pages/home/3d-objects/cover/'__.

To retain pbr realism and create the effect we used the materials from three-custom-shader-material (credits to https://github.com/FarazzShaikh).

#### The World interaction
The world interaction's rendering logic is the same of the product but it present's no gsap or complex logic flows, it's just a 3D world rotating.

#### On scroll animations
The animation of html elements appearing from nowhere is made using the intersectionObserver inside the script __on-scroll-anim.ts__.

The elements that need to be animated on scroll needs to have a __anim-on-scroll__ attribute with the name of the animation wanted,
when the elements intersect with the screen view the animation is added into the style of the element and if a __anim-on-scroll-delay__
attribute is present, it's used to delay the start of the animation (this is currently used in the project to create sequential animations ).

__NOTE__
<br/>
The animation that are used are found in the animation.css file, it's automatically included with the PageLayout wrapper used in every page.
<br/>
Remember to add the initial state of the animation to the element, the animation will be forwarded to maintain the new look:

__EXAMPLE__
<br/>
__css__
```
.fade-from-left {
    opacity: 0;
    transform: translateX(-2rem);
}

@keyframes fade-from-left {
    0% {
        opacity: 0;
        transform: translateX(-2rem);
    }

    100% {
        opacity: 1;
        transform: translateX(0rem);
    }
}
```
__observer animation ts__
```
(entry.target as HTMLElement).style.animation = `${attrAnimationName!.value} 0.25s ease-out ${delay + delayIncrease + 's'} forwards`;
```
__html__
```
<div
    id="hero-message"
    class="fade-from-left"
    anim-on-scroll="fade-from-left"
>
    ...
</div>
```

## How a page is created (and should be added in the future)
A page is made from two essential file:
- __The wrapper file__, called as the name you need to see in the url (remember that Astro creates pages with paths using the folder structures inside __/src/pages/__ ).
- __The content file__, usually called as per the page name with _'Content'_ in front, like _'ShopContent'_, located in the __/src/content/__ path.
The __content file__ handles the logic and ui layout of a page, in this project every Content page that needs to have updatable content have a Props interface that has an object with the type taken from the Sanity schema generation.
The loaded object is used to insert the content in the page.
<br/>
The __wrapper file__ place the __content file__ inside the slot of the __PageLayout__ component, a component made to give the same navbar, footer, page structure and metadata structure to every page.
<br/>
In the __frontmatter__ of the __wrapper file__ there is query to sanity for the navbar, the footer and the __content component__ loaded from the __content file__, the data is filtered by the language field and then passes as attributes to the navbar, content and footer.
<br/>
By following this process, all the pages can be internationalized, made updatable by Sanity Cms and be built to be statics pages with an url to visit.

__NOTES__
- As of now, the css files that are used only inside a page are called as the page and placed in /public/css/pages/ and called from the frontmatter of the __content file__ so it can be bundled by Astro.

When a page is created it's raccomanded to start with hard coded content, after finishing the page, create the Sanity type in the sanity studio project located in __/src/studio-lorika-ontop/__.
<br/>
I'm not going to explain how sanity work, there are ton of guides online and it's simple when you just need to do this one thing.
<br/>
After you created the sanity type and uploaded the content to it you can use the command _extract-schema_ with npm to make the schema (a typescript interface) and reference it in the Props interface of the __Content file__ to have intellisense while refactoring the page to load data from Sanity.