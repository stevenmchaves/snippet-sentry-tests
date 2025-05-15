Feature: Login SnippetSentry

Scenario: Happy path Login
    When I open "https://beta.snippetsentry.com/"
    And I fill in the username field with "$DEFAULT_USER"
    And I fill in the password field with "$DEFAULT_PASSWORD"
    And I click on the LOGIN button
    Then I should see the SnippetSentry Dashboard
