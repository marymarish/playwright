import { Page } from "@playwright/test"

export class HelperBase{
    protected readonly page: Page
    
    constructor(page: Page){
        this.page = page
    }

    // common method across diff files
    async timeoutInSeconds(seconds: number){
        await this.page.waitForTimeout(seconds * 1000)
    }
}