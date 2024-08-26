import {expect} from "@playwright/test"
// ! 4 ENV. import page from "test-options.ts" if you use additional var envs
import {test} from "../test-options"

// ! 5 ENV. use env var "globalsURL" specified in created fille "test-options.ts" and then in config.ts
test("drag and drop", async({page, globalsURL}) => {
    let exampleURL = globalsURL
    await page.goto(exampleURL)
    // 1. create iframe locator 
    // iframe is a kind of embedded HTML document inside of the existing HTML doc. 
    let iFrame = await page.frameLocator("[rel-title='Photo Manager'] iframe")
    let highTatras = iFrame.locator("li", {hasText: "High Tatras 2"})

    // 2. perform drag and drop element into trash
    await highTatras.dragTo(iFrame.locator("#trash"))

    // more presice control
    let highTatras4 = iFrame.locator("li", {hasText: "High Tatras 4"})
    await highTatras4.hover()
    await page.mouse.down()
    await iFrame.locator("#trash").hover()
    await page.mouse.up()

    // validate elements moved to trash
    await expect(iFrame.locator("#trash li h5")).toHaveText(["High Tatras 2", "High Tatras 4"])
})




