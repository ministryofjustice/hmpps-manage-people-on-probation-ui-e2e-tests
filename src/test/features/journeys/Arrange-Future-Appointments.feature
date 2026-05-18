Feature: Create Future Appointments
    As a user
    I want to create appointments
    So that I can manage my schedule

    @full @appointments @basic
    Scenario Outline: Create appointment with critera: inFuture, noText, defaultAttendee and sensitive, for case with criteria: singleSentence, noVisor
        Given Context has been created for "appointments" test
        And A new offender has been created or existing made available
        And I am logged in
        When I navigate to the appointments page
        And I click to arrange an appointment
        And I complete the type attendance page with type "Planned office visit (NS)" and default attendee
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
    Scenario Outline: Create appointment with critera: inFuture, noText, defaultAttendee and non-sensitive, for case with criteria: singleSentence, noVisor
        Given Context has been created for "appointments" test
        And A new offender has been created or existing made available
        And I am logged in
        When I navigate to the appointments page
        And I click to arrange an appointment
        And I complete the type attendance page with type "Planned office visit (NS)" and default attendee
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
    Scenario Outline: Create appointment with critera: inFuture, noText, defaultAttendee and locationNotNeeded for case with criteria: singleSentence, noVisor
        Given Context has been created for "appointments" test
        And A new offender has been created or existing made available
        And I am logged in
        When I navigate to the appointments page
        And I click to arrange an appointment
        And I complete the type attendance page with type "Planned telephone contact (NS)" and default attendee
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

    @full @appointments @addText
    Scenario Outline: Create appointment with critera: inFuture, addText, defaultAttendee for case with criteria: singleSentence, noVisor
        Given Context has been created for "appointments" test
        And A new offender has been created or existing made available
        And I am logged in
        And I clear the contact details if set
        When I navigate to the appointments page
        And I click to arrange an appointment
        And I complete the type attendance page with type "Planned office visit (NS)" and default attendee
        And I complete the location and datetime page with date "TOMORROW", startTime "12:10", endTime "13:10" and location "Wrexham Team Office"
        Then I confirm the text message preview
        When I complete the text message confirmation page with option "Yes, add a mobile number"
        And I set the mobile number to "07368448951"
        And I complete the supporting information page with note "" and sensitivity "No"
        Then I can see the correct information on the CYA page for a future appointment
        When I submit the appointment
        Then I can see the Confirmation page for "future" appointment
        When I navigate to the appointments page
        And I access the created appointment
        Then I can see the Manage page
        And I can see the outlook event was created succesfully
        When I navigate to the reminders service
        Then I can see the appointment text message details
        And I close the context    

    @full @appointments @dual
    Scenario Outline: Create appointment with critera: inFuture, noText, defaultAttendee for case with criteria: dualSentence, noVisor
        Given Context has been created for "appointments" test
        And A new dual offender has been created in Ndelius
        And I am logged in
        When I navigate to the appointments page
        And I click to arrange an appointment
        And I complete the sentence page with sentence "Adult Custody < 12m (6 Months)"
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