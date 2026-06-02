Feature: As a practitioner
  I want to view my home page

  @full @home @footer @integration
  Scenario: View my home page
    Given Context has been created for "Home" test
    And I am logged in
    Then the home page is populated
    And the home page links work correctly
    And I see "Is this page useful?" text
    And I see "Yes (opens in new tab)" link at the footer
    And I see "No (opens in new tab)" link at the footer
    And I close the context