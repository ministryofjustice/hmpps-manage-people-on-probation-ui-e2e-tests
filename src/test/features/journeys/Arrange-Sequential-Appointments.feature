@mode:serial
Feature: Create Appointments
    As a user
    I want to create appointments
    So that I can manage my schedule

    @smoke @appointments @sequential
    Scenario Outline: Create Future Appointment for <ScenarioName>
    Given Context has been created for "Appointments" test
    And A new offender has been created in Ndelius
    And I am logged in
    When I create an appointment
      | label      | value        |
      | sentenceId | <sentenceId> |
      | typeId     | <typeId>     |
      | locationId | <locationId> |
      | text       | <text>       |
      | mobile     | <mobile>     |
      | note       | <note>       |
      | sensitive  | <sensitive>  |
    Then the appointment should be created successfully
    Examples:
      | ScenarioName | sentenceId | typeId | locationId | text                     | mobile      | note       | sensitive |
      | Scenario 2   | 0          | 0      | 0          | Yes, add a mobile number | 07771900900 | Test note1 | No        |
      | Scenario 3   | 0          | 0      | 0          | No                       | 07771900900 | Test note2 | Yes       |

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