Feature: Verify Sentence Plan exists
  As a user
  I want to see Sentence Plan link exists in Risk and plan tab

  Background:
    Given Context has been created for "RiskAndPlan" test
    And A new offender has been created or existing made available
    And Create sentence plan for a case
    And I am logged in

  @sentenceplan @integration @anand
  Scenario: Verify Sentence Plan exists
    Given I navigate to the person on probation
    When I navigate to the Risk and Plan tab
    Then I can see the Sentence Plan link