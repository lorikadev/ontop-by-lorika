import { aboutUsType } from "./aboutUseType";
import { colorPickerType } from "./colorPickerType";
import { homePageType } from "./homePageType";
import { ontopCoverType } from "./ontopCoverType";
import { siteNavigatorsType } from "./siteNavigatorsType";

export const schemaTypes = [
    //navbar and footer
    siteNavigatorsType,
    //home / index page 
    homePageType,
    //color picker labels and accessibility
    colorPickerType,
    //about us page
    aboutUsType,
    //ontop cover page
    ontopCoverType
];
