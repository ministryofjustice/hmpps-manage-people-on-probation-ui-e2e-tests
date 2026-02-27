Feature: Update personal details
    As a user
    I want to update personal details for a Pop

    @smoke @personaldetails
    Scenario: Update current details - '<description>'
        Given Context has been created for "Personal details" test
        And A new offender has been created in Ndelius
        And I am logged in
        And I navigate to personal details page
        And I make a note of possible address types and codes
        When I can note the current details
        And I change the contact details
            | label   | value    |
            | phone   | <phone>  |
            | mobile  | <mobile> |
            | email   | <email>  |
        Then I can see the updated details
        When I update the main address 
            | label     | value      |
            | address   | <address>  |
            | type      | <type>     |
            | verified  | <verified> |
            | startDate | <start>    |
            | endDate   | <end>      |
            | note      | <note>     |
        Then I can see the updated details

        Examples:
            | description           | phone         | mobile        | email            | address                                           | type    | verified | start        | end         | note   |
            | full address          | 01632 960 000 | 07771 900 900 |                  | ,21,Jump Street,,St Albans,Hertfordshire,AB11 5RL | A16     | YES      | LASTWEEK     |             |        |
            | no fixed address      |               |               | name@example.com |                                                   | A08A    | NO       | THREEDAYSAGO |             | no job |
            | previous address only |               |               | name@example.com |                                                   | A08A    | NO       | LASTWEEK     | YESTERDAY   | no job |