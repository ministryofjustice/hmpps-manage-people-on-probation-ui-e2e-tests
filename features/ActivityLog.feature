Feature: Contacts Details
  As an probation practitioner,
  I want to view contact details for a given POP

  Scenario: Submit a form with a message
    Given the user is on the form page
    When the user enters "Hello, World!" into the message field
    And the user clicks the submit button
    Then the message "Hello, World!" should be displayed on the page