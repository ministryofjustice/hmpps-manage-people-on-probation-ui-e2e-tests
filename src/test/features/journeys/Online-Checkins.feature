Feature: Non serial checkIn journeys
    As a user
    I want to setup online checkins
    So they can be used by an offender

    @esupervision @expired @find
    Scenario: Find Setup Checkins
        Given Context has been created for "Esupervision" test
        And I am logged in
        When I find a number of valid cases
        Then I close the context

    @esupervision @expired @create
    Scenario: Create Expired Checkins
        Given Context has been created for "Esupervision" test
        And I mock the completion of an expired checkin for '<cases>'
        And I close the context

        Examples:
            | cases   |
            | X989788,X989912,X989984,X989995,X990011,X990012,X990017,X990023,X990039,X990099,X990108,X990175,X989472,X989522,X989510,X989610,X989612,X989687,X989667,X989632,X989622,X976093,X976094,X976110,X976108,X976235,X976250,X976614,X976858,X976842,X977034,X977246,X977262,X978243,X978245 |

    @esupervision @expired @review
    Scenario: Review Expired Checkin
        Given Context has been created for "Esupervision" test
        And I am logged in
        When I find valid case from '<cases>'
        And I review the missed checkIn
        Then I can view the expired and reviewed checkIn
        And I close the context

        Examples:
            | cases   |
            | X989788,X989912,X989984,X989995,X990011,X990012,X990017,X990023,X990039,X990099,X990108,X990175,X989472,X989522,X989510,X989610,X989612,X989687,X989667,X989632,X989622,X976093,X976094,X976110,X976108,X976235,X976250,X976614,X976858,X976842,X977034,X977246,X977262,X978243,X978245 |


    @esupervision @random
    Scenario: Randomised Setup
        Given Context has been created for "Esupervision" test
        And A new offender has been created in Ndelius
        And I am logged in
        And I have navigated to new offender
        When I set up checkIns with random values
        And I make random changes
        And I submit the checkin
        Then Checkins should be setup
        And I close the context

    @smoke @esupervision @eligibility
    Scenario: View Eligibility Options       
        Given Context has been created for "Esupervision" test
        And A new offender has been created or existing made available
        And I am logged in
        And I have navigated to new offender
        When I fill eligibility values with '<ids>'
        Then I '<can>' use checkIns
        And I close the context

        Examples:
            | ids   | can |
            | 0,2,4 | can, alongside face-to-face contact, |
            | 8     | cannot |
            | 9     | can    |

