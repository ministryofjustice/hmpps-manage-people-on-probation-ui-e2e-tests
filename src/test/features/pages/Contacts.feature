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
      | label        | value          |
      | date_from    | <from>         |
      | date_to      | <to>           |
      | keywords     | <keywords>     |
      | outcome      | <outcome>      |
      | complied     | <complied>     |
      | not_complied | <not_complied> |
    Then the contact log contains '<count>' entries
    And there are '<errors>'

    Examples:
      | description      | case    | from      | to        | keywords | outcome | complied | not_complied | count | errors                  |
      | date range       | X793504 | 11/2/2026 | 15/2/2026 |          |         |          |              | 5     | no errors               |
      | keyword          | X793504 |           |           | online   |         |          |              | 13    | no errors               |
      | no results       | X793504 |           |           | house    |         |          | YES          | 0     | no errors               |
      | validation error | X793504 | 11/2/2026 |           |          |         |          |              | 606   | a missing date to error |
