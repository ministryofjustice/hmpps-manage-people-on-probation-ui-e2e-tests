Feature: Non serial checkIn journeys
    As a user
    I want to setup online checkins
    So they can be used by an offender

    Background:
        Given Context has been created for "Esupervision" test

    @esupervision @expired @find
    #finds a set of cases with online checkIns setup
    Scenario: Find Setup Checkins
        Given I am logged in
        When I find a number of valid cases
        Then I close the context

    @esupervision @expired @create
    #for all of a set of cases, creates expired checkIns (which appear in MPOP after cron job runs on ESUP)
    Scenario: Create Expired Checkins
        Given I mock the completion of an expired checkin for '<cases>'
        And I close the context

        Examples:
            | cases   |
            | Y013288,Y013306,Y013291,Y013308,Y011774,Y011805,Y011786,Y011980,Y012277,Y012571,Y012705 |

    @full @esupervision @expired @review
    #find an unreviewed expired checkIn by working through same cases as previous scenario
    Scenario: Review Expired Checkin
        Given I am logged in
        When I find valid case from '<cases>'
        And I review the missed checkIn
        Then I can view the expired and reviewed checkIn
        And I close the context

        Examples:
            | cases   |
            | Y013288,Y013306,Y013291,Y013308,Y011774,Y011805,Y011786,Y011980,Y012277,Y012571,Y012705 |

    @full @esupervision @eligibility
    Scenario: View Eligibility Options
        Given A new offender has been created or existing made available
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
