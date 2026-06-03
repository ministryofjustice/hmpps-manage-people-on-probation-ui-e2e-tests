Feature: As a practitioner
  I want to view my cases page

  Background: 
    Given Context has been created for "Cases" test
    And I am logged in
    And I navigate to cases page

  @full @cases @integration
  Scenario: View my cases page
    Then the cases page is populated
    And the cases page links work correctly 

@full @cases @integration
Scenario Outline: Filter the cases page - '<description>'
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
      | CRN filter       | X966835 |      |          | 1        |
      | sentence filter  |         |      | 307      | filtered |
      | type filter      |         | COAP |          | filtered |
      | no cases         | RANDOM  |      |          | 0        |

