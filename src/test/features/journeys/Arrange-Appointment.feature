Feature: Create Appointments
    As a user
    I want to create appointments
    So that I can manage my schedule

    @smoke @appointments
    Scenario: Create Appointments Full
        Given Context has been created for "Appointments" test
        And A new offender has been created in Ndelius
        And I am logged in
        When I create an appointment
        And a similar appointment
        And another appointment
        Then the appointment should be created successfully
        And I close the context