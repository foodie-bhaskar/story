import { Asset } from '@/App.type';

export const VALID_FMT_TYPES = {
    LINK: 'link',
    COUNT: 'count',
    ALERT_COUNT: 'alertCount',
    DATETIME: 'dateTime',
    STATUS: 'status',
    PLAIN: 'plain',
    CAPITALIZE: 'capitalize',
    FLAG: 'flag',
    BINARY_STATUS: 'binary',
    DYNA_LINK: 'dynaLink'
}
  
export  const VALUE_TYPES = {
    DATE: 'date',
    NUMBER: 'number',
    TYPE: 'type',
    BOOLEAN: 'boolean',
    STR_VAL: 'string',
    LINK_VIEW: 'linkView',
    EDIT_LINK: 'editLink',
    INV_LINK: 'inventory'
}

export const MAP: { [key: string]: Asset} = {
  'production-date': {
    'group': {
      name: 'Production Date',
      formatType: VALID_FMT_TYPES.LINK,
      valueType: VALUE_TYPES.DATE
    },
    'payload': {
      name: 'Batches',
      formatType: VALID_FMT_TYPES.ALERT_COUNT,
      valueType: VALUE_TYPES.NUMBER    
    },
    'data': {
      name: 'Packets',
      formatType: VALID_FMT_TYPES.COUNT,
      valueType: VALUE_TYPES.NUMBER
    },
    'distinctItems': {
      name: 'Items',
      formatType: VALID_FMT_TYPES.COUNT,
      valueType: VALUE_TYPES.NUMBER
    },
    'createdAt': {
      name: 'Uploaded At',
      formatType: VALID_FMT_TYPES.DATETIME,
      valueType: VALUE_TYPES.DATE
    },
    'updatedAt': {
      name: 'Updated At',
      formatType: VALID_FMT_TYPES.DATETIME,
      valueType: VALUE_TYPES.DATE
    },
    'isPending': {
      name: 'Status',
      formatType: VALID_FMT_TYPES.STATUS,
      valueType: VALUE_TYPES.BOOLEAN
    }
  },
  'rid': {
    'rid': {
      name: 'RID',
      formatType: VALID_FMT_TYPES.PLAIN,
      valueType: VALUE_TYPES.STR_VAL
    },
    'brandName': {
      name: 'Brand',
      formatType: VALID_FMT_TYPES.PLAIN,
      valueType: VALUE_TYPES.STR_VAL
    },
    'aggregator': {
      name: 'Aggregator',
      formatType: VALID_FMT_TYPES.PLAIN,
      valueType: VALUE_TYPES.STR_VAL
    },
    'storeName': {
      name: 'Store',
      formatType: VALID_FMT_TYPES.PLAIN,
      valueType: VALUE_TYPES.STR_VAL
    },
    'storeId': {
      name: 'Store #',
      formatType: VALID_FMT_TYPES.PLAIN,
      valueType: VALUE_TYPES.STR_VAL
    }
  },
  'item': {
    'assetId': {
      name: 'ID',
      formatType: VALID_FMT_TYPES.LINK,
      valueType: VALUE_TYPES.LINK_VIEW
    },
    'editId': {
      name: 'Edit',
      formatType: VALID_FMT_TYPES.LINK,
      valueType: VALUE_TYPES.EDIT_LINK
    },
    'name': {
      name: 'Item',
      formatType: VALID_FMT_TYPES.PLAIN,
      valueType: VALUE_TYPES.STR_VAL
    },
    'vendor': {
      name: 'Vendor',
      formatType: VALID_FMT_TYPES.CAPITALIZE,
      valueType: VALUE_TYPES.STR_VAL
    },
    'isPacket': {
      name: 'Is Packet?',
      formatType: VALID_FMT_TYPES.FLAG,
      valueType: VALUE_TYPES.BOOLEAN
    },
    'isVeg': {
      name: 'Veg / Non-Veg',
      formatType: VALID_FMT_TYPES.BINARY_STATUS,
      valueType: VALUE_TYPES.BOOLEAN
    },
    'weight': {
      name: 'Weight',
      formatType: VALID_FMT_TYPES.PLAIN,
      valueType: VALUE_TYPES.STR_VAL
    },
    'cuisine': {
      name: 'Cuisine',
      formatType: VALID_FMT_TYPES.CAPITALIZE,
      valueType: VALUE_TYPES.STR_VAL
    },
    'item-type': {
      name: 'Type',
      formatType: VALID_FMT_TYPES.CAPITALIZE,
      valueType: VALUE_TYPES.STR_VAL
    },
    'item-sub-type': {
      name: 'Sub Type',
      formatType: VALID_FMT_TYPES.CAPITALIZE,
      valueType: VALUE_TYPES.STR_VAL
    },
    'item-sub-sub-type': {
      name: 'Sub Sub Type',
      formatType: VALID_FMT_TYPES.CAPITALIZE,
      valueType: VALUE_TYPES.STR_VAL
    },
    'raw': {
      name: 'Raw Material',
      formatType: VALID_FMT_TYPES.PLAIN,
      valueType: VALUE_TYPES.STR_VAL
    },
    'preComm': {
      name: 'Pre Commission',
      formatType: VALID_FMT_TYPES.PLAIN,
      valueType: VALUE_TYPES.STR_VAL
    },
    'postAgg': {
      name: 'Post Aggregator',
      formatType: VALID_FMT_TYPES.PLAIN,
      valueType: VALUE_TYPES.STR_VAL
    },
    'postStore': {
      name: 'Post Store',
      formatType: VALID_FMT_TYPES.PLAIN,
      valueType: VALUE_TYPES.STR_VAL
    }
  },
  'package': {
    'assetId': {
      name: 'ID',
      formatType: VALID_FMT_TYPES.LINK,
      valueType: VALUE_TYPES.LINK_VIEW
    },
    'editId': {
      name: 'Edit',
      formatType: VALID_FMT_TYPES.LINK,
      valueType: VALUE_TYPES.EDIT_LINK
    },
    'name': {
      name: 'Name',
      formatType: VALID_FMT_TYPES.PLAIN,
      valueType: VALUE_TYPES.STR_VAL
    },
    'compartments': {
      name: '# of Compartments',
      formatType: VALID_FMT_TYPES.ALERT_COUNT,
      valueType: VALUE_TYPES.STR_VAL
    },
    'volume': {
      name: 'Volume (in ml)',
      formatType: VALID_FMT_TYPES.PLAIN,
      valueType: VALUE_TYPES.STR_VAL
    },
    'packagingCost': {
      name: 'Cost',
      formatType: VALID_FMT_TYPES.PLAIN,
      valueType: VALUE_TYPES.STR_VAL
    },
    'packaging-type': {
      name: 'Packaging Type',
      formatType: VALID_FMT_TYPES.CAPITALIZE,
      valueType: VALUE_TYPES.STR_VAL
    },
    'packaging-sub-type': {
      name: 'Packaging Sub Type',
      formatType: VALID_FMT_TYPES.CAPITALIZE,
      valueType: VALUE_TYPES.STR_VAL
    }
  },
  'store': {
    'assetId': {
      name: 'ID',
      formatType: VALID_FMT_TYPES.PLAIN,
      valueType: VALUE_TYPES.STR_VAL
    },
    'name': {
      name: 'Name',
      formatType: VALID_FMT_TYPES.PLAIN,
      valueType: VALUE_TYPES.STR_VAL
    },
    'city': {
      name: 'City',
      formatType: VALID_FMT_TYPES.PLAIN,
      valueType: VALUE_TYPES.STR_VAL
    },
    'state': {
      name: 'State',
      formatType: VALID_FMT_TYPES.PLAIN,
      valueType: VALUE_TYPES.STR_VAL
    },
    'dynaLink': {
      name: 'View',
      formatType: VALID_FMT_TYPES.DYNA_LINK,
      valueType: VALUE_TYPES.INV_LINK
    }
  }
}

/* {
  "assetType": "RID",
  "timestamp": "6/30/2023, 9:00:34 PM",
  "brandName": "Bowl 99",
  "createdAt": 1688139034628,
  "storeId": "112",
  "storeName": "Lakkasandra",
  "rid": "167158",
  "isActive": true,
  "assetId": "167158",
  "brandId": "1",
  "aggregator": "Swiggy"
} */
  


