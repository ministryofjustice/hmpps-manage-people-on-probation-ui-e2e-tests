import {Given, Then, When} from "@cucumber/cucumber";
import {chromium} from "@playwright/test";


Given('the user navigates to Google', async  ()=> {
            // Write code here that turns the phrase above into concrete actions
    let browser = await chromium.launch({ headless: false }); // set headless: true to run in background
    let context = await browser.newContext();
    let page = await context.newPage();
    await page.goto('https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/');
        });



        When('the user enters {string} into the search field',  (string)=> {
            // Write code here that turns the phrase above into concrete actions

        });


        When('the user clicks the submit button',  ()=> {
            // Write code here that turns the phrase above into concrete actions

        });



        Then('the message {string} should be displayed on the page',  (string) => {
            // Write code here that turns the phrase above into concrete actions

        });
