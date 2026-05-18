Feature: Manage Appointments
    As a user
    I want to manage existing appointments
    So that I can update their details

    @smoke @full @manage @note
    Scenario: Add Note to Appointment
        Given Context has been created for "Manage" test
        And I am logged in
        When I navigate to first non sensitive upcoming appointment
        And I note the current number of notes
        And I navigate to the add a note page
        And I complete the add note page with note "note" and sensitivity "No"
        Then I can see the new note on the appointment
        And I close the context

    @smoke @full @manage @updateSensitivity
    Scenario: Add note to non sensitive appointment and mark as sensitive
        Given Context has been created for "Manage" test
        And I am logged in
        When I navigate to first non sensitive upcoming appointment
        And I note the current number of notes
        And I navigate to the add a note page
        And I complete the add note page with note "note" and sensitivity "Yes"
        Then I can see the new note on the appointment 
        And I can see the appointment marked as sensitive
        And I close the context

    @smoke @full @manage @updateSensitivity
    Scenario: Add note to sensitive appointment
        Given Context has been created for "Manage" test
        And I am logged in
        When I navigate to first sensitive upcoming appointment
        And I note the current number of notes
        And I navigate to the add a note page
        And I complete the add note page with note "note"
        Then I can see the new note on the appointment 
        And I can see the appointment marked as sensitive
        And I close the context

#    @smoke @full @manage @attended
#    Scenario: Add Attended Complied Outcome to non sensitive appointment
#        Given Context has been created for "Manage" test
#        And I am logged in
#        When I navigate to latest non sensitive appointment requiring an outcome
#        And I complete the attended complied page
#        And I complete the add note page with note "test" and sensitivity "No"
#        Then I can see the attended and complied status
#        And I close the context
#  # Past Appointments flow for Log an Outcome is being changed to new journey so the existing journey will not work.
