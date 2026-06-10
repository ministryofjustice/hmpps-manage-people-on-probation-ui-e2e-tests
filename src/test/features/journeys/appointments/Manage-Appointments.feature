Feature: Manage Appointments
    As a user
    I want to manage existing appointments
    So that I can update their details

    Background:
        Given Context has been created for "Manage" test
        And I am logged in

    @smoke @full @manage @note
    Scenario: Add Large Note to Appointment - Test mod security rules
        When I navigate to the upcoming appointments page
        And I navigate to first non sensitive upcoming appointment
        And I note the current number of notes
        And I navigate to the add a note page
        And I complete the add note page with large note and sensitivity "No"
        Then I can see the new note on the appointment
        And I close the context

    @smoke @full @manage @updateSensitivity
    Scenario: Add note to non sensitive appointment and mark as sensitive
        When I navigate to the upcoming appointments page
        And I navigate to first non sensitive upcoming appointment
        And I note the current number of notes
        And I navigate to the add a note page
        And I complete the add note page with note "note" and sensitivity "Yes"
        Then I can see the new note on the appointment
        And I can see the appointment marked as sensitive
        And I close the context

    @smoke @full @manage @updateSensitivity
    Scenario: Add note to sensitive appointment
        When I navigate to the upcoming appointments page
        And I navigate to first sensitive upcoming appointment
        And I note the current number of notes
        And I navigate to the add a note page
        And I complete the add note page with note "note"
        Then I can see the new note on the appointment
        And I can see the appointment marked as sensitive
        And I close the context

# Commented out pending non compliance changes
#    @smoke @full @manage @attended
#    Scenario: Add Attended Complied Outcome to non sensitive appointment
#        When I navigate to the log outcomes page
#        And I navigate to latest non sensitive appointment requiring an outcome
#        And I complete the attended complied page
#        And I complete the add note page with note "test" and sensitivity "No"
#        Then I can see the attended and complied status
#        And I close the context

    # #requires an appointment to exist
    @full @manage @appointments @similar
    Scenario: Create similar appointment with critera: inFuture and noText for case with criteria: singleSentence, noVisor
        When I navigate to the upcoming appointments page
        And I navigate to last upcoming appointment
        And I select to arrange next appointment
        And I select similar appointment
        And I select the "Choose date and time" link on the Arrange Another page
        And I complete the location and datetime page with date "PLUS6MONTHS", startTime "21:21", endTime "22:22" and locationID 0
        Then I confirm the text message preview
        When I complete the text message confirmation page with option "No"
        And I complete the supporting information page with note "" and sensitivity "Yes"
        Then I can see the correct information on the Arrange Another page for a future appointment
        When I submit the similar appointment
        Then I can see the Confirmation page for "future" appointment
        When I submit the page
        And I select the "appointmentsTab" in case navigation
        And I access the created appointment
        Then I can see the Manage page
        And I close the context
