Feature: Log appointment outcome
  As a user
  I want to log Outcomes for any Past Appointments
  So that I can manage my appointment notes

  Background:
    Given Context has been created for "Log Outcome for Past Appointment" test
    And I am logged in


  #//ToDO -> Initiate a breach and send a letter / recall
  @pastappointment @telephonecontact @homevisit @logoutcome
  Scenario Outline: Validate appointment outcome journeys - <appointmentType> for <case_crn> - <outcomeType>
    And I pick a CRN "<case_crn>"
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
    Then I am navigated to the "<breachOrRecallPage>" page and I select the radio option "<radioOption>"
    Then I complete the add a note page
    And I complete the next appointment page
    Then I am on the check your answers page
    And I confirm the appointment outcome
    Then I am on the confirmation page

    Examples:
      # ------ Passing tests --------
      | case_crn | sentenceType                      | appointmentType                          | location            | outcomeType                 | enforcementPage      | enforcementAction | breachOrRecallPage | radioOption        |
#      | Y013598  |                                   | Planned office visit (NS)                | Wrexham Team Office | Attended - complied         |                      |                   |                    |                    |
#      | Y013524  |                                   | Planned telephone contact (NS)           | Wrexham Team Office | Acceptable absence          |                      |                   |                    |                    |
#      | Y013602  |                                   | Planned video contact (NS)               | Wrexham Team Office | Attended - failed to comply | failure to comply    | Initiate a recall | Initiate a recall  |    I’ll initiate the breach                |
      | Y013525  | SA2020 Community Order (6 Months) | Planned contact - other than office (NS) | Wrexham Team Office | Unacceptable absence        | unacceptable absence | Initiate a breach | Initiate a breach  | Case administrator |
#      | Y013599  | SA2020 Community Order (6 Months) | Initial appointment - in office (NS)     | Wrexham Team Office | Failed to attend            | absence              | Send a letter     | Send a letter      |                    |
#      | Y013603  | SA2020 Community Order (6 Months) | 3 way meeting (NS)                       | Wrexham Team Office | Attended - complied         |                      |                   |                    |                    |
#      | Y013291  |                                   | Planned doorstep contact (NS)            | Wrexham Team Office | Acceptable absence          |                      |                   |                    |                    |
#      | Y013332  |                                   | Home visit to case (NS)                  | Wrexham Team Office | Attended - failed to comply | failure to comply    | Initiate a recall | Initiate a recall  |                    |
      # -------------------------
#      | Y013352  |                                   | Planned office visit (NS)                | Wrexham Team Office | Attended - complied         |                      |                   |                   |
#      | Y012277  |                                   | Planned telephone contact (NS)           | Wrexham Team Office | Acceptable absence          |                      |                   |                   |
#      | Y012571  |                                   | Planned video contact (NS)               | Wrexham Team Office | Attended - failed to comply | failure to comply    | Initiate a breach | Initiate a breach |
#      | Y012705  |                                   | Planned contact - other than office (NS) | Wrexham Team Office | Unacceptable absence        | unacceptable absence | Initiate a breach | Initiate a breach |
#      | Y012664  |                                   | Initial appointment - in office (NS)     | Wrexham Team Office | Failed to attend            | absence              | Send a letter     | Send a letter     |
#      | Y013288  |                                   | 3 way meeting (NS)                       | Wrexham Team Office | Attended - complied         |                      |                   |                   |
#      | Y013340  |                                   | Planned doorstep contact (NS)            | Wrexham Team Office | Acceptable absence          |                      |                   |                   |
#      | Y013331  |                                   | Home visit to case (NS)                  | Wrexham Team Office | Attended - failed to comply | failure to comply    | Initiate a breach | Initiate a breach |
#      | Y013364  |                                   | Planned office visit (NS)                | Wrexham Team Office | Attended - complied         |                      |                   |                   |
#      | Y013308  |                                   | Planned telephone contact (NS)           | Wrexham Team Office | Acceptable absence          |                      |                   |                   |
#      | Y013306  |                                   | Planned video contact (NS)               | Wrexham Team Office | Attended - failed to comply | failure to comply    | Initiate a breach | Initiate a breach |
#      | Y011471  |                                   | Planned contact - other than office (NS) | Wrexham Team Office | Unacceptable absence        | unacceptable absence | Initiate a breach | Initiate a breach |
#      | Y011496  |                                   | Initial appointment - in office (NS)     | Wrexham Team Office | Failed to attend            | absence              | Send a letter     | Send a letter     |
#      | Y011774  |                                   | 3 way meeting (NS)                       | Wrexham Team Office | Attended - complied         |                      |                   |                   |
#      | Y011805  |                                   | Planned doorstep contact (NS)            | Wrexham Team Office | Acceptable absence          |                      |                   |                   |
#      | Y011803  |                                   | Home visit to case (NS)                  | Wrexham Team Office | Attended - failed to comply | failure to comply    | Initiate a breach | Initiate a breach |
#      | Y011786  |                                   | Planned office visit (NS)                | Wrexham Team Office | Attended - complied         |                      |                   |                   |
#      | Y011784  |                                   | Planned telephone contact (NS)           | Wrexham Team Office | Acceptable absence          |                      |                   |                   |
#      | Y011980  |                                   | Planned video contact (NS)               | Wrexham Team Office | Attended - failed to comply | failure to comply    | Initiate a breach | Initiate a breach |
#      | Y013323  |                                   | Planned contact - other than office (NS) | Wrexham Team Office | Unacceptable absence        | unacceptable absence | Initiate a breach | Initiate a breach |
#      | Y013327  |                                   | Initial appointment - in office (NS)     | Wrexham Team Office | Failed to attend            | absence              | Send a letter     | Send a letter     |
#      | Y013342  |                                   | 3 way meeting (NS)                       | Wrexham Team Office | Attended - complied         |                      |                   |                   |
#      | Y013367  |                                   | Planned doorstep contact (NS)            | Wrexham Team Office | Acceptable absence          |                      |                   |                   |
#      | Y013324  |                                   | Home visit to case (NS)                  | Wrexham Team Office | Attended - failed to comply | failure to comply    | Initiate a breach | Initiate a breach |
#      | Y006773  |                                   | Planned office visit (NS)                | Wrexham Team Office | Attended - complied         |                      |                   |                   |
#      | Y007595  |                                   | Planned telephone contact (NS)           | Wrexham Team Office | Acceptable absence          |                      |                   |                   |
#      | Y007906  |                                   | Planned video contact (NS)               | Wrexham Team Office | Attended - failed to comply | failure to comply    | Initiate a breach | Initiate a breach |
#      | Y008173  |                                   | Planned contact - other than office (NS) | Wrexham Team Office | Unacceptable absence        | unacceptable absence | Initiate a breach | Initiate a breach |
#      | Y008261  |                                   | Initial appointment - in office (NS)     | Wrexham Team Office | Failed to attend            | absence              | Send a letter     | Send a letter     |
#      | Y008341  |                                   | 3 way meeting (NS)                       | Wrexham Team Office | Attended - complied         |                      |                   |                   |
#      | Y007848  |                                   | Planned doorstep contact (NS)            | Wrexham Team Office | Acceptable absence          |                      |                   |                   |
#      | Y008647  |                                   | Home visit to case (NS)                  | Wrexham Team Office | Attended - failed to comply | failure to comply    | Initiate a breach | Initiate a breach |
#      | Y009258  |                                   | Planned office visit (NS)                | Wrexham Team Office | Attended - complied         |                      |                   |                   |
#      | Y009776  |                                   | Planned telephone contact (NS)           | Wrexham Team Office | Acceptable absence          |                      |                   |                   |
#      | Y011981  |                                   | Planned video contact (NS)               | Wrexham Team Office | Attended - failed to comply | failure to comply    | Initiate a recall | Initiate a recall |
#      | Y013341  |                                   | Planned contact - other than office (NS) | Wrexham Team Office | Unacceptable absence        | unacceptable absence | Initiate a recall | Initiate a recall |
#      | Y013351  |                                   | Initial appointment - in office (NS)     | Wrexham Team Office | Failed to attend            | absence              | Send a letter     | Send a letter     |
#      | Y012430  |                                   | 3 way meeting (NS)                       | Wrexham Team Office | Attended - complied         |                      |                   |                   |
#      | Y012624  |                                   | Planned doorstep contact (NS)            | Wrexham Team Office | Acceptable absence          |                      |                   |                   |
#      | Y013329  |                                   | Home visit to case (NS)                  | Wrexham Team Office | Attended - failed to comply | failure to comply    | Initiate a recall | Initiate a recall |
#      | Y012665  |                                   | Planned office visit (NS)                | Wrexham Team Office | Attended - complied         |                      |                   |                   |
#      | Y013338  |                                   | Planned telephone contact (NS)           | Wrexham Team Office | Acceptable absence          |                      |                   |                   |
#      | Y013333  |                                   | Planned video contact (NS)               | Wrexham Team Office | Attended - failed to comply | failure to comply    | Initiate a recall | Initiate a recall |
#      | Y012775  |                                   | Planned contact - other than office (NS) | Wrexham Team Office | Unacceptable absence        | unacceptable absence | Initiate a recall | Initiate a recall |
#      | Y013334  |                                   | Initial appointment - in office (NS)     | Wrexham Team Office | Failed to attend            | absence              | Send a letter     | Send a letter     |
#      | Y013292  |                                   | 3 way meeting (NS)                       | Wrexham Team Office | Attended - complied         |                      |                   |                   |
#      | Y013343  |                                   | Planned doorstep contact (NS)            | Wrexham Team Office | Acceptable absence          |                      |                   |                   |
#      | Y013328  |                                   | Home visit to case (NS)                  | Wrexham Team Office | Attended - failed to comply | failure to comply    | Initiate a recall | Initiate a recall |
#      | Y013289  |                                   | Planned office visit (NS)                | Wrexham Team Office | Attended - complied         |                      |                   |                   |
#      | Y006612  |                                   | Planned telephone contact (NS)           | Wrexham Team Office | Acceptable absence          |                      |                   |                   |
#      | Y011497  |                                   | Planned video contact (NS)               | Wrexham Team Office | Attended - failed to comply | failure to comply    | Initiate a breach | Initiate a breach |
#      | Y011777  |                                   | Planned contact - other than office (NS) | Wrexham Team Office | Unacceptable absence        | unacceptable absence | Initiate a breach | Initiate a breach |
#      | Y011785  |                                   | Initial appointment - in office (NS)     | Wrexham Team Office | Failed to attend            | absence              | Send a letter     | Send a letter     |
#      | Y011787  |                                   | 3 way meeting (NS)                       | Wrexham Team Office | Attended - complied         |                      |                   |                   |
#      | Y011804  |                                   | Planned doorstep contact (NS)            | Wrexham Team Office | Acceptable absence          |                      |                   |                   |
#      | Y011806  |                                   | Home visit to case (NS)                  | Wrexham Team Office | Attended - failed to comply | failure to comply    | Initiate a breach | Initiate a breach |
#      | Y012279  |                                   | Planned office visit (NS)                | Wrexham Team Office | Attended - complied         |                      |                   |                   |
#      | Y013307  |                                   | Planned telephone contact (NS)           | Wrexham Team Office | Acceptable absence          |                      |                   |                   |
#      | Y013309  |                                   | Planned video contact (NS)               | Wrexham Team Office | Attended - failed to comply | failure to comply    | Initiate a recall | Initiate a recall |
#      | Y013330  |                                   | Planned contact - other than office (NS) | Wrexham Team Office | Unacceptable absence        | unacceptable absence | Initiate a recall | Initiate a recall |
#      | Y013346  |                                   | Initial appointment - in office (NS)     | Wrexham Team Office | Failed to attend            | absence              | Send a letter     | Send a letter     |
#      | Y011356  |                                   | 3 way meeting (NS)                       | Wrexham Team Office | Attended - complied         |                      |                   |                   |
#      | Y013381  |                                   | Planned doorstep contact (NS)            | Wrexham Team Office | Acceptable absence          |                      |                   |                   |
#      | Y013353  |                                   | Home visit to case (NS)                  | Wrexham Team Office | Attended - failed to comply | failure to comply    | Initiate a recall | Initiate a recall |
#      | Y010805  |                                   | Planned office visit (NS)                | Wrexham Team Office | Attended - complied         |                      |                   |                   |
#      | Y013345  |                                   | Planned telephone contact (NS)           | Wrexham Team Office | Acceptable absence          |                      |                   |                   |
#      | Y010802  |                                   | Planned video contact (NS)               | Wrexham Team Office | Attended - failed to comply | failure to comply    | Initiate a recall | Initiate a recall |
#      | Y013371  |                                   | Planned contact - other than office (NS) | Wrexham Team Office | Unacceptable absence        | unacceptable absence | Initiate a recall | Initiate a recall |
#      | Y011493  |                                   | Initial appointment - in office (NS)     | Wrexham Team Office | Failed to attend            | absence              | Send a letter     | Send a letter     |
#      | Y013374  |                                   | 3 way meeting (NS)                       | Wrexham Team Office | Attended - complied         |                      |                   |                   |
#      | Y013375  |                                   | Planned doorstep contact (NS)            | Wrexham Team Office | Acceptable absence          |                      |                   |                   |
#      | Y013376  |                                   | Home visit to case (NS)                  | Wrexham Team Office | Attended - failed to comply | failure to comply    | Initiate a recall | Initiate a recall |
