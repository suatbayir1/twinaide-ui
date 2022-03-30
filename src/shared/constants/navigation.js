// Libraries
import { IconFont } from '@influxdata/clockface'

export const hierarchy = [
    {
        id: 'dt',
        icon: IconFont.Pulse,
        label: 'DT',
        link: {
            type: 'link',
            location: `/`,
        },
        activeKeywords: ['', 'project'],
        permitted: ['user', 'admin'],
    },
    {
        id: 'metadt',
        icon: IconFont.ShareSolid,
        label: 'Meta DT',
        link: {
            type: 'link',
            location: `/metadt`,
        },
        activeKeywords: ['metadt'],
        permitted: ['user', 'admin'],
    },
]