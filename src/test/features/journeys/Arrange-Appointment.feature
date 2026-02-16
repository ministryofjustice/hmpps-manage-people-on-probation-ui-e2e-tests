@mode:serial
Feature: Create Appointments
    As a user
    I want to create appointments
    So that I can manage my schedule

    @smoke @appointments
    Scenario: Create Future Appointment
        Given Context has been created for "Appointments" test
        And A new offender has been created in Ndelius
        And I am logged in
        When I create an appointment
        Then the appointment should be created successfully

    @smoke @appointments
    Scenario: Create Similar Appointment
        When I create a similar appointment
        Then the appointment should be created successfully

    @smoke @appointments
    Scenario: Create Another Appointment
        When I create another appointment
        Then the appointment should be created successfully