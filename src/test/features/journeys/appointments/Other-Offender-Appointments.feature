Feature: Create Appointments
    As a user
    I want to create appointments
    So that I can manage my schedule

    Background:        
        Given Context has been created for "appointments" test
        And A new dual offender has been created in Ndelius
        And I am logged in
        When I navigate to the appointments page
        And I click to arrange an appointment

    @full @appointments @dual
    Scenario: Create appointment with critera: inFuture, noText, defaultAttendee for case with criteria: dualSentence, noVisor
        When I complete the sentence page with sentence "Adult Custody < 12m (6 Months)"
        And I complete the type attendance page with type "Planned office visit (NS)" and default attendee
        And I complete the location and datetime page with date "TOMORROW", startTime "14:14", endTime "15:15" and location "Wrexham Team Office"
        Then I confirm the text message preview
        When I complete the text message confirmation page with option "No"
        And I complete the supporting information page with note "" and sensitivity "No"
        Then I can see the correct information on the CYA page for a future appointment
        When I submit the appointment
        Then I can see the Confirmation page for "future" appointment
        When I navigate to the appointments page
        And I access the created appointment
        Then I can see the Manage page
        And I can see the outlook event was created succesfully
        And I close the context    