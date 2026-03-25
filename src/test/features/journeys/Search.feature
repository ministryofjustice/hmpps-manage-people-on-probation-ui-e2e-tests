Feature: Use Search Service
    As a user
    I want to search for a specific CRN

    @full @search
    Scenario: Search for Case
        Given Context has been created for "Search" test
        And A new offender has been created or existing made available
        And I am logged in
        When I search for CRN
        Then I can view the CRN