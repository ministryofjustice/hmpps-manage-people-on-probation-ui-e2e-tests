Feature: As a practitioner
  I want to add contacts with a PoP
  and view them as per the filter criteria

  @smoke @contacts
  Scenario Outline: View contacts for a Pop - '<description>'
    Given Context has been created for "Contacts" test
    And I am logged in
    And I navigate to '<case>'
    And I navigate to contact log
    When I filter the contact log with values
      | label              | value        |
      | date_from          | <from>       |
      | date_to            | <to>         |
      | keywords           | <keywords>   |
      | system_generated   | <hide>       |
      | compliance_filters | <compliance> |
      | category_filters   | <categories> |
    Then the contact log contains '<count>' entries
    And there are '<errors>'
    And I close the context

    Examples:
      | description      | case    | from      | to        | keywords | hide | compliance | categories | count | errors                  |
      | date range       | X793504 | 11/2/2026 | 15/2/2026 |          |      |            |            | 5     | no errors               |
      | keyword          | X793504 |           |           | online   |      |            |            | 13    | no errors               |
      | no results       | X793504 |           |           | house    |      | 3          |            | 0     | no errors               |
      | catergories      | X793504 |           |           |          |      |            | 8,9,11     | 55    | no errors               |
      | hide system gen  | X793504 |           |           |          | YES  |            |            | 226   | no errors               |            
      | combined         | X793504 | 1/2/2026  | 8/3/2026  | visit    | YES  | 2          | 1          | 4     | no errors               |
      | validation error | X793504 | 11/2/2026 |           |          |      |            |            | full  | a missing date to error |
