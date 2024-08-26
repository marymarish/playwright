import{test} from "@playwright/test"
import{PageManager} from "../page-objects/pageManager"
import {faker} from "@faker-js/faker"

test.beforeEach(async({page}) => {
    await page.goto("/")
})

// @smoke - test tag
test("navigate to form page @regression", async({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayouts()
    await pm.navigateTo().datepicker()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test("fill and submit form @smoke", async({page}) => {
    const pm = new PageManager(page)
    // create random test data
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(" ", "")}${faker.number.int(1000)}@test.com`
    await pm.navigateTo().formLayouts()
    await pm.getFormLayoutsPage().fillAndSubmitForm({
        email: randomEmail,
        // ! to use credentials from .env
        password: (process.env.PASSWORD), 
        optionText: "Option 2"
    })
    // 1. make a screenshot
    await page.screenshot({path: "screenshots/formsLayoutsPage.png"})
    // 2. save into buffer
    const buffer = await page.screenshot()
    // print binary code for the screenshot
    // console.log(buffer.toString("base64")) 
    // 3. make a screenshot for a section by locator
    // await pm.getFormLayoutsPage().inlineForm.screenshot({path: "screenshots/inlineForm.png"})

    await pm.getFormLayoutsPage().submitInlineForm({ 
        name: randomFullName,
        email: randomEmail, 
        rememberMe: false
    })
})

test("datepicker", async({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayouts()
    await pm.navigateTo().datepicker()
    await pm.datePickerPage().selectDate({daysFromToday: 30})
    await pm.datePickerPage().selectDateRange({
        startDateOffset: 10, 
        endDateOffset: 15})
})

test.only("testing with argoc ci", async({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayouts()
    await pm.navigateTo().datepicker()
})
