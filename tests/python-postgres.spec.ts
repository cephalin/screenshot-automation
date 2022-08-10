import { test } from '../lib/docsFixtures';
import '../lib/appServiceLibrary';
import { MenuOptions } from '../lib/appServiceLibrary';
import { DocsPageBase } from '../lib/DocsPageBase';
import { SearchType } from '../lib/AzurePortalPage';
import { expect } from '@playwright/test';

var appName = "msdocs-python-postgres-234";
var resourceGroupName = "msdocs-python-postgres-tutorial";
var region = "Central US";
var runtime = "Python 3.9";
var screenshotCreate1 = "azure-portal-create-app-cosmos-1";
var screenshotCreate2 = "azure-portal-create-app-cosmos-2";
var screenshotCreate3 = "azure-portal-create-app-cosmos-3";
var screenshotConnect1 = "azure-portal-get-connection-string-1";
var screenshotConnect2 = "azure-portal-get-connection-string-2";
var screenshotConnect3 = "azure-portal-get-connection-string-3";
var screenshotConnect4 = "azure-portal-get-connection-string-4";
var screenshotDeploy1 = "azure-portal-deploy-sample-code-1";
var screenshotDeploy2 = "azure-portal-deploy-sample-code-2";
var screenshotDeploy3 = "azure-portal-deploy-sample-code-3";
var screenshotDeploy4 = "azure-portal-deploy-sample-code-4";
var screenshotDeploy5 = "azure-portal-deploy-sample-code-5";
var screenshotDeploy6 = "azure-portal-deploy-sample-code-6";
var screenshotDeploy7 = "azure-portal-deploy-sample-code-7";
var screenshotMigrate1 = "azure-portal-generate-db-schema-1";
var screenshotMigrate2 = "azure-portal-generate-db-schema-2";
var screenshotBrowse1 = "azure-portal-browse-app-1";
var screenshotBrowse2 = "azure-portal-browse-app-2";
var screenshotLogs1 = "azure-portal-stream-diagnostic-logs-1";
var screenshotLogs2 = "azure-portal-stream-diagnostic-logs-2";
var screenshotKudu1 = "azure-portal-stream-diagnostic-kudu-1";
var screenshotKudu2 = "azure-portal-stream-diagnostic-kudu-2";
var screenshotKudu3 = "azure-portal-stream-diagnostic-kudu-3";
var screenshotKudu4 = "azure-portal-stream-diagnostic-kudu-4";
var screenshotKudu5 = "azure-portal-stream-diagnostic-kudu-5";
var screenshotClean = "azure-portal-clean-up-resources";

test.use({ viewport: { width: 780, height: 900 } });

test('tutorial-python-postgresql-app', async ({ azPage, githubPage }) => {

    // add to sensitive text list
    azPage.sensitiveStrings.push({searchString: 'lcephas', replacement: '&lt;github-alias&gt;'});
    githubPage.sensitiveStrings.push({searchString: 'vmagelo', replacement: 'somebody'});
    githubPage.sensitiveStrings.push({searchString: 'lcephas', replacement: '&lt;github-alias&gt;'});

    // // Create App+DB
    // await azPage.searchAndGo(SearchType.marketplace, "web app database", { itemText: "Web App + Database", screenshotName: screenshotCreate1});
    // await azPage.runAppDbCreateWizard('Visual Studio Enterprise Subscription', resourceGroupName, region, appName, runtime, screenshotCreate2);
    // await azPage.goToCreatedResource(screenshotCreate3);

    // debug
    await azPage.searchAndGo(SearchType.resources, appName, {resourceType: 'App Service'});

    // // Connection string
    // await azPage.goToAppServicePageByMenu(MenuOptions.configuration, screenshotConnect1);
    // await azPage.viewAppServiceAppSettings(screenshotConnect2);

    // // Deploy
    // await githubPage.createFork('https://github.com/Azure-Samples/msdocs-flask-postgresql-sample-app', screenshotDeploy1);
    // await githubPage.page.waitForLoadState();
    // await githubPage.openVSCode({screenshotName: screenshotDeploy2});
    // await githubPage.viewFileInVSC({
    //     filepath: 'azureproject/production.py', 
    //     regex: `((?<=\\[')DBUSER|(?<=\\[')DBPASS|(?<=\\[')DBHOST|(?<=\\[')DBNAME|(?<=os.environ\\[')WEBSITE_HOSTNAME)`,
    //     screenshotName: screenshotDeploy3
    // });

    await azPage.goToAppServicePageByMenu(MenuOptions.deploymentcenter, screenshotDeploy4);
    if(process.env.GITHUB_USER) {
        await azPage.configureGitHubActionsDeploy(process.env.GITHUB_USER, 'msdocs-flask-postgresql-sample-app', 'main', screenshotDeploy5);
    }

    const popupPage = await azPage.goToGitHubActionsLogs(screenshotDeploy6);
    popupPage.sensitiveStrings.push({searchString: 'vmagelo', replacement: 'somebody'});
    popupPage.sensitiveStrings.push({searchString: 'lcephas', replacement: '&lt;github-alias&gt;'});
    await popupPage.waitForActionRun({screenshotName: screenshotDeploy7});
    await popupPage.page.close();

    // Run DB migration in SSH
    const sshPage = await azPage.openSshShellToContainer({clickMenu: true, screenshotName: screenshotMigrate1});
    await sshPage.runSshShellCommands(
        [
            {command: 'flask db migrate', timeout: 10000}
        ],
        {
            width: 780,
            height: 500,
            screenshotName: screenshotMigrate2
        }
    );
    sshPage.page.close();
        
    // app needs time to restart
    await azPage.page.waitForTimeout(5000);

    // Browse to web app
    const [browse] = await azPage.browseAppServiceUrl(screenshotBrowse1);
    await browse.setViewportSize({ width: 780, height: 600 });
    await browse.locator('a[href="/create"]').click();
    await browse.locator('input#restaurant_name').fill('Contoso Restaurant');
    await browse.locator('button:text("Submit")').click();
    await browse.locator('button:text("Add new review")').click();
    await browse.locator('input[value="4"]').click();
    await browse.locator('button:text("Save changes")').click();
    await browse.locator('button:text("Add new review")').click();
    await browse.locator('input[value="4"]').click();
    await browse.locator('button:text("Save changes")').click();
    await browse.locator('button:text("Add new review")').click();
    await browse.locator('input[value="4"]').click();
    await browse.locator('button:text("Save changes")').click();
    await browse.locator('a[href="/"]').click();
    await browse.locator('a[href="/create"]').click();
    await browse.locator('input#restaurant_name').fill('Fourth Coffee');
    await browse.locator('button:text("Submit")').click();
    await browse.locator('button:text("Add new review")').click();
    await browse.locator('input[value="2"]').click();
    await browse.locator('button:text("Save changes")').click();
    await browse.locator('button:text("Add new review")').click();
    await browse.locator('input[value="2"]').click();
    await browse.locator('button:text("Save changes")').click();
    await browse.locator('a[href="/"]').click();
    await DocsPageBase.screenshotBigSmall (browse, azPage.screenshotDir, screenshotBrowse2);
    await browse.close();

    // Stream logs
    await azPage.enableAppServiceLinuxLogs(screenshotLogs1);
    await azPage.streamAppServiceLogs({
        searchStrings: ['Request for index page received'], 
        screenshotName: screenshotLogs2
    });

    // Delete resources
    await azPage.deleteResourceGroup(resourceGroupName, screenshotClean);
    await githubPage.deleteFork();
});