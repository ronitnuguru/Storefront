import { LightningElement, api, wire } from 'lwc';
import { publish, MessageContext } from "lightning/messageService";
import STOREFRONT_DETAILS_CHANNEL from '@salesforce/messageChannel/StorefrontDetailsMessageChannel__c';

export default class StorefrontList extends LightningElement {
    @api visualList;

    @wire(MessageContext) messageContext;

    handleChooseVisualPicker(event){
        publish(this.messageContext, STOREFRONT_DETAILS_CHANNEL, {
            storefrontLabel: `${event.target.value}`,
            inAppGuidanceLink: `${event.target.dataset.id}`
        });
    }
}