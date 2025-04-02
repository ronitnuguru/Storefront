import { LightningElement, api, wire } from "lwc";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";

import IS_COMPLETED from "@salesforce/schema/Storefront_Item_Step__c.IsCompleted__c";
import IS_MARKER from "@salesforce/schema/Storefront_Item_Step__c.IsMarker__c";
import IS_ACTIVE from "@salesforce/schema/Storefront_Item_Step__c.IsActive__c";
import DESCRIPTION from "@salesforce/schema/Storefront_Item_Step__c.Description__c";
import BUTTON_LABEL from "@salesforce/schema/Storefront_Item_Step__c.Button_Label__c";
import BUTTON_ICON from "@salesforce/schema/Storefront_Item_Step__c.Button_Icon__c";
import BUTTON_TYPE from "@salesforce/schema/Storefront_Item_Step__c.Button_Type__c";
import BUTTON_VARIANT from "@salesforce/schema/Storefront_Item_Step__c.Button_Variant__c";
import LINK from "@salesforce/schema/Storefront_Item_Step__c.Link__c";
import STATUS from "@salesforce/schema/Storefront_Item_Step__c.Status__c";

const FIELDS = [ IS_COMPLETED, IS_MARKER, IS_ACTIVE, DESCRIPTION, BUTTON_LABEL, BUTTON_ICON, BUTTON_TYPE, BUTTON_VARIANT, LINK, STATUS ];

export default class StorefrontItemStepPreview extends LightningElement {

    @api recordId;

    @wire(getRecord, { recordId: "$recordId", fields: FIELDS })
    item;

    get isCompleted() {
        return getFieldValue(this.item.data, IS_COMPLETED);
    }

    get isMarker() {
        return getFieldValue(this.item.data, IS_MARKER);
    }

    get isActive() {
        return getFieldValue(this.item.data, IS_ACTIVE);
    }

    get description() {
        return getFieldValue(this.item.data, DESCRIPTION);
    }

    get buttonLabel() {
        return getFieldValue(this.item.data, BUTTON_LABEL);
    }

    get buttonIcon(){
        return getFieldValue(this.item.data, BUTTON_ICON);
    }

    get buttonType(){
        return getFieldValue(this.item.data, BUTTON_TYPE);
    }

    get buttonVariant(){
        return getFieldValue(this.item.data, BUTTON_VARIANT);
    }

    get link(){
        return getFieldValue(this.item.data, LINK);
    }

    get status(){
        return getFieldValue(this.item.data, STATUS);
    }
}