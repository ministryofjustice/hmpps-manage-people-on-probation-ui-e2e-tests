Feature: As a practitioner
  I want to view the overview details for a Pop

  @smoke @overview
  Scenario: View my home page
    Given Context has been created for "Home" test
    And I am logged in
    Then the home page is populated
    And the home page links work correctly
    And I close the context