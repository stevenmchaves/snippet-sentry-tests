Feature: Forgot Password SnippetSentry

  Scenario: Forgot Password with empty Username and Password
    When I open "https://beta.snippetsentry.com/"
    And I click the link "Forgot Password?"
    Then I should see the SnippetSentry Forgot Password page
    And the URL is https://beta.snippetsentry.com/forgot-password
    And I should see the "Email" textbox
    And I should see the "SEND RESET LINK" button
    And I should see the "Back to login" link

  Scenario: Forgot Password - Happy Path
    When I open "https://beta.snippetsentry.com/"
    And I click on the "Forgot Password?" link
    And I enter "stevenmchaves@gmail.com" into the "Email" textbox
    And I click the "SEND RESET LINK" button
    Then I should see that the link was sent message
    When I go to my email
    Then I see an email from SnipptSentry subject "Reset password instructions"
    When I open the email
    And I click the "Reset Now" button
    Then I should see the SnippetSentry Reset Password page opens in my default browser
    And I should see the "Password" textbox
    And I should see the "Confirm Password" textbox
    When I enter "QA1Test1!" into the "Password" textbox 
    And I enter "QA1Test1!" into the "Confirm Password" textbox
    And I click the "SUBMIT" button
    Then I should see the SnippetSentry Login page
    When I enter "stevenmchaves@gmail.com" into the "Username" textbox
    And I enter "QA1Test1!" into the "Password" textbox
    And I click the "LOGIN" button
    Then I should see the SnippetSentry Dashboard

