/*****************************************************************************
 * Contains:
 * - DocsPageBase class
 * - AzurePortalPage class
 *****************************************************************************/
import { Locator, Page, expect, TestInfo } from '@playwright/test';
import path from 'path';
import sharp from 'sharp';

// // Declare the types of your fixtures.
// type MyFixtures = {
//     azPage: AzurePortalPage;
//     githubPage: GitHubPage;
// };

// export const test = base.extend<MyFixtures>({
//     azPage: async ({ page }, use, testInfo) => {
//         // Set up the fixture.
//         if (!process.env.AZURE_HOME || !process.env.AZURE_USER || !process.env.AZURE_PASSWORD){
//             throw new Error("AZURE_HOME or AZURE_USER or AZURE_PASSWORD not specified. Be sure to define them in .env");
//         }
        
//         const azPage = new AzurePortalPage(page, process.env.AZURE_HOME);
//         azPage.screenshotDir = "screenshots/" + path.basename(testInfo.title, '.spec.js') + '/';
//         await azPage.signin(process.env.AZURE_USER, process.env.AZURE_PASSWORD);

//         // Use the fixture value in the test.
//         await use(azPage);

//         // Clean up the fixture. TODO: maybe remove a resource group
//         //await azPage.removeAll();
//     },
//     githubPage: async ({ page }, use, testInfo) => {
//         // Set up the fixture.
//         if (!process.env.GITHUB_USER || !process.env.GITHUB_PASSWORD){
//             throw new Error("GITHUB_USER or GITHUB_PASSWORD not specified. Be sure to define them in .env");
//         }
        
//         const githubPage = new GitHubPage(page);
//         if (process.env.GITHUB_REPO) {
//             githubPage.repoUrl = process.env.GITHUB_REPO;
//         }
//         githubPage.screenshotDir = "screenshots/" + path.basename(testInfo.title, '.spec.js') + '/';
//         await githubPage.signin(process.env.GITHUB_USER, process.env.GITHUB_PASSWORD);

//         // Use the fixture value in the test.
//         await use(githubPage);

//         // Clean up the fixture. TODO: maybe remove a resource group
//         //await azPage.removeAll();
//     },

// });

/*****************************************************************************
 * DocsPageBase class
 * - Base class for domain-specific pages
 * - Contains common screenshot routines
 *****************************************************************************/
export class DocsPageBase {
    page: Page;
    screenshotDir: string;

    constructor(page: Page, testInfo?: TestInfo ){
        this.page = page;
        if(testInfo) {
            this.screenshotDir = "screenshots/" + path.basename(testInfo.title, '.spec.js') + '/';
        } else {
            this.screenshotDir = '';
        }
    }

    /**
     * Augmented from (Page|Locator).screenshot to do the following:
     * - Capture both regular size and 240px wide images, optimized for the lightbox in docs
     * - Highlight objects in the viewport with an array of Locators
     * - Add the "Press ." image for GitHub scenario.
     *  
     * @param options 
     */
    async screenshot(options?: { 
		locator?: Locator | undefined,
		name?: string | undefined,
		width?: number | undefined,
		height?: number | undefined,
		highlightobjects?: Locator[] | undefined,
		blurAll?: boolean | undefined,
		pressenter?: boolean | undefined,
	} | undefined): Promise<void> {

		// set defaults
		options = options ? options : {};
		options.name = options.name ? options.name : "screenshot";
		options.width = options.width ? options.width : 780;
		options.height = options.height ? options.height : 700;
		options.blurAll = options.blurAll === undefined ? true : options.blurAll;
		options.pressenter = options.pressenter ? options.pressenter : false;

        await this.page.setViewportSize({ width: options.width, height: options.height });
                
        if(options.highlightobjects) {
            for (const obj of options.highlightobjects) {
                await obj.evaluate(el => {
					el.style.setProperty('border', '3px solid red', 'important');
				});
                await obj.scrollIntoViewIfNeeded();
            }
        }

        // // buggy
        // if (options.blurAll) {
        //     // click out of any focused element
        //     await this.page.locator(':focus').evaluate(el => {
        //         el.blur();
        //     }, undefined, {timeout: 1000});
        // }

        await DocsPageBase.screenshotBigSmall (
            options.locator ? options.locator : this.page,
            this.screenshotDir,
            options.name,
            options.pressenter
        );
    
        if(options.highlightobjects){
            for (const obj of options.highlightobjects) {
                await obj.evaluate(el => el.style.removeProperty('border'));
            }
        }
    }

    static async screenshotBigSmall(
        root: Page | Locator,
        screenshotDir: string,
        screenshotName: string,
        pressenter?: boolean
    ): Promise<void> {

		var pathandname = screenshotDir + screenshotName;

        if (pressenter) {
            var buffer = await root.screenshot();
            await sharp(buffer)
                .composite([{input: 'press-period.png', gravity: 'centre' }])
                .toFile(pathandname + '.png');    
        } else {
            await root.screenshot({path: pathandname + '.png'});
        }
        
        await sharp(pathandname + '.png')
              .resize({width: 240})
              .toFile(pathandname + '-240px.png');
    }
}

/*****************************************************************************
 * SearchType - search result categories in the Azure search box
 *****************************************************************************/
export enum SearchType {
    marketplace,
    services,
    resources,
    resourceGroups,
    documentation,
    aad
}

/*****************************************************************************
 * AzurePortalPage class
 * - Collects common tasks in the Azure portal
 *****************************************************************************/
export class AzurePortalPage extends DocsPageBase {
    baseUrl: string;

    constructor(page: Page, testInfo?: TestInfo){

        if(!process.env.AZURE_HOME){
            throw new Error('Please specify the following environment variables: AZURE_HOME.');
        }

		super(page, testInfo);
        this.baseUrl = process.env.AZURE_HOME;
    }

    async goToCreatedResource(screenshotName?: string | undefined): Promise<void> {

        if (!(this.page.url().startsWith(this.baseUrl))) {
            throw new Error('Page is no longer in Azure.');
        }

        // Make sure the button shows up.
        await this.page.locator('div[role="button"]:has-text("Go to resource")').first().click({trial: true});

        // DEBUG: nothing to blur
        if(screenshotName){
            await this.screenshot({
                locator: this.page.locator('.ext-hubs-deploymentdetails-main-left'),
                height: 900, 
                highlightobjects: [
					this.page.locator('.ext-hubs-deploymentdetails-main-left .fxc-simplebutton', {has: this.page.locator('div[role="button"]:has-text("Go to resource")')})
				], 
                name: screenshotName
            });
        }

        // Proceed to app management page
        await this.clearNotification();
        await this.page.locator('.ext-hubs-deploymentdetails-main-left div[role="button"]:has-text("Go to resource")').click();
    }

    async searchAndGo(type: SearchType, searchString: string, options?: {itemText?: string | undefined, resourceType?: string | undefined, screenshotName?: string | undefined} | undefined): Promise<void> {
        
		options = options ? options : {};
		options.itemText = options.itemText ? options.itemText : searchString;

        var typeSelector = '';
        switch (type) {
            case SearchType.marketplace:
                typeSelector = 'ul[aria-label="Marketplace"]';
                break;
            case SearchType.services:
                typeSelector = 'ul[aria-label="Services"]';
                break;
            case SearchType.resources:
                typeSelector = 'ul[aria-label="Resources"]';
                break;
            case SearchType.resourceGroups:
                typeSelector = 'ul[aria-label="Resource Groups"]';
                break;
            case SearchType.documentation:
                typeSelector = 'ul[aria-label="Documentation"]';
                break;
            case SearchType.aad:
                typeSelector = 'ul[aria-label="Azure Active Directory"]';
                break;
            default:
                throw new Error("Unexpected search type error!");
        }

        // Use default Azure portal page as clean background
        await this.page.locator('.fxs-topbar-home[href="#home"]').click();
        
        var searchBoxSelector = '.fxs-search.fxs-topbar-search input';
        // somehow we need the select the .fxs-menu-result-details element or else the border gets cut off.
		if (type == SearchType.resources) {
			var searchedItemSelector = `.fxs-search.fxs-topbar-search ${typeSelector} .fxs-menu-result-details:has(.fxs-menu-result-name:text-is("${options.itemText}")):has(.fxs-menu-result-type:text-is("${options.resourceType}"))`;
		} else {
			var searchedItemSelector = `.fxs-search.fxs-topbar-search ${typeSelector} .fxs-menu-result-details:has(.fxs-menu-result-name:text-is("${options.itemText}"))`;
		}
        await this.page.locator(searchBoxSelector).click();
        await this.page.locator(searchBoxSelector).type(searchString);
        await this.page.locator(searchedItemSelector).waitFor();

        // DEBUG: should not blur as it removes the search dialog
        if(options.screenshotName) {
            await this.screenshot({
				width: 780, 
				height: 400, 
				highlightobjects: [
					this.page.locator('.fxs-search'),
					this.page.locator(searchedItemSelector)
				], 
                blurAll: false,
				name: options.screenshotName
			});
        }
    
        await this.page.locator(searchedItemSelector).click();
    }

    async signin (): Promise<void> {

        if(!process.env.AZURE_HOME || !process.env.AZURE_USER || !process.env.AZURE_PASSWORD){
            throw new Error('Please specify the following environment variables: AZURE_USER, AZURE_PASSWORD.');
        }

        await this.page.goto(this.baseUrl);
        await this.page.locator('[placeholder="Email\\, phone\\, or Skype"]').click();
        await this.page.locator('[placeholder="Email\\, phone\\, or Skype"]').type(process.env.AZURE_USER);
        await this.page.locator('text=Next').click();
        await this.page.locator('[placeholder="Password"]').click();
        await this.page.locator('[placeholder="Password"]').type(process.env.AZURE_PASSWORD);
        await this.page.locator('input:has-text("Sign in")').click();
        await this.page.locator('text=Yes').click();
        await expect(this.page).toHaveURL( new RegExp(`^${this.baseUrl}`) );
        await this.clearNotification(); // get rid of the default notification
    }
    
    async clearNotification(message?: string | undefined): Promise<void> {

        if (!(this.page.url().startsWith(this.baseUrl))) {
            throw new Error('Page is no longer in Azure.');
        }

        if (!message) {
            await this.page.locator('[aria-label="Dismiss toast notification"]').click();
        } else {
            await this.page.locator('.fxs-toast-item.fxs-popup:has-text("' + message + '")').waitFor();
            await this.page.locator('[aria-label="Dismiss toast notification"]').click();    
        }
    }

    async deleteResourceGroup (name: string, screenshotPrefix?: string): Promise<void> {

        // Step 1
        await this.searchAndGo(
            SearchType.resourceGroups, 
            name, 
            { screenshotName: screenshotPrefix ? `${screenshotPrefix}-1`: undefined }
        );

        // Step 2
        await this.page.waitForTimeout(10000);

        // Remove sensitive information
        await this.page.locator('.fxc-essentials-label-container:has-text("Subscription ID") ~ .fxc-essentials-value-wrapper .fxc-essentials-value.fxs-portal-text')
                .evaluate(el => (el as HTMLElement).innerText = '00000000-0000-0000-0000-000000000000');
    
        if (screenshotPrefix) {
            // DEBUG: nothing to blur
            await this.screenshot({
                locator: this.page.locator('.fxs-blade-firstblade .fxs-blade-content-container-details'),
                width: 780, 
                height: 500, 
                highlightobjects: [
                    this.page.locator('li[title="Delete resource group"]')
                ], 
                name: `${screenshotPrefix}-2`
            });    
        }
      
        await this.page.locator('li[title="Delete resource group"]').click();


        // Step 3
        await this.page.locator('[aria-label="Type the resource group name:"]').fill(name);
        await this.page.locator('.fxs-button[title="Delete"]').click({trial: true});

        if (screenshotPrefix) {
            // DEBUG: manually blur
            this.page.locator('.ext-warning-text.msportalfx-text-regular').click({timeout: 1000});

            await this.screenshot({
                locator: this.page.locator('.fxs-contextpane.fxs-portal-contextpane-right'),
                width: 780, 
                height: 500, 
                highlightobjects: [
                    this.page.locator('[aria-label="Type the resource group name:"]'),
                    this.page.locator('.fxs-button[title="Delete"]')
                ], 
                name: `${screenshotPrefix}-3`
            });    
        }

        // Fire and forget
        await this.page.locator('.fxs-button[title="Delete"]').click();
        await this.clearNotification();
    }
}

/*****************************************************************************
 * GitHubPage class
 * - Collects common tasks on the GitHub site
 *****************************************************************************/
export class GitHubPage extends DocsPageBase {
    repoUrl: string;

    constructor(page: Page, options?: {testInfo?: TestInfo, repoUrl?: string}){
        super(page, options?.testInfo);
        if(options?.repoUrl) {
            this.repoUrl = options?.repoUrl;
        }
    }

    async signin (): Promise<void> {

        if(!process.env.GITHUB_USER || !process.env.GITHUB_PASSWORD){
            throw new Error('Please specify the following environment variables: GITHUB_USER, GITHUB_PASSWORD.');
        }

        await this.page.goto('https://github.com/login');
        await expect(this.page).toHaveURL('https://github.com/login');
        await this.page.locator('input[name="login"]').click();
        await this.page.locator('input[name="login"]').type(process.env.GITHUB_USER);
        await this.page.locator('input[name="password"]').click();
        await this.page.locator('input[name="password"]').type(process.env.GITHUB_PASSWORD); 
        await this.page.locator('input:has-text("Sign in")').click();      
    }

    async createFork(repo: string, screenshotName?: string): Promise<void> {

        await this.page.goto(repo);

        var forkButtonSelector = `a[href="${repo.replace('https://github.com', '').replace(/\/$/, "")}/fork"]`; 

        // DEBUG: nothing to blur 
        if(screenshotName) { 
            await this.screenshot({
				width: 780, 
				height: 500, 
				highlightobjects: [
					this.page.locator(forkButtonSelector)
				], 
				name: screenshotName
			});
        }

        await this.page.locator(forkButtonSelector).click();
        await expect(this.page).toHaveURL(repo + '/fork');
        await this.page.locator('text=Create fork').click();

        if(process.env.GITHUB_USER) {
            var forkUrl = `https://github.com/${process.env.GITHUB_USER}/${repo.split('/').filter(Boolean).pop()}`;
            await expect(this.page).toHaveURL(forkUrl);
            this.repoUrl = forkUrl;
        }
    }

    async cancelWorkflow (screenshotName?: string): Promise<void> {
        
        if(screenshotName) {
            // DEBUG: nothing to blur
            await this.screenshot({
				width: 780, 
				height: 500, 
				highlightobjects: [
					this.page.locator('button.btn-danger:has-text("Cancel workflow")')
				], 
				name: screenshotName
			});
        }

        await this.page.locator('button.btn-danger:has-text("Cancel workflow")').click();
    }

    async openVSCode (options?: {clickCodeTab?: boolean, screenshotName?: string}): Promise<void> {

        options = options ? options : {};

        if(!this.repoUrl) {
            throw new Error('repoUrl is empty.')            
        }
        let highlighted: Locator[] = [];

        await this.page.goto(this.repoUrl);

        if(options.clickCodeTab) {
            highlighted.push(this.page.locator('#code-tab'));
            await this.page.locator('#code-tab').click();
        }

        // DEBUG: nothing to blur
        if(options.screenshotName) {
            await this.screenshot({
				height: 500, 
				highlightobjects: highlighted,
                pressenter: true,
				name: options.screenshotName
			});
        }

        await this.page.locator('body').press('.');
        await expect(this.page).toHaveURL(this.repoUrl.replace('github.com', 'github.dev'));
    }

    async openFileInVSC(filepath: string): Promise<{cleanSelector: string, dirtySelector: string}> {
        var selectpath = (new URL(this.repoUrl)).pathname.replace(/^\/|\/$/g, '');
        var parts = filepath.split('/').filter(Boolean);
        var file = parts.pop();

        for (const p of parts) {
            selectpath += '/' + p;
            await this.page.locator(`[id="workbench.parts.sidebar"] .pane-body .monaco-icon-label.folder-icon[title="${selectpath}"]`).click();
        }

        var fileSelector = `[id="workbench.parts.sidebar"] .pane-body .monaco-icon-label.file-icon[title^="${selectpath}/${file}"] .monaco-icon-name-container`;
        await this.page.locator(fileSelector).click();

        return {
            cleanSelector: fileSelector, 
            dirtySelector: `[id="workbench.parts.sidebar"] .pane-body .monaco-icon-label.file-icon[title^="${selectpath}/${file} • Modified"] .monaco-icon-name-container`
        };
    }

    /**
     * Functionality is very limited:
     * - Can choose to open a file first or not
     * - Modifies on a per-line bases
     * - Replacement line must be unique within the viewable window
     * - Can only highlight at the line level, can't exclude leading spaces, can't highlight block of lines, can't highlight line deletions
     * - Screenshot routine cannot highlight anything that's not within the immediate view of the window.
     * 
     * @param replaceSet 
     * @param options 
     */
    async viewOrModifyFileInVSC(options?: {filepath?: string, searchOrReplace?: {searchLine: string, replaceLine?: string}[], screenshotName?: string}): Promise<void> {

        options = options ? options : {};

        var fileSelectors;
        if(options.filepath) {
            fileSelectors = await this.openFileInVSC(options.filepath);
        }

        await this.page.locator('[id="workbench.parts.editor"] .editor-container .view-lines').click();
        await this.page.waitForTimeout(2000); // The FIND fastkey doesn't work without this wait

        var highlighted: Locator[] = [];

        var isDirty = false;

        if(options.searchOrReplace) {
            for (const r of options.searchOrReplace) {
                await this.page.locator('html').press('Control+f'); //(Window/Linux is Control+f)
                await this.page.locator('[aria-label="Find"]').fill(r.searchLine);
                await this.page.locator('[aria-label="Find"]').press('Enter');
                await this.page.locator('[aria-label="Close \\(Escape\\)"]').click();
                if(r.replaceLine) {
                    isDirty = true;
                    await this.typeInCodeEditor(r.replaceLine);
                    highlighted.push(this.page.locator(`div.view-line span:has-text("${r.replaceLine}")`));
                } else {
                    await this.page.locator('[id="workbench.parts.editor"] .editor-container .view-lines').click();
                } // no highlight for search. it's only for getting desired text to show up in the editor.
            }    
        }
      
        // CSS changed on the file node after modification so select it now
        if(options.filepath && options.searchOrReplace && isDirty) {
            highlighted.push(this.page.locator(fileSelectors.dirtySelector));
        } else {
            highlighted.push(this.page.locator(fileSelectors.cleanSelector));
        }

        // DEBUG: nothing to blur
        if(options.screenshotName) {
            await this.screenshot({
                width: 1200,
				height: 700, 
				highlightobjects: highlighted,
				name: options.screenshotName
			});
        }
    }

    private async typeInCodeEditor(code: string) {

        for (var i = 0; i < code.length; i++) {
            await this.page.keyboard.press(code.charAt(i));
        }  
    }

    async commitAllChangesInVSC(message: string, screenshotName?: string): Promise<void> {

        await this.page.locator('[id="workbench\.parts\.activitybar"] .action-item[aria-label^="Source Control (Ctrl+Shift+G)"]').click();
        await this.page.locator('[aria-label="Source Control Input"] .monaco-editor').click();
        await this.page.locator('[aria-label="Source Control Input"] .monaco-editor').type(message);
        await this.page.locator('text=Don\'t show again').click();      

        // DEBUG: manually blur
        await this.page.locator('[id="workbench.parts.editor"] .editor-container .view-lines').click();

        if(screenshotName) {
            await this.screenshot({
                width: 1200,
				height: 700, 
				highlightobjects: [
                    this.page.locator('[id="workbench\.parts\.activitybar"] .action-item[aria-label^="Source Control (Ctrl+Shift+G)"]'),
                    this.page.locator('[aria-label="Source Control Input"] .monaco-editor'),
                    this.page.locator('.composite.title [aria-label="Commit and Push"]')
                ],
				name: screenshotName
			});
        }

        await this.page.locator('.composite.title [aria-label="Commit and Push"]').click();
        await this.page.waitForTimeout(5000); // make sure commit finishes. need a better way to do this
    }

    async waitForActionRun(options?: {message?: string, screenshotName?: string}): Promise<void> {

        options = options ? options : {};

        if(!this.repoUrl) {
            throw new Error('repoUrl is empty.')            
        }
    
        var actionsUrl = `${this.repoUrl}/actions`;

        // Right now just go there directly if not already there.
        if(!this.page.url().startsWith(`${actionsUrl}/runs/`) && !options.message) {
            await this.page.goto(actionsUrl);
            await this.page.locator(`a:has-text("${options.message}")`).first().click();
            await this.page.waitForTimeout(3000);
        }

        if(options.screenshotName) {
            // DEBUG: nothing to blur
            await this.screenshot({
				height: 500, 
				name: options.screenshotName
			});
        }

        // while(await this.page.locator('button.btn-danger:has-text("Cancel workflow")').isVisible()) {
        //     await this.page.waitForTimeout(10000);
        // };
        await this.page.locator('summary.btn[role="button"]:has-text("Re-run all jobs")').click({trial: true});
    }

    async deleteFork() {
        await this.page.goto(`${this.repoUrl}/settings`);
        await this.page.locator('summary.btn-danger:has-text("Delete this repository")').click();
        await this.page.locator('[aria-label="Type in the name of the repository to confirm that you want to delete this repository."]').fill((new URL(this.repoUrl).pathname.substring(1)));
        await this.page.locator('button.btn-danger.btn.btn-block:has-text("Delete this repository")').click();      
    }
}

