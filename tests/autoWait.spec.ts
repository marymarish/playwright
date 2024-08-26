// There are multiple actions for auto-waiting: 
// 1. attached
// 2. visible
// 3. stable
// 4. receives events
// 5. enabled
// 6. editable
 
import {test, expect} from "@playwright/test"

// testInfo for timeout before every test execution
test.beforeEach(async({page}, testInfo) => {
    // instead hard coded URL use URL specified in .env file
    // ! to run test with provided env use CLI command: "npm i dotenv --save-dev --force"
    // then add "require('dotenv').config();" in playwright.config.ts
    await page.goto(process.env.URL)
    await page.getByText("Button Triggering AJAX Request").click()
    // add additional 2sec for default test timeout
    testInfo.setTimeout(testInfo.timeout + 2000)
})

test("auto waiting", async({page}) => {
    let expectedText = "Data loaded with AJAX get request."
    // autowait 30 sec
    let successButton = page.locator(".bg-success")
    await successButton.click()

    // "textContent" - waits for text to show up (15 sec)
    let buttonText = await successButton.textContent()
    expect(buttonText).toEqual(expectedText)

    // "allTextContents" - do not wait for text to show up
    // for custom wait use ".waitFor"
    await successButton.waitFor({state: "attached"})
    let allText = await successButton.allTextContents()
    expect(allText).toContain(expectedText)

    // ".toHaveText" auto-wait is 5s
    // to modify auto-wait add: "{timeout: n}"" where n is time in ms
    await expect(successButton).toHaveText(expectedText, {timeout: 20000})
})

test.skip("alternative waits", async({page}) => {
    let successButton = page.locator(".bg-success")
    let expectedLabel = "Data loaded with AJAX get request."
    let example_url = "http://uitestingplayground.com/ajax"
    // wait for element before buttonLabel1 - "allTextContents" doesn support auto-wait to be visible
    await page.waitForSelector(".bg-success")
    let buttonLabel1 = await successButton.allTextContents()
    expect(buttonLabel1).toContain(expectedLabel)

    // wait for particular response
    // await page.waitForResponse(example_url)

//     // wait for network calls to be completed (not recommended)
//     // if API calls stacks - test stacks too
//     await page.waitForLoadState("networkidle")

//     // wait for timeout itself (harcoded time)
    // await page.waitForURL(example_url)

    // let buttonLabel = await successButton.allTextContents()
    // expect(buttonLabel).toContain(expectedLabel)
})

test.skip("timeouts", async({page}) => {
    //  override the single test timeout
    // test.setTimeout(16000)
    // multiple test timeout from conf by 3 
    test.slow()
    let successButton = page.locator(".bg-success")
    // timeout should be less than test timout
    await successButton.click({timeout: 16000}) 

})