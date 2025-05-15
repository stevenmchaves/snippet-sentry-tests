Feature: Manage Users
  Test Plan for the Manage Users feature for the SnippetSentry Application with a focus on CRUD operations.
 
  The following is not covered in this Test Plan, but should be considered in the future testing:
    A) Accessibility such as using on Tabs, other control keyboard keys, accessibility options of the browser/mobile device
    B) Combination of tabs and mouse
    C) Specific locations of the widgets and order
    D) Specific colors/fonts
    E) Look and feel depending on device

 
  Background:
    # Do this for ever case. 
    Given I am logged in as "stevenmchaves@gmail.com" with $PASSWORD
    Given I am on the Manage Users screen
    Then I see the User List table

  
  Scenario: Manage Users - Add User Modal Details
    Confirm the contents of the window. Not part of CRUD ops

    Then I should see the "Add User" button
    When I click the "Add User" button
    Then the "Add User" modal is visible
    And the "Admin" checkbox is enabled/clickable
    And the "Send email invite is enabled/clickable
    And the "First Name" textbox appears
    And the "Last Name" textbox appears
    And the "Email" textbox appears
    And the "Enter Mobile Number" textbox appears
    And the Default US dial prefix appears 
    And the "Notes" textbox appears
    And the "Cancel" button is visible/disabled
    And the "Save" button is visisble/enabled/clickable
    And the Dismiss button is visible/enabled/clickable.

  Rule: There can be only 1 User
  # Used as Precondition for amount of users

    Scenario: Manage Users - Add User happy path w/o selecting Admin or Send email invite options
      "Create" operation - confirm only 1 user exists before going on. Using Read operation as part of validation

      Then I should see 1 user in the Users List
      When I click the "Add User" button
      And I enter "Steven" in the "First Name" textbox
      Then the "Cancel" button is visible/enabled/clickable
      When I enter "Chaves" in the "Last Name" textbox
      And I enter "portchavz@gmail.com" in the "Email" textbox
      And I enter "984-555-5555" in the "Enter Mobile Number" textbox
      And I enter "this is a test" in the "Notes" textbox
      And I click the "Save" button
      Then the Add User Modal closes
      And the focus is brought back to Manage Users page
      And a green modal "User Added Successfully!" pop-up appears 
      And I see the User List table with the following users:
        # Note this easier Playwright manner to evaluate multiple items
        # See https://cucumber.io/docs/gherkin/reference/#data-tables
        # Automation will look for image if isAdmin value is True otherwise expects no image
      
        | isAdmin | Name          | STATUS  | Email                   | Phone        | Android | WhatsApp | iMessage |
        | False   | Steven Chaves | Pending | portchavz@gmail.com     | +19845555555 |         |          |          |
        | True    | Steven Chaves | Active  | stevenmchaves@gmail.com | +19842926636 |         |          |          |
  
    Scenario: Manage Users - Create User happy path with selecting Admin and Send email invite options
      "Create" operation  - Admin user

      Then I should see 1 user in the Users List
      When I click the "Add User" button
      And I enter "Steven" in the "First Name" textbox
      Then the "Cancel" button is visible/enabled/clickable
      When I enter "Chaves" in the "Last Name" textbox
      And I enter "portchavz@gmail.com" in the "Email" textbox
      And I enter "984-555-5555" in the "Enter Mobile Number" textbox
      And I enter "this is a test" in the "Notes" textbox
      And I click the "Save" button
      Then the Add User Modal closes
      And the focus is brought back to Manage Users page
      And a green modal "User Added Successfully!" pop-up appears 
      And I see the User List table with the following users:
        # Note this easier Playwright manner to evaluate multiple items
        # See https://cucumber.io/docs/gherkin/reference/#data-tables
        # Automation will look for image if isAdmin value is True otherwise expects no image
        | isAdmin | Name          | STATUS  | Email                   | Phone        | Android | WhatsApp | iMessage |
        | False   | Steven Chaves | Pending | portchavz@gmail.com     | +19845555555 |         |          |          |
  
    Scenario: Manage Users - Read user details
      "Read" operation - confirm the login user details exists in the User List
  
      Then I should see the user row with the Email "stevenmchaves@gmail.com"
      And the user "stevenmchaves@gmail.com" should have the following details: 
        | isAdmin | Name          | STATUS | Email                   | Phone        | Android | WhatsApp | iMessage |
        | Y       | Steven Chaves | Active | stevenmchaves@gmail.com | +19842926636 |         |          |          |
  
  Rule: There can be 2 users
    Background:
      Given I have created portchavz@gmail.com user as a normal user.
  
    Scenario: Manage Users - New User Send email invite
      "Read" operation - New user is usable
  
      Then I should see at least 2 user rows in the Users List
      When I click on the Name link for the user "portchavz@gmail.com"
      Then the "Modify User" modal is visible
      And the "SEND EMAIL INVITE" link is visible/enabled
      And the text "Invitation sent: X" is visible
      And the value "X" after "Invitation sent:" is >= 0
      When I go to Gmail app
      And Open the SnippetSentry email
      And Click the "Register button"
      Then I should see a new Browser Window and/or Tab open with the Email address verified heading
      And I should see "Password*" textbox appear
      And I should see "Confirm Password*" textbox appear
      And I should see a "Please agree to the User Agreement to continue" checkbox
      And I should see a "SUBMIT" button
      And I should see a "Back to login" link.
      When I enter a "QA1Test!" into the "Password*" textbox
      And I enter a "QA1Test!" into the " Confirm Password*" textbox
      And I click the "Please agree to the User Agreement to continue" checkbox
      And I click the "SUBMIT" button"
      Then I should see the SnippetSentry Dashboard
      When I click the User Avatar
      Then I see user "portchavz@gmail.com" text.
  
    Scenario: Manage Users - Modify User Modal Details
      Confirm the contents of the Modify User window. Not part of CRUD ops
    
      When I click on the Name link for the user "stevenmchaves@gmail.com"
      Then the "Modify User" modal is visible
      And the "Admin" checkbox is enabled/checked
      And the "First Name" textbox appears with the text Steven
      And the "Last Name" textbox appears with text Chaves
      And the "Email" textbox visible/disabled with the text "stevenmchaves@gmail.com"
      And the "Mobile Number" textbox appears with the "9842926636" text
      And the Default US dial prefix appears 
      And the "Notes" textbox appears with no text
      And the "RESET PASSWORD" button is visible/enabled
      And the "SUSPEND" button is visible/enabled/clickable
      And the "DELETE" button is visible/enabled/clickable
      And the heading "Status Table" is visible/uncollapsed
      And the table should have the following content:
        # ConnectionType
        | Channel  | Connection Status       | ConnectionTypeAvailable |
        | Android  | Not Currently Connected |                         |
        | WhatsApp | Not Currently Connected | Y                       |
        | iMessage | Not Currently Connected | Y                       |
      And the "CANCEL" button is visible/disabled
      And the "SAVE" button is visible/enabled/clickable
      And the Dismiss button is visible/enabled/clickable.
  
    Scenario: Manage Users - Update user details
      "Update" operation - change phone number
    
      # Note: I tried other items to modify like the Channel Connections. I could not get them to work.
    
      When I click on the Name link for the user "stevenmchaves@gmail.com"
      Then I see the Modify User modal is open.
      When I change the Phone number to "9842926637"
      And click the "SAVE" button
      Then the "User Updated successfully" pop-up modal opens up
      And the Modify User model is open.
      When I click the Dismiss button
      Then the Modify User modal is closed
      And the user "stevenmchaves@gmail.com" details shows "+19842926637" as the Phone entry in the Users List table
      When I refresh the screen
      Then the user "stevenmchaves@gmail.com" details shows "+19842926637" as the Phone entry in the Users List table
  
    Scenario: Manage Users - Try Deleting the logged in user 
      "Delete" operation - Available in Modify User Modal
    
      # Note: I tried other items to modify like the Channel Connections. I could not get them to work.
    
      When I click on the Name link for the user "stevenmchaves@gmail.com"
      Then I see the Modify User modal is open.
      When I change the Phone number to "9842926637"
      And click the "SAVE" button
      Then the "User Updated successfully" pop-up modal opens up
      And the Modify User model is open.
      When I click the Dismiss button
      Then the Modify User modal is closed
      And the user "stevenmchaves@gmail.com" details shows "+19842926637" as the Phone entry in the Users List table
      When I refresh the screen
      Then the user "stevenmchaves@gmail.com" details shows "+19842926637" as the Phone entry in the Users List table
