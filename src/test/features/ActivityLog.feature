Feature: Contacts Details
  As an probation practitioner,
  I want to view contact details for a given POP

  Scenario: Submit a form with a message
    Given the user navigates to Google
    When the user enters "Hello, World!" into the search field
    And the user clicks the submit button
    Then the message "Hello, World!" should be displayed on the page