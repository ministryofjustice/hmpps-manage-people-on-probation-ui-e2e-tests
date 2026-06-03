Feature: Non serial checkIn journeys
    As a user
    I want to setup online checkins
    So they can be used by an offender

    Background: 
        Given Context has been created for "Esupervision" test

    @esupervision @expired @find
    Scenario: Find Setup Checkins
        Given I am logged in 
        When I find a number of valid cases
        Then I close the context

    @esupervision @expired @create
    Scenario: Create Expired Checkins
        Given I mock the completion of an expired checkin for '<cases>'
        And I close the context

        Examples:
            | cases   |
            | Y010730,Y009164,Y010801,Y010803,Y009774,Y010627,Y006772,Y007593,Y007847,Y007905,Y008156,Y008335,Y008260,Y008646,Y010638,Y010732,Y006832,Y007594,Y006988,Y007596,Y007598,Y010727,Y007600,Y007597,Y007601,Y007592,Y007599 |

    @full @esupervision @expired @review
    Scenario: Review Expired Checkin
        Given I am logged in 
        When I find valid case from '<cases>'
        And I review the missed checkIn
        Then I can view the expired and reviewed checkIn
        And I close the context

        Examples:
            | cases   |
            | Y010730,Y009164,Y010801,Y010803,Y009774,Y010627,Y006772,Y007593,Y007847,Y007905,Y008156,Y008335,Y008260,Y008646,Y010638,Y010732,Y006832,Y007594,Y006988,Y007596,Y007598,Y010727,Y007600,Y007597,Y007601,Y007592,Y007599 |

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

