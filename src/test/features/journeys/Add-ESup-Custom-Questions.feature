Feature: As a practitioner
  I want to add ESup custom questions while online checkins

  @full @eSupQuestions
  Scenario Outline: Add Custom Questions to checkins  - preview links'<case>'
    Given Context has been created for "Esupervision" test
    And I am logged in
    And I navigate to '<case_crn>'
    And I navigate to checkIn details
    When I select 'Change questions' link
    Then I see "Cancel and go to Marianne's overview" link on how to write questions page
    When I select 'Add questions to online check ins' button on how to write questions page
    Then I see text "Add questions to Marianne's next online check in" on add questions page
    And I see default questions with preview links:
      | How have you been feeling since we last spoke?                        |
      | Is there anything you need support with or want to let us know about? |
    When I select the 'preview-feeling' link on add questions page
    Then I see these radio buttons on the feeling preview page
      | Very well  |
      | Well       |
      | OK         |
      | Not Great  |
      | Struggling |
    And I see these text areas on the feeling preview page
      | Very well  |
      | Well       |
      | OK         |
      | Not Great  |
      | Struggling |
    And I select 'Back to questions' button on the feeling preview page
    When I select the 'preview-support' link on add questions page
    Then I see these check-boxes on the support preview page
      | Mental health                            |
      | Alcohol                                  |
      | Drugs                                    |
      | Money                                    |
      | Housing                                  |
      | Employment and education                 |
      | Relationships (family, friends, partner) |
      | Something else                           |
      | No, i do not need any support            |
    And I see these text areas on the support preview page
      | Tell us what you want us to know about mental health (optional)            |
      | Tell us what you want us to know about alcohol (optional)                  |
      | Tell us what you want us to know about drugs (optional)                    |
      | Tell us what you want us to know about money (optional)                    |
      | Tell us what you want us to know about housing (optional)                  |
      | Tell us what you want us to know about employment and education (optional) |
      | Tell us what you want us to know about your relationships (optional)       |
      | Tell us what you want us to know about (optional)                          |
    And I select 'Back to questions' button on the feeling preview page
    And I see 'Save questions' button on add questions page
    And I see 'Cancel and go back' link on add questions page
    When I select 'Cancel and go back' link on add questions page
    Then I am directed to 'How to write questions for an online service' page

    Examples:
      | case_crn |
      | X793504  |

