Feature: Verify Sentence Plan exists
  As a user
  I want to see Sentence Plan link exists in Risk and plan tab

  Background:
    Given Context has been created for "Contacts" test
    And I am logged in

  @sentenceplan
  Scenario Outline: Verify Sentence Plan exists
    Given I navigate to '<case>'
    When I navigate to the Risk and Plan tab
    Then I can see the Sentence Plan link
    Examples:
       | case    |
       | X997911 |