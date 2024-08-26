// import Page fixture from playwrigh library
import { Locator, Page } from "@playwright/test";
import { group } from "console";
import { HelperBase } from "./helperBase";

// export in order to be visible to other files in the project
// extend means use common methods
export class NavigationPage extends HelperBase{
    // 1. fields
    readonly formLayoutsMenuItem: Locator;
    readonly datepickerMenuItem: Locator;
    readonly smartTableMenuItem: Locator;
    readonly toastrMenuItem: Locator;
    readonly tooltipMenuItem: Locator;

    // 2. constractor, to define type of your var
    constructor(page: Page){
        // assign instance of the page fixture from test into the local field related to NavigationPage right here
        // because of extend instead "this.page = page" use super(page) and remove "readonly page: Page" from the field
        super(page);
        this.formLayoutsMenuItem = page.getByText("Form Layouts");
        this.datepickerMenuItem = page.getByText("Datepicker");
        this.smartTableMenuItem = page.getByText("Smart Table");
        this.toastrMenuItem = page.getByText("Toastr");
        this.tooltipMenuItem = page.getByText("Tooltip");
    }
    // 3. method
    async formLayouts(){
        // this - in order to read fixture instance
        await this.expandMenuIfCollapsed("Forms")
        await this.formLayoutsMenuItem.click()
        await this.timeoutInSeconds(2)
    }

    async datepicker(){
        await this.expandMenuIfCollapsed("Forms")
        await this.datepickerMenuItem.click()
    }

    async smartTablePage(){
        await this.expandMenuIfCollapsed("Tables & Data")
        await this.smartTableMenuItem.click()
    }

    async toastrPage(){
        await this.expandMenuIfCollapsed("Modal & Overlays")
        await this.toastrMenuItem.click()
    }

    async tooltipPage(){
        await this.expandMenuIfCollapsed("Modal & Overlays")
        await this.tooltipMenuItem.click()
    }

    private async expandMenuIfCollapsed(menuItem: string){
        // to use this.page - 'HelperBase' should have page PROTECTED, not private. 
        // Private page makes it accessible only within class 'HelperBase'.
        let groupMenu = this.page.getByTitle(menuItem)
        let menuExpanded = await groupMenu.getAttribute("aria-expanded")

        if(menuExpanded == "false"){
            await groupMenu.click()
        }
    }
}