document.addEventListener("DOMContentLoaded", () => {
  //collect all the accordions in the page
  const accordions = document.querySelectorAll<HTMLElement>(".accordion");

  accordions.forEach((accordion) => {
    //gets the accordion header
    const header = accordion.querySelector<HTMLButtonElement>(".accordion-header");
    if (!header) {
      console.error("toggle-accordions: \n all the accordions should have an accordion-header, this one doesn't:", accordion);
      return;
    };

    //attach toggle event to header
    header.addEventListener("click", () => {
      const name = accordion.dataset.name;
      if (!name) {
        console.error("toggle-accordions: \n all the accordions should have a data-name, this one doesn't:", accordion);
        return;
      };

      //NOTE - we check the open attirbute now becuase we are going to remove it now
      const isOpen = accordion.hasAttribute("open");

      // close all the accordions with the same name
      const sameGroup = document.querySelectorAll<HTMLElement>(
        `.accordion[data-name="${name}"]`
      );
      sameGroup.forEach((el) => {
        el.removeAttribute("open")
        //ACCESSIBILIY
        header.setAttribute("aria-expanded", "false");
      });

      // if the accordion was close before the removal we open it
      if (!isOpen) {
        accordion.setAttribute("open", "");
        //ACCESSIBILIY
        header.setAttribute("aria-expanded", "true");
      }
    });
  });
});