Feature: As a practitioner
  I want to view the overview details for a Pop

  @full @overview @integration
  Scenario Outline: View overview for a case - '<case>'
    Given Context has been created for "Overview" test
    And I am logged in
    And I navigate to '<case>'
    Then the pop header is correct
    And the overview page is populated
    And the overview page links work correctly
    And I close the context

    Examples:
      | case    |
      | X793504 |


  @full @outcomes @integration
  Scenario Outline: Validate outcomes link at overview page for a case - '<case>'
    Given Context has been created for "Overview" test
    And I am logged in
    And I navigate to '<case>'
    Then the pop header is correct
    And the overview page is populated
    And I can see the text 'You have appointments that need attention'
    And link with href '/case/X756510/record-an-outcome/outcome'
    When I select the outcome link
    Then I land at the page with title 'Record an outcome - Outcome - Manage people on probation'
    And radio filter PAST_TWO_YEARS is selected by default on record an outcome page
    When I select the Older than 2 years radio and apply filter
    Then I validate the results are more than 2 years old
    When I select the all filter option and apply filter
    Then 'All' radio is selected
    And I close the context

    Examples:
      | case    |
      | X756510 |


  @full @sentence
  Scenario Outline: View requirements and licence conditions under sentence tab for a case - '<case>'
    Given Context has been created for "Overview" test
    And I am logged in
    And I navigate to '<case_crn>'
    And the overview page is populated
    Then I see 'Requirements' under ORA Community Order at overview page
    And I see 'View (GPS tagging) Trail Monitoring data' link under Requirements section at overview page
    Then I see 'Licence conditions' under ORA Adult Custody at overview page
    Then I see 'View GPS location monitoring data' link under Licence conditions at overview page
    And I close the context
    Examples:
      | case_crn |
      | X969367  |
