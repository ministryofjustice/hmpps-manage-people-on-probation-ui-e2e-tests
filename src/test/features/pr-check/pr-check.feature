@pr-check
Feature: Playwright website

  Scenario: Page has correct title
    Given I navigate to the Playwright homepage
    Then the page title should contain "Playwright"

  Scenario: Get started link works
    Given I navigate to the Playwright homepage
    When I click the "Get started" link
    Then I should see a heading "Installation"