// import test method from playwright libriry
import {test, expect} from '@playwright/test'

// // test accepts 2 parameters: test's name and actual test method
// test('the first test', () => {

// })

// // test suite - a group of tests
// test.describe('test suite 1', () => {
//     test('the first test', () => {

//     })

//     test('the first test', () => {

//     })
// })

// execute code before all test
// test.beforeAll(async({}) => {

// })

// for repeatable steps for every test
test.beforeEach(async({page}) => {
    // to use baseURl from playwright.config.ts
    await page.goto('/')
})

// page / browser - are fixtures. page represents blank page of the browser
test.describe('suite1', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Modal & Overlays').click()
    })

    test('the first test', async ({page}) => {
        await page.getByText('Dialog').click()
    })
    
    test('the second test', async ({page}) => {
        await page.getByText('Window').click()
    })
})

test.describe('suite2', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click()
    })

    test('the first test', async ({page}) => {
        await page.getByText('Form Layouts').click()
    })
    
    test('the second test', async ({page}) => {
        await page.getByText('Datepicker').click()
    })
})

test.describe('locators', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    // by tag name
    test('locator rules', async({page}) => {
        // by tag name
        await page.locator('input').first().click()

        // by ID
        await page.locator('#inputEmail').click()

        // by Class  
        page.locator('.shape-rectangle')

        // by atribute
        page.locator('[placeholder="Email"]')

        // by Class value
        page.locator('[class="input-full-width"]')

        // combine diff selectors
        page.locator('input[placeholder="Email"][nbinput]')

        // by XPath (not recommended)
        page.locator('//*[@id="inputEmail"]')

        // by partial text match
        page.locator(':text("Using")')

        // by exact text match
        page.locator(':text-is("Using the Grid")')
    })

    test('user facing locators', async({page}) => {
        await page.getByRole('textbox', {name: "Email"}).first().click()
        await page.getByRole('button', {name: "Sign in"}).first().click()

        await page.getByLabel('Email').first().click()

        await page.getByPlaceholder('Jane Doe').click()

        await page.getByText('Using the Grid').click()
        
        await page.getByTestId('SignIn').click()
        
        await page.getByTitle('IoT Dashboard').click()
        
    })

    test('Locating child elements', async({page}) => {
        await page.locator('nb-card nb-radio :text-is("Option 1")').click()

        // same 
        await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

        // mix of regular locator plus user facing locator
        await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()

        // click on 4th element by index .nth()
        await page.locator('nb-card').nth(3).getByRole('button').click()
    })
})

test.beforeEach(async({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test("Locating parent elements", async({page}) => {
    // 1. return parent with a text
    await page.locator("nb-card", {hasText: "Using the Grid"}).getByRole("textbox", {name: "Email"}).click()
    // 2. provide second atribute 
    await page.locator("nb-card", {has: page.locator("#inputEmail")}).getByRole("textbox", {name: "Email"}).click()
    // 3. by using filter
    await page.locator("nb-card").filter({hasText: "Basic form"}).getByRole("textbox", {name: "Email"}).click()
    await page.locator("nb-card").filter({has: page.locator(".status-danger")}).getByRole("textbox", {name: "Password"}).click()
    // 4. by unique combination
    await page.locator("nb-card")
        .filter({has: page.locator("nb-checkbox")})
        .filter({hasText: "Sign in"})
        .getByRole("textbox", {name: "Email"}).click()
    // 5. by using XPath
    await page.locator(":text-is('Using the Grid')").locator("..")
        .getByRole("textbox", {name: "Email"}).click()

})

test("Reusing the locators", async({page}) => {
    // create const
    let basicForm = page.locator("nb-card").filter({hasText: "Basic form"})
    let emailField = basicForm.getByRole("textbox", {name: "Email"})
    let emailValue = "test@test.com"

    await emailField.fill(emailValue)
    await basicForm.getByRole("textbox", {name: "Password"}).fill("Welcome123")
    await basicForm.locator("nb-checkbox").click()
    await basicForm.getByRole("button").click()

    // add assertion
    await expect(emailField).toHaveValue(emailValue)
})

test("Extracting values", async({page}) => {
    let expectedValue = "Submit"
    let emailExample = "test@test.com"

    // single test value
    let basicForm = page.locator("nb-card").filter({hasText: "Basic form"})
    let buttonText = await basicForm.locator("button").textContent()
    expect(buttonText).toEqual(expectedValue)

    // all text values
    let buttonsLabels = await page.locator("nb-radio").allTextContents()
    expect(buttonsLabels).toContain("Option 1")

    // value of input field
    let emailField = basicForm.getByRole("textbox", {name: "Email"})
    await emailField.fill(emailExample)
    let emailValue = await emailField.inputValue()
    expect(emailValue).toEqual(emailExample)

    // get the value of atribute
    let placeHolder = await emailField.getAttribute("placeholder")
    expect(placeHolder).toEqual("Email")
})

test("Assertions", async({page}) => {
    let submit = "Submit"
    let basicFormButton = await page.locator("nb-card")
        .filter({hasText: "Basic form"})
        .locator("button")

    // general/generic assertion (is not awaited)
    let num = 5
    expect(num).toEqual(5)

    let actualText = await basicFormButton.textContent()
    expect(actualText).toEqual(submit)

    // locator assertion can interact with locator (awaits up to 5 sec) 
    await expect(basicFormButton).toHaveText(submit)

    // soft assertion. test continues if failed (not good practice)
    await expect.soft(basicFormButton).toHaveText(submit + "2")
    await basicFormButton.click()
})

// PROMISE is a type of JS function that can wait for the curtain desired condition untill the timeout
// await (auto) is 30 secs

// execute code after afterAll() / afterEach() - not a good practice, but acceptable for cleaning data


