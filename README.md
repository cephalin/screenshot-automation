## To get setup

1. In Visual Studio Code, install the **Playwright Test for VSCode** extension.
1. Install Node.js.

    ```
    npx playwright install
    ```
1. Clone, install dependencies, and open the repo in VSCode:

    ```
    git clone https://github.com/cephalin/screenshot-automation.git
    cd screenshot-automation
    npm install
    code .
    ```

1. In VSCode, open the command palette and type "Test: Install Playwright".

1. Go to the Test browser and choose one of the tests to run.

## To auhenticate manually

Supply Azure/GitHub credentials in *.env*.

## To use a stored auth session file

1. Run the following command in the repo root to generate *auth.json*:

    ```
    npx playwright codegen --save-storage=auth.json
    ```

1. In the pop-up browser, log into Azure portal and GitHub. Close the browser.

1. Above the Playwright script in *\*.spec.ts* (under */tests*), reference *auth.json*.

    ```
    test.use({ storageState: "auth.json" });
    ```