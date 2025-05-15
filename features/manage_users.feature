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
    Given I am logged in as "stevenmchaves@gmail.com" with "$PASSWORD"
    Given I am on the Manage Users screen
    Then I should see the User List table

  
  Scenario: Manage Users - Add User Modal Details
    Confirm the contents of the window. Not part of CRUD ops

    Then I should see the "Add User" button
    When I click the "Add User" button
    Then I should see the "Add User" modal
    And I should see the "Admin" checkbox
    And I should see the "Send email invite" link
    And I should see the "First Name" textbox
    And I should see the "Last Name" textbox
    And I should see the "Email" textbox
    And I should see the "Enter Mobile Number" textbox
    And I should see the Default US dial prefix 
    And I should see the "Notes" textbox
    And I should see the "Cancel" button
    And I should see the "Save" button
    And I should see the Dismiss button

  Rule: There can be only 1 User
  # Used as Precondition for amount of users

    Scenario: Manage Users - Add User happy path w/o selecting Admin or Send email invite options
      "Create" operation - confirm only 1 user exists before going on. Using Read operation as part of validation

      Then I should see 1 user in the Users List
      When I click the "Add User" button
      And I enter "Steven" in the "First Name" textbox
      Then I should see the "Cancel" button
      When I enter "Chaves" in the "Last Name" textbox
      And I enter "portchavz@gmail.com" in the "Email" textbox
      And I enter "984-555-5555" in the "Enter Mobile Number" textbox
      And I enter "this is a test" in the "Notes" textbox
      And I click the "Save" button
      Then I should see the "Add User" Modal close
      And I should see the "User Added Successfully!" pop-up 
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
      Then I should see the "Cancel" button
      When I enter "Chaves" in the "Last Name" textbox
      And I enter "portchavz@gmail.com" in the "Email" textbox
      And I enter "984-555-5555" in the "Enter Mobile Number" textbox
      And I enter "this is a test" in the "Notes" textbox
      And I click the "Save" button
      Then I should see the "Add User" Modal close
      And I should see the "User Added Successfully!" pop-up 
      And I see the User List table with the following users:
        # Note this easier Playwright manner to evaluate multiple items
        # See https://cucumber.io/docs/gherkin/reference/#data-tables
        # Automation will look for image if isAdmin value is True otherwise expects no image
        | isAdmin | Name          | STATUS  | Email                   | Phone        | Android | WhatsApp | iMessage |
        | False   | Steven Chaves | Pending | portchavz@gmail.com     | +19845555555 |         |          |          |
  
    Scenario: Manage Users - Read user details
      "Read" operation - confirm the login user details exists in the User List
  
      Then I should see the user row with the Email "stevenmchaves@gmail.com"
      And I should see the user "stevenmchaves@gmail.com" should have the following details: 
        | isAdmin | Name          | STATUS | Email                   | Phone        | Android | WhatsApp | iMessage |
        | Y       | Steven Chaves | Active | stevenmchaves@gmail.com | +19842926636 |         |          |          |
  
  Rule: There can be 2 users
    Background:
      Given I have created "portchavz@gmail.com" user as a "normal" user.
  
    Scenario: Manage Users - New User Send email invite
      "Read" operation - New user is usable
  
      Then I should see at least 2 user rows in the Users List
      When I click on the Name link for the user "portchavz@gmail.com"
      Then I should see the "Modify User" modal
      And I should see the "SEND EMAIL INVITE" link
      And I should see the text "Invitation sent: 0"
      When I go to Gmail app
      And Open the SnippetSentry email
      And I click the "Register" button
      Then I should see a new Browser Window and/or Tab open with the Email address verified heading
      And I should see the "Password*" textbox
      And I should see the "Confirm Password*" textbox
      And I should see the "Please agree to the User Agreement to continue" checkbox
      And I should see the "SUBMIT" button
      And I should see the "Back to login" link
      When I enter "QA1Test!" into the "Password*" textbox
      And I enter "QA1Test!" into the " Confirm Password*" textbox
      And I select the "Please agree to the User Agreement to continue" checkbox
      And I click the "SUBMIT" button
      Then I should see the SnippetSentry Dashboard
      When I click the User Avatar
      Then I should see "portchavz@gmail.com"
  
    Scenario: Manage Users - Modify User Modal Details
      Confirm the contents of the Modify User window. Not part of CRUD ops
    
      When I click on the Name link for the user "stevenmchaves@gmail.com"
      Then I should see the "Modify User" modal
      And I should see the "Admin" checkbox
      And I should see the "First Name" textbox with the text "Steven"
      And I should see the "Last Name" textbox with the text "Chaves"
      And I should see the "Email" textbox with the text "stevenmchaves@gmail.com"
      And I should see the "Mobile Number" textbox with the "9842926636" text
      And I should see the Default US dial prefix 
      And I should see the "Notes" textbox with the "" text
      And I should see the "RESET PASSWORD" button
      And I should see the "SUSPEND" button
      And I should see the "DELETE" button
      And I should see "Status Table" heading
      And I should see the table should have the following content:
        # ConnectionType
        | Channel  | Connection Status       | ConnectionTypeAvailable |
        | Android  | Not Currently Connected |                         |
        | WhatsApp | Not Currently Connected | Y                       |
        | iMessage | Not Currently Connected | Y                       |
      And I should see the "CANCEL" button
      And I should see the "SAVE" button
      And I should see the Dismiss button
  
    Scenario: Manage Users - Update user details
      "Update" operation - change phone number
    
      # Note: I tried other items to modify like the Channel Connections. I could not get them to work.
    
      When I click on the Name link for the user "stevenmchaves@gmail.com"
      Then I should see the "Modify User" modal
      When I enter "9842926637" into the "Phone number" textbox 
      And I click the "SAVE" button
      Then I should see the "User Updated successfully" pop-up
      And I should see the "Modify User" modal
      When I click the Dismiss button
      Then I should see the "Modify User" Modal close
      And I should see the user "stevenmchaves@gmail.com" details shows "+19842926637" as the Phone entry in the Users List table
      When I refresh the screen
      Then I should see the user "stevenmchaves@gmail.com" details shows "+19842926637" as the Phone entry in the Users List table
  
    Scenario: Manage Users - Deleting a user 
      "Delete" operation - Available in Modify User 
     
      When I click on the Name link for the user "portchavz@gmail.com"
      Then I should see the "Modify User" modal
      And I click the "Delete" button
      Then I should see the "User Deleted successfully" pop-up
      And I should see the "Modify User" Modal close
      And I should not see the user "portchavz@gmail.com"
      When I refresh the screen
      Then I should not see the user "portchavz@gmail.com"