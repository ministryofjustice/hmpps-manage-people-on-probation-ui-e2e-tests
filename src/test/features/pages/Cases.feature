Feature: As a practitioner
  I want to view my cases page

  @full @cases
  Scenario Outline: View my cases page
    Given Context has been created for "Cases" test
    And I am logged in
    And I navigate to cases page
    Then the cases page is populated
    And the cases page links work correctly 

@full @cases
Scenario Outline: Filter the cases page - '<description>'
    Given Context has been created for "Cases" test
    And I am logged in
    And I navigate to cases page
    When I filter the cases with values
      | label    | value      |
      | text     | <text>     |
      | type     | <type>     |
      | sentence | <sentence> |
    Then the cases page contains '<count>' entries
    When I clear filters on cases page
    Then all cases are present on cases page
    And I close the context

    Examples:
      | description      | text    | type | sentence | count    |
      | no filters       |         |      |          | full     |
      | CRN filter       | X990175 |      |          | 1        |
      | sentence filter  |         |      | 307      | filtered |
      | type filter      |         | CODC |          | filtered |
      | no cases         | RANDOM  |      |          | 0        |

