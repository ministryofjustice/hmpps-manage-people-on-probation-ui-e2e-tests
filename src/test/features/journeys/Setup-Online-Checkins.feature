Feature: Setup Checkins
    As a user
    I want to setup online checkins
    So they can be used by an offender

    @smoke @esupervision
    Scenario: Setup Online Checkins
        Given A new offender has been created for setups
        And I am logged in and have navigated to new offender
        When I set up checkIns with values
            | label      | value           |
            | date       | nextweek        |
            | frequency  | EVERY_8_WEEKS   |
            | mobile     | 07771 900 900   |
            | preference | TEXT            |
            | photo      | UPLOAD          |
        And I make the following changes
            | label      | value           |
            | date       | tomorrow        |
            | frequency  | EVERY_2_WEEKS   |
            | email      | Test@test.com   |
            | preference | EMAIL           |
        And I submit the checkin
        Then Checkins should be setup
        When I mock the completion of a completed checkin
            | label               | value           |
            | mentalHealth        | NotGreat        |
            | mentalHealthComment | tired           |
            | drugsSupport        | need help       |
            | otherSupport        | friends are bad |
            | callback            | Yes             |
        Then I can access the new checkIn in the contact log
        When I review the completed checkIn
        Then I can view the reviewed checkIn

    @esupervision @expired
    Scenario: Create Expired Checkin
        Given I am logged in with context
        When I find a suitable CRN
        And I mock the completion of an expired checkin
        Then I can access the expired checkIn in the contact log
        When I review the missed checkIn
        Then I can view the expired and reviewed checkIn
        And Context is closed

    @esupervision @random
    Scenario: Randomised Setup
        Given A new offender has been created for setups
        And I am logged in and have navigated to new offender
        When I set up checkIns with random values
        And I make random changes
        And I submit the checkin
        Then Checkins should be setup