import { test as base } from "@playwright/test"
import { PageManager } from "./page-objects/pageManager"

// ! 1 ENV. use this file to add more env vars for playwright.config.ts
export type TestOptions = {
    globalsURL: string 
    // ! create a fixture
    formsLayoutsPage: string,
    pageManager: PageManager
}

export const test = base.extend<TestOptions>({
    globalsURL: ["", {option: true}],

    // formsLayoutsPage: async({page}, use) => {
    //     const pm = new PageManager(page)
    //     await page.goto("/")
    //     await pm.navigateTo().formLayouts()
    //     // ! activate fixture
    //     await use('')
    // }

    // 2 way to run fixture automatically every test, use [] and {auto:true}
    // formsLayoutsPage: [async({page}, use) => {
    //     const pm = new PageManager(page)
    //     await page.goto("/")
    //     await pm.navigateTo().formLayouts()
    //     // ! activate fixture
    //     await use('')
    // }, {auto: true}],

    // // second fixture for pageManager object
    // pageManager: async({page}, use) => {
    //     const pm = new PageManager(page)
    //     await use(pm)
    // }

    // 3 way to create several fixtures with dependencies between them
    formsLayoutsPage: async({page}, use) => {
        const pm = new PageManager(page)
        await page.goto("/")
        await pm.navigateTo().formLayouts()
        // ! activate fixture
        await use('')
        // everything after use is tear dow
        console.log('Tear Down after Forms')
    },

    // second fixture for pageManager object witch triggers formsLayoutsPage
    pageManager: async({page, formsLayoutsPage}, use) => {
        const pm = new PageManager(page)
        await use(pm)
        console.log('Tear Down after pm')

    }
})