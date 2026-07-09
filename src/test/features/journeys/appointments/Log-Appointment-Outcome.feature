Feature: Log appointment outcome
  As a user
  I want to log Outcomes for any Past Appointments
  So that I can manage my appointment notes


  # TODO -> Initiate a breach and send a letter / recall
  # TODO - Initiate a recall and send a letter option - select - any of the 3 set of radio options
  @pastappointment @logoutcome
  Scenario Outline: Validate appointment outcome journeys - <appointmentType> for <case_crn> - <outcomeType>
    Given Context has been created for "appointments" test
    And A new offender has been created or existing made available
    And I am logged in
    When I navigate to the appointments page
    And I click to arrange an appointment
    When I complete the type attendance page with type "<appointmentType>" and default attendee
    And I complete the location and datetime page with date "LASTWEEK", startTime "10:10", endTime "11:11" and location "<location>"
    Then I am on the what was the outcome of this appointment? page
    And I can see the following outcome options:
      | outcome                     |
      | Attended - complied         |
      | Attended - failed to comply |
      | Acceptable absence          |
      | Unacceptable absence        |
      | Failed to attend            |

    When I select the option "<outcomeType>" and continue
    And I complete the acceptable absence reason page if applicable "<outcomeType>"
    Then I am navigated to the "<enforcementPage>" page
    When I select the enforcement action "<enforcementAction>" and continue
    Then I am navigated to the "<breachOrRecallPage>" page and I select the radio option "<whoWillSend>"
    Then I complete the add a note page
    And I complete the next appointment page
    Then I am on the check your answers page
    And I confirm the appointment outcome
    Then I am on the confirmation page
    When I navigate to the appointments page
    And I access the created appointment
    Then I can see the Manage page
    Then I confirm I can see the contact log on nDelius with appointment type "<appointmentType>" and outcome type "<outcomeType>"
    Examples:
      | appointmentType                | location            | outcomeType                 | enforcementPage      | enforcementAction | breachOrRecallPage | whoWillSend              |
      | Planned office visit (NS)      | Wrexham Team Office | Attended - complied         |                      |                   |                    |                          |
      | Planned telephone contact (NS) | Wrexham Team Office | Acceptable absence          |                      |                   |                    |                          |
      | Planned video contact (NS)     | Wrexham Team Office | Attended - failed to comply | failure to comply    | Initiate a recall | Initiate a recall  | I’ll initiate the recall |
      | Planned doorstep contact (NS)  | Wrexham Team Office | Unacceptable absence        | unacceptable absence | Send a letter     | Send a letter      | Case administrator       |
      | Home visit to case (NS)        | Wrexham Team Office | Attended - failed to comply | failure to comply    | No further action |                    |                          |


  @pastappointment @logoutcome @test
  Scenario Outline: Validate appointment outcome journeys - <appointmentType> for <case_crn> - <outcomeType>
    Given Context has been created for "appointments" test
    And A new dual offender has been created in Ndelius
    And I am logged in
    When I navigate to the appointments page
    And I click to arrange an appointment
    When I complete the sentence page with sentence "<sentenceType>"
    When I complete the type attendance page with type "<appointmentType>" and default attendee
    And I complete the location and datetime page with date "LASTWEEK", startTime "10:10", endTime "11:11" and location "<location>"
    Then I am on the what was the outcome of this appointment? page
    And I can see the following outcome options:
      | outcome                     |
      | Attended - complied         |
      | Attended - failed to comply |
      | Acceptable absence          |
      | Unacceptable absence        |
      | Failed to attend            |

    When I select the option "<outcomeType>" and continue
    And I complete the acceptable absence reason page if applicable "<outcomeType>"
    Then I am navigated to the "<enforcementPage>" page
    When I select the enforcement action "<enforcementAction>" and continue
    Then I am navigated to the "<breachOrRecallPage>" page and I select the radio option "<whoWillSend>"
    Then I complete the add a note page
    And I complete the next appointment page
    Then I am on the check your answers page
    And I confirm the appointment outcome
    Then I am on the confirmation page
    When I navigate to the appointments page
    And I access the created appointment
    Then I can see the Manage page
    Then I confirm I can see the contact log on nDelius with appointment type "<appointmentType>" and outcome type "<outcomeType>"
    Examples:
      | sentenceType                      | appointmentType                          | location            | outcomeType                      | enforcementPage      | enforcementAction | breachOrRecallPage | whoWillSend        |
      | SA2020 Community Order (6 Months) | Planned contact - other than office (NS) | Wrexham Team Office | Unacceptable absence             | unacceptable absence | Initiate a breach | Initiate a breach  | Case administrator |
      | SA2020 Community Order (6 Months) | Initial appointment - in office (NS)     | Wrexham Team Office | Failed to attend                 | absence              | Send a letter     | Send a letter      | Case administrator |
      | SA2020 Community Order (6 Months) | 3 way meeting (NS)                       | Wrexham Team Office | Attended - sent home (behaviour) | failure to comply    | Send a letter     | Send a letter      | Case administrator |
