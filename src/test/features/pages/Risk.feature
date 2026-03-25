Feature: As a practitioner
  I want to view the risk details for a Pop

  @full @risk
  Scenario Outline: View overview for a case - '<case>'
    Given Context has been created for "Overview" test
    And I am logged in
    And I navigate to '<case>'
    And I navigate to risk page
    Then the risk page is populated
    And the risk page links work correctly
    And I close the context

    Examples:
      | case    |
      | X793504 |