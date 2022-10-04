/*****************************************************************************
 * Contains:
 * - App Service-specific extension methods for the AzurePortalPage class
 * - AppServiceScmPage class
 *****************************************************************************/
import { expect, Locator, Page } from '@playwright/test';
import { AppServiceScmPage } from './AppServiceScmPage';
import { AzurePortalPageChinese } from './AzurePortalPageChinese';
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

declare module './AzurePortalPageChinese' {
    interface AzurePortalPageChinese {
    
        runAppDbCreateWizard (
            subscription: string,
            resourceGroupName: string,
            region: string,
            appName: string,
            stack: string, 
            options?: {
                screenshotName?: string
                sku?: "Basic" | "Standard"
            }
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

AzurePortalPageChinese.prototype.newAppServiceSettingNoSave = async function (
    name: string,
    value: string,
    screenshotName?: string
): Promise<void> {

    if (!(this.page.url().startsWith(this.baseUrl))) {
        throw new Error('Page is no longer in Azure.');
    }

    var configurationFrame = this.page.frameLocator('[data-extensionname="WebsitesExtension"] iframe'); // CN

    await configurationFrame.locator('button[name="新应用程序设置"]').click();
    await configurationFrame.locator('input#app-settings-edit-name').fill(name);
    await configurationFrame.locator('input#app-settings-edit-value').fill(value);
  
    if(screenshotName){
        // DEBUG: manually blur
        await this.page.mouse.click(this.page.viewportSize()?.width / 2, 0);

        await this.screenshot({
            locator: this.page.locator('.fxs-blade-firstblade .fxs-blade-content-container-details'),
            height: 500, 
            highlightobjects: [
                configurationFrame.locator('button[name="新应用程序设置"]'),
                configurationFrame.locator('.ms-TextField', {has: this.page.locator('input#app-settings-edit-name')}),
                configurationFrame.locator('.ms-TextField', {has: this.page.locator('input#app-settings-edit-value')}),
                configurationFrame.locator('button#app-settings-edit-footer-save')
            ], 
            name: screenshotName
        });    
    }
  
    await configurationFrame.locator('button#app-settings-edit-footer-save').click();
}

AzurePortalPageChinese.prototype.getAppServiceSetting = async function (
    name: string,
    screenshotName?: string
): Promise<string> {
    return "";
}

const appServiceUrlRegEx = `\/resource\/subscriptions\/[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?\/resourcegroups\/[\\w-]*\/providers\/Microsoft.Web\/sites\/[\\w-]*`;

AzurePortalPageChinese.prototype.viewAppServiceAppSettings = async function (
    screenshotName?: string
): Promise<void> {
    await this.page.waitForTimeout(5000);
    expect(this.page.url()).toMatch(new RegExp(`${appServiceUrlRegEx}\/configuration`, 'i'));

    var configurationFrame = this.page.frameLocator('[data-extensionname="WebsitesExtension"] iframe'); 
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

AzurePortalPageChinese.prototype.newAppServiceConnectionStringNoSave = async function (
    name: string,
    value: string,
    type: string,
    screenshotName?: string
): Promise<void> {

}

AzurePortalPageChinese.prototype.getAppServiceConnectionString = async function(
    name: string,
    screenshotName?: string
): Promise<{value: string, type: string}> {

    var configurationFrame = this.page.frameLocator('[data-extensionname="WebsitesExtension"] iframe'); 
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


AzurePortalPageChinese.prototype.goToAppServicePageByMenu = async function(
    option: MenuOptions,
    screenshotName?: string
): Promise<void> {
    
    await expect(this.page).toHaveURL(new RegExp(appServiceUrlRegEx, 'i'), {timeout: 10000}); // CN

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

AzurePortalPageChinese.prototype.saveAppServiceConfigurationPage = async function (
    screenshotName?: string
): Promise<void> {

    var configurationFrame = this.page.frameLocator('[data-extensionname="WebsitesExtension"] iframe'); 

    //await configurationFrame.locator('#app-settings-application-settings-table').scrollIntoViewIfNeeded();

    if(screenshotName){
        // DEBUG: no need to blur 
        await this.screenshot({
            locator: this.page.locator('.fxs-blade-firstblade .fxs-blade-content-container-details'),
            height: 700, 
            highlightobjects: [
                configurationFrame.locator('button[data-cy="command-button-保存"]')
            ], 
            name: screenshotName
        });    
    }

    await configurationFrame.locator('button[data-cy="command-button-保存"]').click();
    await configurationFrame.locator('button', {has: this.page.locator('text=继续')}).click();

    await this.clearNotification();
    await this.clearNotification("已成功更新 Web 应用设置");
}

AzurePortalPageChinese.prototype.runAppDbCreateWizard = async function(
    subscription: string, 
    resourceGroupName: string, 
    region: string, 
    appName: string, 
    stack: string,
    options?: {
        screenshotName?: string
        sku?: "Basic" | "Standard"
    }
): Promise<void> {

    await this.page.locator('[aria-label="订阅选择器"]').click();
    await this.page.locator('.azc-formElementContainer:has([aria-label="订阅选择器"]) input').type(subscription);
    await this.page.locator(`div[role="treeitem"]:has-text("${subscription}")`).click();
    await this.page.locator('text=新建').click();
    await this.page.locator('[placeholder="新建"]').click();
    await this.page.locator('[placeholder="新建"]').fill(resourceGroupName);
    await this.page.locator('div[role="button"]:has-text("确定")').click();
    await this.page.locator('[aria-label="位置选择器"]').click();
    await this.page.locator('.azc-formElementContainer:has([aria-label="位置选择器"]) input').type(region);
    await this.page.locator(`div[role="treeitem"]:has(:text-is("${region}"))`).waitFor({state: 'visible', timeout: 10000});
    await this.page.locator(`div[role="treeitem"]:has(:text-is("${region}"))`).click();
    await this.page.locator('[placeholder="Web 应用名称。"]').click();
    await this.page.locator('[placeholder="Web 应用名称。"]').fill(appName);
    await this.page.locator('text=选择运行时堆栈').click();
    await this.page.locator(`div[role="treeitem"]:has(:text-is("${stack}"))`).click();
    if(options?.sku == "Basic") {
        await this.page.locator(`ul[aria-label="Web 数据库托管计划"] input[value="basic"] + .azc-radio-circle`).click();
    }
    await expect(this.page.locator('.fxc-validation')).toHaveCount(0, {timeout: 10000}); // wait for validation warnings to disappear

    if(options?.screenshotName){
        var highlighted = [
            this.page.locator('.azc-formElementContainer', {has: this.page.locator('[aria-label="订阅选择器"]')}),
            this.page.locator('.azc-formElementContainer', {has: this.page.locator('[aria-label="创建新的或使用现有的“资源组选择器”"]')}),
            this.page.locator('.azc-formElementContainer', {has: this.page.locator('[aria-label="位置选择器"]')}),
            this.page.locator('.azc-formElementContainer', {has: this.page.locator('[aria-label="Web 应用名称"]')}),
            this.page.locator('.azc-formElementContainer', {has: this.page.locator('[aria-label="运行时堆栈选择器"]')}),
            this.page.locator('[aria-label="审阅并创建"]')
        ];
        if(options?.sku == "Basic") {
            highlighted.push(this.page.locator(`ul[aria-label="Web 数据库托管计划"] input[value="basic"] + .azc-radio-circle`));
        }

        // DEBUG: manually blur
        // await this.page.locator('.fxs-blade-title-titleText').last().click();
        await this.page.mouse.click(this.page.viewportSize()?.width / 2, 0);

        await this.screenshot({
            locator: this.page.locator('.fxs-journey-layout'),
            height: 1100,
            highlightobjects: highlighted, 
            name: options.screenshotName
        });
    }

    await this.page.locator('[aria-label="审阅并创建"]').click();
    await this.page.locator('[aria-label="创建"]').click();
};

AzurePortalPageChinese.prototype.configureGitHubActionsDeploy = async function (
    username: string,
    reponame: string,
    branch: string,
    screenshotName?: string
): Promise<void> {

    var deploymentFrame = await this.page.frameLocator('[data-extensionname="WebsitesExtension"] iframe'); 
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
                deploymentFrame.locator('[aria-label="源"]'),
                deploymentFrame.locator('#deployment-center-settings-organization-option'),
                deploymentFrame.locator('#deployment-center-settings-repository-option'),
                deploymentFrame.locator('#deployment-center-settings-branch-option'),
                deploymentFrame.locator('button[aria-label="部署中心保存命令"]')
            ], 
            name: screenshotName
        });    
    }

    await deploymentFrame.locator('#deployment-center-settings-organization-option button').click();
    await deploymentFrame.locator(`button[role="option"]:has-text("${username}")`).click();
    await deploymentFrame.locator('#deployment-center-settings-repository-option button').click();
    await deploymentFrame.locator(`button[role="option"]:has-text("${reponame}")`).click();
    await deploymentFrame.locator('#deployment-center-settings-branch-option button').click();
    await deploymentFrame.locator(`button[role="option"]:has-text("${branch}")`).click();
  
    await deploymentFrame.locator('button[aria-label="部署中心保存命令"]').click();
    await this.clearNotification("已成功设置 GitHub 操作生成和部署管道。");  
}

AzurePortalPageChinese.prototype.goToGitHubActionsLogs = async function (
    screenshotName?: string
): Promise<GitHubPage> {

    var deploymentFrame = await this.page.frameLocator('[data-extensionname="WebsitesExtension"] iframe'); 

    await deploymentFrame.locator('[aria-label="部署中心日志"]').click();
    await this.page.waitForTimeout(10000);
    await deploymentFrame.locator('[aria-label="部署中心刷新命令"]').click();
    await deploymentFrame.locator('button:has-text("生成/部署日志")').first().click({trial: true});
  
    if(screenshotName){

        // DEBUG: no need to blur
        await this.screenshot({
            height: 500, 
            highlightobjects: [
                deploymentFrame.locator('button:has-text("生成/部署日志")').first(),
                deploymentFrame.locator('[aria-label="部署中心日志"]')
            ], 
            name: screenshotName
        });    
    }

    // Go to GitHub now. The button opens a new tab so we need to follow that.
    const [popup] = await Promise.all([
        this.page.waitForEvent('popup'),
        deploymentFrame.locator('button:has-text("生成/部署日志")').first().click() // Opens a new tab
    ])
  
    let temp = new GitHubPage(popup, {repoUrl: (popup as Page).url().replace(/\/actions\/runs\/[0-9]+/, '') });
    temp.screenshotDir = this.screenshotDir; // TODO: not pretty. should fix
    return temp;
}

AzurePortalPageChinese.prototype.openSshShellToContainer = async function (options?: {
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

AzurePortalPageChinese.prototype.openAppServiceKudu = async function (options?: {
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
    await temp.page.waitForLoadState();
    await expect(temp.page.url()).toMatch(/https:\/\/.*\.scm\.azurewebsites\.net/);
    temp.rootUrl = temp.page.url();
    return temp;
}

AzurePortalPageChinese.prototype.goToAppServiceConfigurationGeneralSettings = async function (
    screenshotName?: string
): Promise<void> {
    
    this.goToAppServicePageByMenu(MenuOptions.configuration);

    var configurationFrame = this.page.frameLocator('[data-extensionname="WebsitesExtension"] iframe'); 
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

AzurePortalPageChinese.prototype.browseAppServiceUrl = async function (
    screenshotName?: string
): Promise<[any, any]> {

    await this.goToAppServicePageByMenu(MenuOptions.overview);
    await this.page.waitForTimeout(10000);

    // Remove sensitive information
    await this.page.locator('.fxc-essentials-label-container:has-text("订阅 ID") ~ .fxc-essentials-value-wrapper .fxc-essentials-value.fxs-portal-text')
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

AzurePortalPageChinese.prototype.enableAppServiceLinuxLogs = async function (
    screenshotName?: string
): Promise<void> {

    await this.goToAppServicePageByMenu(MenuOptions.logsnative);

    await this.page.locator('.fxs-blade-content-container-details .azc-optionPicker-item:has-text("文件系统")').click();

    if(screenshotName){
        // DEBUG: no need to blur
        await this.screenshot({
            height: 500, 
            highlightobjects: [
                this.page.locator(MenuOptions.logsnative),
                this.page.locator('.fxs-blade-content-container-details .azc-optionPicker-item:has-text("文件系统")'),
                this.page.locator(':has(> [aria-label="保存"])')
            ], 
            name: screenshotName
        });
    }
  
    await this.page.locator('[aria-label="保存"]').click();
    // get rid of notification window
    await this.clearNotification();
    await this.clearNotification("已成功更新应用服务日志设置");  
}

AzurePortalPageChinese.prototype.streamAppServiceLogs = async function (options?: {
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

