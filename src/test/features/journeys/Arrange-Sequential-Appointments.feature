@mode:serial
Feature: Create Appointments
    As a user
    I want to create appointments
    So that I can manage my schedule

    @smoke @appointments @sequential
    Scenario: Create Future Appointment
        Given Context has been created for "Appointments" test
        And A new offender has been created in Ndelius
        And I am logged in
        When I create an appointment
            | label      | value |
            | sentenceId | 0     |
            | typeId     | 0     |
            | locationId | 0     |
            | note       | note  |
            | sensitive  | NO    |
        Then the appointment should be created successfully

    @smoke @appointments @sequential
    Scenario: Create Similar Appointment
        When I create a similar appointment
            | label      | value    |
            | date       | NEXTWEEK |
            | sensitive  | YES      |
        Then the appointment should be created successfully

    @smoke @appointments @sequential
    Scenario: Create Another Appointment
        When I create another appointment
            | label      | value       | 
            | sentenceId | person      |
            | typeId     | 0           |
            | date       | PLUS3MONTHS |
            | locationId | 0           |
        Then the appointment should be created successfully
        And I can check appointment details with the manage page

    @smoke @appointments @sequential @reschedule
    Scenario:Reschedule an appointment
        When I access an existing future appointment
        And I reschedule it with the following information
            | label      | value       |
            | date       | PLUS6MONTHS |
            | sensitive  | YES         |
            | who        | person      |
            | reason     | just cos    |
        Then the appointment should be rescheduled successfully
        And I can check appointment details with the manage page

    @smoke @appointments @sequential @reschedule @past
    Scenario:Reschedule an appointment in past
        When I access an existing future appointment
        And I reschedule it with the following information
            | label      | value       |
            | date       | TWODAYSAGO  |
            | sensitive  | NO          |
            | who        | system      |
            | reason     | just cos    |
        Then the appointment should be rescheduled successfully
        And I can check appointment details with the manage page