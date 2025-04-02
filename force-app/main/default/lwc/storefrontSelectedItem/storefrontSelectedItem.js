import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getStorefrontItemsByCollection from '@salesforce/apex/MarketplaceController.getStorefrontItemsByCollection';

export default class StorefrontSelectedItem extends NavigationMixin(LightningElement) {

    @api header;
    @api itemDetails;

    selectedItems;
    selectedItemsError;

    displaySpinner = true;

    @wire(getStorefrontItemsByCollection, { collectionName: '$header' })
        wiredStorefrontItems({ error, data }) {
            if (data) {
                this.displaySpinner = false;
                this.selectedItems = data;
                this.selectedItemsError = undefined;
            } else if (error) {
                this.displaySpinner = false;
                this.selectedItems = undefined;
                this.selectedItemsError = error;
                console.error(error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: "Error",
                        message: error,
                        variant: "error"
                    })
                );
            }
        }

    handlePrimaryAction(){
        this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
              url: this.itemDetails.Primary_Button_Link__c
            }
        });
    }

    handleSecondaryAction(){
        this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
                url: this.itemDetails.Secondary_Button_Link__c
            }
        });
    }
}