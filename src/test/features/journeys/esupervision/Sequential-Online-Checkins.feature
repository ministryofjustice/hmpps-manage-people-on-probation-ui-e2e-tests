@mode:serial
Feature: Setup Checkins
    As a user
    I want to setup online checkins
    So they can be used by an offender

    @smoke @full @esupervision @sequential
    Scenario: Setup Online Checkins        
        Given Context has been created for "Esupervision" test
        And A new offender has been created or existing made available
        And I am logged in
        And I clear the contact details if set
        And I have navigated to new offender
        When I click to set up online checkIns
        And I complete the eligibility check page with criteria
            | At a very high risk of serious harm (ROSH) |
            | On a youth sentence                        |
        And I complete the eligibile page
        And I complete the date frequency page with date 'NEXTWEEK' and frequency 'Every 8 weeks'
        And I navigate to update contact details via "Mobile number" link from checkins journey
        And I update the mobile number to "07771900900"
        And I submit the updated contact details
        And I complete the contact preference page with preference 'Text message'
        And I complete the photo options page with option 'Upload a photo'
        And I complete the upload photo page
        And I complete the photo meet the rules page
        Then I can see the checkIn summary page
        
    @smoke @full @esupervision @sequential
    Scenario: Make changes during setup
        # When I make the following changes
        #     | label      | value            |
        #     | date       | tomorrow         |
        #     | frequency  | EVERY_2_WEEKS    |
        #     | email      | name@example.com |
        #     | preference | EMAIL            |
        When I submit the checkin
        Then I can see the confirmation page
        # Then Checkins should be setup

    @smoke @full @esupervision @sequential
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

    @smoke @full @esupervision @sequential
    Scenario: Stop CheckIns
        When I navigate to checkIn details
        And I stop checkIns with '<reason>' and sensitivity 'No'
        Then checkIns are labelled as stopped

        Examples:
            | reason       |
            | just because |

    @smoke @full @esupervision @sequential
    Scenario: Restart CheckIns
        When I navigate to checkIn details
        And I click to restart checkIns
        And I complete the restart date frequency page with date 'NEXTWEEK' and frequency 'Every 8 weeks'
        And I complete the restart contact preference page with preference 'Text message'
        Then I can see the checkIn summary page for restart
        When I submit the checkin
        # Then Checkins should be setup
        Then I close the context