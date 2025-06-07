//import clsx to class names codinating purpose - npm install clsx
//npm install tailwind-merge

import {clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs){
    return twMerge(clsx(inputs));
}