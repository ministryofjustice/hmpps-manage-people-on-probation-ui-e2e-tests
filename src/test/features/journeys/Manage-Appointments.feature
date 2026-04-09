Feature: Manage Appointments
    As a user
    I want to manage existing appointments
    So that I can update their details

    @smoke @full @manage @note
    Scenario: Add Note to Appointment
        Given Context has been created for "Manage" test
        And I am logged in
        When I navigate to first upcoming appointment
        And I add a note to the appointment
        Then I can see the new note on the appointment
        And I close the context

    @smoke @full @manage @attended
    Scenario: Add Attended Complied Outcome
        Given Context has been created for "Manage" test
        And I am logged in
        When I navigate to latest appointment requiring an outcome
        And I mark the attended complied outcome
        Then I can see the attended and complied status
        And I close the context
