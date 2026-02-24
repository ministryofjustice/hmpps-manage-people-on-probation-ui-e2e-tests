Feature: As a practitioner
  I want to add contacts with a PoP
  and view them as per the filter criteria

  @contacts
  Scenario Outline: View contacts for a Pop
    Given Context has been created for "Contacts" test
    And I am logged in
    And I navigate to 'X793504'
    And I navigate to contact log
    And I record the full list of activities