# Manage Person on Probation UI tests
### Install npm dependencies and playwright
```shell
npm install 
npx playwright install

### Running end-to-end tests
### Create Env file
Create a .env file in the Project root folder and add the content from the 1Password file called '.env.playwright'
You can use `.env.example` as a template.
```shell
cp -n .env.example .env
```

Run the tests
```shell
npx bddgen && npx playwright test

# Run a single test
npx bddgen && npx playwright test -g '@tag' 

#Run in headed mode or in a browser
npx bddgen && npx playwright test --headed

#Adjust number of workers - set to 1 to remove parralelism  
npx bddgen && npx playwright test --workers=1

# Or, run in debug mode to enable breakpoints and test recorder
npx bddgen && npx playwright test --debug
```

### See the Run Reports
```shell
npx playwright show-report
```

## Working with playwright-bdd
- Install playwright and playwright-bbd or cucumber extensions for syntax highlighting 
- Use features folder / .feature files to describe tests in natural language
- Fixtures.ts describes data which can be set and passed between tests 
- Use steps folder / .steps.ts files to describe the technical steps that comprise these natural language instructions
- Common.steps.ts provides steps used by multiple feature files
- Use pageObjects folder / .page.ts files to build page objects 
- Use util folder for additional util functions

## Performance tests
- performance tests are located in the performance folder

Run the tests 
```shell
npx tsx src/performance/scripts/run-performance-test.ts
```

or the below command to see login
```shell
PERF_COOKIE_HEADER="$(npx tsx src/performance/scripts/test-auth-cookie.ts)" npm run perf:home
```




