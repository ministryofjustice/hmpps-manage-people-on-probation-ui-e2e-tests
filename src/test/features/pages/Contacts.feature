Feature: As a practitioner
  I want to add contacts with a PoP
  and view them as per the filter criteria

Background:
  Given an appointment has been created for the MPoP

 Scenario Outline: View contacts with a PoP '<description>'
   And I am logged in
   And I navigate to '<page>' page
   And I provide filter criteria as '<keywords>' '<Date_From>' '<Date_To>'
   And I select '<Compliance_Filter>'
   And I apply filters
   Then I am able to view contacts for the filtered criteria

   Examples:
    |description |page|keywords|Date_From|Date_To|Compliance_Filter|
     |Filter keyword is passed|contacts|   Online   |         |       |                 |
     |Stard and end dates are passed|contacts|      |      10/02/2026   |     10/02/2026   |                 |

