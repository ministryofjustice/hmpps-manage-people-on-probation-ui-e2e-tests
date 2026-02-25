Feature: As a practitioner
  I want to view the overview details for a Pop

  @smoke @overview
  Scenario Outline: View overview for a case - '<case>'
    Given Context has been created for "Overview" test
    And I am logged in
    And I navigate to '<case>'
    Then the overview page is populated
    And the overview page links work correctly 

    Examples:
      | case    |
      | X793504 |