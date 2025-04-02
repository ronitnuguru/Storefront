import { LightningElement, api, wire } from "lwc";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";

import NAVIGATION_NAME from "@salesforce/schema/Storefront_Collection__c.Navigation_Name__c";
import NAVIGATION_ICON from "@salesforce/schema/Storefront_Collection__c.Navigation_Icon__c";

const FIELDS = [ NAVIGATION_NAME, NAVIGATION_ICON ];

export default class StorefrontCollectionPreview extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: "$recordId", fields: FIELDS })
    collection;

    get name() {
        return getFieldValue(this.collection.data, NAVIGATION_NAME);
    }

    get icon() {
        return getFieldValue(this.collection.data, NAVIGATION_ICON);
    }
}