import { Page, Locator } from "@playwright/test"
import { HelperBase } from "./helperBase";


interface SubmitFormParams {
    name?: string;
    email?: string;
    password?: string;
    optionText?: string;
    checkbox?: boolean;
    rememberMe?: boolean;
}

export class FormLayoutsPage extends HelperBase{
    readonly gridForm: Locator
    readonly emailField: Locator
    readonly passwordField: Locator
    readonly submitButton: Locator
    readonly emailInlineField: Locator
    readonly inlineForm: Locator
    readonly nameField: Locator
    readonly checkbox: Locator
    readonly submitInlineButton: Locator
    
    constructor(page: Page){
        super(page)
        this.gridForm = page.locator("nb-card", {hasText: "Using the Grid"})
        this.emailField = this.gridForm.getByRole("textbox", {name: "Email"})
        this.passwordField = this.gridForm.getByRole("textbox", {name: "Password"})
        this.submitButton = this.gridForm.getByRole("button")
        this.inlineForm = page.locator("nb-card", {hasText: "Inline form"})
        this.nameField = this.inlineForm.getByRole("textbox", {name: "Jane Doe"})
        this.emailInlineField = this.inlineForm.getByRole("textbox", {name: "Email"})
        this.checkbox = this.inlineForm.getByRole("checkbox")
        this.submitInlineButton = this.inlineForm.getByRole("button")
    }

    // "Promise<void>" means it doesn't return any specific value
    /**
    * @param email - A properly formatted email address associated with the user
    * @param password - Must be between 8 and 15 characters, and contain at least one uppercase letter, one digit, and one special character
    * @param optionText - "Option 1" || "Option 2"
    */
    async fillAndSubmitForm({ email = "test@test.com", password = "123", optionText = "Option 1" }: SubmitFormParams = {}): Promise<void> {        
        let radioButton = this.gridForm.getByRole("radio", {name: optionText})
        await this.emailField.fill(email)
        await this.passwordField.fill(password)
        await radioButton.check({force: true})
        await this.submitButton.click()
    }

    /**
    * @param name - First and Last name
    * @param email - A properly formatted email address associated with the user
    * @param rememberMe - Set to 'true' to save the user session; otherwise, set to 'false'
    */
    async submitInlineForm({ name = "John Gold", email = "test@test.com", rememberMe = false }: SubmitFormParams = {}): Promise<void> {
        await this.nameField.fill(name)
        await this.emailInlineField.fill(email)
        if(rememberMe){
            await this.checkbox.check({force: true})
        }
        await this.submitInlineButton.click()
    }
}