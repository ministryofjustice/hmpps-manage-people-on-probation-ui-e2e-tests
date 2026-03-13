Feature: Create Appointments
    As a user
    I want to create appointments
    So that I can manage my schedule

  @smoke @appointments @standalones
  Scenario Outline: Create Appointment for <ScenarioName>
    Given Context has been created for "Appointments" test
    And A new offender has been created or existing made available
    And I am logged in
    When I create an appointment
      | label      | value        |
      | sentenceId | <sentenceId> |
      | typeId     | <typeId>     |
      | locationId | <locationId> |
      | date       | <date>       |
      | text       | <text>       |
      | mobile     | <mobile>     |
      | note       | <note>       |
      | sensitive  | <sensitive>  |
    Then the appointment should be created successfully
    And I can check appointment details with the manage page
    And I close the context
    Examples:
      | ScenarioName         | sentenceId | typeId | date        | locationId  | text | mobile | note       | sensitive |
      | Past                 | 0          | 0      | LASTWEEK    | 0           |      |        | Test note1 | NO        |
      | Location-not-needed  | 0          | 1      | PLUS6MONTHS | not needed  | No   |        | Test note2 | NO        |

  @smoke @appointments @failures
  Scenario Outline: Create Appointment for <ScenarioName>
      Given Context has been created for "Appointments" test
      And A new offender has been created or existing made available
      And I am logged in
      When I create an appointment
        | label      | value        |
        | sentenceId | <sentenceId> |
        | typeId     | <typeId>     |
        | locationId | <locationId> |
      Then I end up on the location-not-in-list page
      And I close the context

      Examples:
        | ScenarioName         | sentenceId | typeId | locationId  |
        | Location-not-in-list | 0          | 0      | not in list |

  @smoke @appointments @standalones @changes
  Scenario Outline: Create Appointment and make changes for <ScenarioName>
    Given Context has been created for "Appointments" test
    And A new offender has been created or existing made available
    And I am logged in
    When I setup an appointment
      | label      | value    |
      | sentenceId | 0        |
      | typeId     | 0        |
      | locationId | 0        |
      | date       | TOMORROW |
      | startTime  | 09:15    |
      | endTime    | 10:15    |
      | text       | No       |
      | mobile     |          |
      | note       |          |
      | sensitive  | NO       |
    When I make the following changes to appointment
      | label      | value        |
      | sentenceId | <sentenceId> |
      | typeId     | <typeId>     |
      | locationId | <locationId> |
      | date       | <date>       |
      | startTime  | <start>      |
      | endTime    | <end>        |
      | text       | <text>       |
      | mobile     | <mobile>     |
      | note       | <note>       |
      | sensitive  | <sensitive>  |
    And I complete the submission
    Then the appointment should be created successfully
    And I can check appointment details with the manage page
    And I close the context
    Examples:
      | ScenarioName         | sentenceId | typeId | date        | start | end   | locationId  | text | mobile | note       | sensitive |
      | ChangeToPast         |            |        | LASTWEEK    | 09:15 | 10:15 |             |      |        | past       | YES       |
      | PersonAppointment    | person     | 0      |             |       |       | 0           |      |        |            |           |
