Feature: Log appointment outcome
  As a user
  I want to log Outcomes for any Past Appointments
  So that I can manage my appointment notes

  Background:
    Given Context has been created for "Log Outcome for Past Appointment" test
    And I am logged in
    And I navigate to 'Y011372'
    When I navigate to the appointments page
    And I click to arrange an appointment

  @pastappointment @telephonecontact @homevisit @logoutcome
  Scenario Outline: Validate outcome journeys for different appointment outcomes TEST
    When I complete the type attendance page with type "<appointmentType>" and default attendee
    And I complete the location and datetime page with date "LASTWEEK", startTime "10:10", endTime "11:11" and location "Wrexham Team Office"
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
    Then I am navigated to the "<recallPage>" page
    When I complete the add a note page
    And I complete the next appointment page
    Then I am on the check your answers page
#    And I confirm the appointment outcome
#    Then I am on the confirmation page

    Examples:
      | appointmentType                | outcomeType                 | enforcementPage      | enforcementAction | recallPage        |
      | Planned telephone contact (NS) | Attended - complied         |                      |                   |                   |
      | Planned telephone contact (NS) | Acceptable absence          |                      |                   |                   |
      | Planned telephone contact (NS) | Attended - failed to comply | failure to comply    | Initiate a breach | Initiate a recall |
      | Planned telephone contact (NS) | Unacceptable absence        | unacceptable absence | Initiate a breach | Initiate a recall |
#      | Planned telephone contact (NS) | Failed to attend            | absence              | Send a letter     | Send a letter     |
#      | Home visit to case (NS)        | Attended - complied         |                      |                   |                   |
#      | Home visit to case (NS)        | Acceptable absence          |                      |                   |                   |
#      | Home visit to case (NS)        | Attended - failed to comply | failure to comply    | Initiate a breach | Initiate a recall |
#      | Home visit to case (NS)        | Unacceptable absence        | unacceptable absence | Initiate a breach | Initiate a recall |
#      | Home visit to case (NS)        | Failed to attend            | absence              | Send a letter     | Send a letter     |
