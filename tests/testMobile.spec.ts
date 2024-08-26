import{test} from "@playwright/test"
import{PageManager} from "../page-objects/pageManager"
import {faker} from "@faker-js/faker"


// testInfo - for reusing code and adding specific for device steps
test("fill and submit form", async({page}, testInfo) => {
    await page.goto("/")
    const pm = new PageManager(page)
    
    // additional step, specific for mobile
    if(testInfo.project.name == 'mobile'){
        // expand menu
        await page.locator(".sidebar-toggle").click()
    }
    
    // create random test data
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(" ", "")}${faker.number.int(1000)}@test.com`
    await pm.navigateTo().formLayouts()

    // additional step, specific for mobile
    if(testInfo.project.name == 'mobile'){
        // expand menu
        await page.locator(".sidebar-toggle").click()
    }
    
    await pm.getFormLayoutsPage().fillAndSubmitForm({
        email: randomEmail,
        // ! to use credentials from .env
        password: (process.env.PASSWORD), 
        optionText: "Option 2"
    })
    await pm.getFormLayoutsPage().submitInlineForm({ 
        name: randomFullName,
        email: randomEmail, 
        rememberMe: false
    })
})