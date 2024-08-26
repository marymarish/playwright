// ! add path to the fixture
import{test} from "../test-options";
import {faker} from "@faker-js/faker";


test("fill and submit form", async({pageManager}) => {
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(" ", "")}${faker.number.int(1000)}@test.com`

    await pageManager.getFormLayoutsPage().fillAndSubmitForm({
        email: randomEmail,
        password: (process.env.PASSWORD), 
        optionText: "Option 2"
    })
    await pageManager.getFormLayoutsPage().submitInlineForm({ 
        name: randomFullName,
        email: randomEmail, 
        rememberMe: false
    })
})

