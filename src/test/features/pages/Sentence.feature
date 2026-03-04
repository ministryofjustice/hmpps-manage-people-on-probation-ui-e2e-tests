Feature: As a practitioner
  I want to view the overview details for a Pop

  @sentence  @smoke
  Scenario Outline: View sentence and probation history for a case - '<case>'
    Given Context has been created for "Sentence" test
    And I am logged in
    And I navigate to '<case_crn>'
    When I navigate to sentence page
    And the sentence page is populated with title 'Adult Custody < 12m - Sentence - Manage people on probation'
    And the sentence page has the heading 'Sentence'
    And the sentence page links work correctly
    And the sentence page is populated with title 'Adult Custody < 12m - Sentence - Manage people on probation'
    And I close the context
    Examples:
      | case_crn |
      | X793504  |