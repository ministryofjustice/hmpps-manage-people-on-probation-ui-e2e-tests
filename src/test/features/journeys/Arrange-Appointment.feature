Feature: Create Appointments
    As a user
    I want to create appointments
    So that I can manage my schedule

    @smoke
    Scenario: Create Appointments Full
        Given A new offender has been created
        And I am logged in
        When I create an appointment
        And a similar appointment
        And another appointment
        Then the appointment should be created successfully