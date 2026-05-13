Feature: Manage Appointments
    As a user
    I want to manage existing appointments
    So that I can update their details

    @smoke @full @manage @note
    Scenario: Add Large Note to Appointment - Test mod security rules
        Given Context has been created for "Manage" test
        And I am logged in
        When I navigate to first upcoming appointment
        And I add a large note to the appointment
        Then I can see the new note on the appointment
        And I close the context

    @smoke @full @manage @updateSensitivity
    Scenario: Add note to appointment and mark as sensitive
        Given Context has been created for "Manage" test
        And I am logged in
        When I navigate to first non sensitive upcoming appointment
        And I add a note to the appointment and mark as sensitive
        Then I can see the new note on the appointment 
        And I can see the appointment marked as sensitive
        And I close the context

    @smoke @full @manage @updateSensitivity
    Scenario: Add note to appointment and attempt to clear sensitivity
        Given Context has been created for "Manage" test
        And I am logged in
        When I navigate to first sensitive upcoming appointment
        And I add a note to the appointment 
        Then I can see the new note on the appointment 
        And I can see the appointment marked as sensitive
        And I close the context

   @smoke @full @manage @attended
   Scenario: Add Attended Complied Outcome
       Given Context has been created for "Manage" test
       And I am logged in
       When I navigate to latest appointment requiring an outcome
       And I mark the attended complied outcome
       Then I can see the attended and complied status
       And I close the context
 # Past Appointments flow for Log an Outcome is being changed to new journey so the existing journey will not work.