Feature: Forgot Password SnippetSentry

  Scenario: Forgot Password with empty Username and Password
    When I open "https://beta.snippetsentry.com/"
    And I click on the "Forgot Password?" link
    Then I should see the SnippetSentry Forgot Password page
    And the URL is https://beta.snippetsentry.com/forgot-password
    And I should see an "Email" textbox visible/enabled
    And I should see a "SEND RESET LINK" button visible/enabled
    And a "Back to login" link

  Scenario: Forgot Password - Happy Path
    When I open "https://beta.snippetsentry.com/"
    And I click on the "Forgot Password?" link
    And I enter "stevenmchaves@gmail.com" into the should see the "Email" textbox
    And I click on "SEND RESET LINK" button
    Then I see that the link was sent message
    When I go to my email
    Then I see an email from SnipptSentry subject "Reset password instructions"
    When I open the email
    And click the "Reset Now" button
    Then the SnippetSentry Reset Password page opens in my default browser
    And the URL contains "https://beta.snippetsentry.com/reset-password?reset_password_token"
    And the "Password" textbox is visible/enabled
    And the "Confirm Password" textbox is visible/enabled
    When I enter "QA1Test1!" into the "Password" textbox 
    And I enter "QA1Test1!" into the "Confirm Password" textbox
    And I click the "SUBMIT" button
    Then I see the SnippetSentry Login page
    When I enter "stevenmchaves@gmail.com" into the "Username" textbox
    And I enter "QA1Test1!" into the "Password" textbox
    And I click "LOGIN" button
    Then I see the SnippetSentry Dashboard

