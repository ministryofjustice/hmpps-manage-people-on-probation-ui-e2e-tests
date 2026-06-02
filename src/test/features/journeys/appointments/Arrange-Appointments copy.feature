Feature: Create Appointments
    As a user
    I want to create appointments
    So that I can manage my schedule

    Background:        
        Given Context has been created for "appointments" test
        And A new offender has been created or existing made available
        And I am logged in
        When I navigate to the appointments page
        And I click to arrange an appointment

    @full @appointments @basic
    Scenario: Create appointment with critera: inFuture, noText, defaultAttendee and sensitive, for case with criteria: singleSentence, noVisor
        When I complete the type attendance page with type "Planned office visit (NS)" and default attendee
        And I complete the location and datetime page with date "TOMORROW", startTime "06:10", endTime "07:10" and location "Wrexham Team Office"
        Then I confirm the text message preview
        When I complete the text message confirmation page with option "No"
        And I complete the supporting information page with note "" and sensitivity "Yes"
        Then I can see the correct information on the CYA page for a future appointment
        When I submit the appointment
        Then I can see the Confirmation page for "future" appointment
        When I navigate to the appointments page
        And I access the created appointment
        Then I can see the Manage page
        And I can see the outlook event was created succesfully
        Then I close the context

    @full @appointments @basic
    Scenario: Create appointment with critera: inFuture, noText, defaultAttendee and non-sensitive, for case with criteria: singleSentence, noVisor
        When I complete the type attendance page with type "Planned office visit (NS)" and default attendee
        And I complete the location and datetime page with date "TOMORROW", startTime "07:10", endTime "08:10" and location "Wrexham Team Office"
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
        Then I close the context

    @full @appointments @noLocationNeeded
    Scenario: Create appointment with critera: inFuture, noText, defaultAttendee and locationNotNeeded for case with criteria: singleSentence, noVisor
        When I complete the type attendance page with type "Planned telephone contact (NS)" and default attendee
        And I complete the location and datetime page with date "NEXTWEEK", startTime "10:10", endTime "11:11" and location "I do not need to pick a location"
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

    @full @appointments @past
    Scenario: Create appointment with critera: inPast and defaultAttendee for case with criteria: singleSentence, noVisor
        When I complete the type attendance page with type "Planned video contact (NS)" and default attendee
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