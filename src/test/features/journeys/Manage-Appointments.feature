Feature: Manage Appointments
    As a user
    I want to manage existing appointments
    So that I can update their details

    @manage @note
    Scenario: Add Note to Appointment
        Given Context has been created for "Manage" test
        And I am logged in
        When I navigate to latest past appointment
        And I add a note to the appointment
        Then I can see the new note on the appointment


