Feature: Non serial checkIn journeys
    As a user
    I want to setup online checkins
    So they can be used by an offender

    @esupervision @expired
    Scenario: Create Expired Checkin
        Given Context has been created for "Esupervision" test
        And I am logged in
        When I find a suitable CRN
        And I mock the completion of an expired checkin
        Then I can access the expired checkIn in the contact log
        When I review the missed checkIn
        Then I can view the expired and reviewed checkIn
        And I close the context

    @esupervision @random
    Scenario: Randomised Setup
        Given Context has been created for "Esupervision" test
        And A new offender has been created in Ndelius
        And I am logged in
        And I have navigated to new offender
        When I set up checkIns with random values
        And I make random changes
        And I submit the checkin
        Then Checkins should be setup
        And I close the context