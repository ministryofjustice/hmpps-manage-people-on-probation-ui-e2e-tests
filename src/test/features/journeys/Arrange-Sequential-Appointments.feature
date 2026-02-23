@mode:serial
Feature: Create Appointments
    As a user
    I want to create appointments
    So that I can manage my schedule

    @smoke @appointments @sequential @kk
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
        | Sequential   | 0          | 0      | 0          | Yes, add a mobile number | 07771900900 | Test note1 | No        |

    @smoke @appointments @sequential @kk
    Scenario Outline: Create Similar Appointment for <ScenarioName>
        When I create a similar appointment
          | label     | value       |
          | date      | <date>      |
          | text      | <text>      |
          | mobile    | <mobile>    |
          | note      | <note>      |
          | sensitive | <sensitive> |
        Then the appointment should be created successfully

        Examples:
            | ScenarioName | date     | text                            | mobile      | note       | sensitive |
            | Sequential   | NEXTWEEK | Yes, update their mobile number | 07771900900 | Test note1 | YES       |

    @smoke @appointments @sequential
    Scenario: Create Another Appointment for <ScenarioName>
        When I create another appointment
            | label      | value        | 
            | sentenceId | <sentenceId> |
            | typeId     | <typeId>     |
            | date       | <date>       |
            | locationId | <locationId> |
        Then the appointment should be created successfully
        And I can check appointment details with the manage page
        
        Examples:
            | ScenarioName | sentenceId | typeId | date        | locationId |
            | Sequential   | person     | 0      | PLUS3MONTHS | 0          |

    @smoke @appointments @sequential @reschedule
    Scenario:Reschedule an appointment for <ScenarioName>
        When I access an existing future appointment
        And I reschedule it with the following information
            | label      | value       |
            | date       | <date>      |
            | sensitive  | <sensitive> |
            | who        | <who>       |
            | reason     | <reason>    |
        Then the appointment should be rescheduled successfully
        And I can check appointment details with the manage page

        Examples:
            | ScenarioName | date        | sensitive | who    | reason   |
            | Sequential   | PLUS6MONTHS | YES       | person | just cos |

    @smoke @appointments @sequential @reschedule @past
    Scenario:Reschedule an appointment in past for <ScenarioName>
        When I access an existing future appointment
        And I reschedule it with the following information
            | label      | value       |
            | date       | THREEDAYSAGO  |
            | sensitive  | NO          |
            | who        | system      |
            | reason     | just cos    |
        Then the appointment should be rescheduled successfully
        And I can check appointment details with the manage page

        Examples:
            | ScenarioName | date       | sensitive | who    | reason   |
            | Sequential   | THREEDAYSAGO | NO        | system | just cos |
