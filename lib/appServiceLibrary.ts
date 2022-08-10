/*****************************************************************************
 * Contains:
 * - App Service-specific extension methods for the AzurePortalPage class
 * - AppServiceScmPage class
 *****************************************************************************/
import { expect, Locator, Page } from '@playwright/test';
import { AppServiceScmPage } from './AppServiceScmPage';
import { AzurePortalPage } from './AzurePortalPage';
import { GitHubPage } from './GitHubPage';

// Common App Service menu selectors - not the full list
export enum MenuOptions {
    configuration = '[data-telemetryname="Menu-configuration"]',
    overview = '[data-telemetryname="Menu-appServices"]',
    deploymentcenter = '[data-telemetryname="Menu-vstscd"]',
    ssh = '[data-telemetryname="Menu-ssh"]',
    logsnative = '[data-telemetryname="Menu-appservicelogs"]',
    logstream = '[data-telemetryname="Menu-logStream"]',
    kudu = '[data-telemetryname="Menu-kudu"]'
}

declare module './AzurePortalPage' {
    interface AzurePortalPage {
    
        runAppDbCreateWizard (
            subscription: string,
            resourceGroupName: string,
            region: string,
            appName: string,
            stack: string, 
            screenshotName?: string
        ): Promise<void>;

        goToAppServicePageByMenu (
            option: MenuOptions,
            screenshotName?: string
        ): Promise<void>;

        newAppServiceSettingNoSave (
            name: string,
            value: string,
            screenshotName?: string
        ): Promise<void>;

        getAppServiceSetting (
            name: string,
            screenshotName?: string
        ): Promise<string>;

        newAppServiceConnectionStringNoSave (
            name: string,
            value: string,
            type: string,
            screenshotName?: string
        ): Promise<void>;

        getAppServiceConnectionString (
            name: string,
            screenshotName?: string
        ): Promise<{value: string, type: string}>;

        viewAppServiceAppSettings (
            screenshotName?: string
        ): Promise<void>;
        
        saveAppServiceConfigurationPage (
            screenshotName?: string
        ): Promise<void>;

        configureGitHubActionsDeploy (
            username: string,
            reponame: string,
            branch: string,
            screenshotName?: string
        ): Promise<void>;

        goToGitHubActionsLogs (
            screenshotName?: string
        ): Promise<GitHubPage>;

        openSshShellToContainer (options?: {
            clickMenu?: boolean,
            screenshotName?: string
        }): Promise<AppServiceScmPage>;

        openAppServiceKudu (options?: {
            clickMenu?: boolean,
            screenshotName?: string
        }): Promise<AppServiceScmPage>;

        goToAppServiceConfigurationGeneralSettings (
            screenshotName?: string
        ): Promise<void>;

        browseAppServiceUrl (
            screenshotName?: string
        ): Promise<[any, any]>;

        enableAppServiceLinuxLogs (
            screenshotName?: string
        ): Promise<void>;

        streamAppServiceLogs  (options?: {
            searchStrings?: string[],
            screenshotName?: string
        }): Promise<void>;
    }    
}

AzurePortalPage.prototype.newAppServiceSettingNoSave = async function (
    name: string,
    value: string,
    screenshotName?: string
): Promise<void> {

    if (!(this.page.url().startsWith(this.baseUrl))) {
        throw new Error('Page is no longer in Azure.');
    }

    var configurationFrame = this.page.frameLocator('[data-contenttitle="Configuration"] iframe');

    await configurationFrame.locator('button[name="New application setting"]').click();
    await configurationFrame.locator('input#app-settings-edit-name').fill(name);
    await configurationFrame.locator('input#app-settings-edit-value').fill(value);
  
    if(screenshotName){
        // DEBUG: manually blur
        await this.page.mouse.click(this.page.viewportSize()?.width / 2, 0);

        await this.screenshot({
            locator: this.page.locator('.fxs-blade-firstblade .fxs-blade-content-container-details'),
            height: 500, 
            highlightobjects: [
                configurationFrame.locator('button[name="New application setting"]'),
                configurationFrame.locator('.ms-TextField', {has: this.page.locator('input#app-settings-edit-name')}),
                configurationFrame.locator('.ms-TextField', {has: this.page.locator('input#app-settings-edit-value')}),
                configurationFrame.locator('button#app-settings-edit-footer-save')
            ], 
            name: screenshotName
        });    
    }
  
    await configurationFrame.locator('button#app-settings-edit-footer-save').click();
}

AzurePortalPage.prototype.getAppServiceSetting = async function (
    name: string,
    screenshotName?: string
): Promise<string> {
    return "";
}

const appServiceUrlRegEx = `\/resource\/subscriptions\/[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?\/resourceGroups\/[\\w-]*\/providers\/Microsoft.Web\/sites\/[\\w-]*`;

AzurePortalPage.prototype.viewAppServiceAppSettings = async function (
    screenshotName?: string
): Promise<void> {
    await this.page.waitForTimeout(5000);
    expect(this.page.url()).toMatch(new RegExp(`${appServiceUrlRegEx}\/configuration`));

    var configurationFrame = this.page.frameLocator('[data-contenttitle="Configuration"] iframe');
    // make sure we're in the application settings tab
    await configurationFrame.locator('#app-settings-application-settings-tab').click();

    if(screenshotName){
        // DEBUG: manually blur
        await this.page.mouse.click(this.page.viewportSize()?.width / 2, 0);

        await this.screenshot({
            locator: this.page.locator('.fxs-blade-firstblade .fxs-blade-content-container-details'),
            height: 700, 
            highlightobjects: [
                configurationFrame.locator("#app-settings-application-settings-table")
            ], 
            name: screenshotName
        });    
    }

}

AzurePortalPage.prototype.newAppServiceConnectionStringNoSave = async function (
    name: string,
    value: string,
    type: string,
    screenshotName?: string
): Promise<void> {

}

AzurePortalPage.prototype.getAppServiceConnectionString = async function(
    name: string,
    screenshotName?: string
): Promise<{value: string, type: string}> {

    var configurationFrame = this.page.frameLocator('[data-contenttitle="Configuration"] iframe');
    await configurationFrame.locator('#app-settings-connection-strings-table button#app-settings-connection-strings-name-0').click();

    if(screenshotName){
        // DEBUG: manually blur
        await this.page.mouse.click(this.page.viewportSize()?.width / 2, 0);

        await this.screenshot({
            locator: this.page.locator('.fxs-blade-firstblade .fxs-blade-content-container-details'),
            height: 500, 
            highlightobjects: [
                configurationFrame.locator('#app-settings-connection-strings-table button#app-settings-connection-strings-name-0'),
                configurationFrame.locator('#connection-strings-form-value-copy-button')
            ], 
            name: screenshotName
        });    
    }

    var value = await configurationFrame.locator('input#connection-strings-form-value').evaluate(el => el.value);
    var type = await configurationFrame.locator('[aria-labelledby="connection-strings-form-type-label"]').evaluate(el => el.innerText);

    await configurationFrame.locator('#connection-string-edit-footer-cancel').click();

    return {value, type};
}


AzurePortalPage.prototype.goToAppServicePageByMenu = async function(
    option: MenuOptions,
    screenshotName?: string
): Promise<void> {
    
    expect(this.page).toHaveURL(new RegExp(appServiceUrlRegEx), {timeout: 10000});

    var menuItem = this.page.locator(option);
    await expect (menuItem).toBeEnabled({timeout: 10000});
    await this.page.waitForTimeout(3000);

    if(screenshotName){
        // DEBUG: no need to blur
        await this.screenshot({
            locator: this.page.locator('.fxs-blade-display-in-journey .fxs-blade-content-container-default'),
            height: 500, 
            highlightobjects: [menuItem], 
            name: screenshotName
        });
    }

    await menuItem.click();
}

AzurePortalPage.prototype.saveAppServiceConfigurationPage = async function (
    screenshotName?: string
): Promise<void> {

    var configurationFrame = this.page.frameLocator('[data-contenttitle="Configuration"] iframe');

    //await configurationFrame.locator('#app-settings-application-settings-table').scrollIntoViewIfNeeded();

    if(screenshotName){
        // DEBUG: no need to blur 
        await this.screenshot({
            locator: this.page.locator('.fxs-blade-firstblade .fxs-blade-content-container-details'),
            height: 700, 
            highlightobjects: [
                configurationFrame.locator('button[data-cy="command-button-Save"]')
            ], 
            name: screenshotName
        });    
    }

    await configurationFrame.locator('button[data-cy="command-button-Save"]').click();
    await configurationFrame.locator('button', {has: this.page.locator('text=Continue')}).click();

    await this.clearNotification();
    await this.clearNotification("Successfully updated web app settings");
}

AzurePortalPage.prototype.runAppDbCreateWizard = async function(
    subscription: string, 
    resourceGroupName: string, 
    region: string, 
    appName: string, 
    stack: string, 
    screenshotName?: string | undefined
): Promise<void> {

    await this.page.locator('[aria-label="Subscription selector"]').click();
    await this.page.locator('div[role="treeitem"]:has-text("Visual Studio Enterprise Subscription")').click();
    await this.page.locator('text=Create new').click();
    await this.page.locator('[placeholder="Create new"]').click();
    await this.page.locator('[placeholder="Create new"]').fill(resourceGroupName);
    await this.page.locator('div[role="button"]:has-text("OK")').click();
    await this.page.locator('[aria-label="Location selector"]').click();
    await this.page.locator(`div[role="treeitem"]:has(:text-is("${region}"))`).waitFor({state: 'visible', timeout: 10000});
    await this.page.locator(`div[role="treeitem"]:has(:text-is("${region}"))`).click();
    await this.page.locator('[placeholder="Web App name\\."]').click();
    await this.page.locator('[placeholder="Web App name\\."]').fill(appName);
    await this.page.locator('text=Select a runtime stack').click();
    await this.page.locator(`div[role="treeitem"]:has(:text-is("${stack}"))`).click();
    await expect(this.page.locator('.fxc-validation')).toHaveCount(0, {timeout: 10000}); // wait for validation warnings to disappear

    if(screenshotName){
        var highlighted = [
            this.page.locator('.azc-formElementContainer', {has: this.page.locator('[aria-label="Subscription selector"]')}),
            this.page.locator('.azc-formElementContainer', {has: this.page.locator('[aria-label="Create new or use existing Resource group selector"]')}),
            this.page.locator('.azc-formElementContainer', {has: this.page.locator('[aria-label="Location selector"]')}),
            this.page.locator('.azc-formElementContainer', {has: this.page.locator('[aria-label="Web App name"]')}),
            this.page.locator('.azc-formElementContainer', {has: this.page.locator('[aria-label="Runtime stack selector"]')}),
            this.page.locator('.azc-formElementContainer', {has: this.page.locator('[aria-label="Location selector"]')}),
            this.page.locator('[aria-label="Review and create"]')
        ];

        // DEBUG: manually blur
        // await this.page.locator('.fxs-blade-title-titleText').last().click();
        await this.page.mouse.click(this.page.viewportSize()?.width / 2, 0);

        await this.screenshot({
            locator: this.page.locator('.fxs-journey-layout'),
            height: 900,
            highlightobjects: highlighted, 
            name: screenshotName
        });
    }

    await this.page.locator('[aria-label="Review and create"]').click();
    await this.page.locator('[aria-label="Create"]').click();
};

AzurePortalPage.prototype.configureGitHubActionsDeploy = async function (
    username: string,
    reponame: string,
    branch: string,
    screenshotName?: string
): Promise<void> {

    var deploymentFrame = await this.page.frameLocator('[data-contenttitle="Deployment Center"] iframe');
    await deploymentFrame.locator('span:has-text("")').click();
    await deploymentFrame.locator('button[role="option"]:has-text("GitHub")').click();

    // We must take screenshot earlier because the organization box is "sensitive content"
    // and you cannot freely manipulate it (data-bound)
    if(screenshotName){
        // HACK: put values in placeholder attribute for the screenshot
        deploymentFrame.locator('#deployment-center-settings-organization-option-input').evaluate(e => e.setAttribute('placeholder', '<github-alias>'));
        deploymentFrame.locator('#deployment-center-settings-repository-option-input').evaluate((e, reponame) => e.setAttribute('placeholder', reponame), reponame);
        deploymentFrame.locator('#deployment-center-settings-branch-option-input').evaluate((e, branch) => e.setAttribute('placeholder', branch), branch);

        // DEBUG: manually blur
        // await this.page.locator('.fxs-blade-title-titleText').last().click();
        await this.page.mouse.click(this.page.viewportSize()?.width / 2, 0);

        await this.screenshot({
            height: 1000, 
            highlightobjects: [
                deploymentFrame.locator('[aria-label="Source"]'),
                deploymentFrame.locator('#deployment-center-settings-organization-option'),
                deploymentFrame.locator('#deployment-center-settings-repository-option'),
                deploymentFrame.locator('#deployment-center-settings-branch-option'),
                deploymentFrame.locator('button[aria-label="Deployment center save command"]')
            ], 
            name: screenshotName
        });    
    }

    await deploymentFrame.locator('text=Organization* >> button[role="presentation"]').click();
    await deploymentFrame.locator(`button[role="option"]:has-text("${username}")`).click();
    await deploymentFrame.locator('text=Repository* >> button[role="presentation"]').click();
    await deploymentFrame.locator(`button[role="option"]:has-text("${reponame}")`).click();
    await deploymentFrame.locator('text=Branch* >> button[role="presentation"]').click();
    await deploymentFrame.locator(`button[role="option"]:has-text("${branch}")`).click();
  
    await deploymentFrame.locator('button[aria-label="Deployment center save command"]').click();
    await this.clearNotification("Successfully setup GitHub Action build and deployment pipeline.");  
}

AzurePortalPage.prototype.goToGitHubActionsLogs = async function (
    screenshotName?: string
): Promise<GitHubPage> {

    var deploymentFrame = await this.page.frameLocator('[data-contenttitle="Deployment Center"] iframe');

    await deploymentFrame.locator('[aria-label="Deployment center logs"]').click();
    await this.page.waitForTimeout(10000);
    await deploymentFrame.locator('[aria-label="Deployment center refresh command"]').click();
    await deploymentFrame.locator('button:has-text("Build/Deploy Logs")').first().click({trial: true});
  
    if(screenshotName){

        // DEBUG: no need to blur
        await this.screenshot({
            height: 500, 
            highlightobjects: [
                deploymentFrame.locator('button:has-text("Build/Deploy Logs")').first(),
                deploymentFrame.locator('[aria-label="Deployment center logs"]')
            ], 
            name: screenshotName
        });    
    }

    // Go to GitHub now. The button opens a new tab so we need to follow that.
    const [popup] = await Promise.all([
        this.page.waitForEvent('popup'),
        deploymentFrame.locator('button:has-text("Build/Deploy Logs")').first().click() // Opens a new tab
    ])
  
    let temp = new GitHubPage(popup, {repoUrl: (popup as Page).url().replace(/\/actions\/runs\/[0-9]+/, '') });
    temp.screenshotDir = this.screenshotDir; // TODO: not pretty. should fix
    return temp;
}

AzurePortalPage.prototype.openSshShellToContainer = async function (options?: {
    clickMenu?: boolean,
    screenshotName?: string
}): Promise<AppServiceScmPage> {

    options = options ? options : {};

    let highlighted: Locator[] = [];
    if(options.clickMenu) {
        await this.goToAppServicePageByMenu(MenuOptions.ssh);
        highlighted.push(this.page.locator(MenuOptions.ssh));
    }
    highlighted.push(this.page.locator('a[href*=".scm.azurewebsites.net/webssh/host"]').first());

    if(options.screenshotName){
        // DEBUG: no need to blur
        await this.screenshot({
            height: 500, 
            highlightobjects: highlighted, 
            name: options.screenshotName
        });    
    }

	const [popup] = await Promise.all([
		this.page.waitForEvent('popup'),
		this.page.locator('a[href*=".scm.azurewebsites.net/webssh/host"]').first().click() // Opens a new tab
	]);

    let temp = new AppServiceScmPage(popup);
    temp.screenshotDir = this.screenshotDir; // TODO: not pretty. should fix
    return temp;
}

AzurePortalPage.prototype.openAppServiceKudu = async function (options?: {
    clickMenu?: boolean,
    screenshotName?: string
}): Promise<AppServiceScmPage> {

    options = options ? options : {};

    let highlighted: Locator[] = [];
    if(options.clickMenu) {
        await this.goToAppServicePageByMenu(MenuOptions.kudu);
        highlighted.push(this.page.locator(MenuOptions.kudu));
    }
    highlighted.push(this.page.locator('a[href*=".scm.azurewebsites.net/"]').first());

    if(options.screenshotName){
        // DEBUG: no need to blur
        await this.screenshot({
            height: 500, 
            highlightobjects: highlighted, 
            name: options.screenshotName
        });    
    }

	const [popup] = await Promise.all([
		this.page.waitForEvent('popup'),
		this.page.locator('a[href*=".scm.azurewebsites.net/"]').first().click() // Opens a new tab
	]);

    let temp = new AppServiceScmPage(popup);
    temp.screenshotDir = this.screenshotDir; // TODO: not pretty. should fix
    return temp;
}

AzurePortalPage.prototype.goToAppServiceConfigurationGeneralSettings = async function (
    screenshotName?: string
): Promise<void> {
    
    this.goToAppServicePageByMenu(MenuOptions.configuration);

    const configurationFrame = this.page.frameLocator('[data-contenttitle="Configuration"] iframe');
    await configurationFrame.locator('button#app-settings-general-settings-tab').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  
    if(screenshotName){
        // DEBUG: no need to blur
        await this.screenshot({
            height: 500, 
            highlightobjects: [
                this.page.locator(MenuOptions.configuration),
                configurationFrame.locator('button#app-settings-general-settings-tab')
            ], 
            name: screenshotName
        });    
    }

    await configurationFrame.locator('button#app-settings-general-settings-tab').click();
}

AzurePortalPage.prototype.browseAppServiceUrl = async function (
    screenshotName?: string
): Promise<[any, any]> {

    await this.goToAppServicePageByMenu(MenuOptions.overview);
    await this.page.waitForTimeout(10000);

    // Remove sensitive information
    await this.page.locator('.fxc-essentials-label-container:has-text("Subscription ID") ~ .fxc-essentials-value-wrapper .fxc-essentials-value.fxs-portal-text')
            .evaluate(el => el.innerText = '00000000-0000-0000-0000-000000000000');
    await this.page.locator('.fxc-essentials-label-container:has-text("URL") ~ .fxc-essentials-value-wrapper').evaluateHandle(el => el.setAttribute("style", "border: 3px solid red !important;"));
  
    if(screenshotName){
        // DEBUG: no need to blur
        await this.screenshot({
            height: 500, 
            highlightobjects: [
                this.page.locator(MenuOptions.overview),
                this.page.locator('.fxc-essentials-label-container:has-text("URL") ~ .fxc-essentials-value-wrapper')
            ], 
            name: screenshotName
        });
    }
  
    return await Promise.all([
      this.page.waitForEvent('popup'),
      this.page.locator('.fxc-essentials-label-container:has-text("URL") ~ .fxc-essentials-value-wrapper').click() // Opens a new tab
    ]);
}

AzurePortalPage.prototype.enableAppServiceLinuxLogs = async function (
    screenshotName?: string
): Promise<void> {

    await this.goToAppServicePageByMenu(MenuOptions.logsnative);

    await this.page.locator('.fxs-blade-content-container-details .azc-optionPicker-item:has-text("File System")').click();

    if(screenshotName){
        // DEBUG: no need to blur
        await this.screenshot({
            height: 500, 
            highlightobjects: [
                this.page.locator(MenuOptions.logsnative),
                this.page.locator('.fxs-blade-content-container-details .azc-optionPicker-item:has-text("File System")'),
                this.page.locator(':has(> [aria-label="Save"])')
            ], 
            name: screenshotName
        });
    }
  
    await this.page.locator('[aria-label="Save"]').click();
    // get rid of notification window
    await this.clearNotification();
    await this.clearNotification("Successfully updated App Service logs settings");  
}

AzurePortalPage.prototype.streamAppServiceLogs = async function (options?: {
    searchStrings?: string[],
    screenshotName?: string
}): Promise<void> {

    await this.goToAppServicePageByMenu(MenuOptions.logstream);
    await this.page.waitForTimeout(10000); // wait for logs to show up

    let highlighted = [
        this.page.locator(MenuOptions.logstream)
    ];
    for (const s in options?.searchStrings) {
        const match = this.page.frameLocator('.fxs-blade-content-container-details-primary .fxs-part-frame').locator(':text("' + options?.searchStrings[s] + '")');
        const count = await match.count();
        await this.page.pause();
        for (var i = 0; i < count; i++) {
            highlighted.push(match.nth(i));
        }
    }

    if(options?.screenshotName){
        // DEBUG: no need to blur
        await this.screenshot({
            height: 500, 
            highlightobjects: highlighted, 
            name: options.screenshotName
        });
    }

}

