Feature: As a practitioner
  I want to view the overview details for a Pop

  @full @sentence @integration
  Scenario Outline: View sentence and probation history for a case - '<case>'
    Given Context has been created for "Sentence" test
    And I am logged in
    And I navigate to '<case_crn>'
    When I navigate to sentence page
    Then the sentence page is populated with title 'Adult Custody < 12m - Sentence - Manage people on probation'
    And the sentence page has the heading 'Sentence'
    And the sentence page is populated with title 'Adult Custody < 12m - Sentence - Manage people on probation'
    And the link 'Probation history' at sentence page works correctly
    And the link 'CJA - Deferred Sentence' at sentence page works correctly
    And the link 'ORA Community Order' at sentence page works correctly
    And the link 'Adult Custody < 12m' at sentence page works correctly
    And I close the context
    Examples:
      | case_crn |
      | X793504  |

  @full @sentence
  Scenario: View requirements and licence conditions under sentence tab for a case - '<case>'
    Given Context has been created for "Sentence" test
    And I am logged in
    And I navigate to '<case_crn>'
    When I navigate to sentence page
    And the sentence page has the heading 'Sentence'
    When I select 'ORA Community Order' link at sentence page
    Then I see 'Requirements' under ORA Community Order at sentence page
    And I see 'View (GPS tagging) Trail Monitoring data' link under Requirements section at sentence page
    When I select 'ORA Adult Custody (inc PSS)' link at sentence page
    Then I see 'Licence conditions' under ORA Adult Custody at sentence page
    Then I see 'View GPS location monitoring data' link under Licence conditions at sentence page
    And I close the context
    Examples:
      | case_crn |
      | X969367  |

