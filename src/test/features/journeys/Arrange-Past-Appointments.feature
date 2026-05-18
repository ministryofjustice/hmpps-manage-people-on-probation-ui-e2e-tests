Feature: Create Past Appointments
    As a user
    I want to create appointments
    So that I can manage my schedule

    @full @appointments @past
    Scenario Outline: Create appointment with critera: inPast and defaultAttendee for case with criteria: singleSentence, noVisor
        Given Context has been created for "appointments" test
        And A new offender has been created or existing made available
        And I am logged in
        And I clear the contact details if set
        When I navigate to the appointments page
        And I click to arrange an appointment
        And I complete the type attendance page with type "Planned video contact (NS)" and default attendee
        And I complete the location and datetime page with date "LASTWEEK", startTime "10:10", endTime "11:11" and location "Wrexham Team Office"
        And I complete the attended complied page
        And I complete the add note page with note "test" and sensitivity "No"
        Then I can see the correct information on the CYA page for a past appointment
        When I submit the appointment
        Then I can see the Confirmation page for "past" appointment
        When I navigate to the appointments page
        And I access the created appointment
        Then I can see the Manage page
        And I can see no outlook event was created
        And I close the context    