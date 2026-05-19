Feature: As a practitioner
  I want to add contacts with a PoP
  and view them as per the filter criteria

  Background:
    Given Context has been created for "Contacts" test
    And I am logged in

  @full @contacts @filter_contacts
  Scenario: View contacts for a Pop - '<description>'
    And I navigate to '<case>'
    And I navigate to contact log
    When I filter the contact log with values
      | label              | value        |
      | date_from          | <from>       |
      | date_to            | <to>         |
      | keywords           | <keywords>   |
      | system_generated   | <hide>       |
      | compliance_filters | <compliance> |
      | category_filters   | <categories> |
    Then the contact log contains '<count>' entries
    And there are '<errors>' on contacts page
    And I close the context

    Examples:
      | description           | case    | from      | to        | keywords | hide | compliance             | categories                                 | count    | errors                  |
      | date range            | X793504 | 11/2/2026 | 15/2/2026 |          |      |                        |                                            | filtered | no errors               |
      | keyword               | X793504 |           |           | online   |      |                        |                                            | filtered | no errors               |
      | categories            | X793504 |           |           |          |      |                        | Approved Premises, Internal communications | filtered | no errors               |
      | hide system gen       | X793504 |           |           |          | YES  |                        |                                            | filtered | no errors               |
      | combined no results   | X793504 | 1/2/2026  | 8/3/2026  | house    | YES  | Not complied, Complied | Appointments                               | 0        | no errors               |
      | combined with results | X793504 | 1/2/2026  | 8/3/2026  | visit    | YES  | Complied               | Appointments                               | filtered | no errors               |
      | validation error      | X793504 | 11/2/2026 |           |          |      |                        |                                            | full     | a missing date to error |


  @full @contacts @add_frequent_contact
  Scenario: Add new contacts for a Pop - '<description>'
    And I navigate to '<case>'
    And I navigate to contact log
    When I click on add contact
    And I provide Contact details
      | label              | value                |
      | contact            | <frequent_contact>   |
      | relation_to        | <contact_related_to> |
      | title              | <contact_title>      |
      | date               | <date>               |
      | time               | <time>               |
      | contact_details    | <contact_details>    |
      | file_name          | <file_name>          |
      | visor_report       | <visor_report>       |
      | sensitive_info     | <sensitive_info>     |
      | alert_practitioner | <alert_practitioner> |
    And I save the contact details
    Then I receive success message 'Contact created'


    Examples:
      | description                                | frequent_contact                           | contact_related_to | contact_title | date     | time  | contact_details      | file_name | visor_report | sensitive_info | alert_practitioner |
      | Text or Email from other                   | Email or text from other                   | MPoP               |               | TODAY    | 10:01 | This is test message | test.pdf  | true         | true           | true               |
      | Telephone contact to person on probation   | Telephone contact to person on probation   | MPoP               |               | TOMORROW | 10:01 | This is test message |           | true         | true           | false              |
      | Email or text to other                     | Email or text to other                     | MPoP               |               | TODAY    | 10:01 | This is test message | test.pdf  | true         | true           | true               |
      | Email or text from person on probation     | Email or text from person on probation     | MPoP               |               | TODAY    | 10:01 | This is test message |           | false        | true           | true               |
      | Email or text to person on probation       | Email or text to person on probation       | MPoP               |               | TODAY    | 10:01 | This is test message |           | true         | true           | true               |
      | Internal communications                    | Internal communications                    | MPoP               |               | TODAY    | 10:01 | This is test message | test.pdf  | true         | true           | false              |
      | Police liaison                             | Police liaison                             | Sentence           |               | TODAY    | 10:01 | This is test message |           | true         | true           | true               |
      | Telephone contact from other               | Telephone contact from other               | Sentence           |               | TODAY    | 10:01 | This is test message |           | true         | false          | true               |
      | Telephone contact to other                 | Telephone contact to other                 | MPoP               |               | TODAY    | 10:01 | This is test message | test.pdf  | true         | true           | true               |
      | Telephone contact from person on probation | Telephone contact from person on probation | MPoP               |               | TODAY    | 10:01 | This is test message |           | false        | false          | false              |


  @full @contacts @add_contact_by_category
  Scenario: Add new contacts for a category without outcome for a Pop - '<description>'
    And I navigate to '<case>'
    And I navigate to contact log
    When I click on add contact
    And I click on 'Search by category' tab
    And I search the '<category>'
    And I provide Contact details
      | label              | value                |
      | contact            | <contact>            |
      | relation_to        | <contact_related_to> |
      | title              | <contact_title>      |
      | date               | <date>               |
      | time               | <time>               |
      | contact_details    | <contact_details>    |
      | file_name          | <file_name>          |
      | visor_report       | <visor_report>       |
      | sensitive_info     | <sensitive_info>     |
      | alert_practitioner | <alert_practitioner> |
    And I save the contact details
    Then I receive success message 'Contact created'


    Examples:
      | description                                           | category                                              | contact                                           | contact_related_to | contact_title | date     | time  | contact_details      | file_name | visor_report | sensitive_info | alert_practitioner |
      | Case management and meetings                          | Case management and meetings                          | Case reviewed by case manager                     | MPoP               |               | TODAY    | 10:01 | This is test message |           | true         | true           | true               |
      | Communication and information sharing with others     | Communication and information sharing with others     | Critical communications                           | MPoP               |               | TOMORROW | 10:01 | This is test message | test.pdf  | true         | true           | false              |
      | Communication with person on probation                | Communication with person on probation                | Information from person on probation              | MPoP               |               | TODAY    | 10:01 | This is test message |           | true         | true           | true               |
      | Multi-agency working (including IOM, MAPPA and MARAC) | Multi-agency working (including IOM, MAPPA and MARAC) | IOM case conference                               | MPoP               |               | TODAY    | 10:01 | This is test message |           | false        | true           | true               |
      | Non-compliance and enforcement                        | Non-compliance and enforcement                        | Accommodation evidence                            | MPoP               |               | TODAY    | 10:01 | This is test message | test.pdf  | true         | true           | true               |
      | Referrals                                             | Referrals                                             | Health and well being referral                    | MPoP               |               | TODAY    | 10:01 | This is test message |           | true         | true           | false              |
      | Safeguarding and victim liaison                       | Safeguarding and victim liaison                       | Safeguarding case conference                      | Sentence           |               | TODAY    | 10:01 | This is test message |           | true         | true           | true               |
      | Sentence management                                   | Sentence management                                   | Death under supervision category and notification | Sentence           |               | TODAY    | 10:01 | This is test message | test.pdf  | true         | false          | true               |
      | Sentence management, Case management and meetings     | Sentence management, Case management and meetings     | Comment                                           | MPoP               |               | TODAY    | 10:01 | This is test message |           | true         | true           | true               |


  @full @contacts @add_contact_by_category
  Scenario: Add new contacts for a category with outcome for a Pop - '<description>'
    And I navigate to '<case>'
    And I navigate to contact log
    When I click on add contact
    And I click on 'Search by category' tab
    And I search the '<category>'
    And I provide Contact details
      | label              | value                |
      | contact            | <contact>            |
      | relation_to        | <contact_related_to> |
      | title              | <contact_title>      |
      | date               | <date>               |
      | time               | <time>               |
      | contact_details    | <contact_details>    |
      | outcome            | <outcome>            |
      | file_name          | <file_name>          |
      | visor_report       | <visor_report>       |
      | sensitive_info     | <sensitive_info>     |
      | alert_practitioner | <alert_practitioner> |
    And I save the contact details
    Then I receive success message 'Contact created'


    Examples:
      | description                                           | category                                              | contact                                           | contact_related_to | contact_title | date     | time  | contact_details      | outcome                                           | file_name | visor_report | sensitive_info | alert_practitioner |
      | Case management and meetings                          | Case management and meetings                          | Case decisions                                    | Sentence           |               | TODAY    | 10:01 | This is test message | Contact frequency                                 | test.pdf  | true         | true           | true               |
      | Communication and information sharing with others     | Communication and information sharing with others     | Critical communications                           | MPoP               |               | TOMORROW | 10:01 | This is test message | Acceptable critical communications - no breach    |           | true         | true           | false              |
      | Communication with person on probation                | Communication with person on probation                | Unplanned contact from person on probation        | MPoP               |               | TODAY    | 10:01 | This is test message | Unacceptable behaviour                            |           | true         | true           | true               |
      | Multi-agency working (including IOM, MAPPA and MARAC) | Multi-agency working (including IOM, MAPPA and MARAC) | IOM referral                                      | MPoP               |               | TODAY    | 10:01 | This is test message | Referral decision - pending                       |           | false        | true           | true               |
      | Non-compliance and enforcement                        | Non-compliance and enforcement                        | Alcohol consumption                               | MPoP               |               | TODAY    | 10:01 | This is test message | Acceptable - Monitoring only                      | test.pdf  | true         | true           | true               |
      | Referrals                                             | Referrals                                             | MAPPA referral                                    | MPoP               |               | TODAY    | 10:01 | This is test message | Category 3 referral rejected - not MAPPA managed  |           | true         | true           | false              |
      | Safeguarding and victim liaison                       | Safeguarding and victim liaison                       | Safeguarding enquiries requested                  | Sentence           |               | TODAY    | 10:01 | This is test message | Request not sent - up to date information already |           | true         | true           | true               |
      | Sentence management                                   | Sentence management                                   | Death under supervision category and notification | Sentence           |               | TODAY    | 10:01 | This is test message | Alcohol poisoning                                 |           | true         | false          | true               |
      | Sentence management, Case management and meetings     | Sentence management, Case management and meetings     | Management oversight                              | Sentence           |               | TODAY    | 10:01 | This is test message | Management oversight decision                     | test.pdf  | true         | true           | true               |
