Feature: Log appointment outcome
    As a user
    I want to log Outcomes for any Past Appointments
    So that I can manage my appointment notes


  Background:
    Given Context has been created for "Appointments" test
    And A new offender has been created or existing made available
    And I am logged in
    When I create an appointment
      | label      | value        |
      | sentenceId | 0            |
      | typeId     | 0            |
      | locationId | 0            |
      | date       | LASTWEEK     |
      | text       |              |
      | mobile     |              |
      | note       | Test note1   |
      | sensitive  | NO           |
    Then the appointment should be created successfully
    And I can check appointment details with the manage page
    And I close the context

   Scenario Outline: Log Outcome for Past Appointment for the option '<OutcomeOption>'
     Given I am on the Appointments page
     When I select the past appointment
     Then I am on the Manage Appointments page
     And I see the Log appointment outcome status is '<Status>' and I select the link
     Then I am on the "What was the outcome of this appointment?"
     When I select the '<Outcome option>' and Continue
     Then I am on the '<Page>' page
     Examples:
     | OutcomeOption| Status      | Outcome option              | Page               |
     | OutcomeOption| Not started | Attended - complied         | Add a note         |
     | OutcomeOption| Not started | Attended - failed to comply | Enforcement Action |





