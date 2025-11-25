# Manage Person on Probation UI tests


### Install npm and npm playwright
```shell
npm install --save-dev playwright
npx playwright install

### If using Mac, install the below commands to run the tests
brew install --cask 1password-cli

### Running end-to-end tests
### Create Env file
Create a .env file in the Project root folder and add the content from the 1Password filename is '.env.playwright'
You can use `.env.example` as a template.
```shell
cp -n .env.example .env
```

Populate the file using .env.playwright from within the MPop one password account. 

Run the tests with the following command
```shell
npx playwright text
npm run e2e-test

# Run a single test
npx playwright test tests/pages/verify-activityLog.spec.ts

#Run in headed mode or in a browser
npx playwright test tests/pages/verify-activityLog.spec.ts --headed

## The below command will run the complete suite with the 1password details
op run --account ministryofjustice.1password.eu --env-file=./.env.1password -- npx playwright test

# Or, run in debug mode to enable breakpoints and test recorder
npm run e2e-test:debug
```

### See the Run Reports
```shell
npx playwright show-report
```

### Dependency Checks

The template project has implemented some scheduled checks to ensure that key dependencies are kept up to date.
If these are not desired in the cloned project, remove references to `check_outdated` job from `.circleci/config.yml`
