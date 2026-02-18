Feature: Create Appointments
    As a user
    I want to create appointments
    So that I can manage my schedule

    @smoke @appointments @past
    Scenario: Create Past Appointment
        Given Context has been created for "Appointments" test
        And A new offender has been created in Ndelius
        And I am logged in
        When I create an appointment
            | label      | value     |
            | sentenceId | 0         |
            | typeId     | 0         |
            | date       | YESTERDAY |
            | locationId | 0         |
            | note       | note      |
            | sensitive  | NO        |
        Then the appointment should be created successfully
        And I can check appointment details with the manage page

    @smoke @appointments @location-not-needed
    Scenario: Location Not Needed
        Given Context has been created for "Appointments" test
        And A new offender has been created in Ndelius
        And I am logged in
        When I create an appointment
            | label      | value       |
            | sentenceId | 0           |
            | typeId     | 1           |
            | date       | PLUS6MONTHS |
            | locationId | not needed  |
            | note       | note        |
            | sensitive  | NO          |
        Then the appointment should be created successfully
        And I can check appointment details with the manage page

    @smoke @appointments @location-not-in-list
    Scenario: Location Not In List
        Given Context has been created for "Appointments" test
        And A new offender has been created in Ndelius
        And I am logged in
        When I create an appointment
            | label      | value        |
            | sentenceId | 0            |
            | typeId     | 0            |
            | date       | TOMORROW     |
            | locationId | not in list  |
            | note       | note         |
            | sensitive  | NO           |
        Then I end up on the location-not-in-list page