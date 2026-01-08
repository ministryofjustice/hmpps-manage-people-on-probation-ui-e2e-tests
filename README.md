# Manage Person on Probation UI tests


### Running end-to-end tests
Create a `.env` file in the e2e_tests directory with your Delius credentials. You can use `.env.example` as a template.
```shell
cp -n .env.example .env
```

Populate the file using .env.playwright from within the MPop one password account. 

Run the tests with the following command
```shell
npx playwright test
```
