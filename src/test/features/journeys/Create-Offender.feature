Feature: Create offender
  As a user
  I want to create an offender

  @integration @createOffender
  Scenario: Create offender
    Given Context has been created for "Creation" test
    And A new offender has been created for provider "<provider>", team "<team>" and username "<username>"
    Examples:
        | provider     | team                             | username                |
        | | | |
