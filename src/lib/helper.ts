import { Asset, AssetRow, AssetIdMap, IDValueMap, MergeCfg } from '@/App.type';

export const VALID_FMT_TYPES = {
    LINK: 'link',
    COUNT: 'count',
    ALERT_COUNT: 'alertCount',
    DATETIME: 'dateTime',
    DATE: 'date',
    STATUS: 'status',
    PLAIN: 'plain',
    CAPITALIZE: 'capitalize',
    FLAG: 'flag',
    BINARY_STATUS: 'binary',
    DYNA_LINK: 'dynaLink',
    ROUND: 'round'
}
  
export  const VALUE_TYPES = {
    DATE: 'date',
    NUMBER: 'number',
    TYPE: 'type',
    BOOLEAN: 'boolean',
    STR_VAL: 'string',
    LINK_VIEW: 'linkView',
    EDIT_LINK: 'editLink',
    INV_LINK: 'inventory',
    DT_W_PREFIX: 'prefixedDate',
    HASH_VAL: 'hashValue'
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
  },
  'shipment': {
    'summaryId': {
      name: 'Shipment Id',
      formatType: VALID_FMT_TYPES.LINK,
      valueType: VALUE_TYPES.HASH_VAL
    },
    'summaryDateWPrefix': { 
      name: 'Ship Date',
      formatType: VALID_FMT_TYPES.DATE,
      valueType: VALUE_TYPES.DT_W_PREFIX
    },
    'storeId': {
      name: 'Store #',
      formatType: VALID_FMT_TYPES.PLAIN,
      valueType: VALUE_TYPES.STR_VAL
    },
    'data': {
      name: 'Packets',
      formatType: VALID_FMT_TYPES.PLAIN,
      valueType: VALUE_TYPES.NUMBER
    },
    'distinctItems': {
      name: 'Items',
      formatType: VALID_FMT_TYPES.PLAIN,
      valueType: VALUE_TYPES.NUMBER
    },
    'weight': {
      name: 'Weight (Kg)',
      formatType: VALID_FMT_TYPES.ROUND,
      valueType: VALUE_TYPES.NUMBER
    },
    'name': {
      name: 'Store Name',
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
  }
}


export function reduceToIDValue(assets: AssetRow[], numValueProp: string): IDValueMap {
  return assets.reduce((acc: IDValueMap, asset: AssetRow) => {
    const { assetId } = asset;

    if (asset[numValueProp] && typeof asset[numValueProp] == 'number') {
      acc[assetId] = asset[numValueProp] as number;
    }
    return acc;
  }, {});
}

export function genAssetIdMap(assets: AssetRow[]) {
  return assets.reduce((acc: AssetIdMap, asset: AssetRow) => {
    acc[asset.assetId] = asset;
    return acc;
  }, {});
}

export function extractAssetDetails(id: string, map: AssetIdMap) {
  // alert('extractAssetDetails');
  const { assetId, assetType, createdAt, ...rest } = map[id];
  // alert(JSON.stringify(rest));
  return { ...rest };
}

export function mergeSummation(mergeSource: AssetRow[], idsCountMap: IDValueMap, propName: string): number {
  // alert('mergeSummation')
  // const sourceMap: AssetIdMap = genAssetIdMap(mergeSource);
  const sourceMap: IDValueMap = reduceToIDValue(mergeSource, propName);
  // alert(JSON.stringify(sourceMap));
  return Object.entries(idsCountMap).reduce((acc: number, idCount) => {
    const [assetId, count] = idCount;
    let id = assetId;
    if (assetId.split('-').length > 1) {
      id = assetId.split('-')[0];
    }
    acc += sourceMap[id] * count;
    // alert(acc)
    return acc;
  }, 0);
}

export function mergeExtract(mergeSource: AssetRow[], idsCountMap: IDValueMap, propName: string, mergeId: string) {
  console.log(idsCountMap);
  console.log(propName);
  const sourceMap = genAssetIdMap(mergeSource);
  // alert(JSON.stringify(sourceMap));
  return extractAssetDetails(mergeId, sourceMap);
}

export function merge(cfg: MergeCfg, payload: IDValueMap, source: AssetRow[], mergeId: string) {
  const mergeFn = cfg.fn;

  const merged = mergeFn(source, payload, cfg.propName, mergeId);

  if (typeof merged == 'object') {
    return merged
  } else {
    return {
      [cfg.propName]: merged
    }
  }
}
