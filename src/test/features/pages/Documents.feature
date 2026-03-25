Feature: As a practitioner
  I want to add documents with a PoP
  and view them as per the filter criteria

  @full @documents
  Scenario Outline: View documents for a Pop - <description>
    Given Context has been created for "Documents" test
    And I am logged in
    And I navigate to '<case>'
    And I navigate to documents
    When I filter the documents with values
      | label              | value        |
      | date_from          | <from>       |
      | date_to            | <to>         |
      | keywords           | <keywords>   |
      | level              | <level>      |
    Then the documents list contains '<count>' entries
    And there are '<errors>' on documents page
    And I close the context

    Examples:
      | description           | case    | from      | to        | keywords | level      | count    | errors                    |
      | date range            | X793504 | 1/3/2025  | 19/3/2026 |          |            | filtered | no errors                 |
      | keyword               | X793504 |           |           | file     |            | filtered | no errors                 |         
      | level                 | X793504 |           |           |          | CONTACT    | filtered | no errors                 |        
      | combined no results   | X793504 | 12/3/2026 | 19/3/2026 | random   | ASSESSMENT | 0        | no errors                 | 
      | combined with results | X793504 | 1/3/2024  | 19/3/2025 | view     | PRE_CONS   | filtered | no errors                 | 
      | validation error      | X793504 |           | 19/3/2026 |          |            | full     | a missing date from error | 
