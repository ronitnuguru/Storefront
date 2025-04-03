public with sharing class MarketplaceController {
    @AuraEnabled(cacheable=true)
    public static Object invokePromptAndUserModelsGenAi(String className, String methodName, String modelName, String userPrompt, String systemPrompt) {
        try { 
            String namespacedClass = className; 
            Callable callableInstance = (Callable) Type.forName(className).newInstance(); 
            Map<String, Object> payload = new Map<String, Object> { 
                'modelName' => modelName, 
                'userPrompt' => userPrompt, 
                'systemPrompt' => systemPrompt  
            }; 
            String result = (String) callableInstance.call(methodName, payload); 
            return result; 
        } catch (Exception e) { 
            throw new AuraHandledException(e.getMessage()); 
        }
    }

    @AuraEnabled(cacheable=true)
    public static Object invokeModelsGenAi(String className, String methodName, String modelName, String prompt) {
        try { 
            String namespacedClass = className; 
            Callable callableInstance = (Callable) Type.forName(className).newInstance(); 
            Map<String, Object> payload = new Map<String, Object> { 
                'modelName' => modelName, 
                'prompt' => prompt 
            }; 
            String result = (String) callableInstance.call(methodName, payload); 
            return result; 
        } catch (Exception e) { 
            throw new AuraHandledException(e.getMessage()); 
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Welcome_Mat_Item__c> getWelcomeMatItems() {
        List<Welcome_Mat_Item__c> items = new List<Welcome_Mat_Item__c>();
        try {
            items = [
                SELECT Description__c, Name, Order__c, Title__c, Link__c, Icon__c, Link_Type__c
                FROM Welcome_Mat_Item__c 
                ORDER BY Order__c ASC NULLS FIRST
                LIMIT 50
            ];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching welcome mat items: ' + e.getMessage());
        }
        return items;
    }

    @AuraEnabled(cacheable=true)
    public static List<Storefront_Item_Setup__c> getStorefrontSetupItems(String itemName) {
        List<Storefront_Item_Setup__c> items = new List<Storefront_Item_Setup__c>();
        try {
            items = [
                SELECT Description__c, Name, Order__c, Time__c, Title__c, Storefront_Item__c, (SELECT Button_Label__c,Button_Type__c,Button_Variant__c,Description__c,Link__c,Name,Order__c,Status__c,Storefront_Item_Setup__c,IsActive__c,IsCompleted__c,IsMarker__c,Button_Icon__c FROM Storefront_Item_Steps__r ORDER BY Order__c ASC NULLS FIRST)
                FROM Storefront_Item_Setup__c 
                WHERE Storefront_Item__r.Label__c = :itemName
                ORDER BY Order__c ASC NULLS FIRST
            ];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching storefront items: ' + e.getMessage());
        }
        return items;
    }

    @AuraEnabled(cacheable=true)
    public static List<Storefront_Collection__c> getStorefrontCollectionItems() {
        List<Storefront_Collection__c> items = new List<Storefront_Collection__c>();
        try {
            items = [
                SELECT Icon_Name__c, Name, Navigation_Icon__c, Navigation_Name__c, Order__c, Primary_Button_Icon__c, Primary_Button_Label__c, Primary_Button_Link__c, Secondary_Button_Icon__c, Secondary_Button_Label__c, Secondary_Button_Link__c
                FROM Storefront_Collection__c 
                ORDER BY Order__c ASC NULLS FIRST
                LIMIT 10
            ];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching storefront items: ' + e.getMessage());
        }
        return items;
    }

    @AuraEnabled(cacheable=true)
    public static Account getAnyAccountRecordForMail() {
        try {
            // Query to get a single Account record
            Account accountRecord = [
                SELECT Id
                FROM Account
                LIMIT 1
            ];
            return accountRecord;
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching account record: ' + e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Storefront_Item__c> getStorefrontItemsByCollection(String collectionName) {
        try {
            // Query to get Storefront_Item__c records based on the given Storefront_Collection__c Id
            List<Storefront_Item__c> storefrontItems = [
                SELECT Id, Description__c, Icon_Name__c, In_App_Guidance_Link__c, Storefront_Collection__c, Label__c
                FROM Storefront_Item__c
                WHERE Storefront_Collection__r.Name = :collectionName
                ORDER BY Name ASC
                LIMIT 20
            ];
            return storefrontItems;
        } catch (Exception e) {
            // Handle exceptions by logging the error and returning an empty list
            System.debug('Error fetching storefront items: ' + e.getMessage());
            return new List<Storefront_Item__c>();
        }
    }

}