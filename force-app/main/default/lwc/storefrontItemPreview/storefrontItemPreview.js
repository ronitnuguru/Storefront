import { LightningElement, api, wire } from "lwc";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";

import LABEL from "@salesforce/schema/Storefront_Item__c.Label__c";
import DESCRIPTION from "@salesforce/schema/Storefront_Item__c.Description__c";
import ICON from "@salesforce/schema/Storefront_Item__c.Icon_Name__c";

const FIELDS = [ LABEL, DESCRIPTION, ICON ];

export default class StorefrontItemPreview extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: "$recordId", fields: FIELDS })
    item;

    get label() {
        return getFieldValue(this.item.data, LABEL);
    }

    get description() {
        return getFieldValue(this.item.data, DESCRIPTION);
    }

    get icon() {
        return getFieldValue(this.item.data, ICON);
    }
}