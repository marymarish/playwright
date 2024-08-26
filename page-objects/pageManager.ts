import { Page } from "@playwright/test"
import{NavigationPage} from "../page-objects/navigationPage"
import { FormLayoutsPage } from "../page-objects/formLayoutsPage"
import { DatepickerPage } from "../page-objects/datepickerPage"

export class PageManager{
    private readonly page: Page
    private readonly navigationPage: NavigationPage
    private readonly formLayoutsPage: FormLayoutsPage
    private readonly datepickerPage: DatepickerPage

    constructor(page){
        this.page = page
        this.navigationPage = new NavigationPage(this.page)
        this.formLayoutsPage = new FormLayoutsPage(this.page)
        this.datepickerPage = new DatepickerPage(this.page)
    }

    // create instance of the class with instance of the page (page)
    navigateTo(){
        return this.navigationPage
    }
    getFormLayoutsPage(){
        return this.formLayoutsPage
    }
    datePickerPage(){
       return this.datepickerPage
    }

}