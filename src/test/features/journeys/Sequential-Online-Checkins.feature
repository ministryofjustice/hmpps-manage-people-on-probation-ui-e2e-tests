@mode:serial
Feature: Setup Checkins
    As a user
    I want to setup online checkins
    So they can be used by an offender

    @smoke @esupervision @sequential
    Scenario: Setup Online Checkins        
        Given Context has been created for "Esupervision" test
        And A new offender has been created or existing made available
        And I am logged in
        And I have navigated to new offender
        When I set up checkIns with values
            | label      | value           |
            | date       | nextweek        |
            | frequency  | EVERY_8_WEEKS   |
            | mobile     | 07771 900 900   |
            | preference | TEXT            |
            | photo      | UPLOAD          |

    @smoke @esupervision @sequential
    Scenario: Make changes during setup
        When I make the following changes
            | label      | value            |
            | date       | tomorrow         |
            | frequency  | EVERY_2_WEEKS    |
            | email      | name@example.com |
            | preference | EMAIL            |
        And I submit the checkin
        Then Checkins should be setup

    @smoke @esupervision @sequential
    Scenario: Review checkIn    
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
        And I close the context
