Feature: Setup Checkins
    As a user
    I want to setup online checkins
    So they can be used by an offender

    @smoke
    Scenario: Setup Online Checkins - TEXT
        Given A new offender has been created
        And I am logged in and have navigated to new offender
        When I set up checkIns with TEXT MESSAGE as contact preference
        Then checkIns should be setup up succesfully

    @smoke
    Scenario: Setup Online Checkins - EMAIL
        Given A new offender has been created
        And I am logged in and have navigated to new offender
        When I set up checkIns with EMAIL as contact preference
        Then checkIns should be setup up succesfully