Feature: Create Appointments related misc journeys
    As a user
    I want to create appointments
    So that I can manage my schedule

    Background:        
        Given Context has been created for "appointments" test
        And A new offender has been created or existing made available
        And I am logged in
        Then I end up on the location-not-in-list page

    @full @appointments @locationNotInList
    Scenario: Create appointment with critera: locationNotInList for case with criteria: singleSentence, noVisor
        When I navigate to the appointments page
        And I click to arrange an appointment
        And I complete the type attendance page with type "Planned video contact (NS)" and default attendee
        And I complete the location and datetime page with date "LASTWEEK", startTime "12:10", endTime "13:10" and location "The location I’m looking for is not in this list"
        Then I end up on the location-not-in-list page
        And I close the context    

    # #requires an appointment to exist
    @full @appointments @similar
    Scenario: Create similar appointment with critera: inFuture and noText for case with criteria: singleSentence, noVisor
        When I navigate to the appointments page
        #Can fail if newest is Delius managed
        And I go to the newest appointment
        And I select to arrange next appointment
        And I select similar appointment
        And I select the "Choose date and time" link on the Arrange Another page
        And I complete the location and datetime page with date "PLUS3MONTHS", startTime "12:10", endTime "13:10" and locationID 0
        Then I confirm the text message preview
        When I complete the text message confirmation page with option "No"
        And I complete the supporting information page with note "" and sensitivity "Yes"
        Then I can see the correct information on the Arrange Another page for a future appointment
        When I submit the similar appointment
        Then I can see the Confirmation page for "future" appointment
        When I navigate to the appointments page
        And I access the created appointment
        Then I can see the Manage page
        And I can see the outlook event was created succesfully
        Then I close the context

    @full @appointments @addText
    Scenario: Create appointment with critera: inFuture, addText, defaultAttendee for case with criteria: singleSentence, noVisor
        Given I clear the contact details if set
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