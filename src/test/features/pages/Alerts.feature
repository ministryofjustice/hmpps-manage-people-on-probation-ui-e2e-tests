Feature: Alerts page
    As a user
    I want to view and manage alerts
    So that I can stay informed about important events

    @smoke @alerts
    Scenario: Verify alerts page functionality
        Given Context has been created for "Alerts" test
        And I am logged in
        And I have noted the alerts count
        And A new offender has been created in Ndelius
        And The offender has been given an alert
        And I have navigated to alerts
        Then the page should be rendered
        And the new alert should be present
        When I click the person link
        Then I should be taken to the overview page
        When I click the activity link
        Then I should be taken to the manage appointments page
        When I view the activity note
        Then I should be on the note page
        When I navigate through pagination
        Then the alerts list should be updated
        When I select and deselect all alerts
        When I try to clear alerts without selection
        Then I should see an error message
        When I select and clear an alert
        Then the alert should be cleared
        And I close the context