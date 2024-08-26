import {test, expect} from "@playwright/test"
import { CtrDropdown } from "ng2-completer"

// to run all tests from file parallely
test.describe.configure({mode: "parallel"})

test.beforeEach(async({page}) => {
    await page.goto("/")
})

// .only command = execute only this test suite
// .parallel = execture in parallel, the rest subsequency
test.describe.parallel("Form Layouts page @suite", () => {
    // change default number of retry. Value 2 makes 3 attemps
    test.describe.configure({retries: 0})

    // to execute tests inside suite in serial. not recommended
    // test.describe.configure({mode: "serial"})

    test.beforeEach(async({page}) => {
        await page.getByText("Forms").click()
        await page.getByText("Form Layouts").click()
    })

    test("input fields", async({page}, testInfo) => {
        let emailInput = page.locator("nb-card", {hasText: "Using the Grid"}).getByRole("textbox", {name: "Email"})
        let emailExample = "test@test.com"
        // clean data before following retry
        if(testInfo.retry){
            await emailInput.clear()
        }
        await emailInput.fill(emailExample)
        await emailInput.clear()

        // delay between key strokes
        await emailInput.pressSequentially(emailExample, {delay: 50})

        // generic assertion
        let inputValue = await emailInput.inputValue()
        expect(inputValue).toEqual(emailExample)

        // locator assertion
        await expect(emailInput).toHaveValue(emailExample)
    })
})

test.only('radio buttons compare screenshots', async({page}) => {
    let emailInput = page.locator("nb-card", {hasText: "Using the Grid"})
    let optionOne = emailInput.getByRole("radio", {name: "Option 1"})
    let optionTwo = emailInput.getByRole("radio", {name: "Option 2"})

    await page.getByText("Forms").click()
    await page.getByText("Form Layouts").click()

    // if radio button visually is hidden
    await emailInput.getByLabel("Option 1").click({force: true})

    // await optionOne.click({force: true})
    await optionTwo.click({force: true})

    // selected or not - use ".isChecked()"
    // await optionOne.check({force: true})
    await optionTwo.check({force: true})
    let radioStatus = await optionOne.isChecked()  // general assertion
    // generate a 'golden'/baseline screenshot that will be used later for comparison
    await page.waitForTimeout(2000)
    await expect(emailInput).toHaveScreenshot()
    // to update base screenshot use CLI command: "npx playwright test --update-snapshots"
})

test('radio buttons', async({page}) => {
    let emailInput = page.locator("nb-card", {hasText: "Using the Grid"})
    let optionOne = emailInput.getByRole("radio", {name: "Option 1"})
    let optionTwo = emailInput.getByRole("radio", {name: "Option 2"})

    await page.getByText("Forms").click()
    await page.getByText("Form Layouts").click()

    // if radio button visually is hidden
    await emailInput.getByLabel("Option 1").click({force: true})

    await optionOne.click({force: true})

    // selected or not - use ".isChecked()"
    await optionOne.check({force: true})
    let radioStatus = await optionOne.isChecked()  // general assertion
    expect(radioStatus).toBeTruthy()
    await expect(optionOne).toBeChecked()  // locator assertion with await


    await optionTwo.check({force: true})
    expect(await optionOne.isChecked()).toBeFalsy()
    expect(await optionTwo.isChecked()).toBeTruthy
})

test("checkboxes", async({page}) => {
    let checkboxOne = page.getByRole("checkbox", {name: "Hide on click"})
    let checkboxTwo = page.getByRole("checkbox", {name: "Prevent arising of duplicate toast"})
    let allCheckboxes = page.getByRole("checkbox")

    await page.getByText("Modal & Overlays").click()
    await page.getByText("Toastr").click()

    // click method do not check checkbox to be checked or unchecked
    await checkboxOne.click({force: true})

    // check method performs click only if checkbox in unchecked
    await checkboxOne.check({force: true})

    // uncheck box if it is not selected
    await checkboxOne.uncheck({force: true})

    await checkboxTwo.check({force: true})

    // unselect all checkboxes on the page
    // .all - convert multiple elements into array of locators
    for(let box of await allCheckboxes.all()){
        await box.check({force: true})
        expect(await box.isChecked()).toBeTruthy()
    }

    for(let box of await allCheckboxes.all()){
        await box.uncheck({force: true})
        expect(await box.isChecked()).toBeFalsy()
    }
})

test("lists and dropdowns", async({page}) => {
    let menu = page.locator("ngx-header nb-select")
    await menu.click()

    // selected item from expanded list
    page.getByRole("list")  // for "ul" tag
    page.getByRole("listitem")  // for "li" tag

    // let optionList = page.getByRole("list").locator("nb-option")
    // or:
    let optionList = page.locator("nb-option-list nb-option")
    await expect.soft(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate2"])

    // filter drop down element by value
    await optionList.filter({hasText: "Cosmic"}).click()

    // validate color on the page
    let header = page.locator("nb-layout-header")
    await expect(header).toHaveCSS("background-color", "rgb(50, 50, 89)")

    // validate all colors on the page
    let colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }
    await menu.click()
    for(let color in colors){
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS("background-color", colors[color])
        if(color != "Corporate"){
            await menu.click()
        }
    }
})

test("tooltips", async({page}) => {
    await page.getByText("Modal & Overlays").click()
    await page.getByText("Tooltip").click()
    
    // mouse hover
    // there is a role "tooltip" exists for the selector (if specified in DOM)
    let toolTipCard = page.locator('nb-card', {hasText: "Tooltip Placements"})
    await toolTipCard.getByRole("button", {name: "Top"}).hover()

    let toolTip = await page.locator("nb-tooltip").textContent()
    expect(toolTip).toEqual("This is a tooltip")

    // command on MAC: "/", on Windows: "F8" to freeze browser in order to find out
    // the tooltip which is dynamically shows up and hiding in the DOM

})

test("dialog box", async({page}) => {
    await page.getByText("Tables & Data").click()
    await page.getByText("Smart Table").click()

    // create leasener. Interact with browser dialog box
    page.on("dialog", dialog => {
        expect(dialog.message()).toEqual("Are you sure you want to delete?")
        dialog.accept()
    })
    let removeEmail = "mdo@gmail.com"
    let trashIcon = page.getByRole("table").locator("tr", {hasText: removeEmail}).locator(".nb-trash")
    
    await trashIcon.click()
    await expect(page.locator("table tr").first()).not.toHaveText(removeEmail)
})

test("web table interaction", async({page}) => {
    let userEmail = "twitter@outlook.com"
    let userEmail2 = "example@test.com"
    let submitChanges = page.locator(".nb-checkmark")
    await page.getByText("Tables & Data").click()
    await page.getByText("Smart Table").click()

    // get role by text in the row
    let targetRow = page.getByRole("row", {name: userEmail})
    await targetRow.locator(".nb-edit").click()

    // modify row
    let ageValue = page.locator("input-editor").getByPlaceholder("Age")
    await ageValue.clear()
    await ageValue.fill("35")
    await submitChanges.click()

    // go to the next page
    await page.locator(".ng2-smart-pagination-nav").getByText("2").click()
    let targetRowId = page.getByRole("row", {name: "11"})  // 2 elements
    // await targetRowId.click()  // error because two elements

    // specify row and column value
    let rowId = page.getByRole("row").filter({has: page.locator("td").nth(1).getByText("11")})
    await rowId.locator(".nb-edit").click()

    // modify email in provided row
    let emailField = page.locator("input-editor").getByPlaceholder("E-mail")
    await emailField.clear()
    await emailField.fill(userEmail2)
    await submitChanges.click()
    await expect(rowId.locator("td").nth(5)).toHaveText(userEmail2)

    // test filter
    let ages = ["20", "30", "40", "200"]
    let ageFilter = page.locator("input-filter").getByPlaceholder("Age")
    for(let age of ages){
        await ageFilter.clear()
        await ageFilter.fill(age)

        // add delay
        await page.waitForTimeout(500)

        let ageRows = page.locator("tbody tr")
        for(let row of await ageRows.all()){
            let cellValue = await row.locator("td").last().textContent()

            if(age == "200"){
                expect(await page.getByRole("table").textContent()).toContain("No data found")
            } else{
                expect(cellValue).toEqual(age)
            }
            
        }
    }
            
})

test("datepicker", async({page}) => {
    await page.getByText("Forms").click()
    await page.getByText("Datepicker").click()

    let calInput = page.getByPlaceholder("Form Picker")
    await calInput.click()

    // getByText - partial match. use {exact: true} for exact match
    let currMonth = page.locator("[class='day-cell ng-star-inserted']").getByText("1", {exact: true})
    await currMonth.click()
    await expect(calInput).toHaveValue("Aug 1, 2024")

    // set dynamic expected date
    let date = new Date()
    date.setDate(date.getDate() + 60)
    let expectedDay = date.getDate().toString()
    let expectedMM = date.toLocaleString("En-US", {month: "short"})
    let expectedMMLong = date.toLocaleString("En-US", {month: "long"})
    let expectedYY = date.getFullYear()
    let expectedDate = `${expectedMM} ${expectedDay}, ${expectedYY}`

    // await calInput.click()
    // let targetMonth = page.locator("[class='day-cell ng-star-inserted']").getByText(expectedDay, {exact: true})
    // await targetMonth.click()
    // await expect(calInput).toHaveValue(expectedDate)

    // select next month in day picker
    await calInput.click()
    let currDate = await page.locator("nb-calendar-view-mode").textContent()
    let nextButton = page.locator("nb-calendar-pageable-navigation [data-name='chevron-right']")
    let expectedDateLabel = ` ${expectedMMLong} ${expectedYY} `
    while(!currDate.includes(expectedDateLabel)){
        await nextButton.click()
        // await page.waitForTimeout(500)
        currDate = await page.locator("nb-calendar-view-mode").textContent()
    }

    let targetMonth = page.locator("[class='day-cell ng-star-inserted']").getByText(expectedDay, {exact: true})
    await targetMonth.click()
    await expect(calInput).toHaveValue(expectedDate)
})

test("sliders", async({page}) => {
    // Two ways to move a mous
    // 1. Update slider atribute, change circle value and validate 
    let tempDragger = page.locator("[tabtitle='Temperature'] ngx-temperature-dragger circle")
    await tempDragger.evaluate( node => {
        node.setAttribute("cx", "232.630")
        node.setAttribute("cy", "232.630")
    })
    await tempDragger.click()

    // 2. Simulate mouse movement
    let tempBox= page.locator("[tabtitle='Temperature'] ngx-temperature-dragger")
    // scroll into view
    await tempBox.scrollIntoViewIfNeeded()
    // locate boundaries
    let boundBox = await tempBox.boundingBox()
    // get the center of the box
    let x = boundBox.x + boundBox.width / 2
    let y = boundBox.y + boundBox.height / 2
    await page.mouse.move(x, y)
    // click LBM
    await page.mouse.down()
    await page.mouse.move(x+100, y)
    await page.mouse.move(x+100, y+100)
    await page.mouse.up()

    await expect(tempBox).toContainText("30")
})



"http://globalsqa.com/demo-site/draganddrop"