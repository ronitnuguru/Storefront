import { LightningElement, api, wire } from "lwc";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";

import STEP_NUMBER from "@salesforce/schema/Storefront_Item_Setup__c.Order__c";
import STEP_TITLE from "@salesforce/schema/Storefront_Item_Setup__c.Title__c";
import STEP_DESCRIPTION from "@salesforce/schema/Storefront_Item_Setup__c.Description__c";
import STEP_TIME from "@salesforce/schema/Storefront_Item_Setup__c.Time__c";


const FIELDS = [ STEP_NUMBER, STEP_TITLE, STEP_DESCRIPTION, STEP_TIME ];

export default class StorefrontItemSetupPreview extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: "$recordId", fields: FIELDS })
    item;

    get stepNumber() {
        return getFieldValue(this.item.data, STEP_NUMBER);
    }

    get stepTitle() {
        return getFieldValue(this.item.data, STEP_TITLE);
    }

    get stepDescription() {
        return getFieldValue(this.item.data, STEP_DESCRIPTION);
    }

    get stepTime() {
        return getFieldValue(this.item.data, STEP_TIME);
    }
}