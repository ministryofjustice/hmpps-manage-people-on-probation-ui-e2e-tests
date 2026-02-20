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
    Examples:
      | ScenarioName         | sentenceId | typeId | date        | locationId  | text | mobile | note       | sensitive |
      | Past                 | 0          | 0      | LASTWEEK    | 0           |      |        | Test note1 | NO        |
      | Location-not-needed  | 0          | 1      | PLUS6MONTHS | not needed  | No   |        | Test note2 | NO        |

  @smoke @appointments @failures
  Scenario: Create Appointment for <ScenarioName>
      Given Context has been created for "Appointments" test
      And A new offender has been created or existing made available
      And I am logged in
      When I create an appointment
        | label      | value        |
        | sentenceId | <sentenceId> |
        | typeId     | <typeId>     |
        | locationId | <locationId> |
      Then I end up on the location-not-in-list page

      Examples:
        | ScenarioName         | sentenceId | typeId | locationId  |
        | Location-not-in-list | 0          | 0      | not in list |