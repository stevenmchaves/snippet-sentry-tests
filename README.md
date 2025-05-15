# SnippetSentry QA Assessment

## Manage Users Testplan
Located here: https://github.com/stevenmchaves/snippet-sentry-tests/blob/main/features/manage_users.feature

I used Gherkin style

I also added 2 other Gherkin fles for reset password and forget password


## Execution

You will need npm, node, and yarn
```
npm install --global yarn
yarn
yarn test:generate-bdd
"test:generate-bdd": "export BDD=true && bddgen -c playwright.config.ts",
```
