import { Page, expect, Locator } from "@playwright/test"
import { HelperBase } from "./helperBase";

interface DatepickerParams {
    daysFromToday?: number;
    startDateOffset?: number;
    endDateOffset?: number;
    dayCellLocator?: Locator;
}

export class DatepickerPage extends HelperBase{
    private readonly formPicker: Locator
    private readonly rangePicker: Locator
    private readonly calendarView: Locator
    private readonly nextButton: Locator
    private readonly dayCell: Locator
    private readonly rangeCell: Locator
    
    constructor(page: Page){
        super(page)
        this.formPicker = page.getByPlaceholder("Form Picker")
        this.rangePicker = page.getByPlaceholder("Range Picker")
        this.calendarView = page.locator("nb-calendar-view-mode")
        this.nextButton = page.locator("nb-calendar-pageable-navigation [data-name='chevron-right']")
        this.dayCell = page.locator("[class='day-cell ng-star-inserted']")
        this.rangeCell = page.locator(".range-cell:not(.bounding-month)")
    }

    async selectDate({ daysFromToday }: DatepickerParams = {}): Promise<void> {
        await this.formPicker.click()
        let expectedDate = await this.pickDate({
            daysFromToday: daysFromToday, 
            dayCellLocator: this.dayCell
        })
        await expect(this.formPicker).toHaveValue(expectedDate)
    }

    async selectDateRange({ startDateOffset, endDateOffset }: DatepickerParams = {}): Promise<void> {
        await this.rangePicker.click()
        let expectedStartDate = await this.pickDate({
            daysFromToday: startDateOffset, 
            dayCellLocator: this.rangeCell
        }) 
        let expectedEndDate = await this.pickDate({
            daysFromToday: endDateOffset, 
            dayCellLocator: this.rangeCell
        })
        await expect(this.rangePicker).toHaveValue(`${expectedStartDate} - ${expectedEndDate}`)
    }

    private async pickDate({ daysFromToday, dayCellLocator }: DatepickerParams = {}): Promise<string> {
        let date = new Date()
        date.setDate(date.getDate() + daysFromToday)
        let expectedDay = date.getDate().toString()
        let expectedMMShort = date.toLocaleString("En-US", {month: "short"})
        let expectedMMLong = date.toLocaleString("En-US", {month: "long"})
        let expectedYY = date.getFullYear()
        let expectedDate = `${expectedMMShort} ${expectedDay}, ${expectedYY}`

        let currDate = await this.calendarView.textContent()
        let expectedDateLabel = ` ${expectedMMLong} ${expectedYY}`
        while(!currDate.includes(expectedDateLabel)){
            await this.nextButton.click()
            currDate = await this.calendarView.textContent()
        }
        let targetDay = dayCellLocator.getByText(expectedDay, {exact: true})
        await targetDay.click()
        return expectedDate
    }
}