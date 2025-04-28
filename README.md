# Manage Person on Probation UI tests


### Running end-to-end tests
Create a `.env` file in the e2e_tests directory with your Delius credentials. You can use `.env.example` as a template.
```shell
cp -n .env.example .env
```

Run the tests
```shell
npm run e2e-test

# Or, run in debug mode to enable breakpoints and test recorder
npm run e2e-test:debug
```

### Dependency Checks

The template project has implemented some scheduled checks to ensure that key dependencies are kept up to date.
If these are not desired in the cloned project, remove references to `check_outdated` job from `.circleci/config.yml`
