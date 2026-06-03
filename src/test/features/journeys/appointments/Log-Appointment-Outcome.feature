Feature: Log appointment outcome
    As a user
    I want to log Outcomes for any Past Appointments
    So that I can manage my appointment notes

  Background:
    Given Context has been created for "Log Outcome for Past Appointment" test
    And I am logged in
    And I navigate to 'D006309'
    When I navigate to the appointments page
    And I click to arrange an appointment


  @full @pastappointment
  Scenario Outline: Past Appointment - Log  Outcome for a Pop for "<Appointment type>"
    When I complete the type attendance page with type "<Appointment type>" and default attendee
    And I complete the location and datetime page with date "LASTWEEK", startTime "10:10", endTime "11:11" and location "Chelmsford"
    Then I am on the "Outcome" page
    When I select the option "<Outcome option>" and continue
    And I complete the add note page with note "test" and sensitivity "No"
    Then I can see the correct information on the CYA page for a past appointment
    When I submit the appointment
    Then I can see the Confirmation page for "past" appointment
    When I navigate to the appointments page
    And I access the created appointment
    Then I can see the Manage page

    Examples:
      | Appointment type               | Outcome option      |
      | Planned video contact (NS)     | Attended - complied |
      | Planned telephone contact (NS) |                     |
      | Planned doorstep contact (NS)  |                     |


    #Future Appointment Scenario:

  @pastappointment
  Scenario Outline: Validate outcome journeys for different appointment outcomes
    When I complete the type attendance page with type "<appointmentType>" and default attendee
    And I complete the location and datetime page with date "LASTWEEK", startTime "10:10", endTime "11:11" and location "Chelmsford"
    Then I am on the "Outcome" page
    And I can see the following outcome options:
      | outcome                      |
      | Attended - complied          |
      | Attended - failed to comply  |
      | Unacceptable absence         |
      | Failed to attend             |
    When I select the option "<outcome>" and continue
    Then I am navigated to the "<nextPage>" page

    Examples:
      | appointmentType                          | outcome                         | nextPage                    |
      | Planned video contact (NS)               | Attended - complied             | Add a note                  |
     # | Planned video contact (NS)               | Attended - failed to comply     | Enforcement action          |
      | Planned video contact (NS)               | Unacceptable absence            | Unacceptable absence        |
      | Planned video contact (NS)               | Failed to attend                | Failed to attend            |
      | Planned telephone contact (NS)           | Attended - complied             | Add a note                  |
    #  | Planned telephone contact (NS)           | Attended - failed to comply     | Enforcement action          |
      | Planned telephone contact (NS)           | Unacceptable absence            | Unacceptable absence        |
      | Planned telephone contact (NS)           | Failed to attend                | Failed to attend            |
      | Planned Contact - other than office (NS) | Attended - complied             | Add a note                  |
    #  | Planned Contact - other than office (NS) | Attended - failed to comply     | Enforcement action          |
      | Planned Contact - other than office (NS) | Unacceptable absence            | Unacceptable absence        |
      | Planned Contact - other than office (NS) | Failed to attend                | Failed to attend            |

  # Not Responsible officee or PP will display Refer to offender manager
  @pastappointment
  Scenario Outline: Validate outcome journeys for different appointment outcomes
    When I complete the type attendance page with type "<appointmentType>" and default attendee
    And I complete the location and datetime page with date "LASTWEEK", startTime "10:10", endTime "11:11" and location "Chelmsford"

    Then I am on the "Outcome" page
    And I can see the following outcome options:
      | outcome                      |
      | Attended - complied          |
      | Attended - failed to comply  |
      | Unacceptable absence         |
      | Failed to attend             |

    When I select the option "<outcome>" and continue
    Then I am navigated to the "<nextPage>" page

    And I can see the following enforcement options:
      | enforcementOption                                                          |
      | Send a letter                                                              |
      | [~] initiate a breach - [~] initiate a recall                              |
      | [~] initiate a breach - [~] initiate a recall - and send a letter          |
      | Refer to offender manager                                                  |
      | Notify the allocated probation practitioner so they can take action        |
      | No further action                                                          |
      | I want to add a different action                                           |

    Examples:
      | appointmentType                          | outcome                         | nextPage                                             |
      | Planned video contact (NS)               | Attended - failed to comply     | Failure to comply - NOT responsible officer          |
      | Planned telephone contact (NS)           | Attended - failed to comply     | Failure to comply - Telephone/home visit appointment |
      | Planned Contact - other than office (NS) | Attended - failed to comply     | Failure to comply - Telephone/home visit appointment |








