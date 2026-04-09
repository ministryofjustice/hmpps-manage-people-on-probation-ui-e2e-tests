Feature: As a practitioner
  I want to view the overview details for a Pop

  @personalDetails  @smoke @raj
  Scenario Outline: View personal details page and assert sections on the page
    Given Context has been created for "Personal details" test
    And I am logged in
    And I navigate to "<case_crn>"
    When I navigate to personal details page
    Then the personal details page is populated with title 'Personal details - Manage people on probation'
    And the personal details page has the heading 'Personal details'
    And the Contact details section contains below data
      | Phone number    |
      | Mobile number   |
      | Email Address   |
      | Main Address    |
      | Other addresses |
      | Contacts        |
    And Personal details section contains below data
      | Name                    |
      | Date of birth           |
      | Preferred name/Known as |
      | Aliases                 |
      | Previous name           |
      | Preferred language      |
      | Current circumstances   |
      | Disabilities            |
      | Adjustments             |
      | Personal documents      |
    And Identity numbers section contains below data
      | CRN           |
      | PNC number    |
      | Prison number |
    And Staff contacts section contains below data
      | Probation practitioner        |
      | Prison offender manager (POM) |
    And Equality monitoring section contains below data
      | Religion or belief    |
      | Sex                   |
      | Gender identity       |
      | Self-described gender |
      | Sexual orientation    |

    Examples:
      | case_crn |
      | X793504  |