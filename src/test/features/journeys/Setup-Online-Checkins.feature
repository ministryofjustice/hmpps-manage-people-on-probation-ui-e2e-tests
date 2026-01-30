Feature: Setup Checkins
    As a user
    I want to setup online checkins
    So they can be used by an offender

    @smoke @esupervision
    Scenario: Setup Online Checkins - TEXT
        Given A new offender has been created for setups
        And I am logged in and have navigated to new offender
        When I set up checkIns with values
            | label      | value           |
            | date       | tomorrow        |
            | frequency  | EVERY_8_WEEKS   |
            | mobile     | 07771 900 900   |
            | preference | TEXT            |
            | photo      | UPLOAD          |
        And I make the following changes
            | label      | value           |
            | date       | nextweek        |
            | frequency  | EVERY_2_WEEKS   |
            | email      | Test@test.com   |
            | preference | EMAIL           |
        And I submit the checkin
        Then Checkins should be setup