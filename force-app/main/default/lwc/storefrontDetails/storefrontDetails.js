import { LightningElement, wire, api } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';
import STOREFRONT_DETAILS_CHANNEL from '@salesforce/messageChannel/StorefrontDetailsMessageChannel__c';
import getStorefrontSetupItems from '@salesforce/apex/MarketplaceController.getStorefrontSetupItems';

export default class StorefrontDetails extends NavigationMixin(LightningElement) {

    @api header;
    @api description;
    
    @api welcomeMatActionLabel;
    @api welcomeMatActionLink;

    @wire(MessageContext) messageContext;

    subscription = null;

    label;
    inAppGuidanceLink;

    displaySpinner = true;

    storefrontItems;
    noStorefrontItems;

    connectedCallback(){
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                STOREFRONT_DETAILS_CHANNEL,
                (message) => {
                    this.label = message.storefrontLabel;
                    if(message.inAppGuidanceLink === undefined || message.inAppGuidanceLink === 'undefined'){
                        this.inAppGuidanceLink = false;
                    } else {
                        this.inAppGuidanceLink = message.inAppGuidanceLink;
                    }
                    this.getStorefrontSetupItems(this.label);
                },
                { 
                    scope: APPLICATION_SCOPE 
                }
            );
        }
    }

    getStorefrontSetupItems(){
        (async () => {
            await getStorefrontSetupItems({
                itemName: this.label
            })
                .then(result => {
                    this.displaySpinner = false;
                    this.storefrontItems = result;
                    this.noStorefrontItems = this.storefrontItems.length === 0 ? true : false;
                })
                .catch(error => {
                    this.displaySpinner = false;
                    this.noStorefrontItems = true;
                    console.error(error);
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: "Error",
                            message: error,
                            variant: "error"
                        })
                    );
                });
        })();
    }

    inAppWalkthrough(){
        this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
                url: this.inAppGuidanceLink
            }
        });
    }

    disconnectedCallback() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    handleBacktoWelcomeMat(){
        this.label = null;
    }
}