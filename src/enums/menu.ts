// * Button to Template Mapping
export enum Menu {
    button1 = "template1",

    button2 = "template2",
    
    button3 = "template3",
    
    button4 = "template4",
    
    button5 = "template5",
    
    button6 = "template6",
    
    button7 = "template7",
    
    button8 = "template8",
    
    button9 = "template9"

}


export function getMenuValue(menuKey: keyof typeof Menu): string {
    return Menu[menuKey];
}