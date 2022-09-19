import { expect, Locator, Page, TestInfo } from "@playwright/test";
import { DocsPageBase } from "./DocsPageBase";
import fs from "fs";
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
        await this.clearNotification();

        // DEBUG: nothing to blur
        if(screenshotName){
            await this.screenshot({
                locator: this.page.locator('.ext-hubs-deploymentdetails-content'),
                height: 500, 
                width: 1050,
                highlightobjects: [
					this.page.locator('.ext-hubs-deploymentdetails-main-left .fxc-simplebutton', {has: this.page.locator('div[role="button"]:has-text("Go to resource")')})
				], 
                name: screenshotName
            });
        }

        // Proceed to app management page
        await this.page.locator('.ext-hubs-deploymentdetails-main-left div[role="button"]:has-text("Go to resource")').click();
        await this.page.waitForLoadState();
    }

    async searchAndGo(type: SearchType, searchString: string, options?: {itemText?: string | undefined, resourceType?: string | undefined, screenshotName?: string | undefined, clean?: boolean, dontGo?: boolean, otherHighlights?: Locator[]} | undefined): Promise<void> {
        
		options = options ? options : {};
		options.itemText = options.itemText ? options.itemText : searchString;
        options.clean = options.clean === undefined ? true : false; // default to true

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
        if(options.clean) {
            await this.page.locator('.fxs-topbar-home[href="#home"]').click();
        }
        
        var searchBoxSelector = '.fxs-search.fxs-topbar-search input';
        // somehow we need the select the .fxs-menu-result-details element or else the border gets cut off.
		if (type == SearchType.resources) {
			var searchedItemSelector = `.fxs-search.fxs-topbar-search ${typeSelector} .fxs-menu-result-details:has(.fxs-menu-result-name:text-is("${options.itemText}")):has(.fxs-menu-result-type:text-is("${options.resourceType}"))`;
		} else {
			var searchedItemSelector = `.fxs-search.fxs-topbar-search ${typeSelector} .fxs-menu-result-details:has(.fxs-menu-result-name:text-is("${options.itemText}"))`;
		}
        await this.page.locator(searchBoxSelector).click();
        await this.page.locator(searchBoxSelector).type(searchString, {delay: 50});
        //await this.page.waitForTimeout(1000);
        await this.page.locator(searchedItemSelector).waitFor();

        // DEBUG: should not blur as it removes the search dialog
        let highlighted = [
            this.page.locator('.fxs-search'),
            this.page.locator(searchedItemSelector)
        ];
        if(options.otherHighlights) {
            highlighted = highlighted.concat(options.otherHighlights);
        }
        if(options.screenshotName) {
            await this.screenshot({
				width: 780, 
				height: 400, 
				highlightobjects: highlighted, 
                blurAll: false,
				name: options.screenshotName
			});
        }
    
        if(options?.dontGo) {
            let width = this.page.viewportSize()?.width;
            if(width) {
                await this.page.mouse.click( width / 2, 0);
            }
        } else {
            await this.page.locator(searchedItemSelector).click();
            await this.page.waitForTimeout(3000);
        }
    }

    async signin (): Promise<void> {

        // Use stored authentication session if saved.
        // Run "npx playwright codegen --save-storage=auth.json" to generate auth.json
        if (fs.existsSync("auth.json")) {
            await this.page.goto(this.baseUrl);
            await this.page.waitForNavigation();
            if(process.env.FREE_ACCOUNT && process.env.FREE_ACCOUNT == 'true') {
                await this.clearNotification(); // get rid of the default notification
            }
            return;
        }
          
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
        await expect(this.page).toHaveURL( new RegExp(`^${this.baseUrl}`), {timeout: 10000} );
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
