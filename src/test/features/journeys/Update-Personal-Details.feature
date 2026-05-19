Feature: Update personal details
    As a user
    I want to update personal details for a Pop

    @full @personaldetails
    Scenario: Update current details - '<description>'
        Given Context has been created for "Personal details" test
        And A new offender has been created or existing made available
        And I am logged in
        And I navigate to personal details page
        And I make a note of possible address types and codes
        When I can note the current details
        And I navigate to update contact details via "<changeLink>" link
        And I update the phone number to "<phone>"
        And I update the mobile number to "<mobile>"
        And I update the email address to "<email>"
        And I submit the updated contact details
        And I navigate to the update main address page
        When I update the main address details
            | label     | value      |
            | address   | <address>  |
            | type      | <type>     |
            | verified  | <verified> |
            | startDate | <start>    |
            | endDate   | <end>      |
            | note      | <note>     |
        Then I can see the updated details
        # And I close the context

        Examples:
            | description           | changeLink    | phone         | mobile        | email            | address                                           | type    | verified | start        | end         | note   |
            | full address          | Phone number  | 01632 960 000 | 07771 900 900 |                  | ,21,Jump Street,,St Albans,Hertfordshire,AB11 5RL | A16     | YES      | LASTWEEK     |             |        |
            | no fixed address      | Mobile number |               |               | name@example.com |                                                   | A08A    | NO       | THREEDAYSAGO |             | no job |
            | previous address only | Email address |               |               | name@example.com |                                                   | A08A    | NO       | LASTWEEK     | YESTERDAY   | no job |