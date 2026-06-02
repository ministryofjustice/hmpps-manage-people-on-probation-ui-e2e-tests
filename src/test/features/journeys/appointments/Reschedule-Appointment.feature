Feature: Reschedule Appointments
    As a user
    I want to create appointments
    So that I can manage my schedule

    Background: 
        Given Context has been created for "appointments" test
        And I am logged in

    #requires an appointment to exist (may not know case criteria)
    @full @appointments @reschedule
    Scenario: Reschedule appointment with critera: inFuture and noText
        When I navigate to the upcoming appointments page
        And I navigate to first non sensitive upcoming appointment
        And I select the Reschedule link
        And I complete the reschedule page with userId 0, reason "none" and sensitivity "No"
        And I select the "Choose date and time" link on the Reschedule Details page
        And I complete the location and datetime page with date "PLUS6MONTHS", startTime "01:10", endTime "02:10" and locationID 0
        Then I confirm the text message preview
        When I complete the text message confirmation page with option "No"
        And I complete the supporting information page with note "" and sensitivity "No"
        Then I can see the correct information on the Reschedule Details page for a future appointment
        When I submit the rescheduled appointment
        Then I can see the Confirmation page for "rescheduled" appointment
        And I close the context

    #requires an appointment to exist (may not know case criteria)
    @full @appointments @reschedule
    Scenario: Reschedule appointment with critera: inFuture, setSensitiveEarly and noText
        When I navigate to the upcoming appointments page
        And I navigate to first non sensitive upcoming appointment
        And I select the Reschedule link
        And I complete the reschedule page with userId 0, reason "none" and sensitivity "Yes"
        And I select the "Choose date and time" link on the Reschedule Details page
        And I complete the location and datetime page with date "PLUS6MONTHS", startTime "03:10", endTime "04:10" and locationID 0
        Then I confirm the text message preview
        When I complete the text message confirmation page with option "No"
        Then I can see the correct information on the Reschedule Details page for a future appointment
        When I submit the rescheduled appointment
        Then I can see the Confirmation page for "rescheduled" appointment
        And I close the context

    #requires an appointment to exist (may not know case criteria)
    @full @appointments @reschedule
    Scenario: Reschedule a sensitive appointment with critera: inFuture and noText
        When I navigate to the upcoming appointments page
        And I navigate to first sensitive upcoming appointment
        And I select the Reschedule link
        And I complete the reschedule page with userId 0, reason "none"
        And I select the "Choose date and time" link on the Reschedule Details page
        And I complete the location and datetime page with date "PLUS6MONTHS", startTime "05:10", endTime "06:10" and locationID 0
        Then I confirm the text message preview
        When I complete the text message confirmation page with option "No"
        Then I can see the correct information on the Reschedule Details page for a future appointment
        When I submit the rescheduled appointment
        Then I can see the Confirmation page for "rescheduled" appointment
        And I close the context