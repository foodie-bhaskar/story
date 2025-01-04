import { Asset } from '@/App.type';

export const VALID_FMT_TYPES = {
    LINK: 'link',
    COUNT: 'count',
    ALERT_COUNT: 'alertCount',
    DATETIME: 'dateTime',
    STATUS: 'status'
}
  
export  const VALUE_TYPES = {
    DATE: 'date',
    NUMBER: 'number',
    TYPE: 'type',
    BOOLEAN: 'boolean'
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
    }
}
  


