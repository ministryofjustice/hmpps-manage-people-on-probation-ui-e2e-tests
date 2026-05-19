Feature: Use Search Service
  As a user
  I want to search for a specific CRN

  Background: 
    Given Context has been created for "Search" test

  @full @search
  Scenario: Search for Case
    Given A new offender has been created or existing made available
    And I am logged in
    When I search for CRN
    Then I can view the CRN


  @full @search
  Scenario: Search for a Case and validate the columns on search result page
    Given I am logged in
    When I search for a case CRN 'X793504'
    Then I can view below columns on the search page:
      | Name          |
      | CRN           |
      | Date of Birth |
      | Managed by    |
      | PDU           |
